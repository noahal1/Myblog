import { defineStore } from 'pinia'
import axios from 'axios'
import { API_BASE_URL, API_CONFIG, APP_CONFIG } from '../config.js'
import { userStorage } from '../utils/secureStorage'

export const useUserStore = defineStore('user', {
  state: () => ({
    username: '',
    token: '',
    refreshToken: '',
    expiresAt: null,
    isLogin: false,
    userId: null,
    avatar: '',
    lastLoginTime: null
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token && state.isLogin,
    userInitials: (state) => {
      if (!state.username) return '游客'
      return state.username.substring(0, 1).toUpperCase()
    }
  },
  
  actions: {
    login(userData) {
      this.username = userData.username
      this.token = userData.token
      this.refreshToken = userData.refreshToken || ''
      this.expiresAt = userData.expiresAt || null
      this.isLogin = true
      this.userId = userData.userId
      this.avatar = userData.avatar || ''
      this.lastLoginTime = new Date().toISOString()
      
      this.saveUserData()
    },
    
    saveUserData() {
      const userData = {
        username: this.username,
        token: this.token,
        refreshToken: this.refreshToken,
        expiresAt: this.expiresAt,
        isLogin: this.isLogin,
        userId: this.userId,
        avatar: this.avatar,
        lastLoginTime: this.lastLoginTime
      }
      
      userStorage.saveUserInfo(userData)
    },
    
    logout() {
      this.username = ''
      this.token = ''
      this.refreshToken = ''
      this.expiresAt = null
      this.isLogin = false
      this.userId = null
      this.avatar = ''
      this.lastLoginTime = null
      
      userStorage.clearUserInfo()
    },
    
<<<<<<< HEAD
<<<<<<< HEAD
    // 从本地存储恢复用户状态
    async initUserState() {
      const savedUser = localStorage.getItem('user')
      if (savedUser) {
=======
    // 从存储恢复用户状态
    async initUserState() {
      const userData = userStorage.getUserInfo()
      if (userData) {
>>>>>>> feature-branch
=======
    // 从存储恢复用户状态
    async initUserState() {
      const userData = userStorage.getUserInfo()
      if (userData) {
>>>>>>> e41fb12 (合并冲突解决)
        try {
          this.username = userData.username || ''
          this.token = userData.token || ''
          this.refreshToken = userData.refreshToken || ''
          this.expiresAt = userData.expiresAt || null
          this.isLogin = userData.isLogin || false
          this.userId = userData.userId || null
          this.avatar = userData.avatar || ''
          this.lastLoginTime = userData.lastLoginTime || null
          
          // 如果登录时间超过配置的最大会话天数，自动登出
          if (this.lastLoginTime) {
            const loginDate = new Date(this.lastLoginTime)
            const now = new Date()
            const diffDays = Math.floor((now - loginDate) / (1000 * 60 * 60 * 24))
            
            if (diffDays > APP_CONFIG.MAX_SESSION_DAYS) {
              console.log('登录已过期，自动登出')
              this.logout()
              return false
            }
          }
          
          // 如果有token，检查是否已过期
          if (this.token) {
            // 检查token是否已过期或即将过期
            if (this.expiresAt) {
              const expiryTime = this.expiresAt * 1000 // 转换为毫秒
              const now = Date.now()
<<<<<<< HEAD
<<<<<<< HEAD
              const thresholdMs = 5 * 60 * 1000 // 5分钟
=======
              const thresholdMs = API_CONFIG.REFRESH_THRESHOLD_MINUTES * 60 * 1000
>>>>>>> feature-branch
=======
              const thresholdMs = API_CONFIG.REFRESH_THRESHOLD_MINUTES * 60 * 1000
>>>>>>> e41fb12 (合并冲突解决)
              
              // 如果token已过期或即将过期，并且有刷新token
              if (now > (expiryTime - thresholdMs) && this.refreshToken) {
                console.log('Token即将过期，尝试刷新')
                try {
                  const refreshSuccess = await this.refreshAccessToken()
                  if (!refreshSuccess) {
                    console.log('刷新Token失败，登出用户')
                    this.logout()
                    return false
                  }
                } catch (error) {
                  console.error('刷新Token失败:', error)
                  this.logout()
                  return false
                }
              }
            }
            
            // 设置已登录状态
            this.isLogin = true
            return true
          }
        } catch (error) {
          console.error('初始化用户状态时出错:', error)
          this.logout()
          return false
        }
      }
      return false
    },
    
    // 验证token有效性的方法
    async verifyToken() {
      if (!this.token) return false;
      
      try {
        // 检查token是否已过期
        if (this.expiresAt) {
          const expiryTime = new Date(this.expiresAt * 1000); // 转换为毫秒
          const now = new Date();
          
          // 如果token已过期且有刷新token，尝试刷新
          if (now > expiryTime) {
            console.log('Token已过期，尝试刷新');
            if (this.refreshToken) {
              return await this.refreshAccessToken();
            }
            return false;
          }
          
<<<<<<< HEAD
<<<<<<< HEAD
          // 如果token即将过期（5分钟内），尝试提前刷新
          const thresholdMs = 5 * 60 * 1000; // 5分钟
=======
          // 如果token即将过期，尝试提前刷新
          const thresholdMs = API_CONFIG.REFRESH_THRESHOLD_MINUTES * 60 * 1000;
>>>>>>> feature-branch
=======
          // 如果token即将过期，尝试提前刷新
          const thresholdMs = API_CONFIG.REFRESH_THRESHOLD_MINUTES * 60 * 1000;
>>>>>>> e41fb12 (合并冲突解决)
          if (now > (expiryTime - thresholdMs) && this.refreshToken) {
            console.log('Token即将过期，尝试提前刷新');
            // 异步刷新，但不等待结果
            this.refreshAccessToken().catch(error => {
              console.error('提前刷新token失败:', error);
            });
          }
          
          // token未过期，有效
          return true;
        }
      } catch (error) {
        console.error('验证token出错:', error);
      }
      
      // 如果没有过期时间信息或出现错误，使用token存在作为退路检查
      return !!this.token;
    },
    
    // 刷新访问令牌
    async refreshAccessToken() {
      if (!this.refreshToken) {
        console.error('没有可用的刷新令牌');
        return false;
      }
      
      try {
        console.log('开始刷新访问令牌...');
        const response = await axios.post(`${API_BASE_URL}/api/token/refresh`, {
          refresh_token: this.refreshToken
        });
        
        if (!response || !response.data) {
          console.error('刷新令牌响应无效');
          return false;
        }
        
        const { access_token, refresh_token, expires_at, userId } = response.data;
        
        // 更新令牌
        this.token = access_token;
        this.refreshToken = refresh_token;
        this.expiresAt = expires_at;
        this.userId = userId || this.userId;
        this.isLogin = true;
        
<<<<<<< HEAD
<<<<<<< HEAD
        this.saveToLocalStorage();
=======
        this.saveUserData();
>>>>>>> feature-branch
=======
        this.saveUserData();
>>>>>>> e41fb12 (合并冲突解决)
        console.log('访问令牌刷新成功');
        return true;
      } catch (error) {
        console.error('刷新访问令牌失败:', error.response?.data || error.message);
        
        // 只有在特定情况下才登出
        if (error.response?.status === 401 || error.response?.status === 403) {
          console.warn('刷新令牌已失效，需要重新登录');
          this.logout();
        }
        
        return false;
      }
    },
    
    // 更新用户信息
    updateUserInfo(userData) {
      if (userData.username) this.username = userData.username
      if (userData.avatar) this.avatar = userData.avatar
      if (userData.userId) this.userId = userData.userId
      
      this.saveUserData()
    }
  }
})