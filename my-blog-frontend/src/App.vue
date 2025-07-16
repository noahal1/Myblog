<script>
export default {
  name: 'App',
  mounted() {
    this.initialize();
  },
  methods: {
    initialize() {
      // 初始化应用状态
      console.log('App 组件已加载');
    }
  }
}
</script>

<template>
  <v-app>
    <nav-bar @toggle-theme="toggleTheme" :current-theme="currentTheme" />
    <v-main id="main-content" role="main">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <keep-alive :include="['HomeView', 'ArchiveView']">
            <component :is="Component" />
          </keep-alive>
        </transition>
      </router-view>
    </v-main>
    <app-footer />
  </v-app>
</template>

<style>
@import './assets/styles.css';
@import './assets/styles/glassmorphism.css';
@import './assets/styles/microinteractions.css';
@import './assets/styles/performance.css';
@import './assets/styles/theme-performance.css';
@import './assets/styles/premium-theme.css';
@import './assets/styles/views/article.css';
@import './assets/styles/views/about.css';
@import './assets/styles/views/knowledge.css';
@import './assets/styles/views/admin.css';


/* 全局样式 */
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background-color: var(--background);
  color: var(--text-primary);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transition: background-color 0.3s ease, color 0.3s ease;
}

* {
  transition: background-color 0.3s ease, 
              color 0.3s ease, 
              border-color 0.3s ease, 
              box-shadow 0.3s ease;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

:root {
  --primary-blue: var(--prussian-blue);
  --accent-orange: var(--sage-green);
  --card-shadow: 0 4px 20px rgba(var(--prussian-blue), 0.08);
  --transition-default: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow-text: 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
  --transition-medium: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-container {
  min-height: calc(100vh - 64px);
}

.page-transition-enter-active,
.page-transition-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.page-transition-enter-from,
.page-transition-leave-to {
  opacity: 0;
  transform: translateY(10px);
}


/* 优化文本过渡性能 */
.subtitle-text,
.tagline-text,
.site-description {
  transition: color 0.2s ease, opacity 0.2s ease;
}

/* 优化主题切换性能 */
body, .v-application {
  transition: background-color 0.15s ease;
}

.v-application {
  transition: background-color 0.15s ease !important;
}

.v-main {
  --v-layout-bottom: 100px !important;
  padding-bottom: 10px !important;
}

:deep(.v-footer) {
  margin-top: 0 !important; 
}

/* 优化暗色模式过渡 */
.v-theme--dark .hero-subtitle,
.v-theme--dark .tagline-prefix {
  transition-duration: 0.15s !important;
}

/* 性能优化 */
:deep(.v-theme--dark) .gradient-text {
  will-change: color;
  transform: translateZ(0); /* 硬件加速 */
}
</style>

<script setup>
import { ref, provide, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from './components/NavBar.vue'
import AppFooter from './components/AppFooter.vue'
import { useTheme } from 'vuetify'
import { useUserStore } from './stores/user'

const theme = useTheme()
const currentTheme = ref('light')
const router = useRouter()
const userStore = useUserStore()

// 提供主题给子组件
provide('theme', currentTheme)

// 优化的主题切换函数
const isThemeChanging = ref(false)
const toggleTheme = () => {
  if (isThemeChanging.value) return

  isThemeChanging.value = true

  // 添加快速切换类，减少过渡动画
  document.documentElement.classList.add('theme-switching')

  requestAnimationFrame(() => {
    const newTheme = currentTheme.value === 'light' ? 'dark' : 'light'
    currentTheme.value = newTheme
    theme.global.name.value = newTheme
    localStorage.setItem('theme', newTheme)

    // 短暂延迟后移除快速切换类
    setTimeout(() => {
      document.documentElement.classList.remove('theme-switching')
      isThemeChanging.value = false
    }, 150)
  })
}

// 初始化应用
onMounted(async () => {
// 初始化主题
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    currentTheme.value = savedTheme
    theme.global.name.value = savedTheme
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    // 如果用户系统偏好暗色模式
    currentTheme.value = 'dark'
    theme.global.name.value = 'dark'
  }
  
  // 初始化用户状态
  try {
    await userStore.initUserState()
    console.log('用户状态初始化完成', userStore.isLogin ? '已登录' : '未登录')
  } catch (error) {
    console.error('初始化用户状态失败', error)
  }
})

// 监听路由变化，处理特殊路由规则
watch(() => router.currentRoute.value, async (route) => {
  // 如果进入需要登录的页面但未登录，则重定向到登录页
  if (route.meta.requiresAuth && !userStore.isAuthenticated) {
    console.log('需要登录访问的页面，重定向到登录')
    router.push('/login')
  }
}, { immediate: true })
</script>
