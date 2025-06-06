import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import '@mdi/font/css/materialdesignicons.css'

import './assets/styles/index.css'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { useUserStore } from './stores/user'
import 'md-editor-v3/lib/style.css'

// 创建 Vuetify 实例
const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#3F51B5',
          secondary: '#9C27B0', 
          accent: '#FF9800',
          error: '#F44336',
          warning: '#FFC107',
          info: '#2196F3',
          success: '#4CAF50',
          background: '#F5F5F5'
        },
      },
      dark: {
        colors: {
          primary: '#5C6BC0',
          secondary: '#BA68C8',
          accent: '#FFB74D',
          error: '#EF5350',
          warning: '#FFD54F',
          info: '#64B5F6',
          success: '#81C784',
          background: '#121212'
        },
      },
    },
  },
})

// 创建 Vue 应用并应用 Vuetify
const app = createApp(App)
const pinia = createPinia()

// 使用 Pinia 和 Router
app.use(pinia)
app.use(router)
app.use(vuetify) // 注册 Vuetify

// 在应用挂载前初始化用户状态
const initApp = async () => {
const userStore = useUserStore()
  try {
    // 异步初始化用户状态
    await userStore.initUserState()
    console.log('用户状态初始化完成', userStore.isAuthenticated ? '已登录' : '未登录')
  } catch (error) {
    console.error('初始化用户状态失败:', error)
  } finally {
    // 无论成功或失败，都挂载应用
app.mount('#app')
  }
}

// 执行初始化
initApp()
