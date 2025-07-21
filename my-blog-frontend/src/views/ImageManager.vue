<template>
  <div class="image-manager">
    <v-container>
      <v-row>
        <v-col cols="12">
          <div class="d-flex align-center mb-6">
            <h1 class="text-h4 font-weight-bold">图片管理</h1>
            <v-spacer />

            <!-- CDN切换 -->
            <v-select
              v-model="selectedCdnProvider"
              :items="cdnProviders"
              label="CDN提供商"
              variant="outlined"
              density="compact"
              style="width: 150px;"
              class="mr-4"
              @update:model-value="switchCdnProvider"
            />

            <v-btn
              color="primary"
              prepend-icon="mdi-plus"
              @click="showUploadDialog = true"
            >
              上传图片
            </v-btn>
          </div>
          
          <!-- 图片上传组件 -->
          <ImageUpload
            v-if="showUploadDialog"
            class="mb-6"
            @upload-success="handleUploadSuccess"
            @upload-error="handleUploadError"
          />
          
          <!-- 关闭上传区域按钮 -->
          <div v-if="showUploadDialog" class="text-center mb-6">
            <v-btn
              variant="outlined"
              @click="showUploadDialog = false"
            >
              关闭上传区域
            </v-btn>
          </div>
          
          <!-- 已有图片展示 -->
          <div v-if="existingImages.length > 0" class="mb-6">
            <h2 class="text-h5 mb-4">已有图片 ({{ imageStats.total }} 张)</h2>
            <div class="images-grid">
              <v-card
                v-for="(image, index) in existingImages"
                :key="image.sha"
                class="image-card"
                elevation="2"
              >
                <v-img
                  :src="image.download_url"
                  :alt="image.name"
                  height="200"
                  cover
                  class="image-preview"
                >
                  <template v-slot:placeholder>
                    <div class="d-flex align-center justify-center fill-height">
                      <v-progress-circular
                        color="grey-lighten-4"
                        indeterminate
                      />
                    </div>
                  </template>
                </v-img>

                <v-card-text class="pa-3">
                  <div class="text-body-2 font-weight-medium mb-1">
                    {{ image.name }}
                  </div>
                  <div class="text-caption text-grey">
                    {{ formatFileSize(image.size) }}
                  </div>
                  <div class="text-caption text-primary mt-1">
                    {{ getCurrentImageUrl(image) }}
                  </div>
                </v-card-text>

                <v-card-actions class="pa-3 pt-0">
                  <v-menu>
                    <template v-slot:activator="{ props }">
                      <v-btn
                        v-bind="props"
                        size="small"
                        variant="text"
                        prepend-icon="mdi-content-copy"
                      >
                        复制
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item @click="copyImageUrl(getCurrentImageUrl(image))">
                        <v-list-item-title>复制当前链接</v-list-item-title>
                      </v-list-item>
                      <v-list-item v-if="image.cdn_url" @click="copyImageUrl(image.cdn_url)">
                        <v-list-item-title>复制CDN链接</v-list-item-title>
                      </v-list-item>
                      <v-list-item v-if="image.raw_url" @click="copyImageUrl(image.raw_url)">
                        <v-list-item-title>复制原始链接</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>

                  <v-btn
                    size="small"
                    variant="text"
                    prepend-icon="mdi-open-in-new"
                    @click="openImage(getCurrentImageUrl(image))"
                  >
                    查看
                  </v-btn>
                  <v-spacer />
                  <v-btn
                    size="small"
                    variant="text"
                    color="error"
                    prepend-icon="mdi-delete"
                    @click="confirmDeleteExisting(image, index)"
                  >
                    删除
                  </v-btn>
                </v-card-actions>
              </v-card>
            </div>

            <!-- 分页 -->
            <div v-if="imageStats.total_pages > 1" class="d-flex justify-center mt-6">
              <v-pagination
                v-model="currentPage"
                :length="imageStats.total_pages"
                @update:model-value="loadImages"
              />
            </div>
          </div>

          <!-- 新上传图片展示 -->
          <div v-if="uploadedImages.length > 0" class="images-grid">
            <h2 class="text-h5 mb-4">本次上传的图片</h2>
            <v-card
              v-for="(image, index) in uploadedImages"
              :key="index"
              class="image-card"
              elevation="2"
            >
              <v-img
                :src="image.url"
                :alt="image.alt"
                height="200"
                cover
                class="image-preview"
              >
                <template v-slot:placeholder>
                  <div class="d-flex align-center justify-center fill-height">
                    <v-progress-circular
                      color="grey-lighten-4"
                      indeterminate
                    />
                  </div>
                </template>
              </v-img>
              
              <v-card-text class="pa-3">
                <div class="text-body-2 font-weight-medium mb-1">
                  {{ image.title }}
                </div>
                <div class="text-caption text-grey">
                  {{ formatFileSize(image.size) }}
                </div>
              </v-card-text>
              
              <v-card-actions class="pa-3 pt-0">
                <v-btn
                  size="small"
                  variant="text"
                  prepend-icon="mdi-content-copy"
                  @click="copyImageUrl(image.url)"
                >
                  复制链接
                </v-btn>
                <v-btn
                  size="small"
                  variant="text"
                  prepend-icon="mdi-open-in-new"
                  @click="openImage(image.url)"
                >
                  查看
                </v-btn>
                <v-spacer />
                <v-btn
                  size="small"
                  variant="text"
                  color="error"
                  prepend-icon="mdi-delete"
                  @click="confirmDelete(image, index)"
                >
                  删除
                </v-btn>
              </v-card-actions>
            </v-card>
          </div>
          
          <!-- 空状态 -->
          <div v-else-if="!showUploadDialog && existingImages.length === 0 && !loadingImages" class="empty-state text-center py-12">
            <v-icon size="64" color="grey-lighten-2" class="mb-4">
              mdi-image-multiple
            </v-icon>
            <h3 class="text-h6 mb-2">还没有上传任何图片</h3>
            <p class="text-body-2 text-grey mb-4">
              点击上方的"上传图片"按钮开始上传
            </p>
            <v-btn
              color="primary"
              prepend-icon="mdi-plus"
              @click="showUploadDialog = true"
            >
              上传第一张图片
            </v-btn>
          </div>

          <!-- 加载状态 -->
          <div v-if="loadingImages" class="text-center py-12">
            <v-progress-circular
              indeterminate
              color="primary"
              size="64"
              class="mb-4"
            />
            <p class="text-body-1">正在加载图片...</p>
          </div>
        </v-col>
      </v-row>
    </v-container>
    
    <!-- 删除确认对话框 -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6">
          确认删除
        </v-card-title>
        <v-card-text>
          确定要删除图片 "{{ deleteTarget?.title }}" 吗？此操作不可撤销。
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="text"
            @click="deleteDialog = false"
          >
            取消
          </v-btn>
          <v-btn
            color="error"
            variant="text"
            @click="deleteImage"
            :loading="deleting"
          >
            删除
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <!-- 成功提示 -->
    <v-snackbar
      v-model="showSuccessSnackbar"
      color="success"
      timeout="3000"
    >
      {{ successMessage }}
    </v-snackbar>
    
    <!-- 错误提示 -->
    <v-snackbar
      v-model="showErrorSnackbar"
      color="error"
      timeout="5000"
    >
      {{ errorMessage }}
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import ImageUpload from '../components/ImageUpload.vue'
import { deleteImage as deleteImageApi, getImageList } from '../api'
import { getCdnUrl, getRawUrl, convertToCdnUrl } from '../utils/cdn'
import { useUserStore } from '../stores/user'

// 用户状态
const userStore = useUserStore()
const isAuthenticated = computed(() => userStore.isAuthenticated)

// 响应式数据
const showUploadDialog = ref(false)
const uploadedImages = ref([])
const existingImages = ref([])
const loadingImages = ref(false)
const currentPage = ref(1)
const imageStats = ref({
  total: 0,
  total_pages: 0
})
const deleteDialog = ref(false)
const deleteTarget = ref(null)
const deleteIndex = ref(-1)
const deleting = ref(false)
const showSuccessSnackbar = ref(false)
const showErrorSnackbar = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

// CDN相关
const selectedCdnProvider = ref('jsdelivr')
const cdnProviders = [
  { title: 'jsDelivr CDN', value: 'jsdelivr' },
  { title: 'Statically CDN', value: 'statically' },
  { title: 'GitHack CDN', value: 'githack' },
  { title: '原始链接', value: 'raw' }
]

// 格式化文件大小
const formatFileSize = (bytes) => {
  if (!bytes) return '未知大小'
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 组件是否已卸载的标志
let isUnmounted = false

// 加载已有图片
const loadImages = async (page = 1) => {
  if (isUnmounted) return // 如果组件已卸载，直接返回

  loadingImages.value = true

  try {
    const response = await getImageList(page, 20)

    // 检查组件是否在请求期间被卸载
    if (isUnmounted) return

    if (response && response.data && response.data.success) {
      existingImages.value = response.data.data.images
      imageStats.value = {
        total: response.data.data.total,
        total_pages: response.data.data.total_pages
      }
      currentPage.value = page
    } else {
      console.error('API响应格式错误:', response)
      errorMessage.value = '获取图片列表失败，请检查网络连接'
      showErrorSnackbar.value = true
    }
  } catch (error) {
    // 检查组件是否在请求期间被卸载
    if (isUnmounted) return

    console.error('加载图片失败:', error)

    // 更详细的错误处理
    if (error.response) {
      if (error.response.status === 401) {
        errorMessage.value = '认证失败，请重新登录'
      } else if (error.response.status === 403) {
        errorMessage.value = '权限不足，无法访问图片管理'
      } else {
        errorMessage.value = `服务器错误: ${error.response.status}`
      }
    } else if (error.request) {
      errorMessage.value = '网络连接失败，请检查网络设置'
    } else {
      errorMessage.value = '加载图片失败，请重试'
    }

    showErrorSnackbar.value = true
  } finally {
    if (!isUnmounted) {
      loadingImages.value = false
    }
  }
}

// 处理上传成功
const handleUploadSuccess = (results) => {
  uploadedImages.value.unshift(...results)
  successMessage.value = `成功上传 ${results.length} 张图片`
  showSuccessSnackbar.value = true
  // 重新加载图片列表
  loadImages(currentPage.value)
}

// 处理上传错误
const handleUploadError = (error) => {
  console.error('上传失败:', error)
  errorMessage.value = '图片上传失败，请重试'
  showErrorSnackbar.value = true
}

// 复制图片URL
const copyImageUrl = async (url) => {
  try {
    await navigator.clipboard.writeText(url)
    successMessage.value = '图片链接已复制到剪贴板'
    showSuccessSnackbar.value = true
  } catch (err) {
    console.error('复制失败:', err)
    errorMessage.value = '复制失败，请手动复制'
    showErrorSnackbar.value = true
  }
}

// 打开图片
const openImage = (url) => {
  window.open(url, '_blank')
}

// 确认删除新上传的图片
const confirmDelete = (image, index) => {
  deleteTarget.value = image
  deleteIndex.value = index
  deleteDialog.value = true
}

// 确认删除已有图片
const confirmDeleteExisting = (image, index) => {
  deleteTarget.value = image
  deleteIndex.value = index
  deleteDialog.value = true
}

// 删除图片
const deleteImage = async () => {
  if (!deleteTarget.value || deleteIndex.value === -1) return

  deleting.value = true
  try {
    const filePath = deleteTarget.value.path || `${deleteTarget.value.filename}`
    const response = await deleteImageApi(filePath)
    if (response.data.success) {
      // 如果是新上传的图片，从uploadedImages中删除
      if (uploadedImages.value.includes(deleteTarget.value)) {
        uploadedImages.value.splice(deleteIndex.value, 1)
      } else {
        // 如果是已有图片，从existingImages中删除并重新加载
        existingImages.value.splice(deleteIndex.value, 1)
        loadImages(currentPage.value)
      }
      successMessage.value = '图片删除成功'
      showSuccessSnackbar.value = true
    } else {
      throw new Error(response.data.message || '删除失败')
    }
  } catch (error) {
    console.error('删除失败:', error)
    errorMessage.value = error.message || '删除失败，请重试'
    showErrorSnackbar.value = true
  } finally {
    deleting.value = false
    deleteDialog.value = false
    deleteTarget.value = null
    deleteIndex.value = -1
  }
}

// 获取当前图片URL（根据选择的CDN提供商）
const getCurrentImageUrl = (image) => {
  if (selectedCdnProvider.value === 'raw') {
    return image.raw_url || image.download_url
  } else if (selectedCdnProvider.value === 'jsdelivr' && image.cdn_url) {
    return image.cdn_url
  } else if (image.download_url) {
    // 如果后端没有提供CDN URL，前端生成
    const filename = image.name
    if (selectedCdnProvider.value === 'jsdelivr') {
      return getCdnUrl(filename, 'jsdelivr')
    } else if (selectedCdnProvider.value === 'statically') {
      return getCdnUrl(filename, 'statically')
    } else if (selectedCdnProvider.value === 'githack') {
      return getCdnUrl(filename, 'githack')
    }
  }
  return image.download_url
}

// 切换CDN提供商
const switchCdnProvider = (provider) => {
  selectedCdnProvider.value = provider
  console.log('切换CDN提供商:', provider)
}

// 组件挂载时加载图片
onMounted(() => {
  isUnmounted = false
  loadImages()
})

// 组件卸载时清理
onUnmounted(() => {
  isUnmounted = true
  // 清理响应式数据
  existingImages.value = []
  uploadedImages.value = []
  loadingImages.value = false
  showUploadDialog.value = false
})
</script>

<style scoped>
.image-manager {
  min-height: 100vh;
  background: linear-gradient(135deg,
    rgba(var(--pearl-white), 1) 0%,
    rgba(var(--mist-gray-light), 0.5) 100%);
  transition: background 0.2s ease;
}

.images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.image-card {
  transition: all 0.3s ease;
  background: rgba(var(--pearl-white), 0.9) !important;
  border: 1px solid rgba(var(--mist-gray), 0.3) !important;
  backdrop-filter: var(--blur-sm);
  -webkit-backdrop-filter: var(--blur-sm);
}

.image-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(var(--prussian-blue), 0.15);
  border-color: rgba(var(--prussian-blue), 0.3) !important;
}

.image-preview {
  cursor: pointer;
}

.empty-state {
  background: rgba(var(--pearl-white), 0.9);
  border: 1px solid rgba(var(--mist-gray), 0.2);
  border-radius: var(--radius-organic-md);
  margin: 20px 0;
  backdrop-filter: var(--blur-sm);
  -webkit-backdrop-filter: var(--blur-sm);
}

/* === 暗色模式适配 === */
.v-theme--dark .image-manager {
  background: linear-gradient(135deg,
    rgba(var(--charcoal), 0.95) 0%,
    rgba(var(--charcoal-light), 0.9) 50%,
    rgba(var(--prussian-blue), 0.1) 100%);
}

.v-theme--dark .image-card {
  background: linear-gradient(135deg,
    rgba(var(--charcoal), 0.95) 0%,
    rgba(var(--charcoal-light), 0.9) 100%) !important;
  border: 1px solid rgba(var(--mist-gray-dark), 0.3) !important;
  color: rgba(255, 255, 255, 0.9) !important;
}

.v-theme--dark .image-card:hover {
  border-color: rgba(var(--prussian-blue), 0.5) !important;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
}

.v-theme--dark .empty-state {
  background: linear-gradient(135deg,
    rgba(var(--charcoal), 0.95) 0%,
    rgba(var(--charcoal-light), 0.9) 100%);
  border: 1px solid rgba(var(--mist-gray-dark), 0.3);
  color: rgba(255, 255, 255, 0.9);
}

/* 响应式优化 */
@media (max-width: 768px) {
  .images-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .images-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}
</style>
