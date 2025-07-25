import axios from 'axios';
import { API_BASE_URL, API_CONFIG } from './config';
import { userStorage } from './utils/secureStorage';

// 创建axios实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: API_CONFIG.TIMEOUT, // 添加超时设置
});

// 请求计数器(用于重试)
const requestRetryCount = new Map();

// 是否正在刷新Token
let isRefreshing = false;
// 等待刷新Token的请求队列
let refreshSubscribers = [];

// Token刷新后执行订阅的回调
function onTokenRefreshed(accessToken) {
  refreshSubscribers.forEach(callback => callback(accessToken));
  refreshSubscribers = [];
}

// 将请求添加到订阅队列中
function addRefreshSubscriber(callback) {
  refreshSubscribers.push(callback);
}

// 刷新Token
async function refreshToken() {
  const userInfo = userStorage.getUserInfo();
  if (!userInfo || !userInfo.refreshToken) {
    return null;
  }

  try {
    console.log('开始刷新Token...');
    const response = await axios.post(`${API_BASE_URL}/api/token/refresh`, {
      refresh_token: userInfo.refreshToken
    });
    
    // 更新存储的Token
    const { access_token, refresh_token, expires_at, userId } = response.data;
    const updatedUserInfo = {
      ...userInfo,
      token: access_token,
      refreshToken: refresh_token,
      expiresAt: expires_at,
      userId: userId || userInfo.userId,
      isLogin: true
    };
    userStorage.saveUserInfo(updatedUserInfo);
    
    console.log('Token刷新成功');
    return access_token;
  } catch (error) {
    console.error('刷新Token失败:', error.response?.data || error.message);
    // 不直接清除用户信息和重定向，让调用者决定如何处理
    return null;
  }
}

// 检查Token是否即将过期
function isTokenExpired() {
  const userInfo = userStorage.getUserInfo();
  if (!userInfo || !userInfo.expiresAt) {
    return true;
  }
  
  // 如果Token过期前5分钟，认为即将过期
  const expiresAt = userInfo.expiresAt * 1000; // 转为毫秒
  const now = Date.now();
  const thresholdMs = API_CONFIG.REFRESH_THRESHOLD_MINUTES * 60 * 1000; // 使用配置的阈值
  
  return now > expiresAt - thresholdMs;
}

// 获取文章列表
export const getArticles = async (page = 1, limit = 10, knowledge_base = null) => {
  const skip = (page - 1) * limit;
  const params = { skip, limit };
  
  // 如果指定了知识库参数，添加到请求参数中
  if (knowledge_base !== null) {
    params.knowledge_base = knowledge_base;
  }
  
  try {
    return await apiClient.get('/api/articles', { params });
  } catch (error) {
    return handleApiError(error, () => getArticles(page, limit, knowledge_base));
  }
};

// 获取文章详情
export const getArticle = async (id) => {
  try {
    const response = await apiClient.get(`/api/articles/${id}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, () => getArticle(id));
  }
};

// 创建文章
export const createArticle = async (articleData) => {
  try {
    return await apiClient.post('/api/articles', articleData);
  } catch (error) {
    return handleApiError(error, () => createArticle(articleData));
  }
};

// 获取标签列表
export const getTags = async () => {
  try {
    return await apiClient.get('/api/tags');
  } catch (error) {
    return handleApiError(error, () => getTags());
  }
};

// 创建标签
export const createTag = async (tagName) => {
  try {
    return await apiClient.post('/api/tags', { name: tagName });
  } catch (error) {
    return handleApiError(error, () => createTag(tagName));
  }
};

// 获取文章评论
export const getComments = async (articleId, page = 1, limit = 50) => {
  const skip = (page - 1) * limit;
  try {
    return await apiClient.get(`/api/articles/${articleId}/comments?skip=${skip}&limit=${limit}`);
  } catch (error) {
    return handleApiError(error, () => getComments(articleId, page, limit));
  }
};

// 创建评论
export const createComment = async (content, articleId, replyToId = null) => {
  try {
    return await apiClient.post('/api/comments', {
      content,
      article_id: articleId,
      reply_to_id: replyToId ? parseInt(replyToId) : null
    });
  } catch (error) {
    return handleApiError(error, () => createComment(content, articleId, replyToId));
  }
};

// 删除评论
export const deleteComment = async (commentId) => {
  try {
    return await apiClient.delete(`/api/comments/${commentId}`);
  } catch (error) {
    return handleApiError(error, () => deleteComment(commentId));
  }
};

// 点赞文章
export const likeArticle = async (articleId) => {
  try {
    return await apiClient.post(`/api/articles/${articleId}/like`);
  } catch (error) {
    return handleApiError(error, () => likeArticle(articleId));
  }
};

// 点赞评论
export const likeComment = async (commentId) => {
  try {
    return await apiClient.post(`/api/comments/${commentId}/like`);
  } catch (error) {
    return handleApiError(error, () => likeComment(commentId));
  }
};

// 登录
export const login = async (username, password) => {
  try {
    const response = await apiClient.post('/api/login', { username, password });
    const { access_token, refresh_token, token_type, expires_at, userId } = response.data;
    
    // 存储用户信息，包括刷新令牌和过期时间
    const userInfo = {
      token: access_token,
      refreshToken: refresh_token,
      tokenType: token_type,
      expiresAt: expires_at,
      userId: userId,
      username: username
    };
    
    userStorage.saveUserInfo(userInfo);
    return userInfo;
  } catch (error) {
    return handleApiError(error, null); // 登录失败不重试
  }
};

// 注册
export const register = async (username, email, password) => {
  try {
    return await apiClient.post('/api/register', { username, email, password });
  } catch (error) {
    return handleApiError(error, null); // 注册失败不重试
  }
};

// 注销
export const logout = () => {
  userStorage.clearUserInfo();
  window.location.href = '/login';
};

// 获取访问记录列表
export const getVisitorLogs = async (params = {}) => {
  try {
    return await apiClient.get('/api/admin/visitor-logs', { params });
  } catch (error) {
    return handleApiError(error, () => getVisitorLogs(params));
  }
};

// 获取访问统计数据
export const getVisitorStats = async (days = 7) => {
  try {
    return await apiClient.get('/api/admin/visitor-stats', { params: { days } });
  } catch (error) {
    return handleApiError(error, () => getVisitorStats(days));
  }
};

// 获取IP地理位置信息
export const getIpGeolocation = async (ip) => {
  try {
    const response = await apiClient.get('/api/admin/ip-geolocation', { params: { ip } });
    return response.data;
  } catch (error) {
    console.error('获取IP地理位置失败:', error);
    return null;
  }
};

// 获取文章详情
export const getArticleDetail = async (articleId) => {
  try {
    return await apiClient.get(`/api/articles/${articleId}`);
  } catch (error) {
    return handleApiError(error, () => getArticleDetail(articleId));
  }
};

// 获取管理员版文章详情
export const getAdminArticleDetail = async (articleId) => {
  try {
    return await apiClient.get(`/api/admin/articles/${articleId}`);
  } catch (error) {
    return handleApiError(error, () => getAdminArticleDetail(articleId));
  }
};

// 图片上传相关API
export const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/api/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('API响应:', response);
    return response;
  } catch (error) {
    console.error('API调用失败:', error);
    throw error;
  }
};

export const uploadMultipleImages = async (files) => {
  try {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    return await apiClient.post('/api/upload/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  } catch (error) {
    return handleApiError(error, () => uploadMultipleImages(files));
  }
};

export const getImageList = async (page = 1, limit = 20) => {
  try {
    const response = await apiClient.get('/api/upload/images', {
      params: { page, limit }
    });
    console.log('获取图片列表响应:', response);
    return response;
  } catch (error) {
    console.error('获取图片列表失败:', error);
    throw error;
  }
};

export const deleteImage = async (filePath) => {
  try {
    return await apiClient.delete('/api/upload/image', {
      params: { file_path: filePath }
    });
  } catch (error) {
    return handleApiError(error, () => deleteImage(filePath));
  }
};

// 更新审核状态
export const updateArticleStatus = async (articleId, status) => {
  return await apiClient.put(`/api/admin/articles/${articleId}/status?status=${status}`);
};

// 更新文章详情
export const updateArticleDetail = async (id, data) => {
  return await apiClient.put(`/api/admin/articles/${id}`, data);
};

// 获取所有文章、管理员版
export const getAdminArticles = async (page = 1, limit = 10, status = null) => {
  const skip = (page - 1) * limit;
  const params = { skip, limit };
  
  if (status) {
    params.status = status;
  }
  
  try {
    return await apiClient.get('/api/admin/articles', { params });
  } catch (error) {
    return handleApiError(error, () => getAdminArticles(page, limit, status));
  }
};

// 获取需要处理的文章（待审核和已拒绝）
export const getArticlesToProcess = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const params = { skip, limit };
  
  try {
    return await apiClient.get('/api/admin/articles/to-process', { params });
  } catch (error) {
    return handleApiError(error, () => getArticlesToProcess(page, limit));
  }
};

// 错误处理和重试逻辑
const handleApiError = (error, retryCallback) => {
  const requestId = error.config?.url;
  
  // 检查网络连接问题
  if (!error.response) {
    console.error('网络错误:', error.message);
    // 尝试重试请求
    if (retryCallback) {
      const currentRetryCount = requestRetryCount.get(requestId) || 0;
      
      if (currentRetryCount < API_CONFIG.RETRY_COUNT) {
        console.log(`重试请求 (${currentRetryCount + 1}/${API_CONFIG.RETRY_COUNT}): ${requestId}`);
        requestRetryCount.set(requestId, currentRetryCount + 1);
        return retryCallback();
      }
      
      requestRetryCount.delete(requestId);
    }
    throw new Error('网络连接失败，请检查网络设置');
  }
  
  // 如果是401错误但不是刷新令牌请求本身
  if (error.response?.status === 401 && !error.config.url.includes('/api/token/refresh')) {
    console.log('遇到401错误，尝试刷新token...');
    
    // 创建一个新的Promise来处理刷新token和重试
    if (retryCallback) {
      return new Promise((resolve, reject) => {
        // 如果当前没有其他请求正在刷新token，则开始刷新
    if (!isRefreshing) {
      isRefreshing = true;
      
          refreshToken()
            .then(newToken => {
        isRefreshing = false;
        if (newToken) {
                console.log('使用新token重试请求');
                // 如果刷新成功，通知所有等待的请求
          onTokenRefreshed(newToken);
                
                // 替换当前请求的token并重试
                error.config.headers.Authorization = `Bearer ${newToken}`;
                resolve(axios(error.config));
              } else {
                // 如果刷新失败，拒绝所有等待的请求
                reject(error);
        }
            })
            .catch(refreshError => {
        isRefreshing = false;
              console.error('刷新token失败:', refreshError);
              reject(error);
      });
        } else {
          // 如果已经有请求在刷新token，将当前请求加入队列
        addRefreshSubscriber(newToken => {
            console.log('使用刷新的token重试队列中的请求');
          error.config.headers.Authorization = `Bearer ${newToken}`;
          resolve(axios(error.config));
        });
        }
      });
    }
  }
  
  // 处理401错误，如果是登录页面或没有token，直接抛出错误
  if (error.response?.status === 401) {
    // 只有当用户已登录时才清理状态

    const userInfo = userStorage.getUserInfo();

    if (userInfo.token) {
      console.warn('身份验证失败，请重新登录');
    }
    
    throw error;
  }
  
  // 将所有其他错误正常抛出
  throw error;
};

// 添加请求拦截器
apiClient.interceptors.request.use(
  async config => {
    // 获取用户信息对象

    const userInfo = userStorage.getUserInfo();
    if (userInfo) {
      try {
        // 如果有token，直接使用它
        if (userInfo && userInfo.token) {
          config.headers.Authorization = `Bearer ${userInfo.token}`;
        
          // 检查token是否即将过期
          if (userInfo.expiresAt) {
            const expiryTime = new Date(userInfo.expiresAt * 1000); // 转换为毫秒
            const now = new Date();
            const thresholdMs = API_CONFIG.REFRESH_THRESHOLD_MINUTES * 60 * 1000; // 使用配置的阈值
            
            // 如果token即将过期且有刷新token，尝试刷新，但不阻塞请求

            if (now > (expiryTime - thresholdMs) && userInfo.refreshToken && !isRefreshing && !config.url.includes('/api/token/refresh')) {

              // 设置标志，避免多次刷新
      isRefreshing = true;
              
              // 异步刷新token，不阻塞当前请求
              refreshToken().then(newToken => {
      isRefreshing = false;
      if (newToken) {
                  onTokenRefreshed(newToken);
      }
              }).catch(error => {
                isRefreshing = false;
                console.error('刷新令牌失败:', error);
                // 不阻塞当前请求，让后端判断token有效性
              });
            }
          }
          }
        } catch (e) {
          console.error('解析用户信息失败:', e);
        // 出错时不添加令牌
      }
    }
    return config;
  },
  error => Promise.reject(error)
);

// 添加响应拦截器
apiClient.interceptors.response.use(
  response => {
    // 成功请求后重置重试计数器
    if (response.config && response.config.url) {
      requestRetryCount.delete(response.config.url);
    }
    return response;
  },
  error => {
    // 错误拦截器在handleApiError中处理
    return Promise.reject(error);
  }
);

export default apiClient; 