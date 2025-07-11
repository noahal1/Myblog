<template>
  <div class="knowledge-base">
    <section class="glass-kb-hero" ref="heroBanner" role="banner">
      <v-container class="py-8">
        <!-- 页面标题 -->
        <header class="kb-header">
          <h1 class="kb-main-title">
            <span class="kb-title-text" ref="gradientText">知识库</span>
          </h1>
          <p class="kb-subtitle" ref="subtitle">整理的各类技术笔记、教程和解决方案</p>

          <!-- 玻璃拟态搜索框 -->
          <div class="glass-kb-search-container">
            <div class="kb-search-wrapper hover-lift-subtle focus-ring">
              <v-icon icon="mdi-magnify" class="kb-search-icon" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="搜索知识库内容..."
                class="glass-kb-search-input focus-ring"
                @keyup.enter="searchKnowledge"
                @focus="onSearchFocus"
                @blur="onSearchBlur"
                ref="searchInput"
                aria-label="搜索知识库"
              />
              <button
                v-if="searchQuery"
                @click="searchQuery = ''"
                class="kb-clear-btn button-magnetic"
                aria-label="清除搜索"
              >
                <v-icon icon="mdi-close" size="20" />
              </button>
              <div class="kb-search-glow"></div>
            </div>
          </div>
        </header>
      </v-container>
    </section>

    <v-container class="main-content">
      <div class="kb-content-grid">
        <!-- 左侧导航 -->
        <aside class="kb-sidebar">
          <!-- 玻璃拟态导航卡片 -->
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
        <v-col cols="12" md="9">
          <!-- 筛选栏 -->
          <v-card class="filter-bar mb-4" variant="flat" color="surface">
            <v-card-text class="d-flex align-center justify-space-between py-2">
              <div class="d-flex align-center">
                <span class="text-body-2 text-medium-emphasis me-3">
                  已找到 {{ filteredArticles.length }} 条结果
                </span>
                
                <v-chip-group v-model="sortOption" class="ms-3" mandatory>
                  <v-chip
                    v-for="option in sortOptions"
                    :key="option.value"
                    :value="option.value"
                    size="small"
                    variant="flat"
                    :prepend-icon="option.icon"
                  >
                    {{ option.label }}
                  </v-chip>
                </v-chip-group>
              </div>
              
              <div class="d-flex align-center">
                <v-btn-toggle v-model="viewMode" mandatory density="comfortable" color="primary">
                  <v-btn value="card" variant="text">
                    <v-icon>mdi-view-grid</v-icon>
                  </v-btn>
                  <v-btn value="list" variant="text">
                    <v-icon>mdi-view-list</v-icon>
                  </v-btn>
                </v-btn-toggle>
              </div>
            </v-card-text>
          </v-card>
          
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
            
            <v-chip
              v-for="tagId in selectedTags"
              :key="tagId"
              size="small"
              closable
              @click:close="toggleTag(tagId)"
              :color="getTagColor(tagId)"
              class="me-2"
            >
              {{ getTagName(tagId) }}
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
              <v-list class="article-list">
                <v-list-item
                  v-for="article in paginatedArticles"
                  :key="article.id"
                  :title="article.title"
                  :subtitle="article.summary"
                  :prepend-icon="getCategoryIcon(article.category_id)"
                  rounded="lg"
                  class="mb-3 article-list-item"
                  @click="viewArticle(article.id)"
                >
                  <template v-slot:prepend>
                    <div class="category-indicator" :class="`bg-${getCategoryColor(article.category_id)}`"></div>
                  </template>
                  
                  <template v-slot:append>
                    <div class="d-flex flex-column align-end">
                      <div class="d-flex align-center mb-1">
                        <v-icon icon="mdi-eye" size="small" class="me-1"></v-icon>
                        <span class="text-caption">{{ article.views }}</span>
                        <v-icon icon="mdi-thumb-up" size="small" class="ms-2 me-1"></v-icon>
                        <span class="text-caption">{{ article.likes || 0 }}</span>
                      </div>
                      <span class="text-caption text-medium-emphasis">{{ formatDate(article.created_at) }}</span>
                    </div>
                  </template>
                </v-list-item>
              </v-list>
            </template>
            
            <!-- 卡片视图 -->
            <template v-else>
              <v-row>
                <v-col
                  v-for="article in paginatedArticles"
                  :key="article.id"
                  cols="12"
                  sm="6"
                  lg="4"
                  class="article-card-col"
                >
                  <v-card
                    class="article-card h-100"
                    @click="viewArticle(article.id)"
                    :ripple="false"
                    hover
                  >
                    <div class="card-category-indicator" :class="`bg-${getCategoryColor(article.category_id)}`"></div>
                    
                    <v-card-title class="text-h6 text-truncate">
                      {{ article.title }}
                    </v-card-title>
                    
                    <v-card-subtitle class="pt-2">
                      <v-icon :icon="getCategoryIcon(article.category_id)" size="small" class="me-1"></v-icon>
                      {{ getCategoryName(article.category_id) }}
                    </v-card-subtitle>
                    
                    <v-card-text>
                      <p class="summary-text mb-3">{{ article.summary }}</p>
                      
                      <div class="mb-3 d-flex flex-wrap">
                        <v-chip
                          v-for="tagId in article.tag_ids"
                          :key="tagId"
                          size="x-small"
                          class="me-1 mb-1"
                          :color="getTagColor(tagId)"
                          variant="flat"
                          density="compact"
                        >
                          {{ getTagName(tagId) }}
                        </v-chip>
                      </div>
                      
                      <div class="d-flex justify-space-between align-center text-caption text-medium-emphasis">
                        <span>
                          <v-icon icon="mdi-calendar" size="x-small" class="me-1"></v-icon>
                          {{ formatDate(article.created_at) }}
                        </span>
                        <span>
                          <v-icon icon="mdi-eye" size="x-small" class="me-1"></v-icon>
                          {{ article.views }}
                          <v-icon icon="mdi-thumb-up" size="x-small" class="ms-2 me-1"></v-icon>
                          {{ article.likes || 0 }}
                        </span>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
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
        </v-col>
      </div>
    </v-container>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { getArticles } from '../api'

const router = useRouter()
const loading = ref(true)
const articles = ref([])
const searchQuery = ref('')
const selectedCategory = ref('all')
const selectedTags = ref([])
const sortOption = ref('latest')
const viewMode = ref('card')
const currentPage = ref(1)
const itemsPerPage = 9
const totalArticles = ref(0)
const isNavCollapsed = ref(false)
const selectedSubcategory = ref(null)

// 目录分类
const categories = [
  { id: 'all', name: '全部内容', icon: 'mdi-book-open-page-variant', count: 0 },
  { id: 'frontend', name: '前端开发', icon: 'mdi-language-javascript', count: 0 },
  { id: 'backend', name: '后端技术', icon: 'mdi-server', count: 0 },
  { id: 'database', name: '数据库', icon: 'mdi-database', count: 0 },
  { id: 'devops', name: 'DevOps', icon: 'mdi-cloud-sync', count: 0 },
  { id: 'ai', name: '人工智能', icon: 'mdi-brain', count: 0 },
  { id: 'tools', name: '工具技巧', icon: 'mdi-tools', count: 0 },
  { id: 'career', name: '职业发展', icon: 'mdi-office-building', count: 0 }
]

// 标签
const tags = [
  { id: 1, name: 'JavaScript', count: 15, color: 'amber' },
  { id: 2, name: 'Python', count: 12, color: 'blue' },
  { id: 3, name: 'Vue', count: 9, color: 'green' },
  { id: 4, name: 'React', count: 7, color: 'cyan' },
  { id: 5, name: 'Node.js', count: 6, color: 'lime' },
  { id: 6, name: 'Docker', count: 5, color: 'blue-grey' },
  { id: 7, name: 'MySQL', count: 5, color: 'orange' },
  { id: 8, name: 'Git', count: 4, color: 'red' },
  { id: 9, name: 'CSS', count: 4, color: 'indigo' },
  { id: 10, name: 'API', count: 4, color: 'teal' },
  { id: 11, name: '设计模式', count: 3, color: 'purple' },
  { id: 12, name: '安全', count: 3, color: 'red-darken-3' },
]

// 获取除"全部内容"外的分类
const categoriesWithoutAll = computed(() => {
  return categories.filter(c => c.id !== 'all')
})

// 获取文章总数
const getTotalArticleCount = () => {
  return articles.value.length
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
        return article.category_id === selectedCategory.value && 
               article.subcategory_id === selectedSubcategory.value
      }
      return article.category_id === selectedCategory.value
    })
  }
  
  // 根据标签过滤
  if (selectedTags.value.length > 0) {
    result = result.filter(article => 
      article.tags.some(tagName => {
        const tagId = tags.find(t => t.name === tagName)?.id
        return tagId && selectedTags.value.includes(tagId)
      })
    )
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
  selectedTags.value = []
  sortOption.value = 'latest'
  currentPage.value = 1
}

// 切换标签选中状态
const toggleTag = (tagId) => {
  const index = selectedTags.value.indexOf(tagId)
  
  if (index === -1) {
    selectedTags.value.push(tagId)
  } else {
    selectedTags.value.splice(index, 1)
  }
  
  currentPage.value = 1
}

// 将文章与分类关联（根据标签）
const mapArticlesToCategories = (articles) => {
  const categoryMap = {
    'frontend': ['JavaScript', 'Vue', 'React', 'Angular', 'CSS', 'HTML', '前端'],
    'backend': ['Python', 'Java', 'Node.js', 'Go', 'PHP', 'API', '后端'],
    'database': ['MySQL', 'MongoDB', 'PostgreSQL', 'Redis', 'SQL', '数据库'],
    'devops': ['Docker', 'Kubernetes', 'CI/CD', 'DevOps', '运维', 'Git'],
    'ai': ['人工智能', '机器学习', 'AI', '深度学习', 'Python'],
    'tools': ['工具', 'Git', 'VS Code', 'IDE', '效率'],
    'career': ['职业', '面试', '简历', '求职', '职场']
  }
  
  const result = []
  
  articles.forEach(article => {
    // 默认分类为工具
    let category = 'tools'
    
    // 根据文章标签确定分类
    for (const [cat, keywords] of Object.entries(categoryMap)) {
      if (article.tags.some(tag => keywords.includes(tag))) {
        category = cat
        break
      }
    }
    
    result.push({
      ...article,
      category_id: category
    })
  })
  
  return result
}

// 获取分类图标
const getCategoryIcon = (categoryId) => {
  const category = categories.find(c => c.id === categoryId)
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
    default: return 'grey'
  }
}

// 获取标签名称
const getTagName = (tagId) => {
  const tag = tags.find(t => t.id === tagId)
  return tag ? tag.name : ''
}

// 获取标签颜色
const getTagColor = (tagId) => {
  const tag = tags.find(t => t.id === tagId)
  return tag ? tag.color : 'grey'
}

// 文章标签和标签表的映射
const mapTagsToIds = (articleTags) => {
  const tagIds = []
  articleTags.forEach(tagName => {
    const tag = tags.find(t => t.name === tagName)
    if (tag) {
      tagIds.push(tag.id)
    }
  })
  return tagIds
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
  const category = categories.find(c => c.id === categoryId)
  return category ? category.name : '未分类'
}

// 标签排序（按使用次数）
const sortedTags = computed(() => {
  return [...tags].sort((a, b) => b.count - a.count)
})

// 是否有活动的筛选条件
const hasActiveFilters = computed(() => {
  return searchQuery.value || 
         selectedCategory.value !== 'all' || 
         selectedTags.value.length > 0
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
    
    // 处理文章数据
    const articlesData = response.data
    
    // 将文章与分类关联
    const processedArticles = mapArticlesToCategories(articlesData)
    
    // 为每篇文章添加标签ID
    processedArticles.forEach(article => {
      article.tag_ids = mapTagsToIds(article.tags)
    })
    
    articles.value = processedArticles
    
    // 更新各分类的文章数量
    categories.forEach(category => {
      if (category.id === 'all') {
        category.count = articles.value.length
      } else {
        category.count = articles.value.filter(article => article.category_id === category.id).length
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

// 子分类数据
const subcategories = {
  frontend: [
    { id: 'html-css', name: 'HTML/CSS', icon: 'mdi-language-html5', count: 5 },
    { id: 'javascript', name: 'JavaScript', icon: 'mdi-language-javascript', count: 8 },
    { id: 'framework', name: '前端框架', icon: 'mdi-view-grid-plus', count: 6 }
  ],
  backend: [
    { id: 'python', name: 'Python', icon: 'mdi-language-python', count: 7 },
    { id: 'nodejs', name: 'Node.js', icon: 'mdi-nodejs', count: 4 },
    { id: 'java', name: 'Java', icon: 'mdi-language-java', count: 3 }
  ],
  // ... 其他分类的子分类
}

// 为每个分类添加子分类
categories.forEach(category => {
  if (subcategories[category.id]) {
    category.subcategories = subcategories[category.id]
  } else {
    category.subcategories = []
  }
})

onMounted(() => {
  fetchArticles()
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