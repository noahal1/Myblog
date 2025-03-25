<template>
  <v-toolbar
    density="comfortable"
    flat
    class="neon-navbar"
    :class="{ 'scrolled': isScrolled }"
    :color="toolbarColor"
  >
    <v-toolbar-title class="logo-item">
      <v-icon icon="mdi-book-open-outline" size="28" />
      <span class="text-h6 font-weight-bold ml-2">Noah's Blog</span>
    </v-toolbar-title>

    <v-btn
      v-for="(item, index) in navItems"
      :key="index"
      variant="text"
      :to="item.to"
      :prepend-icon="item.icon"
      class="nav-btn"
    >{{ item.label }}</v-btn>

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
  backdrop-filter: blur(12px) saturate(180%);
  background: linear-gradient(
    var(--gradient-angle),
    rgba(var(--primary-blue), 0.1),
    rgba(var(--secondary-purple), 0.05),
    rgba(var(--accent-orange), 0.08)
  ) !important;
  transition: all var(--transition-default);
}

.neon-navbar.scrolled {
  background: linear-gradient(
    var(--gradient-angle),
    rgba(var(--primary-blue), 0.25),
    rgba(var(--secondary-purple), 0.15),
    rgba(var(--accent-orange), 0.1)
  ) !important;
  box-shadow: 0 6px 24px rgba(var(--primary-blue), 0.2);
  backdrop-filter: blur(20px) saturate(200%);
}

.logo-item {
  position: relative;
  transition: all var(--transition-default);
}

.logo-item span {
  background: var(--neon-gradient);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-weight: bold;
  transition: all var(--transition-default);
  letter-spacing: 0.5px;
}

.logo-item:hover span {
  letter-spacing: 1px;
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
</style>

<script setup>
import { useUserStore } from '../stores/user'
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useDisplay } from 'vuetify'

const userStore = useUserStore()
const display = useDisplay()

// 使用Vuetify提供的断点系统替代手动媒体查询
const isMobile = computed(() => display.mdAndDown.value)
const isSmallScreen = computed(() => display.smAndDown.value)

// 优化导航项定义
const navItems = [
  { to: '/', icon: 'mdi-home', label: '首页' },
  { to: '/archive', icon: 'mdi-archive', label: '归档' },
  { to: '/about', icon: 'mdi-information', label: '关于' }
]

// 使用Vuetify主题API获取当前主题
const theme = computed(() => {
  return useDisplay().theme
})

const toolbarColor = computed(() => 
  theme.value?.global?.current?.dark ? 'surface' : 'background'
)

// 添加滚动行为优化
const isScrolled = ref(false)
const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
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
