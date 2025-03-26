<script>
export default {
  name: 'App',
  mounted() {
    this.initialize();
  },
  methods: {
    initialize() {
    }
  }
}
</script>

<template>
  <v-app>
    <NavBar class="hardware-accelerated reduce-flicker" />
    
    <v-main class="hardware-accelerated">
      <v-container fluid class="page-container pa-0">
        <router-view v-slot="{ Component }">
          <keep-alive :include="['HomeView', 'ArchiveView']">
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </v-container>
    </v-main>
    <app-footer />
  </v-app>
</template>

<style>
:root {
  --primary-blue: 63, 81, 181;
  --accent-orange: 255, 145, 55;
  --card-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  --transition-default: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow-text: 2.5s cubic-bezier(0.25, 0.8, 0.25, 1);
  --transition-medium: 1.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-container {
  min-height: calc(100vh - 64px);
}

/* 添加页面过渡效果 */
.page-transition-enter-active,
.page-transition-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.page-transition-enter-from,
.page-transition-leave-to {
  opacity: 0;
  transform: translateY(10px);
}


.subtitle-text,
.tagline-text,
.site-description {
  transition: color var(--transition-slow-text), 
              opacity var(--transition-slow-text),
              text-shadow var(--transition-slow -text);
}

body, .v-application {
  transition: background-color 0.5s ease;
}

.v-application {
  transition: background-color 0.3s ease-out !important;
}
.v-theme--dark .hero-subtitle,
.v-theme--dark .tagline-prefix {
  transition-duration: 0.3s !important;
}
:deep(.v-theme--dark) .gradient-text {
  will-change: opacity;
}
</style>

<script setup>
import { onMounted, nextTick } from 'vue';
import NavBar from '@/components/NavBar.vue';
import AppFooter from '@/components/AppFooter.vue';

onMounted(async () => {
  document.title = 'Noah\'s Blog';
  
  // 使用更简单的favicon生成方式
  const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 80 80"><circle cx="40" cy="40" r="36" fill="#3f51b5"/><path d="M24 25v30c0 3 8 3 16 0 8 3 16 3 16 0V25c0-3-8-3-16 0-8-3-16-3-16 0z" fill="#fff"/><path d="M40 25v30" stroke="#3f51b5" stroke-width="2" stroke-linecap="round"/><path d="M50 23v12l-4-3-4 3V23z" fill="#ff913d"/><path d="M30 50v-8l6 6v-8" stroke="#3f51b5" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`;
  
  // 避免在主渲染流程中执行，减少卡顿
  await nextTick();
  
  const iconUrl = `data:image/svg+xml;base64,${btoa(iconSvg)}`;
  let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
  link.type = 'image/svg+xml';
  link.rel = 'shortcut icon';
  link.href = iconUrl;
  document.head.appendChild(link);
});
</script>
