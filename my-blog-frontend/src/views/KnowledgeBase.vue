<template>
  <div class="knowledge-base">
    <v-container class="main-content">
      <div class="kb-content-grid">
        <!-- 左侧导航 -->
        <aside class="kb-sidebar">
          <nav class="glass-kb-nav" role="navigation" aria-label="知识库导航">
            <header class="kb-nav-header">
              <div class="nav-title-section">
                <v-icon icon="mdi-folder-multiple" class="nav-icon" aria-hidden="true"></v-icon>
                <h2 class="nav-title">目录</h2>
              </div>
              <button
                class="nav-toggle-btn button-magnetic click-feedback"
                :class="{ 'rotated': !isNavCollapsed }"
                @click="isNavCollapsed = !isNavCollapsed"
                :aria-label="isNavCollapsed ? '展开导航' : '收起导航'"
              >
                <v-icon icon="mdi-chevron-left" size="20" />
              </button>
            </header>
            <div class="nav-divider"></div>
            
            <v-expand-transition>
              <div v-show="!isNavCollapsed">
                <v-list bg-color="transparent" class="pa-2">
                  <v-list-item
                    value="all"
                    :active="selectedCategory === 'all'"
                    @click="selectedCategory = 'all'"
                    prepend-icon="mdi-book-open-page-variant"
                    title="全部内容"
                    :subtitle="`${getTotalArticleCount()} 篇文章`"
                    rounded="lg"
                    class="mb-2"
                  >
                    <template v-slot:append>
                      <v-chip
                        size="x-small"
                        color="primary"
                        variant="flat"
                      >
                        {{ getTotalArticleCount() }}
                      </v-chip>
                    </template>
                  </v-list-item>
                  
                  <v-list-group
                    v-for="(category, index) in categoriesWithoutAll"
                    :key="index"
                    :value="category.id"
                  >
                    <template v-slot:activator="{ props }">
                      <v-list-item
                        v-bind="props"
                        :prepend-icon="category.icon"
                        :title="category.name"
                        :active="selectedCategory === category.id"
                        @click="selectedCategory = category.id"
                        rounded="lg"
                        class="mb-1"
                      >
                        <template v-slot:append>
                          <v-chip
                            size="x-small"
                            color="primary"
                            variant="flat"
                          >
                            {{ category.count }}
                          </v-chip>
                        </template>
                      </v-list-item>
                    </template>
                    
                    <v-list-item
                      v-for="subcategory in category.subcategories"
                      :key="subcategory.id"
                      :title="subcategory.name"
                      :subtitle="`${subcategory.count} 篇文章`"
                      :prepend-icon="subcategory.icon || 'mdi-file-document-outline'"
                      :active="selectedSubcategory === subcategory.id"
                      density="compact"
                      rounded="lg"
                      class="ms-4 mb-1"
                      @click="selectSubcategory(category.id, subcategory.id)"
                    ></v-list-item>
                  </v-list-group>
                </v-list>
              </div>
            </v-expand-transition>
          </nav>
        </aside>
        
        <!-- 右侧内容 -->
        <main class="kb-main-content">
          <!-- 筛选栏 -->
          <div class="glass-filter-bar mb-6">
            <div class="filter-section">
              <div class="filter-info">
                <v-icon icon="mdi-filter-variant" class="filter-icon" />
                <span class="filter-text">
                  已找到 <strong>{{ filteredArticles.length }}</strong> 条结果
                </span>
              </div>

              <div class="filter-controls">
                <v-chip-group v-model="sortOption" class="sort-chips" mandatory>
                  <v-chip
                    v-for="option in sortOptions"
                    :key="option.value"
                    :value="option.value"
                    size="small"
                    variant="flat"
                    :prepend-icon="option.icon"
                    class="glass-chip"
                  >
                    {{ option.label }}
                  </v-chip>
                </v-chip-group>

                <div class="view-toggle">
                  <v-btn-toggle v-model="viewMode" mandatory density="comfortable" color="primary" class="glass-toggle">
                    <v-btn value="card" variant="text" class="toggle-btn">
                      <v-icon>mdi-view-grid</v-icon>
                      <v-tooltip activator="parent" location="top">卡片视图</v-tooltip>
                    </v-btn>
                    <v-btn value="list" variant="text" class="toggle-btn">
                      <v-icon>mdi-view-list</v-icon>
                      <v-tooltip activator="parent" location="top">列表视图</v-tooltip>
                    </v-btn>
                  </v-btn-toggle>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 活动筛选器 -->
          <div v-if="hasActiveFilters" class="active-filters mb-4">
            <v-chip
              v-if="searchQuery"
              size="small"
              closable
              @click:close="searchQuery = ''"
              prepend-icon="mdi-magnify"
              class="me-2"
            >
              搜索: {{ searchQuery }}
            </v-chip>
            
            <v-chip
              v-if="selectedCategory !== 'all'"
              size="small"
              closable
              @click:close="selectedCategory = 'all'"
              :prepend-icon="getCategoryIcon(selectedCategory)"
              class="me-2"
            >
              {{ getCategoryName(selectedCategory) }}
            </v-chip>
            
            <v-btn
              v-if="hasActiveFilters"
              size="small"
              variant="text"
              prepend-icon="mdi-refresh"
              @click="resetFilters"
              class="ms-2"
            >
              重置筛选
            </v-btn>
          </div>
          
          <!-- 文章列表 -->
          <template v-if="loading">
            <v-sheet class="pa-3 mb-3" v-for="n in 6" :key="n">
              <v-skeleton-loader type="article"></v-skeleton-loader>
            </v-sheet>
          </template>
          
          <template v-else-if="filteredArticles.length === 0">
            <v-card class="empty-state text-center pa-10">
              <v-icon icon="mdi-book-search" size="64" color="grey-lighten-1" class="mb-4"></v-icon>
              <h3 class="text-h5 mb-2">没有找到匹配的内容</h3>
              <p class="text-body-1 mb-6">尝试调整搜索条件或删除筛选器</p>
              <v-btn @click="resetFilters" color="primary" prepend-icon="mdi-refresh">重置筛选条件</v-btn>
            </v-card>
          </template>
          
          <template v-else>
            <!-- 列表视图 -->
            <template v-if="viewMode === 'list'">
              <div class="articles-list">
                <article
                  v-for="article in paginatedArticles"
                  :key="article.id"
                  class="glass-article-list-item"
                  @click="viewArticle(article.id)"
                  tabindex="0"
                  role="button"
                  :aria-label="`阅读文章: ${article.title}`"
                >
                  <!-- 左侧分类图标 -->
                  <div class="list-category-icon" :class="`category-${getCategoryColor(article.category_id)}`">
                    <v-icon :icon="getCategoryIcon(article.category_id)" size="large" />
                  </div>

                  <!-- 中间内容区域 -->
                  <div class="list-content">
                    <div class="list-header">
                      <h3 class="list-title">{{ article.title }}</h3>
                      <div class="list-category-badge">
                        {{ getCategoryName(article.category_id) }}
                      </div>
                    </div>

                    <p class="list-summary">{{ article.summary }}</p>
                  </div>

                  <!-- 右侧元信息 -->
                  <div class="list-meta">
                    <div class="list-date">
                      <v-icon icon="mdi-calendar-outline" size="small" />
                      <span>{{ formatDate(article.created_at) }}</span>
                    </div>
                    <div class="list-stats">
                      <div class="stat-item">
                        <v-icon icon="mdi-eye-outline" size="small" />
                        <span>{{ article.views || 0 }}</span>
                      </div>
                      <div class="stat-item">
                        <v-icon icon="mdi-heart-outline" size="small" />
                        <span>{{ article.likes || 0 }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- 悬停效果 -->
                  <div class="list-item-glow"></div>
                </article>
              </div>
            </template>
            
            <!-- 卡片视图 -->
            <template v-else>
              <div class="articles-grid">
                <article
                  v-for="article in paginatedArticles"
                  :key="article.id"
                  class="glass-article-card"
                  @click="viewArticle(article.id)"
                  tabindex="0"
                  role="button"
                  :aria-label="`阅读文章: ${article.title}`"
                >
                  <!-- 分类指示器 -->
                  <div class="card-category-badge" :class="`category-${getCategoryColor(article.category_id)}`">
                    <v-icon :icon="getCategoryIcon(article.category_id)" size="small" />
                    <span>{{ getCategoryName(article.category_id) }}</span>
                  </div>

                  <!-- 文章标题 -->
                  <h3 class="article-title">{{ article.title }}</h3>

                  <!-- 文章摘要 -->
                  <p class="article-summary">{{ article.summary }}</p>

                  <!-- 文章元信息 -->
                  <div class="article-meta">
                    <div class="meta-item">
                      <v-icon icon="mdi-calendar-outline" size="small" />
                      <span>{{ formatDate(article.created_at) }}</span>
                    </div>
                    <div class="meta-stats">
                      <div class="meta-item">
                        <v-icon icon="mdi-eye-outline" size="small" />
                        <span>{{ article.views || 0 }}</span>
                      </div>
                      <div class="meta-item">
                        <v-icon icon="mdi-heart-outline" size="small" />
                        <span>{{ article.likes || 0 }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- 悬停效果装饰 -->
                  <div class="card-glow"></div>
                </article>
              </div>
            </template>
            
            <!-- 分页 -->
            <div v-if="totalPages > 1" class="text-center mt-8">
              <v-pagination
                v-model="currentPage"
                :length="totalPages"
                :total-visible="7"
                rounded
                class="pagination-bar"
              ></v-pagination>
            </div>
          </template>
        </main>
      </div>
    </v-container>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getArticles, getKnowledgeCategories } from '../api'

const router = useRouter()
const loading = ref(true)
const articles = ref([])
const searchQuery = ref('')
const selectedCategory = ref('all')
const sortOption = ref('latest')
const viewMode = ref('card')
const currentPage = ref(1)
const itemsPerPage = 9
const totalArticles = ref(0)
const isNavCollapsed = ref(false)
const selectedSubcategory = ref(null)

// 目录分类 - 动态从API获取
const categories = ref([
  { id: 'all', name: '全部内容', icon: 'mdi-book-open-page-variant', count: 0 }
])

// 获取除"全部内容"外的分类
const categoriesWithoutAll = computed(() => {
  return categories.value.filter(c => c.id !== 'all')
})

// 获取文章总数
const getTotalArticleCount = () => {
  return articles.value.length
}

// 获取总阅读量
const getTotalViews = () => {
  return articles.value.reduce((total, article) => total + (article.views || 0), 0)
}

// 选择子分类
const selectSubcategory = (categoryId, subcategoryId) => {
  selectedCategory.value = categoryId
  selectedSubcategory.value = subcategoryId
  currentPage.value = 1
}

// 根据分类和标签筛选文章
const filteredArticles = computed(() => {
  let result = [...articles.value]
  
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(article => 
      article.title.toLowerCase().includes(query) || 
      article.summary.toLowerCase().includes(query)
    )
  }
  
  // 根据分类和子分类过滤
  if (selectedCategory.value && selectedCategory.value !== 'all') {
    result = result.filter(article => {
      if (selectedSubcategory.value) {
        return (article.category_id === selectedCategory.value || article.knowledge_category_id === selectedCategory.value) && 
               article.subcategory_id === selectedSubcategory.value
      }
      return article.category_id === selectedCategory.value || article.knowledge_category_id === selectedCategory.value
    })
  }
  
  // 排序
  if (sortOption.value === 'latest') {
    result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  } else if (sortOption.value === 'popular') {
    result.sort((a, b) => b.views - a.views)
  } else if (sortOption.value === 'alpha') {
    result.sort((a, b) => a.title.localeCompare(b.title))
  }
  
  return result
})

// 分页数据
const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredArticles.value.slice(start, end)
})

// 总页数
const totalPages = computed(() => {
  return Math.ceil(filteredArticles.value.length / itemsPerPage)
})

// 查询知识库内容
const searchKnowledge = () => {
  currentPage.value = 1
}

// 重置筛选条件
const resetFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = 'all'
  selectedSubcategory.value = null
  sortOption.value = 'latest'
  currentPage.value = 1
}

// 获取知识库分类数据
const fetchCategories = async () => {
  try {
    const response = await getKnowledgeCategories(true, true)
    const apiCategories = response.data
    
    // 将API返回的分类数据转换为前端需要的格式
    const formattedCategories = apiCategories.map(cat => ({
      id: cat.id,
      name: cat.name,
      icon: getCategoryIconByName(cat.name), // 根据分类名称获取图标
      count: cat.article_count || 0,
      subcategories: cat.children ? cat.children.map(child => ({
        id: child.id,
        name: child.name,
        icon: getCategoryIconByName(child.name),
        count: child.article_count || 0
      })) : []
    }))
    
    // 更新分类数据，保留"全部内容"选项，并添加"未分类"选项
    categories.value = [
      { id: 'all', name: '全部内容', icon: 'mdi-book-open-page-variant', count: 0 },
      ...formattedCategories,
      { id: 'uncategorized', name: '未分类', icon: 'mdi-help-circle', count: 0 }
    ]
  } catch (error) {
    console.error('获取知识库分类失败:', error)
  }
}

// 根据分类名称获取图标
const getCategoryIconByName = (name) => {
  const iconMap = {
    '前端开发': 'mdi-language-javascript',
    '后端技术': 'mdi-server',
    '数据库': 'mdi-database',
    'DevOps': 'mdi-cloud-sync',
    '人工智能': 'mdi-brain',
    '工具技巧': 'mdi-tools',
    '职业发展': 'mdi-office-building',
    'JavaScript': 'mdi-language-javascript',
    'Python': 'mdi-language-python',
    'Vue': 'mdi-vuejs',
    'React': 'mdi-react',
    'Node.js': 'mdi-nodejs',
    'MySQL': 'mdi-database',
    'Docker': 'mdi-docker',
    'Git': 'mdi-git'
  }
  return iconMap[name] || 'mdi-file-document-outline'
}

// 获取分类图标 - 使用默认图标
const getCategoryIcon = (categoryId) => {
  if (categoryId === 'all') return 'mdi-book-open-page-variant'
  if (categoryId === 'uncategorized') return 'mdi-help-circle'
  const category = categories.value.find(c => c.id === categoryId)
  return category ? category.icon : 'mdi-help-circle'
}

// 获取分类颜色
const getCategoryColor = (categoryId) => {
  switch (categoryId) {
    case 'frontend': return 'blue'
    case 'backend': return 'green'
    case 'database': return 'orange'
    case 'devops': return 'purple'
    case 'ai': return 'red'
    case 'tools': return 'cyan'
    case 'career': return 'amber'
    case 'uncategorized': return 'grey'
    default: return 'grey'
  }
}

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// 查看文章详情
const viewArticle = (id) => {
  router.push(`/article/${id}`)
}

// 获取分类名称
const getCategoryName = (categoryId) => {
  if (categoryId === 'all') return '全部内容'
  if (categoryId === 'uncategorized') return '未分类'
  const category = categories.value.find(c => c.id === categoryId)
  return category ? category.name : '未分类'
}



// 是否有活动的筛选条件
const hasActiveFilters = computed(() => {
  return searchQuery.value || 
         selectedCategory.value !== 'all'
})

// 监听路由变化时重置导航折叠状态
watch(() => router.currentRoute.value.path, () => {
  isNavCollapsed.value = false
})

// 获取文章列表和更新分类计数
const fetchArticles = async () => {
  loading.value = true
  
  try {
    // 从API获取知识库文章
    const response = await getArticles(1, 100, true)
    totalArticles.value = parseInt(response.headers['x-total-count'] || 0)
    
    // 处理文章数据 - 直接使用API返回的数据，不再进行分类映射
    const articlesData = response.data
    
    // 处理文章数据，设置分类ID
    articlesData.forEach(article => {
      // 对于知识库文章，如果没有分类，设置为"未分类"
      if (article.is_knowledge_base) {
        if (article.knowledge_category_id) {
          article.category_id = article.knowledge_category_id
        } else {
          // 没有分类的知识库文章，设置为虚拟的"未分类"ID
          article.category_id = 'uncategorized'
        }
      }
    })
    
    articles.value = articlesData
    
    // 更新各分类的文章数量
    categories.value.forEach(category => {
      if (category.id === 'all') {
        category.count = articles.value.length
      } else {
        category.count = articles.value.filter(article => 
          article.category_id === category.id || 
          article.knowledge_category_id === category.id
        ).length
      }
    })
  } catch (error) {
    console.error('获取知识库文章失败:', error)
  } finally {
    loading.value = false
  }
}

// 排序选项
const sortOptions = [
  { value: 'latest', label: '最新', icon: 'mdi-clock-outline' },
  { value: 'popular', label: '最热', icon: 'mdi-fire' },
  { value: 'alpha', label: '字母序', icon: 'mdi-sort-alphabetical-ascending' }
]


onMounted(async () => {
  // 先获取分类数据，再获取文章数据
  await fetchCategories()
  await fetchArticles()
})
</script>

<style scoped>
.knowledge-base {
  min-height: 100vh;
  opacity: 1 !important;
  margin-bottom: 0 !important;
  padding-bottom: 0 !important;
}

.hero-banner {
  background: radial-gradient(circle at 30% 30%, rgba(var(--primary-blue), 0.05), transparent 400px),
              radial-gradient(circle at 70% 70%, rgba(var(--accent-orange), 0.05), transparent 400px);
  padding: 140px 0 40px;
  text-align: center;
  position: relative;
  overflow: hidden;
  will-change: transform;
  background-position: 50% 0%;
  margin-top: -56px;
  height: 400px;
}

.hero-banner .v-container {
  position: relative;
  z-index: 1;
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.8s ease-out forwards;
}

.hero-subtitle {
  font-size: 1.25rem;
  max-width: 600px;
  margin: 0 auto 2rem;
  line-height: 1.6;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.8s ease-out 0.2s forwards;
  cursor: pointer;
  position: relative;
  z-index: 2;
  transform: translateZ(0);
  backface-visibility: hidden;
}

.hero-subtitle:hover {
  opacity: 1;
  transform: scale(1.02) translateZ(0);
  text-shadow: 0 0 8px rgba(0,0,0,0.1);
}

.gradient-text {
  font-size: 3rem;
  font-weight: 700;
  background-image: linear-gradient(135deg,rgb(170, 133, 255),rgb(124, 142, 215) 45%,rgb(255, 163, 238) 55%,rgb(255, 163, 164),rgb(255, 174, 174));
  background-size: 300% 300%;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  display: inline-block;
  animation: gradient-shift 15s ease infinite;
  will-change: background-position;
}

@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.search-input {
  max-width: 600px;
  margin: 0 auto;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.8s ease-out 0.4s forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 0 !important;
  margin-bottom: 0 !important;
  position: relative;
  z-index: 1;
}

/* 卡片样式统一 */
.v-card {
  transition: all 0.3s ease;
  border-radius: 12px !important;
  background: #ffffff !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
  overflow: hidden;
  border: none !important;
}

.v-theme--dark .v-card {
  background: rgba(33, 33, 33, 0.8) !important;
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.08) !important;
}

.v-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15) !important;
}

/* 列表项样式 */
.v-list-item {
  transition: all 0.2s ease;
  border-radius: 12px !important;
}

.v-list-item:hover {
  background: rgba(var(--v-theme-primary), 0.05);
}

/* 筛选栏样式 */
.filter-bar {
  border-radius: 12px !important;
  background: #ffffff !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
  border: none !important;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.v-theme--dark .filter-bar {
  background: rgba(33, 33, 33, 0.8) !important;
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.08) !important;
}

.filter-bar:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15) !important;
}

.v-theme--dark .filter-bar:hover {
  box-shadow: 0 6px 16px rgba(255, 255, 255, 0.12) !important;
}

/* 分类标签样式 */
.category-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-bottom: 32px;
  padding: 8px;
}

.category-chip {
  margin: 0 4px;
  transition: transform 0.3s ease;
}

.category-chip:hover {
  transform: translateY(-3px);
}

/* 分页样式 */
.pagination-bar {
  display: inline-flex;
  background: rgba(var(--v-theme-surface), 0.8);
  border-radius: 12px !important;
  padding: 4px;
}

/* 空状态样式 */
.empty-state {
  border-radius: 12px !important;
  background: rgba(var(--v-theme-surface), 0.8) !important;
}

/* 文章卡片样式 */
.article-card {
  border-radius: 12px !important;
  background: rgba(var(--v-theme-surface), 0.8) !important;
}

.article-list-item {
  border-radius: 12px !important;
  background: rgba(var(--v-theme-surface), 0.8) !important;
  margin-bottom: 8px;
}

/* 标签样式 */
.v-chip {
  border-radius: 6px !important;
}

/* 按钮样式 */
.v-btn {
  border-radius: 8px !important;
}

/* 搜索框样式 */
.v-text-field {
  border-radius: 8px !important;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-banner {
    padding: 100px 0 30px;
  }
  
  .gradient-text {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .gradient-text {
    font-size: 2rem;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
}
</style> 