<template>
  <v-toolbar
    density="comfortable"
    flat
    class="neon-navbar"
    :class="{ 'scrolled': isScrolled }"
    :color="toolbarColor"
  >
    <v-toolbar-title class="logo-container">
      <div class="logo-item d-flex align-center">
        <logo-icon 
          :width="35" 
          :height="35" 
          :color="logoColor" 
          :theme="logoTheme" 
          class="logo-svg" 
        />
        <span class="site-title">Noah's Blog</span>
      </div>
    </v-toolbar-title>

    <v-spacer></v-spacer>
    
    <div class="nav-buttons">
      <v-btn
        v-for="(item, index) in navItems"
        :key="index"
        variant="text"
        :to="item.to"
        :prepend-icon="item.icon"
        class="nav-btn"
      >{{ item.label }}</v-btn>
    </div>
  
    
    <!-- 主题切换按钮 -->
    <v-btn
      icon
      variant="text"
      @click="toggleTheme"
      class="theme-toggle-btn mx-2"
    >
      <v-icon :icon="themeIcon" />
    </v-btn>

    <v-menu location="bottom end" :close-on-content-click="false">
      <template #activator="{ props }">
        <v-btn
          variant="text"
          class="user-menu-trigger"
          v-bind="props"
        >
          <v-avatar size="32" class="mr-2">
            <v-icon icon="mdi-account-circle" size="32" />
          </v-avatar>
          <span class="text-capitalize">{{ userStore.username || '游客' }}</span>
        </v-btn>
      </template>
      
      <v-card class="menu-card" elevation="8">
        <v-list density="compact" bg-color="surfaceVariant">
          <v-list-item
            v-if="!userStore.isLogin"
            to="/login"
            prepend-icon="mdi-login"
            title="登录注册"
          />
          <v-list-item
            v-else
            @click="handleLogout"
            prepend-icon="mdi-logout"
            title="退出登录"
          />
          <v-list-item
            v-if="userStore.isLogin"
            to="/create-article"
            prepend-icon="mdi-pencil"
            title="创建文章"
          />
        </v-list>
      </v-card>
    </v-menu>
  </v-toolbar>
</template>

<style scoped>
.neon-navbar {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--z-index-nav);
  width: 100%;
  max-width: 100%;
  backdrop-filter: blur(8px) saturate(100%);
  background: linear-gradient(
    var(--gradient-angle),
    rgba(var(--primary-blue), 0.1),
    rgba(var(--secondary-purple), 0.06),
    rgba(var(--accent-orange), 0.02)
  );
  transition: all var(--transition-default);
}

.neon-navbar.scrolled {
  background: linear-gradient(
    var(--gradient-angle),
    rgba(var(--primary-blue), 0.1),
    rgba(var(--secondary-purple), 0.06),
    rgba(var(--accent-orange), 0.02)
  ) !important;
  box-shadow: 0 6px 24px rgba(var(--primary-blue), 0.2);
  backdrop-filter: blur(20px) saturate(200%);
}

.logo-container {
  height: 100%;
  display: flex;
  align-items: center;
}

.logo-item {
  position: relative;
  transition: all var(--transition-default);
  display: flex;
  align-items: center;
  height: 100%;
}

.site-title {
  background: var(--neon-gradient);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-weight: bold;
  transition: all var(--transition-default);
  margin-left: 10px;
  font-size: 1.25rem;
  line-height: 1;
  position: relative;
  top: 1px;
}

.logo-item:hover .site-title {
  letter-spacing: 1px;
}

.logo-svg {
  transition: transform var(--transition-default);
  display: flex;
}

.logo-item:hover .logo-svg {
  transform: rotate(10deg) scale(1.1);
}

.nav-btn {
  transition: all var(--transition-default);
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  font-weight: 500;
}

.nav-btn::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 0;
  background: linear-gradient(90deg, 
    rgba(var(--primary-blue), 0.1), 
    rgba(var(--secondary-purple), 0.1),
    rgba(var(--accent-orange), 0.1)
  );
  transition: height var(--transition-default);
  z-index: -1;
}

.nav-btn:hover::before {
  height: 100%;
}

.nav-btn::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, 
    rgba(var(--accent-orange), 0.7), 
    rgba(var(--secondary-purple), 0.7),
    rgba(var(--primary-blue), 0.7)
  );
  transition: all var(--transition-default);
  transform: translateX(-50%);
}

.nav-btn:hover::after {
  width: 80%;
}

.user-menu-trigger {
  border-radius: 20px;
  transition: all var(--transition-default);
  padding: 0 12px;
}

.user-menu-trigger:hover {
  background: rgba(var(--primary-blue), 0.1);
}

.menu-card {
  background: rgba(var(--v-theme-surface), 0.85);
  border-radius: var(--border-radius);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(var(--primary-blue), 0.1);
  overflow: hidden;
}

/* 响应式优化 */
@media (max-width: 960px) {
  .nav-btn span {
    display: none;
  }
  .nav-btn :deep(.v-icon) {
    margin-right: 0;
  }
}

@media (max-width: 600px) {
  .logo-item span {
    display: none;
  }
}

.nav-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-toggle-btn {
  position: relative;
  transition: all var(--transition-default);
}

.theme-toggle-btn:hover {
  transform: rotate(12deg);
  background: rgba(var(--primary-blue), 0.1);
}

.theme-transitioning * {
  transition-delay: 0s !important; 
}
</style>

<script setup>
import { useUserStore } from '../stores/user'
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import { useDisplay, useTheme } from 'vuetify'
import LogoIcon from './icons/LogoIcon.vue'

const userStore = useUserStore()
const display = useDisplay()
const theme = useTheme()

// 使用Vuetify提供的断点系统替代手动媒体查询
const isMobile = computed(() => display.mdAndDown.value)
const isSmallScreen = computed(() => display.smAndDown.value)

// 优化导航项定义
const navItems = [
  { to: '/', icon: 'mdi-home', label: '首页' },
  { to: '/archive', icon: 'mdi-archive', label: '归档' },
  { to: '/about', icon: 'mdi-information', label: '关于' }
]

// 修复主题检测逻辑
const isDarkTheme = computed(() => {
  try {
    // 尝试安全地访问dark属性
    return !!theme.global.current.value?.dark;
  } catch (e) {
    console.warn('无法确定主题状态:', e);
    // 回退到检查系统偏好
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
});

const logoTheme = computed(() => {
  return isDarkTheme.value ? 'dark' : 'light';
});

// 修改图标显示逻辑
const themeIcon = computed(() => {
  const currentTheme = theme.global.name.value;
  // 检查是否使用系统主题
  const isSystemTheme = localStorage.getItem('theme') === 'system';
  
  if (isSystemTheme) return 'mdi-theme-light-dark';
  if (currentTheme === 'dark') return 'mdi-weather-sunny';
  return 'mdi-weather-night';
});

const toggleTheme = () => {
  if (isThemeChanging.value) return
  isThemeChanging.value = true
  requestAnimationFrame(() => {
    const currentSetting = localStorage.getItem('theme') || theme.global.name.value
    const nextTheme = currentSetting === 'light' ? 'dark' : 'light'
    document.documentElement.classList.add('theme-minimal-transition')
    
    // 保存并应用新主题
    localStorage.setItem('theme', nextTheme)
    theme.global.name.value = nextTheme
    
    // 切换完成后允许再次切换
    setTimeout(() => {
      document.documentElement.classList.remove('theme-minimal-transition')
      isThemeChanging.value = false
    }, 100)
  })
}

// 添加状态变量来防止频繁切换
const isThemeChanging = ref(false)

const toolbarColor = computed(() => 
  isDarkTheme.value ? 'surface' : 'background'
)

// 根据主题设置Logo颜色
const logoColor = computed(() => {
  return isDarkTheme.value
    ? 'rgba(156, 39, 176, 0.9)' // 深色主题时的颜色
    : 'rgba(63, 81, 181, 0.9)'  // 浅色主题时的颜色
})

const isScrolled = ref(false)
const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  
  try {
    // 从localStorage读取用户主题偏好
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      theme.global.name.value = savedTheme;
    } else {
      // 如果没有保存的主题，则使用系统主题
      theme.global.name.value = 'system';
    }
  } catch (e) {
    console.error('设置初始主题时出错:', e);
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const handleLogout = () => {
  if (confirm('确定要退出登录吗？')) {
    userStore.logout()
    window.location.href = '/login'
  }
}
</script>
