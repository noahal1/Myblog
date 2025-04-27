import axios from 'axios';
import { API_BASE_URL, API_CONFIG } from './config';

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
  const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
  if (!userInfo || !userInfo.refreshToken) {
    return null;
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/api/token/refresh`, {
      refresh_token: userInfo.refreshToken
    });
    
    // 更新存储的Token
    const { access_token, refresh_token, expires_at } = response.data;
    const updatedUserInfo = {
      ...userInfo,
      token: access_token,
      refreshToken: refresh_token,
      expiresAt: expires_at
    };
    localStorage.setItem('user', JSON.stringify(updatedUserInfo));
    
    return access_token;
  } catch (error) {
    // 刷新Token失败, 清除用户信息
    localStorage.removeItem('user');
    window.location.href = '/login';
    return null;
  }
}

// 检查Token是否即将过期
function isTokenExpired() {
  const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
  if (!userInfo || !userInfo.expiresAt) {
    return true;
  }
  
  // 如果Token过期前5分钟，认为即将过期
  const expiresAt = userInfo.expiresAt * 1000; // 转为毫秒
  const now = Date.now();
  const thresholdMs = 5 * 60 * 1000; // 5分钟
  
  return now > expiresAt - thresholdMs;
}

// 获取文章列表
export const getArticles = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  try {
    return await apiClient.get(`/api/articles?skip=${skip}&limit=${limit}`);
  } catch (error) {
    return handleApiError(error, () => getArticles(page, limit));
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
export const createComment = async (content, articleId, userId = null, replyToId = null) => {
  try {
    return await apiClient.post('/api/comments', {
      content,
      article_id: articleId,
      user_id: userId,
      reply_to_id: replyToId ? parseInt(replyToId) : undefined
    });
  } catch (error) {
    return handleApiError(error, () => createComment(content, articleId, userId, replyToId));
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
    
    localStorage.setItem('user', JSON.stringify(userInfo));
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
  localStorage.removeItem('user');
  window.location.href = '/login';
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
    if (!isRefreshing) {
      isRefreshing = true;
      
      refreshToken().then(newToken => {
        isRefreshing = false;
        if (newToken) {
          onTokenRefreshed(newToken);
        }
      }).catch(() => {
        isRefreshing = false;
        localStorage.removeItem('user');
        window.location.href = '/login';
      });
    }
    
    // 创建一个新的Promise，等待令牌刷新
    if (retryCallback) {
      return new Promise((resolve) => {
        addRefreshSubscriber(newToken => {
          // 替换原始请求的Authorization头
          error.config.headers.Authorization = `Bearer ${newToken}`;
          // 使用新令牌重试原始请求
          resolve(axios(error.config));
        });
      });
    }
  }
  
  // 处理401错误（未授权）
  if (error.response?.status === 401) {
    localStorage.removeItem('user');
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }
  
  // 将所有其他错误正常抛出
  throw error;
};

// 添加请求拦截器
apiClient.interceptors.request.use(
  async config => {
    // 检查是否需要刷新令牌
    if (isTokenExpired() && !config.url.includes('/api/token/refresh') && !isRefreshing) {
      isRefreshing = true;
      const newToken = await refreshToken();
      isRefreshing = false;
      
      if (newToken) {
        config.headers.Authorization = `Bearer ${newToken}`;
      }
    } else {
      // 获取用户信息对象
      const userInfo = localStorage.getItem('user');
      if (userInfo) {
        try {
          const user = JSON.parse(userInfo);
          if (user && user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
          }
        } catch (e) {
          console.error('解析用户信息失败:', e);
        }
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