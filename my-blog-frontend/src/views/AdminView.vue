<template>
  <div class="admin-view">
    <v-container v-if="hasPermission">
      <h1 class="text-h4 mb-4">管理控制台</h1>
      
      <v-tabs v-model="activeTab" class="mb-4" @update:model-value="handleTabChange">
        <v-tab value="stats">访问统计</v-tab>
        <v-tab value="logs">访问记录</v-tab>
        <v-tab value="articles">文章管理</v-tab>
      </v-tabs>
      
      <v-window v-model="activeTab">
        <!-- 统计信息视图 -->
        <v-window-item value="stats">
          <v-row>
            <v-col cols="12" md="4">
              <v-card class="mb-4" elevation="2" :loading="loading">
                <v-card-title>总访问量</v-card-title>
                <v-card-text>
                  <div class="text-h3">{{ visitorStats.total_visits || 0 }}</div>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" md="4">
              <v-card class="mb-4" elevation="2" :loading="loading">
                <v-card-title>独立IP数</v-card-title>
                <v-card-text>
                  <div class="text-h3">{{ visitorStats.unique_ips || 0 }}</div>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" md="4">
              <v-card class="mb-4" elevation="2" :loading="loading">
                <v-card-title>平均响应时间</v-card-title>
                <v-card-text>
                  <div class="text-h3">{{ (visitorStats.average_response_time || 0).toFixed(2) }}ms</div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
          
          <v-card class="mb-4" elevation="2" :loading="loading">
            <v-card-title class="d-flex align-center">
              访问统计
              <v-spacer></v-spacer>
              <v-select
                v-model="days"
                :items="[1, 7, 14, 30, 90]"
                label="统计天数"
                density="compact"
                class="max-width-200"
                @update:model-value="fetchVisitorStats"
              ></v-select>
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" md="6">
                  <h3 class="text-h6 mb-2">热门路径</h3>
                  <v-list>
                    <v-list-item v-for="(count, path) in pathStats" :key="path">
                      <v-list-item-title>{{ path }}</v-list-item-title>
                      <v-list-item-subtitle>访问次数: {{ count }}</v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item v-if="Object.keys(pathStats).length === 0">
                      <v-list-item-title>无数据</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-col>
                <v-col cols="12" md="6">
                  <h3 class="text-h6 mb-2">活跃IP</h3>
                  <v-list>
                    <v-list-item v-for="(count, ip) in ipStats" :key="ip">
                      <v-list-item-title>{{ ip }}</v-list-item-title>
                      <v-list-item-subtitle>访问次数: {{ count }}</v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item v-if="Object.keys(ipStats).length === 0">
                      <v-list-item-title>无数据</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-window-item>
        
        <!-- 访问记录视图 -->
        <v-window-item value="logs">
          <v-card elevation="2">
            <v-card-title>访问记录</v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="filters.ip_address"
                    label="IP地址"
                    density="compact"
                    clearable
                    @keydown.enter="fetchVisitorLogs"
                    @click:clear="filters.ip_address = ''; fetchVisitorLogs()"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="filters.path"
                    label="路径"
                    density="compact"
                    clearable
                    @keydown.enter="fetchVisitorLogs"
                    @click:clear="filters.path = ''; fetchVisitorLogs()"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-select
                    v-model="filters.status_code"
                    :items="statusCodes"
                    item-title="title"
                    item-value="value"
                    label="状态码"
                    density="compact"
                    clearable
                    @update:model-value="fetchVisitorLogs"
                  ></v-select>
                </v-col>
              </v-row>
            </v-card-text>
            
            <v-data-table
              :headers="headers"
              :items="visitorLogs"
              :loading="loading"
              :items-per-page="10"
            >
              <template v-slot:item.status_code="{ item }">
                <v-chip
                  :color="getStatusColor(item.status_code)"
                  size="small"
                  text-color="white"
                >
                  {{ item.status_code }}
                </v-chip>
              </template>
              
              <template v-slot:item.request_time="{ item }">
                {{ formatDate(item.request_time) }}
              </template>
              
              <template v-slot:item.process_time="{ item }">
                {{ item.process_time.toFixed(3) }}s
              </template>
              
              <template v-slot:item.actions="{ item }">
                <v-btn
                  color="info"
                  size="small"
                  class="mr-2"
                  @click="openEditDialog(item)"
                >
                  编辑
                </v-btn>
              </template>
              
              <template v-slot:bottom>
                <div class="d-flex justify-center">
                  <v-pagination
                    v-model="page"
                    :length="Math.ceil(totalLogs / 10)"
                    @update:model-value="fetchVisitorLogs"
                  ></v-pagination>
                </div>
              </template>
            </v-data-table>
          </v-card>
        </v-window-item>
        
        <!-- 文章审核视图 -->
        <v-window-item value="articles">
          <v-card elevation="2">
            <v-card-title class="d-flex align-center">
              文章管理
              <v-spacer></v-spacer>
              <v-select
                v-model="articleStatus"
                :items="statusOptions"
                label="状态筛选"
                density="compact"
                class="max-width-200 ml-4"
                @update:model-value="fetchArticlesByStatus"
              ></v-select>
            </v-card-title>
            <v-card-text>
              <v-data-table
                :headers="articleHeaders"
                :items="adminArticles"
                :loading="loadingArticles"
                :items-per-page="10"
              >
                <template v-slot:item.created_at="{ item }">
                  {{ formatDate(item.created_at) }}
                </template>

                <template v-slot:item.status="{ item }">
                  <v-chip
                    :color="getArticleStatusColor(item.status)"
                    size="small"
                    text-color="white"
                  >
                    {{ getArticleStatusText(item.status) }}
                  </v-chip>
                </template>
                
                <template v-slot:item.actions="{ item }">
                  <v-btn
                    color="primary"
                    size="small"
                    class="mr-2"
                    @click="viewArticle(item)"
                  >
                    查看
                  </v-btn>
                  <template v-if="item.status === 'pending'">
                    <v-btn
                      color="success"
                      size="small"
                      class="mr-2"
                      @click="approveArticle(item)"
                    >
                      通过
                    </v-btn>
                    <v-btn
                      color="error"
                      size="small"
                      @click="rejectArticle(item)"
                    >
                      拒绝
                    </v-btn>
                  </template>
                  <template v-else-if="item.status === 'rejected'">
                    <v-btn
                      color="success"
                      size="small"
                      @click="approveArticle(item)"
                    >
                      通过
                    </v-btn>
                  </template>
                  <template v-else>
                    <v-btn
                      color="warning"
                      size="small"
                      @click="pendingArticle(item)"
                    >
                      撤回发布
                    </v-btn>
                  </template>
                </template>
                
                <template v-slot:bottom>
                  <div class="d-flex justify-center">
                    <v-pagination
                      v-model="articlePage"
                      :length="Math.ceil(totalAdminArticles / 10)"
                      @update:model-value="fetchArticlesByStatus"
                    ></v-pagination>
                  </div>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
          
          <!-- 文章内容对话框 -->
          <v-dialog v-model="articleDialog" width="800">
            <v-card>
              <v-card-title>{{ selectedArticle.title }}</v-card-title>
              <v-card-subtitle>
                作者: {{ selectedArticle.author_name || '未知' }} | 
                创建时间: {{ formatDate(selectedArticle.created_at) }} |
                状态: {{ getArticleStatusText(selectedArticle.status) }}
              </v-card-subtitle>
              <v-card-text>
                <div class="mb-4">
                  <strong>摘要:</strong> {{ selectedArticle.summary }}
                </div>
                <div v-html="selectedArticle.content"></div>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="articleDialog = false">关闭</v-btn>
                <template v-if="selectedArticle.status === 'pending'">
                  <v-btn color="success" @click="approveArticle(selectedArticle); articleDialog = false">通过</v-btn>
                  <v-btn color="error" @click="rejectArticle(selectedArticle); articleDialog = false">拒绝</v-btn>
                </template>
                <template v-else-if="selectedArticle.status === 'rejected'">
                  <v-btn color="success" @click="approveArticle(selectedArticle); articleDialog = false">通过</v-btn>
                </template>
                <template v-else>
                  <v-btn color="warning" @click="pendingArticle(selectedArticle); articleDialog = false">撤回发布</v-btn>
                </template>
              </v-card-actions>
            </v-card>
          </v-dialog>
          
          <!-- 文章编辑对话框 -->
          <v-dialog v-model="editDialog" width="800">
            <v-card>
              <v-card-title>编辑文章</v-card-title>
              <v-card-text>
                <ArticleForm
                  v-if="editArticle"
                  :article="editArticle"
                  :loading="loadingArticles"
                  @submit="submitEdit"
                />
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="editDialog = false">关闭</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-window-item>
      </v-window>
    </v-container>

    <!-- 权限不足提示 -->
    <v-container v-else>
      <v-alert
        type="error"
        title="访问被拒绝"
        text="您没有权限访问管理控制台"
        class="mt-4"
      >
        <p class="mt-2">请确认您已登录并拥有管理员权限</p>
        <v-btn
          color="primary"
          class="mt-4"
          @click="goToHome"
        >
          返回首页
        </v-btn>
      </v-alert>
    </v-container>
    
    <!-- 全局提示 -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      timeout="3000"
    >
      {{ snackbar.text }}
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { getVisitorLogs, getVisitorStats, getPendingArticles, updateArticleStatus, getAdminArticles } from '../api'
import ArticleForm from '../components/ArticleForm.vue'
import { getArticleDetail, updateArticleDetail, getAdminArticleDetail } from '../api'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()
const activeTab = ref('stats')
const loading = ref(false)
const visitorLogs = ref([])
const visitorStats = ref({})
const totalLogs = ref(0)
const page = ref(1)
const days = ref(7)

// 使用userStore中的isAdmin getter
const hasPermission = computed(() => userStore.isAdmin)

// 文章审核相关
const pendingArticles = ref([])
const adminArticles = ref([])
const loadingArticles = ref(false)
const articlePage = ref(1)
const totalPendingArticles = ref(0)
const totalAdminArticles = ref(0)
const articleDialog = ref(false)
const selectedArticle = ref({})
const editDialog = ref(false)
const editArticle = ref(null)
const articleStatus = ref('to_process')

// 提示信息
const snackbar = ref({
  show: false,
  text: '',
  color: 'success'
})

const filters = ref({
  ip_address: '',
  path: '',
  status_code: null
})

const statusCodes = [
  { title: '200 - 成功', value: 200 },
  { title: '301 - 永久重定向', value: 301 },
  { title: '302 - 临时重定向', value: 302 },
  { title: '400 - 请求错误', value: 400 },
  { title: '401 - 未授权', value: 401 },
  { title: '403 - 禁止访问', value: 403 },
  { title: '404 - 未找到', value: 404 },
  { title: '500 - 服务器错误', value: 500 }
]

const headers = [
  { title: 'IP地址', key: 'ip_address' },
  { title: '路径', key: 'path' },
  { title: '方法', key: 'method' },
  { title: '状态码', key: 'status_code' },
  { title: '访问时间', key: 'request_time' },
  { title: '处理时间', key: 'process_time' },
  { title: '操作', key: 'actions', sortable: false }
]

// 文章表格列定义
const articleHeaders = [
  { title: '标题', key: 'title' },
  { title: '作者', key: 'author_name' },
  { title: '创建时间', key: 'created_at' },
  { title: '状态', key: 'status' },
  { title: '操作', key: 'actions', sortable: false }
]

const pathStats = computed(() => visitorStats.value?.path_stats || {})
const ipStats = computed(() => visitorStats.value?.ip_stats || {})

// 文章状态选项
const statusOptions = [
  { title: '需要处理', value: 'to_process' },
  { title: '待审核', value: 'pending' },
  { title: '已发布', value: 'published' },
  { title: '已拒绝', value: 'rejected' },
  { title: '全部', value: '' }
]

// 获取文章状态颜色
const getArticleStatusColor = (status) => {
  switch(status) {
    case 'published': return 'success'
    case 'pending': return 'warning'
    case 'rejected': return 'error'
    default: return 'grey'
  }
}

// 获取文章状态文本
const getArticleStatusText = (status) => {
  switch(status) {
    case 'published': return '已发布'
    case 'pending': return '待审核'
    case 'rejected': return '已拒绝'
    default: return '未知'
  }
}

// 按状态获取文章列表
const fetchArticlesByStatus = async () => {
  if (!hasPermission.value) return
  
  loadingArticles.value = true
  try {
    // 特殊处理"需要处理"选项，获取待审核和被拒绝的文章
    if (articleStatus.value === 'to_process') {
      // 首先获取待审核文章
      const pendingResponse = await getAdminArticles(1, 50, 'pending')
      const pendingArticles = pendingResponse?.data || []
      
      // 然后获取被拒绝文章
      const rejectedResponse = await getAdminArticles(1, 50, 'rejected')
      const rejectedArticles = rejectedResponse?.data || []
      
      // 合并两种文章
      adminArticles.value = [...pendingArticles, ...rejectedArticles]
      
      // 按创建时间排序，最新的在前面
      adminArticles.value.sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at)
      })
      
      // 手动处理分页
      const startIndex = (articlePage.value - 1) * 10
      const endIndex = startIndex + 10
      adminArticles.value = adminArticles.value.slice(startIndex, endIndex)
      
      // 计算总数
      const totalItems = (pendingResponse?.headers?.['x-total-count'] || 0) + 
                        (rejectedResponse?.headers?.['x-total-count'] || 0)
      totalAdminArticles.value = parseInt(totalItems)
    } else {
      // 正常处理单一状态
      const response = await getAdminArticles(articlePage.value, 10, articleStatus.value || null)
      if (response && response.data) {
        adminArticles.value = response.data || []
        totalAdminArticles.value = parseInt(response.headers['x-total-count']) || 0
      }
    }
  } catch (error) {
    console.error('获取文章列表失败:', error)
    showSnackbar('获取文章列表失败', 'error')
  } finally {
    loadingArticles.value = false
  }
}

// 撤回文章至待审核状态
const pendingArticle = async (article) => {
  loadingArticles.value = true
  try {
    await updateArticleStatus(article.id, 'pending')
    showSnackbar('文章已撤回至待审核状态')
    // 重新加载文章列表
    fetchArticlesByStatus()
  } catch (error) {
    console.error('更新文章状态失败:', error)
    showSnackbar('更新文章状态失败', 'error')
  } finally {
    loadingArticles.value = false
  }
}

// 处理标签页变更
const handleTabChange = (tab) => {
  if (tab === 'stats' && Object.keys(visitorStats.value).length === 0) {
    fetchVisitorStats()
  } else if (tab === 'logs' && visitorLogs.value.length === 0) {
    fetchVisitorLogs()
  } else if (tab === 'articles' && adminArticles.value.length === 0) {
    fetchArticlesByStatus()
  }
}

// 显示提示信息
const showSnackbar = (text, color = 'success') => {
  snackbar.value = {
    show: true,
    text,
    color
  }
}

// 返回首页
const goToHome = () => {
  router.push('/')
}

// 获取访问记录
const fetchVisitorLogs = async () => {
  if (!hasPermission.value) return
  
  loading.value = true
  try {
    const params = {
      limit: 10,
      offset: (page.value - 1) * 10,
      ...filters.value
    }
    
    // 移除值为null或空字符串的参数
    Object.keys(params).forEach(key => {
      if (params[key] === null || params[key] === '') {
        delete params[key]
      }
    })
    
    const response = await getVisitorLogs(params)
    if (response && response.data) {
      visitorLogs.value = response.data.logs || []
      totalLogs.value = response.data.total || 0
    }
  } catch (error) {
    console.error('获取访问记录失败:', error)
    showSnackbar('获取访问记录失败', 'error')
  } finally {
    loading.value = false
  }
}

// 获取访问统计
const fetchVisitorStats = async () => {
  if (!hasPermission.value) return
  
  loading.value = true
  try {
    const response = await getVisitorStats(days.value)
    if (response && response.data) {
      visitorStats.value = response.data
    }
  } catch (error) {
    console.error('获取访问统计失败:', error)
    showSnackbar('获取访问统计失败', 'error')
  } finally {
    loading.value = false
  }
}

// 获取待审核文章
const fetchPendingArticles = async () => {
  if (!hasPermission.value) return
  
  loadingArticles.value = true
  try {
    const response = await getPendingArticles(articlePage.value, 10)
    if (response && response.data) {
      pendingArticles.value = response.data.articles || []
      totalPendingArticles.value = response.data.total || 0
    }
  } catch (error) {
    console.error('获取待审核文章失败:', error)
    showSnackbar('获取待审核文章失败', 'error')
  } finally {
    loadingArticles.value = false
  }
}

// 查看文章详情
const viewArticle = (article) => {
  selectedArticle.value = article
  articleDialog.value = true
}

// 通过文章
const approveArticle = async (article) => {
  loadingArticles.value = true
  try {
    await updateArticleStatus(article.id, 'published')
    showSnackbar('文章已通过审核')
    // 重新加载文章列表
    fetchPendingArticles()
  } catch (error) {
    console.error('审核文章失败:', error)
    showSnackbar('审核文章失败', 'error')
  } finally {
    loadingArticles.value = false
  }
}

// 拒绝文章
const rejectArticle = async (article) => {
  loadingArticles.value = true
  try {
    await updateArticleStatus(article.id, 'rejected')
    showSnackbar('文章已被拒绝')
    // 重新加载文章列表
    fetchPendingArticles()
  } catch (error) {
    console.error('审核文章失败:', error)
    showSnackbar('审核文章失败', 'error')
  } finally {
    loadingArticles.value = false
  }
}

// 根据状态码获取颜色
const getStatusColor = (statusCode) => {
  if (statusCode >= 200 && statusCode < 300) return 'success'
  if (statusCode >= 300 && statusCode < 400) return 'info'
  if (statusCode >= 400 && statusCode < 500) return 'warning'
  return 'error'
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '未知'
  
  try {
    const date = new Date(dateString)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  } catch (e) {
    return dateString
  }
}

const openEditDialog = async (article) => {
  loadingArticles.value = true
  try {
    const res = await getArticleDetail(article.id)
    editArticle.value = res.data
    editDialog.value = true
  } catch (error) {
    console.error('获取文章详情失败:', error)
    showSnackbar('获取文章详情失败', 'error')
  } finally {
    loadingArticles.value = false
  }
}

const submitEdit = async (formData) => {
  loadingArticles.value = true
  try {
    await updateArticleDetail(editArticle.value.id, formData)
    showSnackbar('文章更新成功')
    editDialog.value = false
    fetchPendingArticles()
  } catch (error) {
    console.error('更新文章失败:', error)
    showSnackbar('更新文章失败', 'error')
  } finally {
    loadingArticles.value = false
  }
}

// 监听分页变化
watch(page, () => {
  if (activeTab.value === 'logs') {
    fetchVisitorLogs()
  }
})

watch(articlePage, () => {
  if (activeTab.value === 'articles') {
    fetchArticlesByStatus()
  }
})

// 监听文章状态变化
watch(articleStatus, () => {
  articlePage.value = 1 // 重置分页
  fetchArticlesByStatus()
})

onMounted(async () => {
  // 检查是否已登录，如果未登录尝试初始化用户状态
  if (!userStore.isAuthenticated) {
    await userStore.initUserState()
  }

  // 只有有权限时才加载数据
  if (hasPermission.value) {
    handleTabChange(activeTab.value)
  } else {
    showSnackbar('没有权限访问该资源，只有管理员(用户ID=1)才能访问', 'error')
  }
})
</script>

<style scoped>
.admin-view {
  min-height: calc(100vh - 64px);
  padding-bottom: 2rem;
}

.max-width-200 {
  max-width: 200px;
}
</style> 