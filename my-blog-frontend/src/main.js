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

// 创建 Vuetify 实例 - 高端配色方案
const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: 'rgb(0, 49, 83)',        // 普鲁士蓝
          secondary: 'rgb(229, 221, 215)',  // 雾灰色 
          accent: 'rgb(0, 49, 83)',         // 普鲁士蓝
          error: '#E53E3E',                 
          warning: 'rgb(255, 193, 7)',      
          info: 'rgb(0, 188, 212)',         
          success: 'rgb(76, 175, 80)',      
          surface: 'rgb(255, 255, 255)',    
          background: 'rgb(255, 255, 255)', 
          'surface-variant': 'rgb(245, 240, 235)', // 浅雾灰
          'on-primary': 'rgb(255, 255, 255)',
          'on-secondary': 'rgb(0, 49, 83)',
          'on-surface': 'rgb(33, 33, 33)',
          'on-background': 'rgb(33, 33, 33)',
          'outline': 'rgb(200, 190, 180)',      // 深雾灰
          'outline-variant': 'rgb(229, 221, 215)' // 雾灰色
        },
      },
      dark: {
        colors: {
          primary: 'rgb(100, 130, 250)',    // 普鲁士蓝亮色版本
          secondary: 'rgb(160, 160, 160)',  // 雾灰色暗色版本
          accent: 'rgb(100, 130, 250)',     // 普鲁士蓝
          error: '#FC8181',                 // 珊瑚红 - 温和提醒
          warning: 'rgb(255, 213, 79)',     // 金色
          info: 'rgb(77, 208, 225)',        // 青色
          success: 'rgb(102, 187, 106)',    // 翡翠绿
          surface: 'rgb(18, 18, 18)',       // 炭黑 - 与CSS变量一致
          background: 'rgb(18, 18, 18)',    // 炭黑 - 与CSS变量一致
          'surface-variant': 'rgb(45, 45, 45)', // 浅炭黑
          'on-primary': 'rgb(245, 245, 245)',
          'on-secondary': 'rgb(245, 245, 245)',
          'on-surface': 'rgb(240, 240, 240)',
          'on-background': 'rgb(200, 200, 200)',
          'outline': 'rgb(120, 120, 120)',      // 深雾灰
          'outline-variant': 'rgb(45, 45, 45)'  // 浅炭黑
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
