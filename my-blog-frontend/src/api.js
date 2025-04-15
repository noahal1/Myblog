import axios from 'axios';
import { API_BASE_URL } from './config';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 获取文章列表
export const getArticles = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return apiClient.get(`/api/articles?skip=${skip}&limit=${limit}`);
};

// 获取文章详情
export const getArticle = async (id) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/api/articles/${id}`, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// 创建文章
export const createArticle = async (articleData) => {
  return apiClient.post('/api/articles', articleData);
};

// 获取标签列表
export const getTags = async () => {
  return apiClient.get('/api/tags');
};

// 创建标签
export const createTag = async (tagName) => {
  return apiClient.post('/api/tags', { name: tagName });
};

// 获取文章评论
export const getComments = async (articleId, page = 1, limit = 50) => {
  const skip = (page - 1) * limit;
  return apiClient.get(`/api/articles/${articleId}/comments?skip=${skip}&limit=${limit}`);
};

// 创建评论
export const createComment = async (content, articleId, userId = null, replyToId = null) => {
  return apiClient.post('/api/comments', {
    content,
    article_id: articleId,
    user_id: userId,
    reply_to_id: replyToId ? parseInt(replyToId) : undefined
  });
};

// 删除评论
export const deleteComment = async (commentId) => {
  return apiClient.delete(`/api/comments/${commentId}`);
};

// 点赞文章
export const likeArticle = async (articleId) => {
  return apiClient.post(`/api/articles/${articleId}/like`);
};

// 添加请求和响应拦截器
apiClient.interceptors.request.use(
  config => {
    // 从localStorage获取token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

// 添加响应拦截器
apiClient.interceptors.response.use(
  response => response,
  error => {
    // 处理401错误（未授权）
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default apiClient; 