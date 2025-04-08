<template>
  <div class="home-view">
    <!-- 头部横幅 -->
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
.home-view {
  min-height: 100vh;
}

.hero-section {
  padding: 5rem 0 3rem;
  position: relative;
  overflow: hidden;
  background: linear-gradient(
    var(--gradient-angle),
    rgba(var(--primary-blue), 0.05),
    rgba(var(--secondary-purple), 0.03),
    rgba(var(--accent-orange), 0.05)
  );
}

.hero-content {
  position: relative;
  z-index: 2;
}

.site-name {
  background: var(--neon-gradient);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  display: inline-block;
}

.tagline-text {
  font-weight: 500;
  letter-spacing: 1px;
  color: rgb(var(--accent-orange));
  transition: color 1.5s ease;
}

.subtitle-text {
  font-style: italic;
  transition: color 2.0s ease;
}

.hero-banner {
  background: linear-gradient(
    var(--gradient-angle),
    rgba(var(--primary-blue), 0.1),
    rgba(var(--secondary-purple), 0.06),
    rgba(var(--accent-orange), 0.02)
  );
  padding:32px 0;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero-banner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
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
  transition: color var(--transition-slow-text), opacity var(--transition-slow-text);
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

/* 添加标语前缀样式 */
.tagline-prefix {
  position: relative;
  transition: color var(--transition-slow-text);
  display: inline-block;
}

/* 在夜间模式下显示渐变色 */
:deep(.v-theme--dark) .tagline-prefix {
  background: linear-gradient(
    var(--gradient-angle),
    rgba(var(--primary-blue), 0.9),
    rgba(var(--accent-orange), 0.7)
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: none;
}

/* 调整字幕文字样式，添加慢速过渡 */
.hero-subtitle {
  font-size: 1.25rem;
  opacity: 0.8;
  max-width: 600px;
  margin: 0 auto;
  transition: color var(--transition-slow-text), opacity var(--transition-slow-text);
}

/* 在夜间模式下微调字幕颜色 */
:deep(.v-theme--dark) .hero-subtitle {
  color: rgba(var(--accent-orange), 0.9);
  opacity: 0.9;
}

/* 简化渐变文本效果 */
.gradient-text {
  background: var(--neon-gradient);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
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