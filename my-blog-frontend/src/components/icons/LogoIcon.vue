<template>
  <svg 
    :width="width" 
    :height="height" 
    viewBox="0 0 80 80" 
    xmlns="http://www.w3.org/2000/svg"
    :style="{ filter: 'drop-shadow(0 2px 3px rgba(0, 0, 0, 0.15))' }"
  >
    <!-- 背景圆形 -->
    <circle cx="40" cy="40" r="36" :fill="bgColor" />
    
    <!-- 书本形状 -->
    <path 
      d="M 24 25 L 24 55 C 24 58 32 58 40 55 C 48 58 56 58 56 55 L 56 25 C 56 22 48 22 40 25 C 32 22 24 22 24 25 Z" 
      :fill="color" 
      opacity="0.95"
    />
    
    <!-- 书页 -->
    <path 
      d="M 40 25 L 40 55" 
      :stroke="bgColor" 
      stroke-width="2" 
      stroke-linecap="round"
    />
    
    <!-- 书签 -->
    <path 
      d="M 50 23 L 50 35 L 46 32 L 42 35 L 42 23 Z" 
      :fill="accentColor" 
    />
    
    <!-- 装饰线条 -->
    <path 
      d="M 28 35 L 36 35 M 28 40 L 36 40 M 28 45 L 34 45 M 44 40 L 52 40 M 44 45 L 52 45" 
      :stroke="bgColor" 
      stroke-width="1.5" 
      stroke-linecap="round"
    />
    
    <!-- N字母 (Noah的首字母) -->
    <path 
      d="M 30 50 L 30 42 L 36 48 L 36 40" 
      :stroke="bgColor" 
      stroke-width="2.5" 
      stroke-linecap="round" 
      stroke-linejoin="round"
      fill="none"
    />
  </svg>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  width: {
    type: [Number, String],
    default: 30
  },
  height: {
    type: [Number, String],
    default: 30
  },
  color: {
    type: String,
    default: "rgba(63, 81, 181, 0.9)"
  },
  theme: {
    type: String,
    default: "light"
  }
});

// 计算背景颜色（根据主题）
const bgColor = computed(() => {
  return props.theme === 'dark' ? 
    'rgba(30, 30, 40, 0.95)' : 
    'rgba(255, 255, 255, 0.95)';
});

// 计算强调色
const accentColor = computed(() => {
  return props.theme === 'dark' ? 
    'rgba(156, 39, 176, 0.9)' : 
    'rgba(255, 145, 55, 0.9)';
});
</script>

<style scoped>
/* 添加微妙的阴影效果使图标更突出 */
svg {
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}
</style> 