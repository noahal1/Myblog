<template>
  <div class="test-image-list pa-6">
    <h1>图片列表API测试</h1>
    
    <v-btn 
      @click="testImageList" 
      :loading="loading"
      color="primary"
      class="mb-4"
    >
      测试获取图片列表
    </v-btn>
    
    <v-card v-if="result" class="mb-4">
      <v-card-title>API响应结果</v-card-title>
      <v-card-text>
        <pre>{{ JSON.stringify(result, null, 2) }}</pre>
      </v-card-text>
    </v-card>
    
    <v-card v-if="error" color="error" class="mb-4">
      <v-card-title>错误信息</v-card-title>
      <v-card-text>
        <pre>{{ JSON.stringify(error, null, 2) }}</pre>
      </v-card-text>
    </v-card>
    
    <div v-if="images.length > 0">
      <h2>图片列表 ({{ images.length }} 张)</h2>
      <div class="images-grid">
        <v-card
          v-for="image in images"
          :key="image.sha"
          class="image-card"
          elevation="2"
        >
          <v-img
            :src="image.download_url"
            :alt="image.name"
            height="150"
            cover
          />
          <v-card-text class="pa-2">
            <div class="text-caption">{{ image.name }}</div>
            <div class="text-caption text-grey">{{ formatFileSize(image.size) }}</div>
          </v-card-text>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { getImageList } from '../api'

const loading = ref(false)
const result = ref(null)
const error = ref(null)
const images = ref([])

const formatFileSize = (bytes) => {
  if (!bytes) return '未知大小'
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const testImageList = async () => {
  loading.value = true
  result.value = null
  error.value = null
  images.value = []
  
  try {
    console.log('开始测试图片列表API...')
    const response = await getImageList(1, 20)
    console.log('API响应:', response)
    
    result.value = response
    
    if (response && response.data && response.data.success) {
      images.value = response.data.data.images || []
      console.log('成功获取图片:', images.value.length, '张')
    } else {
      error.value = {
        message: 'API响应格式错误',
        response: response
      }
    }
  } catch (err) {
    console.error('API调用失败:', err)
    error.value = {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.test-image-list {
  max-width: 1200px;
  margin: 0 auto;
}

.images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.image-card {
  transition: all 0.2s ease;
}

.image-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

pre {
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 400px;
  overflow-y: auto;
}
</style>
