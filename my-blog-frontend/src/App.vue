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
    <NavBar />
    
    <v-main>
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
</style>

<script setup>
import NavBar from '@/components/NavBar.vue'
import AppFooter from '@/components/AppFooter.vue'
</script>
