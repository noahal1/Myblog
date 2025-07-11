<template>
  <v-dialog v-model="dialog" max-width="1200px" scrollable @update:model-value="onDialogChange">
    <template v-slot:activator="{ props }">
      <v-btn
        v-bind="props"
        variant="outlined"
        prepend-icon="mdi-image-multiple"
        class="mr-2"
      >
        选择已有图片
      </v-btn>
    </template>
    
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2">mdi-image-multiple</v-icon>
        选择图片
        <v-spacer />
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="dialog = false"
        />
      </v-card-title>
      
      <v-card-text style="height: 600px;">
        <!-- 搜索和筛选 -->
        <div class="d-flex align-center mb-4">
          <v-text-field
            v-model="searchQuery"
            label="搜索图片名称"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            hide-details
            class="mr-4"
            @input="filterImages"
          />
          <v-select
            v-model="sortBy"
            :items="sortOptions"
            label="排序方式"
            variant="outlined"
            density="compact"
            hide-details
            @update:model-value="sortImages"
          />
        </div>
        
        <!-- 加载状态 -->
        <div v-if="loading" class="text-center py-8">
          <v-progress-circular
            indeterminate
            color="primary"
            size="64"
            class="mb-4"
          />
          <p class="text-body-1">正在加载图片...</p>
        </div>
        
        <!-- 图片网格 -->
        <div v-else-if="filteredImages.length > 0" class="images-grid">
          <v-card
            v-for="image in filteredImages"
            :key="image.sha"
            class="image-card"
            :class="{ 'selected': selectedImages.includes(image) }"
            @click="toggleSelection(image)"
            elevation="2"
          >
            <div class="image-container">
              <v-img
                :src="image.download_url"
                :alt="image.name"
                height="150"
                cover
                class="image-preview"
              >
                <template v-slot:placeholder>
                  <div class="d-flex align-center justify-center fill-height">
                    <v-progress-circular
                      color="grey-lighten-4"
                      indeterminate
                      size="32"
                    />
                  </div>
                </template>
              </v-img>
              
              <!-- 选中状态覆盖层 -->
              <div v-if="selectedImages.includes(image)" class="selection-overlay">
                <v-icon color="white" size="32">mdi-check-circle</v-icon>
              </div>
            </div>
            
            <v-card-text class="pa-2">
              <div class="text-caption font-weight-medium text-truncate">
                {{ image.name }}
              </div>
              <div class="text-caption text-grey">
                {{ formatFileSize(image.size) }}
              </div>
            </v-card-text>
          </v-card>
        </div>
        
        <!-- 空状态 -->
        <div v-else class="text-center py-8">
          <v-icon size="64" color="grey-lighten-2" class="mb-4">
            mdi-image-off
          </v-icon>
          <h3 class="text-h6 mb-2">没有找到图片</h3>
          <p class="text-body-2 text-grey">
            {{ searchQuery ? '尝试调整搜索条件' : '还没有上传任何图片' }}
          </p>
        </div>
        
        <!-- 分页 -->
        <div v-if="totalPages > 1" class="d-flex justify-center mt-4">
          <v-pagination
            v-model="currentPage"
            :length="totalPages"
            @update:model-value="loadImages"
          />
        </div>
      </v-card-text>
      
      <v-card-actions>
        <div class="d-flex align-center">
          <span class="text-body-2 text-grey mr-4">
            已选择 {{ selectedImages.length }} 张图片
          </span>
          <v-spacer />
          <v-btn
            variant="text"
            @click="dialog = false"
          >
            取消
          </v-btn>
          <v-btn
            color="primary"
            :disabled="selectedImages.length === 0"
            @click="confirmSelection"
          >
            确定选择
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getImageList } from '../api'
import { useUserStore } from '../stores/user'

const props = defineProps({
  multiple: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['select'])

// 用户状态
const userStore = useUserStore()

// 响应式数据
const dialog = ref(false)
const loading = ref(false)
const images = ref([])
const selectedImages = ref([])
const searchQuery = ref('')
const sortBy = ref('newest')
const currentPage = ref(1)
const totalPages = ref(0)

// 排序选项
const sortOptions = [
  { title: '最新上传', value: 'newest' },
  { title: '最旧上传', value: 'oldest' },
  { title: '文件名 A-Z', value: 'name_asc' },
  { title: '文件名 Z-A', value: 'name_desc' },
  { title: '文件大小 大-小', value: 'size_desc' },
  { title: '文件大小 小-大', value: 'size_asc' }
]

// 过滤后的图片
const filteredImages = computed(() => {
  let result = [...images.value]
  
  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(image => 
      image.name.toLowerCase().includes(query)
    )
  }
  
  // 排序
  switch (sortBy.value) {
    case 'oldest':
      result.sort((a, b) => (a.created_at || '').localeCompare(b.created_at || ''))
      break
    case 'name_asc':
      result.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'name_desc':
      result.sort((a, b) => b.name.localeCompare(a.name))
      break
    case 'size_desc':
      result.sort((a, b) => b.size - a.size)
      break
    case 'size_asc':
      result.sort((a, b) => a.size - b.size)
      break
    case 'newest':
    default:
      result.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''))
      break
  }
  
  return result
})

// 格式化文件大小
const formatFileSize = (bytes) => {
  if (!bytes) return '未知大小'
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 加载图片列表
const loadImages = async (page = 1) => {
  loading.value = true
  console.log('开始加载图片列表，页码:', page)

  try {
    const response = await getImageList(page, 50) // 加载更多图片用于选择
    console.log('图片列表API响应:', response)

    if (response && response.data && response.data.success) {
      images.value = response.data.data.images
      totalPages.value = response.data.data.total_pages
      currentPage.value = page
      console.log('成功加载图片:', images.value.length, '张')
    } else {
      console.error('API响应格式错误:', response)
      images.value = []
    }
  } catch (error) {
    console.error('加载图片失败:', error)
    images.value = []
  } finally {
    loading.value = false
  }
}

// 切换选择状态
const toggleSelection = (image) => {
  const index = selectedImages.value.findIndex(img => img.sha === image.sha)
  
  if (index > -1) {
    // 取消选择
    selectedImages.value.splice(index, 1)
  } else {
    // 选择图片
    if (props.multiple) {
      selectedImages.value.push(image)
    } else {
      selectedImages.value = [image]
    }
  }
}

// 确认选择
const confirmSelection = () => {
  const result = selectedImages.value.map(image => ({
    url: image.download_url,
    alt: image.name,
    title: image.name,
    filename: image.name,
    size: image.size
  }))
  
  emit('select', result)
  dialog.value = false
  selectedImages.value = []
}

// 过滤图片（搜索时调用）
const filterImages = () => {
  // 过滤逻辑在computed中处理
}

// 排序图片
const sortImages = () => {
  // 排序逻辑在computed中处理
}

// 监听对话框状态变化
const onDialogChange = (isOpen) => {
  if (isOpen && images.value.length === 0) {
    console.log('对话框打开，开始加载图片...')
    console.log('用户登录状态:', userStore.isLoggedIn)
    console.log('用户信息:', userStore.user)

    if (!userStore.isLoggedIn) {
      console.error('用户未登录，无法加载图片')
      return
    }

    loadImages()
  }
}

// 组件挂载时不加载图片，等用户打开对话框时再加载
onMounted(() => {
  console.log('ImagePicker组件已挂载')
})
</script>

<style scoped>
.images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
}

.image-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.image-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.image-card.selected {
  border-color: rgb(var(--v-theme-primary));
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.3);
}

.image-container {
  position: relative;
}

.selection-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(var(--v-theme-primary), 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px 4px 0 0;
}

.image-preview {
  border-radius: 4px 4px 0 0;
}
</style>
