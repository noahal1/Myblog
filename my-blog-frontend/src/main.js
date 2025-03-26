import { createApp } from 'vue'
import { createPinia } from 'pinia'

import './style.css'
import App from './App.vue'
import router from './router'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// 检测系统主题偏好
const prefersDarkTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches

// 获取保存的主题设置
const savedTheme = localStorage.getItem('theme')

// 确定初始主题
let initialTheme = 'light'
if (savedTheme) {
  initialTheme = savedTheme
} else if (prefersDarkTheme) {
  initialTheme = 'dark'
}

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    // 不使用'system'主题，而是根据系统偏好设置初始主题
    defaultTheme: initialTheme,
    themes: {
      light: {
        colors: {
          primary: '#3f51b5',
          secondary: '#b0bec5',
          accent: '#8c9eff',
          background: '#f5f5f5'
        },
      },
      dark: {
        colors: {
          primary: '#7986cb',
          secondary: '#546e7a',
          accent: '#82b1ff',
          surface: '#212121'
        },
      },
    },
  },
})

const app = createApp(App)
app.use(createPinia())
app.use(vuetify)
app.use(router)

app.mount('#app')

// 监听系统主题变化
if (window.matchMedia) {
  const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)')
  colorSchemeQuery.addEventListener('change', (e) => {
    // 只有当用户选择了"系统"主题时才自动切换
    if (localStorage.getItem('theme') === 'system') {
      const newTheme = e.matches ? 'dark' : 'light'
      vuetify.theme.global.name.value = newTheme
    }
  })
}
