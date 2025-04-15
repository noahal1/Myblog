<template>
  <div>  
    <v-app-bar
      flat
      class="nav-bar"
      :class="{
        'scrolled': isScrolled,
        'hidden': isHidden,
        'transparent': !isScrolled
      }"
      :elevation="isScrolled ? 2 : 0"
      :height="navbarHeightValue"
    >
      <div class="nav-container d-flex align-center">
        <router-link to="/" class="logo-wrapper text-decoration-none d-flex align-center">
          <div class="logo-container">
            <logo-icon 
              :width="35" 
              :height="35" 
              :color="logoColor" 
              :theme="logoTheme" 
              class="logo-svg" 
            />
            <div class="logo-glow"></div>
          </div>
          <div class="brand-text">
            <span class="site-title">Noah's Blog</span>
          </div>
        </router-link>

        <v-spacer></v-spacer>
        
        <div class="desktop-nav" v-if="!isMobile">
          <router-link 
            v-for="(item, index) in navItems" 
            :key="index"
            :to="item.to"
            class="nav-link"
            :class="{ 'active': isActiveRoute(item.to) }"
          >
            <span class="nav-icon"><v-icon :icon="item.icon"></v-icon></span>
            <span class="nav-text">{{ item.label }}</span>
          </router-link>
        </div>
        
        <div class="action-area d-flex align-center">
          <v-btn
            icon
            variant="text"
            @click="toggleTheme"
            class="theme-toggle-btn"
            :ripple="false"
          >
            <div class="theme-icon-container">
              <v-icon :icon="themeIcon" />
            </div>
          </v-btn>

          <v-menu
            location="bottom end"
            :close-on-content-click="false"
            transition="scale-transition"
            class="user-menu"
          >
            <template #activator="{ props }">
              <v-btn
                variant="text"
                class="user-menu-trigger ml-2"
                v-bind="props"
                :ripple="false"
              >
                <v-avatar size="32" class="user-avatar">
                  <template v-if="userStore.avatar">
                    <v-img :src="userStore.avatar" alt="用户头像" />
                  </template>
                  <template v-else>
                    <v-icon v-if="!userStore.isLogin" icon="mdi-account-circle" size="32" />
                    <span v-else class="text-h6">{{ userStore.userInitials }}</span>
                  </template>
                </v-avatar>
                <span class="text-capitalize user-name" v-if="!isSmallScreen">
                  {{ userStore.username || '游客' }}
                </span>
                <v-icon icon="mdi-chevron-down" size="small" class="ml-1" v-if="!isSmallScreen"/>
              </v-btn>
            </template>
            
            <v-card class="menu-card" elevation="3" rounded="lg">
              <v-list class="user-menu-list">
                <v-list-item
                  v-if="!userStore.isLogin"
                  to="/login"
                  prepend-icon="mdi-login"
                  title="登录注册"
                  class="menu-item"
                  rounded="lg"
                />
                <template v-else>
                  <v-list-item class="user-info-item pa-3" rounded="lg">
                    <template v-slot:prepend>
                      <v-avatar size="40" class="mr-3">
                        <template v-if="userStore.avatar">
                          <v-img :src="userStore.avatar" alt="用户头像" />
                        </template>
                        <template v-else>
                          <span class="text-h6">{{ userStore.userInitials }}</span>
                        </template>
                      </v-avatar>
                    </template>
                    <v-list-item-title class="font-weight-medium">
                      {{ userStore.username }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="text-caption">
                      已登录
                    </v-list-item-subtitle>
                  </v-list-item>
                  
                  <v-divider class="my-2"></v-divider>
                  
                  <v-list-item
                    to="/create-article"
                    prepend-icon="mdi-pencil"
                    title="创建文章"
                    class="menu-item"
                    rounded="lg"
                  />
                  <v-list-item
                    @click="handleLogout"
                    prepend-icon="mdi-logout"
                    title="退出登录"
                    class="menu-item"
                    rounded="lg"
                  />
                </template>
              </v-list>
            </v-card>
          </v-menu>
          
          <v-btn
            v-if="isMobile"
            variant="text"
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="mobile-menu-btn ml-2"
            :ripple="false"
          >
            <div class="hamburger" :class="{ 'open': mobileMenuOpen }">
              <span></span>
              <span></span>
            </div>
          </v-btn>
        </div>
      </div>
    </v-app-bar>
    
    <div class="mobile-menu" :class="{ 'open': mobileMenuOpen }">
      <div class="mobile-menu-container">
        <router-link 
          v-for="(item, index) in navItems" 
          :key="index"
          :to="item.to"
          class="mobile-nav-link"
          @click="mobileMenuOpen = false"
        >
          <v-icon :icon="item.icon" class="mr-3"></v-icon>
          {{ item.label }}
        </router-link>
      </div>
      <div class="mobile-menu-backdrop" @click="mobileMenuOpen = false"></div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '../stores/user'
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import { useDisplay, useTheme } from 'vuetify'
import { useRoute } from 'vue-router'
import LogoIcon from './icons/LogoIcon.vue'

const userStore = useUserStore()
const display = useDisplay()
const theme = useTheme()
const route = useRoute()
const navbarHeight = ref(56)
const navbarHeightValue = computed(() => navbarHeight.value)
const mobileMenuOpen = ref(false)

const isMobile = computed(() => display.mdAndDown.value)
const isSmallScreen = computed(() => display.smAndDown.value)

const navItems = [
  { to: '/', icon: 'mdi-home', label: '首页' },
  { to: '/knowledge', icon: 'mdi-bookshelf', label: '知识库' },
  { to: '/about', icon: 'mdi-information', label: '关于' }
]

const isActiveRoute = (path) => {
  return route.path === path
}

const isDarkTheme = computed(() => {
  try {
    return !!theme.global.current.value?.dark
  } catch (e) {
    console.warn('无法确定主题状态:', e)
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  }
})

const logoTheme = computed(() => isDarkTheme.value ? 'dark' : 'light')

const themeIcon = computed(() => {
  const currentTheme = theme.global.name.value
  const isSystemTheme = localStorage.getItem('theme') === 'system'
  
  if (isSystemTheme) return 'mdi-theme-light-dark'
  if (currentTheme === 'dark') return 'mdi-weather-sunny'
  return 'mdi-weather-night'
})

const isThemeChanging = ref(false)
const toggleTheme = () => {
  if (isThemeChanging.value) return
  isThemeChanging.value = true
  
  requestAnimationFrame(() => {
    const currentSetting = localStorage.getItem('theme') || theme.global.name.value
    const nextTheme = currentSetting === 'light' ? 'dark' : 'light'
    document.documentElement.classList.add('theme-minimal-transition')
    
    localStorage.setItem('theme', nextTheme)
    theme.global.name.value = nextTheme
    
    setTimeout(() => {
      document.documentElement.classList.remove('theme-minimal-transition')
      isThemeChanging.value = false
    }, 100)
  })
}

const logoColor = computed(() => {
  return isDarkTheme.value
    ? 'rgba(156, 39, 176, 0.9)' 
    : 'rgba(63, 81, 181, 0.9)'
})

const isScrolled = ref(false)
const isHidden = ref(false)
const lastScrollTop = ref(0)
const scrollThreshold = 10
const hideThreshold = 100

const handleScroll = () => {
  const currentScrollTop = window.scrollY
  const scrollDelta = currentScrollTop - lastScrollTop.value
  
  isScrolled.value = currentScrollTop > scrollThreshold
  
  if (scrollDelta > 0 && currentScrollTop > hideThreshold) {
    if (!isHidden.value) {
      isHidden.value = true
    }
  } else if (scrollDelta < 0) {
    if (isHidden.value) {
      isHidden.value = false
    }
  }
  
  lastScrollTop.value = currentScrollTop <= 0 ? 0 : currentScrollTop
}

const throttle = (fn, delay) => {
  let lastCall = 0
  return function(...args) {
    const now = new Date().getTime()
    if (now - lastCall < delay) return
    lastCall = now
    return fn(...args)
  }
}

const throttledScroll = throttle(handleScroll, 16)

watch(() => route.path, () => {
  mobileMenuOpen.value = false
})

onMounted(() => {
  window.addEventListener('scroll', throttledScroll)
  handleScroll()
  
  try {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      theme.global.name.value = savedTheme
    } else {
      theme.global.name.value = 'system'
    }
    
    // 每次组件挂载时检查用户状态
    checkUserAuth()
  } catch (e) {
    console.error('设置初始主题时出错:', e)
  }
})

// 检查用户认证状态
const checkUserAuth = async () => {
  if (userStore.isLogin && userStore.token) {
    try {
      // 验证token有效性
      const isValid = await userStore.verifyToken()
      
      if (!isValid) {
        console.log('Token无效，正在登出...')
        userStore.logout()
      } else {
        console.log('用户已登录:', userStore.username)
      }
    } catch (error) {
      console.error('验证用户token时出错:', error)
      userStore.logout() // 出错时登出用户
    }
  }
}

onUnmounted(() => {
  window.removeEventListener('scroll', throttledScroll)
})

const handleLogout = () => {
  if (confirm('确定要退出登录吗？')) {
    userStore.logout()
    window.location.href = '/login'
  }
}
</script>

<style scoped>
</style>
