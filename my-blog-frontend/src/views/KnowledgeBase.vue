<template>
  <div class="knowledge-base">
    <v-container class="py-8">
      <!-- 页面标题 -->
      <div class="kb-header text-center mb-10">
        <h1 class="text-h3 font-weight-bold gradient-text mb-2">知识库</h1>
        <p class="text-subtitle-1 text-medium-emphasis">整理的各类技术笔记、教程和解决方案</p>
        
        <!-- 搜索框 -->
        <v-text-field
          v-model="searchQuery"
          prepend-inner-icon="mdi-magnify"
          placeholder="搜索知识库内容..."
          variant="outlined"
          hide-details
          density="comfortable"
          class="search-input mt-6 mx-auto"
          @keyup.enter="searchKnowledge"
          bg-color="surface"
          style="max-width: 600px;"
        ></v-text-field>
      </div>
      
      <v-row>
        <!-- 左侧导航 -->
        <v-col cols="12" md="3">
          <v-card class="navigation-card mb-6" variant="elevated" elevation="2">
            <v-list bg-color="transparent">
              <v-list-subheader>目录</v-list-subheader>
              
              <v-list-item
                v-for="(category, index) in categories"
                :key="index"
                :value="category.id"
                @click="selectedCategory = category.id"
                :active="selectedCategory === category.id"
                :prepend-icon="category.icon"
                :title="category.name"
                :subtitle="`${category.count} 篇文章`"
                rounded="lg"
                class="mb-1"
              ></v-list-item>
            </v-list>
          </v-card>
          
          <!-- 标签云 -->
          <v-card class="tag-cloud-card" variant="elevated" elevation="2">
            <v-card-title class="d-flex align-center">
              <v-icon icon="mdi-tag-multiple" class="me-2"></v-icon>
              标签云
            </v-card-title>
            <v-card-text>
              <div class="tag-cloud">
                <v-chip
                  v-for="(tag, index) in tags"
                  :key="index"
                  :color="tag.color"
                  :variant="selectedTags.includes(tag.id) ? 'elevated' : 'outlined'"
                  class="ma-1 tag-chip"
                  closable
                  :close-icon="selectedTags.includes(tag.id) ? 'mdi-close' : ''"
                  @click="toggleTag(tag.id)"
                >
                  {{ tag.name }} ({{ tag.count }})
                </v-chip>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        
        <!-- 右侧内容 -->
        <v-col cols="12" md="9">
          <!-- 筛选栏 -->
          <div class="filter-bar d-flex align-center justify-space-between mb-4 px-3 py-2 rounded">
            <div class="d-flex align-center">
              <span class="text-caption text-medium-emphasis me-3">已找到 {{ filteredArticles.length }} 条结果</span>
              
              <v-chip-group v-model="sortOption" class="ms-3">
                <v-chip value="latest" size="small" variant="flat">最新</v-chip>
                <v-chip value="popular" size="small" variant="flat">最热</v-chip>
                <v-chip value="alpha" size="small" variant="flat">字母序</v-chip>
              </v-chip-group>
            </div>
            
            <div>
              <v-btn-toggle v-model="viewMode" mandatory density="compact" color="primary">
                <v-btn value="card" icon="mdi-view-grid"></v-btn>
                <v-btn value="list" icon="mdi-view-list"></v-btn>
              </v-btn-toggle>
            </div>
          </div>
          
          <!-- 加载状态 -->
          <div v-if="loading" class="text-center py-10">
            <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
            <p class="mt-4 text-medium-emphasis">加载中...</p>
          </div>
          
          <!-- 无匹配结果 -->
          <v-card v-else-if="filteredArticles.length === 0" class="empty-state text-center pa-10">
            <v-icon icon="mdi-book-search" size="64" color="grey-lighten-1" class="mb-4"></v-icon>
            <h3 class="text-h5 mb-2">没有找到匹配的内容</h3>
            <p class="text-body-1 mb-6">尝试调整搜索条件或删除筛选器</p>
            <v-btn @click="resetFilters" color="primary" prepend-icon="mdi-refresh">重置筛选条件</v-btn>
          </v-card>
          
          <!-- 列表视图 -->
          <template v-else-if="viewMode === 'list'">
            <v-list class="article-list">
              <v-list-item
                v-for="article in filteredArticles"
                :key="article.id"
                :title="article.title"
                :subtitle="article.summary"
                :prepend-icon="getCategoryIcon(article.category_id)"
                rounded="lg"
                class="mb-3 article-list-item"
                @click="viewArticle(article.id)"
              >
                <template v-slot:append>
                  <div class="d-flex flex-column align-end text-caption">
                    <div class="mb-1">
                      <v-icon icon="mdi-eye" size="small" class="me-1"></v-icon>
                      {{ article.views }}
                    </div>
                    <div class="text-medium-emphasis">{{ formatDate(article.created_at) }}</div>
                  </div>
                </template>
              </v-list-item>
            </v-list>
          </template>
          
          <!-- 卡片视图 -->
          <template v-else>
            <v-row>
              <v-col
                v-for="article in filteredArticles"
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
                  <v-card-title class="text-h6">{{ article.title }}</v-card-title>
                  <v-card-text>
                    <p class="text-caption text-medium-emphasis mb-2">
                      <v-icon icon="mdi-calendar" size="x-small" class="me-1"></v-icon>
                      {{ formatDate(article.created_at) }}
                      <v-icon icon="mdi-eye" size="x-small" class="ms-2 me-1"></v-icon>
                      {{ article.views }}
                    </p>
                    <p class="summary-text">{{ article.summary }}</p>
                    
                    <div class="mt-3 d-flex flex-wrap">
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
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </template>
          
          <!-- 分页 -->
          <div v-if="filteredArticles.length > 0" class="text-center mt-8">
            <v-pagination
              v-model="currentPage"
              :length="totalPages"
              :total-visible="7"
              rounded
            ></v-pagination>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
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

// 根据分类和标签筛选文章
const filteredArticles = computed(() => {
  // 首先根据搜索词过滤
  let result = [...articles.value]
  
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(article => 
      article.title.toLowerCase().includes(query) || 
      article.summary.toLowerCase().includes(query)
    )
  }
  
  // 根据分类过滤
  if (selectedCategory.value && selectedCategory.value !== 'all') {
    result = result.filter(article => article.category_id === selectedCategory.value)
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

// 当筛选条件变化时，重置页码
watch([selectedCategory, selectedTags, searchQuery, sortOption], () => {
  currentPage.value = 1
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

onMounted(() => {
  fetchArticles()
})
</script>

<style scoped>
.knowledge-base {
  min-height: calc(100vh - 200px);
  background: radial-gradient(circle at 30% 30%, rgba(var(--primary-blue), 0.03), transparent 400px),
              radial-gradient(circle at 70% 70%, rgba(var(--accent-orange), 0.03), transparent 400px);
}

.gradient-text {
  background: var(--neon-gradient);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.navigation-card, 
.tag-cloud-card {
  background: rgba(var(--v-theme-surface), 0.9);
  backdrop-filter: blur(8px);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid rgba(var(--primary-blue), 0.1);
}

.filter-bar {
  background: rgba(var(--v-theme-surface), 0.8);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(var(--primary-blue), 0.05);
}

.article-card {
  position: relative;
  border-radius: var(--border-radius);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  overflow: hidden;
  backdrop-filter: blur(8px);
  background: rgba(var(--v-theme-surface), 0.8);
}

.article-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--hover-shadow);
}

.card-category-indicator {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
}

.article-list-item {
  background: rgba(var(--v-theme-surface), 0.8);
  backdrop-filter: blur(8px);
  border: 0px solid rgba(var(--primary-blue), 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.article-list-item:hover {
  transform: translateX(5px);
  box-shadow: var(--hover-shadow);
}

.summary-text {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tag-cloud-card .v-card-title {
  border-bottom: 1px solid rgba(var(--primary-blue), 0.1);
}

.tag-chip {
  transition: transform 0.2s ease;
}

.tag-chip:hover {
  transform: scale(1.05);
}

.bg-blue { background-color: rgb(var(--blue)); }
.bg-green { background-color: rgb(var(--green)); }
.bg-orange { background-color: rgb(var(--orange)); }
.bg-purple { background-color: rgb(var(--purple)); }
.bg-red { background-color: rgb(var(--red)); }
.bg-cyan { background-color: rgb(var(--cyan)); }
.bg-amber { background-color: rgb(var(--amber)); }
.bg-grey { background-color: rgb(var(--grey)); }

@media (max-width: 768px) {
  .kb-header {
    margin-bottom: 2rem !important;
  }
  
  .navigation-card {
    margin-bottom: 1rem !important;
  }
}
</style> 