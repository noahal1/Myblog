import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    username: '',
    token: '',
    isLogin: false
  }),
  
  actions: {
    login(userData) {
      this.username = userData.username
      this.token = userData.token
      this.isLogin = true
      
      // 保存到本地存储，以便页面刷新后保持登录状态
      localStorage.setItem('user', JSON.stringify({
        username: this.username,
        token: this.token,
        isLogin: this.isLogin
      }))
    },
    
    logout() {
      this.username = ''
      this.token = ''
      this.isLogin = false
      
      // 清除本地存储
      localStorage.removeItem('user')
    },
    
    // 从本地存储恢复用户状态
    initUserState() {
      const savedUser = localStorage.getItem('user')
      if (savedUser) {
        const userData = JSON.parse(savedUser)
        this.username = userData.username
        this.token = userData.token
        this.isLogin = userData.isLogin
      }
    }
  }
})