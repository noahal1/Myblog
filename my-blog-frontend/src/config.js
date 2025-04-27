// 基础API配置
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://60.205.12.17:8000';

// API请求配置
export const API_CONFIG = {
  TIMEOUT: 10000, // 10秒超时
  RETRY_COUNT: 3, // 失败重试次数
  CACHE_TIME: 300000 // 缓存时间 5分钟
};

// 应用全局配置
export const APP_CONFIG = {
  SITE_NAME: '诺亚的博客',
  PAGINATION_SIZE: 10,
  THEME_KEY: 'noah-blog-theme'
}; 