<template>
  <div class="admin-view">
    <v-container>
      <h1 class="text-h4 mb-4">管理控制台</h1>
      
      <v-tabs v-model="activeTab" class="mb-4">
        <v-tab value="stats">访问统计</v-tab>
        <v-tab value="logs">访问记录</v-tab>
      </v-tabs>
      
      <v-window v-model="activeTab">
        <!-- 统计信息视图 -->
        <v-window-item value="stats">
          <v-row>
            <v-col cols="12" md="4">
              <v-card class="mb-4">
                <v-card-title>总访问量</v-card-title>
                <v-card-text>
                  <div class="text-h3">{{ visitorStats.total_visits || 0 }}</div>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" md="4">
              <v-card class="mb-4">
                <v-card-title>独立IP数</v-card-title>
                <v-card-text>
                  <div class="text-h3">{{ visitorStats.unique_ips || 0 }}</div>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" md="4">
              <v-card class="mb-4">
                <v-card-title>平均响应时间</v-card-title>
                <v-card-text>
                  <div class="text-h3">{{ (visitorStats.average_response_time || 0).toFixed(2) }}ms</div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
          
          <v-card class="mb-4">
            <v-card-title class="d-flex align-center">
              访问统计
              <v-spacer></v-spacer>
              <v-select
                v-model="days"
                :items="[1, 7, 14, 30, 90]"
                label="统计天数"
                dense
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
          <v-card>
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
              
              <template v-slot:bottom>
                <v-pagination
                  v-model="page"
                  :length="Math.ceil(totalLogs / 10)"
                  @update:model-value="fetchVisitorLogs"
                ></v-pagination>
              </template>
            </v-data-table>
            
            <div class="d-flex justify-center mt-4">
              <v-pagination
                v-model="page"
                :length="Math.ceil(totalLogs / 10)"
                @update:model-value="fetchVisitorLogs"
              ></v-pagination>
            </div>
          </v-card>
        </v-window-item>
      </v-window>
    </v-container>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getVisitorLogs, getVisitorStats } from '../api'

const activeTab = ref('stats')
const loading = ref(false)
const visitorLogs = ref([])
const visitorStats = ref({})
const totalLogs = ref(0)
const page = ref(1)
const days = ref(7)

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
  { title: '处理时间', key: 'process_time' }
]

const pathStats = computed(() => visitorStats.value?.path_stats || {})
const ipStats = computed(() => visitorStats.value?.ip_stats || {})

// 获取访问记录
const fetchVisitorLogs = async () => {
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
      visitorLogs.value = response.data || []
      totalLogs.value = response.data.length || 0
    }
  } catch (error) {
    console.error('获取访问记录失败:', error)
  } finally {
    loading.value = false
  }
}

// 获取访问统计
const fetchVisitorStats = async () => {
  loading.value = true
  try {
    const response = await getVisitorStats(days.value)
    if (response && response.data) {
      visitorStats.value = response.data
    }
  } catch (error) {
    console.error('获取访问统计失败:', error)
  } finally {
    loading.value = false
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
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

onMounted(async () => {
  await fetchVisitorStats()
  await fetchVisitorLogs()
})
</script>

<style scoped>
.admin-view {
  min-height: calc(100vh - 64px);
  padding-bottom: 2rem;
}
</style> 