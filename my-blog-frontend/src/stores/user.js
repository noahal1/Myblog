import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    username: null,
    avatar: null,
    isLogin: false
  }),
  actions: {
    logout() {
      this.username = null
      this.avatar = null
      this.isLogin = false
      localStorage.removeItem('token')
    }
  }
})