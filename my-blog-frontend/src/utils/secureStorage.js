import { SECURITY_CONFIG, APP_CONFIG, API_CONFIG } from '../config';
import CryptoJS from 'crypto-js';

// 获取加密密钥
const getEncryptionKey = () => {
  // 首选从配置获取密钥，这包含了环境变量的密钥
  if (SECURITY_CONFIG.ENCRYPTION_KEY) {
    return SECURITY_CONFIG.ENCRYPTION_KEY;
  }
  
  const domain = window.location.hostname;
  const browserKey = `${domain}-${navigator.userAgent.substring(0, 10)}`;
  return browserKey;
};

// 安全存储类，提供加密和解密功能
class SecureStorage {
  constructor(storageType = 'localStorage') {
    this.storage = storageType === 'localStorage' ? localStorage : sessionStorage;
    this.isEnabled = SECURITY_CONFIG.ENABLE_SECURE_STORAGE !== false;
    this.encryptionKey = getEncryptionKey();
  }

  // 加密数据
  encrypt(data) {
    if (!this.isEnabled) {
      return JSON.stringify(data);
    }
    try {
      const jsonData = JSON.stringify(data);
      return CryptoJS.AES.encrypt(jsonData, this.encryptionKey).toString();
    } catch (error) {
      console.error('加密失败:', error);
      return JSON.stringify(data);
    }
  }

  // 解密数据
  decrypt(encryptedData) {
    if (!this.isEnabled || !encryptedData) {
      try {
        return JSON.parse(encryptedData || '{}');
      } catch {
        return {};
      }
    }
    
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, this.encryptionKey);
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedData || '{}');
    } catch (error) {
      console.error('解密失败:', error);
      return {};
    }
  }

  // 存储数据
  setItem(key, data) {
    const encryptedData = this.encrypt(data);
    this.storage.setItem(key, encryptedData);
  }

  // 获取数据
  getItem(key) {
    const encryptedData = this.storage.getItem(key);
    if (!encryptedData) {
      return null;
    }
    return this.decrypt(encryptedData);
  }

  // 删除数据
  removeItem(key) {
    this.storage.removeItem(key);
  }

  // 清空所有数据
  clear() {
    this.storage.clear();
  }
}

// 创建本地存储和会话存储实例
const localSecureStorage = new SecureStorage('localStorage');
const sessionSecureStorage = new SecureStorage('sessionStorage');

// 根据配置选择合适的存储方式
export const secureStorage = APP_CONFIG.SESSION_PERSISTENCE 
  ? localSecureStorage 
  : sessionSecureStorage;

// 用户数据专用存储
export const userStorage = {
  // 保存用户信息
  saveUserInfo(userInfo) {
    if (API_CONFIG.USE_COOKIES) {
      // 使用Cookie存储时，仅保存最基本信息
      // 注意: 这里只是示意，实际应该使用HttpOnly cookies由后端设置
      return;
    }
    
    // 根据配置的会话持久化选项，选择合适的存储
    const storage = APP_CONFIG.SESSION_PERSISTENCE 
      ? localSecureStorage 
      : sessionSecureStorage;
    
    storage.setItem(APP_CONFIG.TOKEN_STORAGE_KEY, userInfo);
  },
  
  // 获取用户信息
  getUserInfo() {
    // 根据配置的会话持久化选项，选择合适的存储
    const storage = APP_CONFIG.SESSION_PERSISTENCE 
      ? localSecureStorage 
      : sessionSecureStorage;
    
    return storage.getItem(APP_CONFIG.TOKEN_STORAGE_KEY);
  },
  
  // 清除用户信息
  clearUserInfo() {
    localSecureStorage.removeItem(APP_CONFIG.TOKEN_STORAGE_KEY);
    sessionSecureStorage.removeItem(APP_CONFIG.TOKEN_STORAGE_KEY);
  }
};

export default secureStorage; 