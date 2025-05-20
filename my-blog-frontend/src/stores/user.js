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
    userInitials: (state) => {
      if (!state.username) return ''
      return state.username.charAt(0).toUpperCase()
    },
    
    isAuthenticated: (state) => {
      return state.isLogin && !!state.token
    },
    
    isAdmin: (state) => {
      return state.isAuthenticated && state.userId === 1
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
    
    // 初始化用户状态
    async initUserState() {
      try {
        // 尝试从存储获取用户信息
        const userData = userStorage.getUserInfo()
        
        if (userData && userData.token) {
          // 有token，设置用户状态
          this.username = userData.username || ''
          this.token = userData.token
          this.refreshToken = userData.refreshToken || ''
          this.expiresAt = userData.expiresAt || null
          this.userId = userData.userId || null
          this.avatar = userData.avatar || ''
          this.isLogin = true
          
          console.log('从存储加载用户状态：', this.username)
          return true
        }
        
        return false
      } catch (error) {
        console.error('初始化用户状态失败:', error)
        return false
      }
    },
    
    // 保存用户数据到存储
    saveUserData() {
      const userData = {
        username: this.username,
        token: this.token,
        refreshToken: this.refreshToken,
        expiresAt: this.expiresAt,
        userId: this.userId,
        avatar: this.avatar,
        lastLoginTime: this.lastLoginTime
      }
      
      userStorage.saveUserInfo(userData)
    },
    
    // 退出登录
    logout() {
      this.username = ''
      this.token = ''
      this.refreshToken = ''
      this.expiresAt = null
      this.isLogin = false
      this.userId = null
      this.avatar = ''
      
      userStorage.clearUserInfo()
    },
    
    // 验证token有效性
    async verifyToken() {
      try {
        if (!this.token) {
          return false
        }
        
        // 这里可以添加验证token的API调用
        // 暂时简单返回true，实际应该调用后端验证
        return true
      } catch (error) {
        console.error('验证token失败:', error)
        return false
      }
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
        
        this.saveUserData();
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