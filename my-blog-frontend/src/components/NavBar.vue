<template>
  <v-toolbar
    dense
    flat
    class="navbar"
    style="background: var(--color-bg) !important; color: var(--text-primary) !important"
  >
    <v-toolbar-title class="d-flex align-center">
      <v-icon icon="mdi-book-open" size="24" class="mr-2" />
      <span class="font-weight-medium">Noah's Blog</span>
    </v-toolbar-title>

    <v-spacer />

    <v-btn variant="text" @click="navigateTo('/')">
      <v-icon icon="mdi-home" class="mr-1" />首页
    </v-btn>
    <v-btn variant="text" @click="navigateTo('/archive')">
      <v-icon icon="mdi-archive" class="mr-1" />归档
    </v-btn>

    <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn
          variant="text"
          class="d-flex align-center px-4"
          size="large"
          v-bind="props"
        >
          <v-icon icon="mdi-account" size="28" class="mr-2" />
          <span class="user-name text-body-1 font-weight-medium">
            {{ userStore.username || '游客' }}
          </span>
        </v-btn>
      </template>
      <v-list>
        <v-list-item
          v-if="!userStore.isLogin"
          @click="navigateTo('/login')"
        >
          <v-icon icon="mdi-login" class="mr-2" />
          登录注册
        </v-list-item>
        <v-list-item v-else @click="handleLogout">
          <v-icon icon="mdi-logout" class="mr-2" />
          退出登录
        </v-list-item>
      </v-list>
    </v-menu>
  </v-toolbar>
</template>

<style scoped>
.md-style {
  box-shadow: 0 2px 4px -1px rgba(0,0,0,0.1);
  border-bottom: none;
  padding: 0 48px;
}

.user-name {
  font-size: 0.95rem;
  letter-spacing: 0.03em;
}

.mr-1 { margin-right: 4px; }
.mr-2 { margin-right: 8px; }

:deep(.md-dropdown) {
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}
.navbar {
  background: var(--v-theme-surface) !important;
  color: var(--v-theme-on-surface) !important;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  padding: 1rem;
  backdrop-filter: blur(12px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  z-index: 1000;
  min-height: 64px !important;
}
.flex-grow {
  flex-grow: 1;
}
.logo-item {
  display: flex;
  align-items: center;
  padding-right: 40px !important;
  font-family: var(--font-heading);
  font-size: 1.4rem;
}
.logo {
  height: 32px;
  margin-right: 12px;
}
</style>

<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()

const navigateTo = (path) => {
  router.push(path)
}

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}
</script>