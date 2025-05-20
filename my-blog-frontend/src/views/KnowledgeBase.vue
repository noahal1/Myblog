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

// 模拟知识库文章数据
const mockArticles = [
  {
    id: 1,
    title: 'Vue 3 组合式 API 完全指南',
    summary: '详细介绍 Vue 3 组合式 API 的使用方法和最佳实践，包括 setup、ref、reactive 等核心概念',
    category_id: 'frontend',
    tag_ids: [1, 3],
    views: 1240,
    created_at: '2023-04-15T08:00:00Z'
  },
  {
    id: 2,
    title: 'Docker 容器化应用开发教程',
    summary: '从零开始学习如何使用 Docker 进行应用容器化，包括 Dockerfile 编写、镜像构建和容器编排',
    category_id: 'devops',
    tag_ids: [6],
    views: 890,
    created_at: '2023-05-22T10:30:00Z'
  },
  {
    id: 3,
    title: 'Python 数据分析实战：Pandas 和 NumPy',
    summary: '使用 Python 的 Pandas 和 NumPy 库进行数据处理和分析的实用指南',
    category_id: 'ai',
    tag_ids: [2],
    views: 1560,
    created_at: '2023-03-10T14:15:00Z'
  },
  {
    id: 4,
    title: 'Node.js RESTful API 设计最佳实践',
    summary: '如何设计高效、安全且可扩展的 RESTful API，包括身份验证、错误处理和性能优化',
    category_id: 'backend',
    tag_ids: [5, 10],
    views: 980,
    created_at: '2023-06-05T09:45:00Z'
  },
  {
    id: 5,
    title: 'MySQL 数据库性能调优指南',
    summary: '详细讲解 MySQL 数据库性能优化的各种技巧，包括索引设计、查询优化和配置调整',
    category_id: 'database',
    tag_ids: [7],
    views: 1120,
    created_at: '2023-04-30T16:20:00Z'
  },
  {
    id: 6,
    title: 'React Hooks 深入理解与应用',
    summary: '深入剖析 React Hooks 的工作原理，并通过实例展示其在复杂应用中的应用方法',
    category_id: 'frontend',
    tag_ids: [1, 4],
    views: 1350,
    created_at: '2023-05-12T11:30:00Z'
  },
  {
    id: 7,
    title: 'Git 高级技巧与工作流',
    summary: '超越基础命令，掌握 Git 高级特性和团队协作工作流，提高开发效率',
    category_id: 'tools',
    tag_ids: [8],
    views: 760,
    created_at: '2023-03-25T13:40:00Z'
  },
  {
    id: 8,
    title: '前端安全防御指南：XSS 和 CSRF',
    summary: '详解常见的前端安全漏洞 XSS 和 CSRF，以及如何在应用中进行有效防御',
    category_id: 'frontend',
    tag_ids: [1, 9, 12],
    views: 890,
    created_at: '2023-06-18T10:15:00Z'
  },
  {
    id: 9,
    title: '设计模式在 TypeScript 中的应用',
    summary: '结合 TypeScript 特性实现常用设计模式，包括单例、工厂、观察者等模式的实际应用',
    category_id: 'frontend',
    tag_ids: [1, 11],
    views: 670,
    created_at: '2023-05-05T09:30:00Z'
  },
  {
    id: 10,
    title: '构建可扩展的 Node.js 微服务架构',
    summary: '使用 Node.js 构建微服务架构的完整指南，包括服务发现、负载均衡和故障恢复',
    category_id: 'backend',
    tag_ids: [5, 6, 10],
    views: 1480,
    created_at: '2023-04-10T15:50:00Z'
  },
  {
    id: 11,
    title: '程序员职业生涯规划与成长',
    summary: '从初级到高级工程师的职业发展路径，以及如何持续提升技术和软技能',
    category_id: 'career',
    tag_ids: [],
    views: 2150,
    created_at: '2023-06-01T08:30:00Z'
  },
  {
    id: 12,
    title: 'CSS Grid 和 Flexbox 完全指南',
    summary: '现代 CSS 布局技术详解，掌握 Grid 和 Flexbox 创建响应式、灵活的网页布局',
    category_id: 'frontend',
    tag_ids: [9],
    views: 950,
    created_at: '2023-03-18T14:10:00Z'
  }
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
      article.tag_ids.some(tagId => selectedTags.value.includes(tagId))
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
    // 在实际应用中，这里应该调用 API
    // const response = await getArticles(1, 100)
    // articles.value = response.data
    
    // 使用模拟数据
    await new Promise(resolve => setTimeout(resolve, 800))
    articles.value = mockArticles
    
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