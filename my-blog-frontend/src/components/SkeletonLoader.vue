<template>
  <div class="skeleton-container">
    <!-- 文章卡片骨架屏 -->
    <div v-if="type === 'article-card'" class="article-skeleton gpu-accelerated">
      <div class="article-skeleton-title skeleton"></div>
      <div class="article-skeleton-meta">
        <div class="article-skeleton-meta-item skeleton"></div>
        <div class="article-skeleton-meta-item skeleton"></div>
        <div class="article-skeleton-meta-item skeleton"></div>
        <div class="article-skeleton-meta-item skeleton"></div>
      </div>
      <div class="article-skeleton-content">
        <div class="article-skeleton-line skeleton"></div>
        <div class="article-skeleton-line skeleton"></div>
        <div class="article-skeleton-line skeleton"></div>
      </div>
      <div class="article-skeleton-actions">
        <div class="article-skeleton-button skeleton"></div>
        <div class="article-skeleton-button skeleton"></div>
      </div>
    </div>

    <!-- 搜索框骨架屏 -->
    <div v-else-if="type === 'search'" class="search-skeleton gpu-accelerated">
    </div>

    <!-- 分页骨架屏 -->
    <div v-else-if="type === 'pagination'" class="pagination-skeleton">
      <div class="pagination-skeleton-item skeleton"></div>
      <div class="pagination-skeleton-item skeleton"></div>
      <div class="pagination-skeleton-item skeleton"></div>
      <div class="pagination-skeleton-item skeleton"></div>
      <div class="pagination-skeleton-item skeleton"></div>
    </div>

    <!-- 文本骨架屏 -->
    <div v-else-if="type === 'text'" class="text-skeleton">
      <div 
        v-for="line in lines" 
        :key="line"
        class="skeleton-text skeleton"
        :class="getTextClass(line)"
      ></div>
    </div>

    <!-- 通用骨架屏 -->
    <div v-else class="skeleton-card gpu-accelerated">
      <div class="skeleton-text skeleton short"></div>
      <div class="skeleton-text skeleton medium"></div>
      <div class="skeleton-text skeleton long"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'card',
    validator: (value) => ['article-card', 'search', 'pagination', 'text', 'card'].includes(value)
  },
  lines: {
    type: Number,
    default: 3
  },
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: 'auto'
  }
})

const getTextClass = (lineNumber) => {
  const classes = ['short', 'medium', 'long']
  return classes[(lineNumber - 1) % classes.length]
}
</script>

<style scoped>
.skeleton-container {
  width: v-bind(width);
  height: v-bind(height);
}

/* 确保骨架屏在加载时有合适的最小高度 */
.article-skeleton {
  min-height: 280px;
}

.search-skeleton {
  min-height: 56px;
}

.pagination-skeleton {
  min-height: 60px;
}

.text-skeleton {
  min-height: 60px;
}

.skeleton-card {
  min-height: 120px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .article-skeleton {
    min-height: 240px;
  }
  
  .search-skeleton {
    min-height: 48px;
  }
}
</style>
