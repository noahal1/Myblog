import { defineStore } from 'pinia'
import axios from 'axios'
import { API_BASE_URL } from '../config.js'

export const useUserStore = defineStore('user', {
  state: () => ({
    username: '',
    token: '',
    isLogin: false,
    userId: null,
    avatar: '',
    lastLoginTime: null
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token && state.isLogin,
    userInitials: (state) => {
      if (!state.username) return '游'
      return state.username.substring(0, 1).toUpperCase()
    }
  },
  
  actions: {
    login(userData) {
      this.username = userData.username
      this.token = userData.token
      this.isLogin = true
      this.userId = userData.userId || null
      this.avatar = userData.avatar || ''
      this.lastLoginTime = new Date().toISOString()
      
      // 保存到本地存储，以便页面刷新后保持登录状态
      this.saveToLocalStorage()
    },
    
    saveToLocalStorage() {
      localStorage.setItem('user', JSON.stringify({
        username: this.username,
        token: this.token,
        isLogin: this.isLogin,
        userId: this.userId,
        avatar: this.avatar,
        lastLoginTime: this.lastLoginTime
      }))
    },
    
    logout() {
      this.username = ''
      this.token = ''
      this.isLogin = false
      this.userId = null
      this.avatar = ''
      this.lastLoginTime = null
      
      // 清除本地存储
      localStorage.removeItem('user')
    },
    
    // 从本地存储恢复用户状态
    initUserState() {
      const savedUser = localStorage.getItem('user')
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser)
          this.username = userData.username || ''
          this.token = userData.token || ''
          this.isLogin = userData.isLogin || false
          this.userId = userData.userId || null
          this.avatar = userData.avatar || ''
          this.lastLoginTime = userData.lastLoginTime || null
          
          // 如果登录时间超过7天，自动登出
          if (this.lastLoginTime) {
            const loginDate = new Date(this.lastLoginTime)
            const now = new Date()
            const diffDays = Math.floor((now - loginDate) / (1000 * 60 * 60 * 24))
            
            if (diffDays > 7) {
              console.log('登录已过期，自动登出')
              this.logout()
            }
          }
        } catch (error) {
          console.error('初始化用户状态时出错:', error)
          this.logout()
        }
      }
    },
    
    // 验证token有效性的方法 (未来可以对接后端API)
    async verifyToken() {
      if (!this.token) return false
      
      // 如果有API验证token的端点，可以这样实现:
      // try {
      //   const response = await axios.post(
      //     `${API_URL}/verify-token`,
      //     {},
      //     { headers: { Authorization: `Bearer ${this.token}` }}
      //   )
      //   return response.data.valid
      // } catch (error) {
      //   console.error('验证token时出错:', error)
      //   return false
      // }
      
      // 目前暂时返回true，表示token有效
      return true
    },
    
    // 更新用户信息
    updateUserInfo(userData) {
      if (userData.username) this.username = userData.username
      if (userData.avatar) this.avatar = userData.avatar
      if (userData.userId) this.userId = userData.userId
      
      this.saveToLocalStorage()
    }
  }
})