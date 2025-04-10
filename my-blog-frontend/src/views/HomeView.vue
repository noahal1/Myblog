<template>
  <div class="home-view">
    <div class="hero-banner">
      <v-container>
        <h1 class="hero-title">
          <span class="tagline-prefix slow-transition">抒情与逻辑之间的</span>
          <span class="gradient-text">自留地</span>
        </h1>
        <p class="hero-subtitle subtitle-text">在这里，未编译的诗歌，以及持续生长的胡思乱想</p>
        
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
            v-for="category in availableCategories" 
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
      
      <!-- 文章列表 -->
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
        
        <!-- 空状态 -->
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
/* 所有样式已移至 src/assets/styles/views/home.css */
</style>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import ArticleCard from '@/components/ArticleCard.vue'
import { useRouter } from 'vue-router'
import { getArticles } from '../api'
import { useInfiniteScroll } from '@vueuse/core'

const router = useRouter()
const loading = ref(true)
const articles = ref([])
const currentPage = ref(1)
const totalPages = ref(0) 
const searchQuery = ref('')
const selectedCategory = ref(null)
const page = ref(1)
const hasMore = ref(true)

// 从文章中获取唯一标签来生成分类列表
const availableCategories = computed(() => {
  const categories = [{ id: 'all', name: '全部' }];
  const uniqueTags = new Set();
  
  articles.value.forEach(article => {
    if (Array.isArray(article.tags)) {
      article.tags.forEach(tag => {
        uniqueTags.add(tag);
      });
    }
  });
  
  // 添加唯一标签到分类列表
  Array.from(uniqueTags).forEach(tag => {
    categories.push({ id: tag, name: tag });
  });
  
  return categories;
});

// 获取文章列表
  const fetchArticles = async () => {
    loading.value = true
    try {
      const response = await getArticles(currentPage.value, 10)
      articles.value = response.data
      totalPages.value = Math.ceil(response.headers['x-total-count'] / 10) || 1
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
      article.summary.toLowerCase().includes(query) ||
      (Array.isArray(article.tags) && article.tags.some(tag => 
        tag.toLowerCase().includes(query)
      ))
    )
  }
  
  // 分类筛选
  if (selectedCategory.value && selectedCategory.value !== 'all') {
    result = result.filter(article => 
      Array.isArray(article.tags) && 
      article.tags.includes(selectedCategory.value)
    )
  }
  
  return result
})

// 搜索文章
const searchArticles = () => {
  // 重置到第一页
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

// 监听页码变化
watch(currentPage, () => {
  // 在实际应用中，这里应该重新请求对应页码的数据
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

// 监听分类变化
watch(selectedCategory, () => {
  currentPage.value = 1
})

const loadMoreArticles = async () => {
  if (loading.value || !hasMore.va6lue) return
  
  loading.value = true
  try {
    const response = await getArticles(page.value, 10)
    articles.value.push(...response.data)
    
    page.value++
    hasMore.value = response.data.length === 10
  } catch (error) {
    console.error('加载更多文章失败:', error)
  } finally {
    loading.value = false
  }
}

// 监听滚动到底部
useInfiniteScroll(
  window,
  () => {
    loadMoreArticles()
  },
  { distance: 200 }
)

onMounted(() => {
  fetchArticles()
})
</script>