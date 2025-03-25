<template>
  <div class="home-view">
    <!-- 头部横幅 -->
    <div class="hero-banner">
      <v-container>
        <h1 class="hero-title">抒情与逻辑之间的<span class="gradient-text">自留地</span></h1>
        <p class="hero-subtitle">在这里，未编译的诗歌，以及持续生长的胡思乱想</p>
        
        <v-text-field
          v-model="searchQuery"
          prepend-inner-icon="mdi-magnify"
          placeholder="搜索文章、标签或关键词..."
          variant="outlined"
          hide-details
          density="comfortable"
          class="search-input mt-8"
          @keyup.enter="searchArticles"
          bg-color="surface"
        ></v-text-field>
      </v-container>
    </div>
    
    <v-container class="main-content py-8">
      <!-- 分类标签 -->
      <div class="category-tags mb-8">
        <v-chip-group v-model="selectedCategory">
          <v-chip 
            v-for="category in categories" 
            :key="category.id"
            filter
            :value="category.id"
            variant="elevated"
            class="category-chip"
          >
            {{ category.name }}
          </v-chip>
        </v-chip-group>
      </div>
    
      <!-- 加载状态 -->
      <v-skeleton-loader
        v-if="loading"
        type="card, article, article"
        class="mx-auto"
      />
      
      <div v-else class="articles-container">
        <transition-group name="article-list" tag="div" class="article-grid">
          <article-card
            v-for="article in filteredArticles"
            :key="article.id"
            :article="article"
            @click="viewArticle(article.id)"
            class="mb-4"
          />
        </transition-group>
        
        <div v-if="filteredArticles.length === 0" class="empty-state text-center py-8">
          <v-icon icon="mdi-text-search" size="64" class="mb-4 empty-icon"></v-icon>
          <h3 class="text-h5">无法找到符合条件的文章</h3>
          <p class="text-body-1">尝试调整搜索条件或查看其他分类</p>
          <v-btn 
            color="primary" 
            class="mt-4"
            prepend-icon="mdi-refresh"
            @click="resetFilters"
          >
            重置筛选条件
          </v-btn>
        </div>
        
        <!-- 分页控件 -->
        <v-pagination
          v-if="totalPages > 1"
          v-model="currentPage"
          :length="totalPages"
          rounded
          class="my-5"
        />
      </div>
    </v-container>
  </div>
</template>

<style scoped>
.home-view {
  min-height: 100vh;
}

.hero-banner {
  background: linear-gradient(
    var(--gradient-angle),
    rgba(var(--primary-blue), 0.1),
    rgba(var(--secondary-purple), 0.05),
    rgba(var(--accent-orange), 0.08)
  );
  padding: 64px 0;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero-banner::before {
  content: '';
  position: absolute;
  top: -10%;
  left: -10%;
  width: 120%;
  height: 120%;
  background: 
    radial-gradient(circle at 20% 30%, rgba(var(--primary-blue), 0.05) 0%, transparent 70%),
    radial-gradient(circle at 80% 60%, rgba(var(--accent-orange), 0.05) 0%, transparent 70%);
  z-index: -1;
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 16px;
  font-family: var(--font-heading);
}

.hero-subtitle {
  font-size: 1.25rem;
  opacity: 0.8;
  max-width: 600px;
  margin: 0 auto;
}

.search-input {
  max-width: 600px;
  margin: 0 auto;
  border-radius: 28px;
  transition: all var(--transition-default);
}

.search-input:focus-within {
  transform: translateY(-4px);
  box-shadow: var(--card-shadow);
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
}

.category-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-bottom: 32px;
  padding: 8px;
}

.category-chip {
  transition: all var(--transition-default);
  border-radius: 20px;
}

.category-chip:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(var(--primary-blue), 0.2);
}

.article-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
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

.empty-state {
  background: rgba(var(--v-theme-surface), 0.7);
  border-radius: var(--border-radius);
  padding: 48px;
  margin: 32px auto;
  max-width: 500px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(var(--primary-blue), 0.1);
}

.empty-icon {
  opacity: 0.5;
}

@media (max-width: 960px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.1rem;
  }
}

@media (max-width: 600px) {
  .hero-banner {
    padding: 40px 0;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .article-grid {
    grid-template-columns: 1fr;
  }
  
  .search-input {
    width: 90%;
  }
}
</style>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import ArticleCard from '@/components/ArticleCard.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(true)
const articles = ref([])
const currentPage = ref(1)
const totalPages = ref(0)
const searchQuery = ref('')
const selectedCategory = ref(null)

const categories = [
  { id: 'all', name: '全部' },
  { id: 'Frontend', name: '前端' },
  { id: 'Tech', name: '科技知识' },
  { id: 'poem', name: '诗歌' },
  { id: 'essay', name: '随笔' },
  { id: 'backend', name: '后端' },
]

const fetchArticles = async (page = 1) => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // 模拟文章数据
    articles.value = Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      title: `测试文章：${i + 1}`,
      summary: `Vue 3带来了很多新特性，学习如何充分利用这些特性可以让你的开发更高效。本文将分享最实用的Vue 3开发技巧，帮助你更好地构建应用。`,
      created_at: new Date(Date.now() - i * 86400000),
      views: Math.floor(Math.random() * 1000),
      comments: Math.floor(Math.random() * 20),
      category: i % 7 === 0 ? 'vue' : 
                i % 7 === 1 ? 'react' : 
                i % 7 === 2 ? 'javascript' : 
                i % 7 === 3 ? 'css' : 
                i % 7 === 4 ? 'backend' : 
                i % 7 === 5 ? 'devops' : 'all'
    }))
    
    totalPages.value = 3 // 模拟总页数
  } catch (error) {
    console.error('获取文章失败:', error)
  } finally {
    loading.value = false
  }
}

// 筛选文章
const filteredArticles = computed(() => {
  let result = [...articles.value]
  
  // 搜索筛选
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(article => 
      article.title.toLowerCase().includes(query) || 
      article.summary.toLowerCase().includes(query)
    )
  }
  
  // 分类筛选
  if (selectedCategory.value && selectedCategory.value !== 'all') {
    result = result.filter(article => article.category === selectedCategory.value)
  }
  
  return result
})

// 搜索文章
const searchArticles = () => {
  currentPage.value = 1
}

// 重置筛选器
const resetFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = 'all'
  currentPage.value = 1
}

// 查看文章详情
const viewArticle = (id) => {
  router.push(`/article/${id}`)
}

watch(currentPage, () => {
  // 在实际应用中，这里应该重新请求对应页码的数据
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

// 监听分类变化
watch(selectedCategory, () => {
  currentPage.value = 1
})

onMounted(() => {
  fetchArticles()
})
</script>