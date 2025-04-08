<template>
  <div class="category-view">
    <v-container class="py-8">
      <h1 class="text-h3 mb-6">{{ categoryName }} 类别的文章</h1>
      
      <!-- 加载状态 -->
      <v-skeleton-loader
        v-if="loading"
        type="card, article, article"
        class="mx-auto"
      />
      
      <!-- 文章列表 -->
      <div v-else class="articles-container">
        <transition-group name="article-list" tag="div" class="article-grid">
          <article-card
            v-for="article in articles"
            :key="article.id"
            :article="article"
            @click="viewArticle(article.id)"
            class="mb-4"
          />
        </transition-group>
        
        <!-- 空状态 -->
        <div v-if="articles.length === 0" class="empty-state text-center py-8">
          <v-icon icon="mdi-text-search" size="64" class="mb-4 empty-icon"></v-icon>
          <h3 class="text-h5">该分类下暂无文章</h3>
          <p class="text-body-1">请稍后查看或浏览其他分类</p>
          <v-btn 
            color="primary" 
            class="mt-4"
            prepend-icon="mdi-home"
            @click="$router.push('/')"
          >
            返回首页
          </v-btn>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ArticleCard from '../components/ArticleCard.vue'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const articles = ref([])

// 获取当前分类名称
const categoryName = computed(() => {
  const category = route.params.category
  const categoryMap = {
    'frontend': '前端开发',
    'backend': '后端开发',
    'design': '设计',
    'devops': 'DevOps',
    'thoughts': '随想'
  }
  return categoryMap[category] || category
})

// 获取特定分类的文章
const fetchArticlesByCategory = async () => {
  loading.value = true
  try {
    const response = await fetch(`/api/articles?category=${route.params.category}`)
    if (!response.ok) throw new Error('获取文章失败')
    const data = await response.json()
    articles.value = data.articles || []
  } catch (error) {
    console.error('获取文章失败:', error)
    articles.value = []
  } finally {
    loading.value = false
  }
}

watch(() => route.params.category, fetchArticlesByCategory)

// 查看文章详情
const viewArticle = (id) => {
  router.push({ name: 'article', params: { id } })
}

onMounted(fetchArticlesByCategory)
</script>

<style scoped>
.category-view {
  min-height: 100vh;
}

.article-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.article-list-enter-active,
.article-list-leave-active {
  transition: all 0.5s ease;
}

.article-list-enter-from,
.article-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.empty-icon {
  opacity: 0.6;
}
</style> 