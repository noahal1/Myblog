// 基础API配置
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (
  window.location.hostname === 'localhost' 
    ? 'http://localhost:8000' 
    : `${window.location.protocol}//${window.location.hostname}:8000`
);

// API请求配置
export const API_CONFIG = {
  TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'), // 10秒超时
  RETRY_COUNT: parseInt(import.meta.env.VITE_API_RETRY_COUNT || '3'), // 失败重试次数
  CACHE_TIME: parseInt(import.meta.env.VITE_API_CACHE_TIME || '300000'), // 缓存时间 5分钟
  REFRESH_THRESHOLD_MINUTES: parseInt(import.meta.env.VITE_TOKEN_REFRESH_THRESHOLD || '5'), // Token刷新阈值（分钟）
  USE_COOKIES: import.meta.env.VITE_USE_COOKIES === 'true' // 是否使用cookies存储
};

// 应用全局配置
export const APP_CONFIG = {
  SITE_NAME: import.meta.env.VITE_SITE_NAME || '诺亚的博客',
  PAGINATION_SIZE: parseInt(import.meta.env.VITE_PAGINATION_SIZE || '10'),
  THEME_KEY: 'noah-blog-theme',
  TOKEN_STORAGE_KEY: 'user', // 用户令牌在localStorage/sessionStorage中的键名
  SESSION_PERSISTENCE: import.meta.env.VITE_SESSION_PERSISTENCE === 'true', // 会话持久化（true为localStorage, false为sessionStorage）
  MAX_SESSION_DAYS: parseInt(import.meta.env.VITE_MAX_SESSION_DAYS || '7') // 最大会话保持天数
};

// 安全配置
export const SECURITY_CONFIG = {
  CONTENT_SECURITY_POLICY: import.meta.env.VITE_ENABLE_CSP !== 'false', // 启用内容安全策略
  XSS_PROTECTION: import.meta.env.VITE_ENABLE_XSS_PROTECTION !== 'false', // 启用XSS保护
  FRAME_PROTECTION: import.meta.env.VITE_ENABLE_FRAME_PROTECTION !== 'false', // 启用Frame保护
  ENABLE_SECURE_STORAGE: import.meta.env.VITE_ENABLE_SECURE_STORAGE !== 'false', // 启用安全存储
  ENCRYPTION_KEY: import.meta.env.VITE_ENCRYPTION_KEY || null // 加密密钥
};

// 如果启用了内容安全策略，设置meta标签
if (SECURITY_CONFIG.CONTENT_SECURITY_POLICY && typeof document !== 'undefined') {
  const meta = document.createElement('meta');
  meta.httpEquiv = 'Content-Security-Policy';
  meta.content = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self';";
  document.head.appendChild(meta);
}

// 如果启用了XSS保护，设置meta标签
if (SECURITY_CONFIG.XSS_PROTECTION && typeof document !== 'undefined') {
  const meta = document.createElement('meta');
  meta.httpEquiv = 'X-XSS-Protection';
  meta.content = '1; mode=block';
  document.head.appendChild(meta);
}

// 如果启用了Frame保护，设置meta标签
if (SECURITY_CONFIG.FRAME_PROTECTION && typeof document !== 'undefined') {
  const meta = document.createElement('meta');
  meta.httpEquiv = 'X-Frame-Options';
  meta.content = 'SAMEORIGIN';
  document.head.appendChild(meta);
} 