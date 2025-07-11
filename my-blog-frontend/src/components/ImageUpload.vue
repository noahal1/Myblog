<template>
  <div class="image-upload-container">
    <!-- 拖拽上传区域 -->
    <div
      ref="dropZone"
      class="drop-zone"
      :class="{ 'drag-over': isDragOver, 'uploading': uploading }"
      @click="triggerFileInput"
      @dragover.prevent="handleDragOver"
      @dragleave.prevent="handleDragLeave"
      @drop.prevent="handleDrop"
    >
      <div class="drop-zone-content">
        <v-icon size="48" color="primary" class="mb-4">
          {{ uploading ? 'mdi-loading mdi-spin' : 'mdi-cloud-upload' }}
        </v-icon>
        <h3 class="text-h6 mb-2">{{ uploading ? '上传中...' : '点击或拖拽上传图片' }}</h3>
        <p class="text-body-2 text-grey">
          支持 JPG、PNG、GIF、WebP 格式，最大 5MB
        </p>
        
        <!-- 上传进度 -->
        <v-progress-linear
          v-if="uploading"
          :model-value="uploadProgress"
          color="primary"
          height="4"
          class="mt-4"
        />
      </div>
    </div>
    
    <!-- 隐藏的文件输入 -->
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      multiple
      style="display: none"
      @change="handleFileSelect"
    />
    
    <!-- 上传结果展示 -->
    <div v-if="uploadResults.length > 0" class="upload-results mt-4">
      <h4 class="text-subtitle-1 mb-2">上传结果</h4>
      <div class="results-grid">
        <v-card
          v-for="(result, index) in uploadResults"
          :key="index"
          class="result-card"
          :color="result.success ? 'success' : 'error'"
          variant="tonal"
        >
          <v-card-text class="pa-3">
            <div class="d-flex align-center">
              <v-icon class="me-2">
                {{ result.success ? 'mdi-check-circle' : 'mdi-alert-circle' }}
              </v-icon>
              <div class="flex-grow-1">
                <div class="text-body-2 font-weight-medium">
                  {{ result.original_name || result.filename }}
                </div>
                <div v-if="result.success" class="text-caption">
                  {{ formatFileSize(result.size) }}
                </div>
                <div v-else class="text-caption text-error">
                  {{ result.error }}
                </div>
              </div>
              <div v-if="result.success" class="ms-2">
                <v-btn
                  icon="mdi-content-copy"
                  size="small"
                  variant="text"
                  @click="copyImageUrl(result.url)"
                  title="复制图片链接"
                />
                <v-btn
                  icon="mdi-open-in-new"
                  size="small"
                  variant="text"
                  @click="openImage(result.url)"
                  title="查看图片"
                />
              </div>
            </div>
          </v-card-text>
        </v-card>
      </div>
    </div>
    
    <!-- 错误提示 -->
    <v-alert
      v-if="error"
      type="error"
      class="mt-4"
      closable
      @click:close="error = null"
    >
      {{ error }}
    </v-alert>
    
    <!-- 成功提示 -->
    <v-snackbar
      v-model="showSuccessSnackbar"
      color="success"
      timeout="3000"
    >
      {{ successMessage }}
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { uploadImage, uploadMultipleImages } from '../api'

const props = defineProps({
  multiple: {
    type: Boolean,
    default: true
  },
  maxFiles: {
    type: Number,
    default: 10
  },
  maxSize: {
    type: Number,
    default: 5 * 1024 * 1024 // 5MB
  }
})

const emit = defineEmits(['upload-success', 'upload-error'])

// 响应式数据
const dropZone = ref(null)
const fileInput = ref(null)
const isDragOver = ref(false)
const uploading = ref(false)
const uploadProgress = ref(0)
const uploadResults = ref([])
const error = ref(null)
const showSuccessSnackbar = ref(false)
const successMessage = ref('')

// 支持的文件类型
const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/bmp']

// 验证文件
const validateFile = (file) => {
  if (!allowedTypes.includes(file.type)) {
    return `不支持的文件类型: ${file.type}`
  }
  
  if (file.size > props.maxSize) {
    return `文件大小超过限制: ${formatFileSize(props.maxSize)}`
  }
  
  return null
}

// 格式化文件大小
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 触发文件选择
const triggerFileInput = () => {
  if (!uploading.value) {
    fileInput.value?.click()
  }
}

// 处理拖拽
const handleDragOver = (e) => {
  e.preventDefault()
  isDragOver.value = true
}

const handleDragLeave = (e) => {
  e.preventDefault()
  isDragOver.value = false
}

const handleDrop = (e) => {
  e.preventDefault()
  isDragOver.value = false
  
  const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'))
  if (files.length > 0) {
    handleFiles(files)
  }
}

// 处理文件选择
const handleFileSelect = (e) => {
  const files = Array.from(e.target.files)
  if (files.length > 0) {
    handleFiles(files)
  }
  // 清空input值，允许重复选择同一文件
  e.target.value = ''
}

// 处理文件上传
const handleFiles = async (files) => {
  if (uploading.value) return
  
  // 限制文件数量
  if (files.length > props.maxFiles) {
    error.value = `一次最多上传 ${props.maxFiles} 张图片`
    return
  }
  
  // 验证所有文件
  const validationErrors = []
  files.forEach((file, index) => {
    const validationError = validateFile(file)
    if (validationError) {
      validationErrors.push(`文件 ${index + 1}: ${validationError}`)
    }
  })
  
  if (validationErrors.length > 0) {
    error.value = validationErrors.join('\n')
    return
  }
  
  // 清空之前的结果
  uploadResults.value = []
  error.value = null
  uploading.value = true
  uploadProgress.value = 0
  
  try {
    let results
    
    if (files.length === 1) {
      // 单文件上传
      uploadProgress.value = 50
      const response = await uploadImage(files[0])
      uploadProgress.value = 100

      console.log('单文件上传响应:', response)

      if (response && response.data && response.data.success) {
        results = [response.data.data]
      } else {
        console.error('上传响应格式错误:', response)
        throw new Error(response?.data?.message || '上传失败')
      }
    } else {
      // 多文件上传
      uploadProgress.value = 50
      const response = await uploadMultipleImages(files)
      uploadProgress.value = 100
      
      if (response.data.success) {
        results = response.data.data.results
        
        // 如果有错误，也要显示
        if (response.data.data.errors.length > 0) {
          results = results.concat(
            response.data.data.errors.map(err => ({
              success: false,
              original_name: err.filename,
              error: err.error
            }))
          )
        }
      } else {
        throw new Error(response.data.message || '上传失败')
      }
    }
    
    uploadResults.value = results
    
    // 统计成功和失败数量
    const successCount = results.filter(r => r.success).length
    const errorCount = results.filter(r => !r.success).length
    
    if (successCount > 0) {
      successMessage.value = `成功上传 ${successCount} 张图片`
      showSuccessSnackbar.value = true
      
      // 发送成功事件
      emit('upload-success', results.filter(r => r.success))
    }
    
    if (errorCount > 0) {
      error.value = `${errorCount} 张图片上传失败`
      emit('upload-error', results.filter(r => !r.success))
    }
    
  } catch (err) {
    console.error('上传失败:', err)
    error.value = err.message || '上传失败，请重试'
    emit('upload-error', err)
  } finally {
    uploading.value = false
    uploadProgress.value = 0
  }
}

// 复制图片URL
const copyImageUrl = async (url) => {
  try {
    await navigator.clipboard.writeText(url)
    successMessage.value = '图片链接已复制到剪贴板'
    showSuccessSnackbar.value = true
  } catch (err) {
    console.error('复制失败:', err)
    error.value = '复制失败，请手动复制'
  }
}

// 打开图片
const openImage = (url) => {
  window.open(url, '_blank')
}

// 处理粘贴事件
const handlePaste = (e) => {
  const items = e.clipboardData?.items
  if (!items) return
  
  const imageFiles = []
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    if (item.type.startsWith('image/')) {
      const file = item.getAsFile()
      if (file) {
        imageFiles.push(file)
      }
    }
  }
  
  if (imageFiles.length > 0) {
    e.preventDefault()
    handleFiles(imageFiles)
  }
}

// 生命周期
onMounted(() => {
  // 监听全局粘贴事件
  document.addEventListener('paste', handlePaste)
})

onUnmounted(() => {
  document.removeEventListener('paste', handlePaste)
})
</script>

<style scoped>
.image-upload-container {
  width: 100%;
}

.drop-zone {
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #fafafa;
}

.drop-zone:hover {
  border-color: #1976d2;
  background-color: #f5f5f5;
}

.drop-zone.drag-over {
  border-color: #1976d2;
  background-color: #e3f2fd;
}

.drop-zone.uploading {
  cursor: not-allowed;
  opacity: 0.7;
}

.drop-zone-content {
  pointer-events: none;
}

.upload-results {
  max-height: 300px;
  overflow-y: auto;
}

.results-grid {
  display: grid;
  gap: 8px;
}

.result-card {
  transition: all 0.2s ease;
}

.result-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
</style>
