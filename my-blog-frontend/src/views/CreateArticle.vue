<template>
  <div class="create-article">
    <v-container class="py-8">
      <v-card class="create-article-card mx-auto" max-width="1000" elevation="4">
        <div class="card-header pa-6">
          <h1 class="text-h4 font-weight-bold gradient-text mb-2">创建新文章</h1>
          <p class="text-subtitle-1 text-medium-emphasis">在这里分享您的想法和知识</p>
        </div>
        
        <v-form @submit.prevent="submitArticle" v-model="isFormValid" class="pa-6">
          <v-text-field
            v-model="article.title"
            label="文章标题"
            required
            variant="outlined"
            prepend-inner-icon="mdi-format-title"
            class="mb-6"
            :rules="[v => !!v || '标题不能为空']"
            placeholder="输入一个吸引人的标题"
          ></v-text-field>
          
          <!-- 图片上传 -->
          <div class="mb-6">
            <label class="text-subtitle-1 mb-2 d-block">文章封面</label>
            <div class="d-flex align-center cover-upload">
              <v-img
                v-if="coverImagePreview"
                :src="coverImagePreview"
                height="150"
                width="280"
                cover
                class="rounded me-4"
              ></v-img>
              <div v-else class="image-placeholder d-flex justify-center align-center rounded me-4">
                <v-icon size="40" color="grey-lighten-1">mdi-image</v-icon>
              </div>
              
              <div>
                <v-file-input
                  v-model="coverImage"
                  accept="image/*"
                  label="选择封面图片"
                  variant="outlined"
                  density="compact"
                  prepend-icon="mdi-camera"
                  @update:model-value="handleImageUpload"
                  hide-details
                ></v-file-input>
                <p class="text-caption mt-2 text-grey">
                  建议尺寸: 1200x600，支持 JPG、PNG、WebP 格式
                </p>
              </div>
            </div>
          </div>
          
          <!-- Markdown 编辑器 -->
          <div class="mb-6">
            <label class="text-subtitle-1 mb-2 d-block">文章内容</label>
            <MdEditor
              v-model="article.content"
              :theme="editorTheme"
              :toolbarsExclude="toolbarsExclude"
              previewTheme="github"
              :autoFocus="false"
              @onChange="checkFormValidity"
              style="height: 500px"
              codeTheme="github"
              :showCodeRowNumber="true"
              :autoDetectCode="true"
              :footers="[]"
              :tabWidth="2"
              outlined
            />
          </div>
          
          <v-textarea
            v-model="article.summary"
            label="文章摘要"
            required
            variant="outlined"
            rows="3"
            class="mb-6"
            :rules="[v => !!v || '摘要不能为空']"
            placeholder="简要概述文章内容，会显示在文章列表中"
            prepend-inner-icon="mdi-text-short"
          ></v-textarea>
          
          <v-autocomplete
            v-model="article.tags"
            :items="availableTags"
            item-title="name"
            item-value="id"
            label="文章标签"
            variant="outlined"
            chips
            multiple
            closable-chips
            class="mb-6"
            :loading="loading"
            :error-messages="error"
            prepend-inner-icon="mdi-tag-multiple"
            placeholder="选择相关标签"
          ></v-autocomplete>
          
          <!-- 分类和高级选项 -->
          <div class="d-flex flex-wrap gap-4 mb-6">
            <v-select
              v-model="article.category"
              :items="categories"
              label="文章分类"
              variant="outlined"
              class="flex-grow-1"
              prepend-inner-icon="mdi-folder"
            ></v-select>
            
            <v-checkbox
              v-model="article.is_published"
              label="立即发布"
              class="mt-5"
              hide-details
            ></v-checkbox>
          </div>
          
          <div class="d-flex justify-space-between mt-6">
            <v-btn
              variant="outlined"
              color="secondary"
              @click="router.go(-1)"
              prepend-icon="mdi-arrow-left"
            >
              返回
            </v-btn>
            
            <div>
              <v-btn
                variant="outlined"
                color="secondary"
                class="me-2"
                @click="saveAsDraft"
                :loading="savingDraft"
                prepend-icon="mdi-content-save"
              >
                保存草稿
              </v-btn>
              
              <v-btn
                type="submit"
                color="primary"
                :loading="loading"
                :disabled="!isFormValid"
                size="large"
                prepend-icon="mdi-send"
                elevation="2"
                class="px-6"
              >
                发布文章
              </v-btn>
            </div>
          </div>
        </v-form>
      </v-card>
    </v-container>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '../api'
import { getTags, createArticle } from '../api'
import MdEditor from 'md-editor-v3'
import { useTheme } from 'vuetify'
import 'md-editor-v3/lib/style.css'

const router = useRouter()
const loading = ref(false)
const savingDraft = ref(false)
const isFormValid = ref(false)
const error = ref(null)
const theme = useTheme()

// 封面图片
const coverImage = ref(null)
const coverImagePreview = ref(null)
const uploadingImage = ref(false)

// 编辑器主题
const editorTheme = computed(() => {
  return theme.global.current.value.dark ? 'dark' : 'light'
})

// 不需要的工具栏按钮
const toolbarsExclude = ['save']

const article = ref({
  title: '',
  content: '',
  summary: '',
  tags: [],
  category: '',
  cover_image: '',
  is_published: true
})

const availableTags = ref([])

// 文章分类
const categories = [
  '前端开发',
  '后端技术',
  '人工智能',
  '数据科学',
  '产品设计',
  '职场成长',
  '读书笔记',
  '随笔感悟'
]

// 图片上传处理
const handleImageUpload = async () => {
  if (!coverImage.value || coverImage.value.length === 0) {
    coverImagePreview.value = null
    article.value.cover_image = ''
    return
  }
  
  const file = coverImage.value[0]
  
  // 创建本地预览
  coverImagePreview.value = URL.createObjectURL(file)
  
  // 这里应该有上传图片到服务器的代码
  // 模拟上传过程
  uploadingImage.value = true
  try {
    // 模拟API调用
    // const response = await uploadImage(file)
    // article.value.cover_image = response.data.url
    
    // 临时使用本地URL
    article.value.cover_image = coverImagePreview.value
  } catch (error) {
    console.error('上传图片失败:', error)
  } finally {
    uploadingImage.value = false
  }
}

// 获取标签列表
const fetchTags = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await getTags()
    availableTags.value = response.data
  } catch (err) {
    error.value = '获取标签失败'
    console.error('获取标签失败:', err)
    // 如果API调用失败，使用默认标签
    availableTags.value = [
      { id: 1, name: '前端开发' },
      { id: 2, name: '后端技术' },
      { id: 3, name: '随笔' },
      { id: 4, name: '诗歌' },
      { id: 5, name: '人工智能' }
    ]
  } finally {
    loading.value = false
  }
}

// 检查表单有效性
const checkFormValidity = () => {
  isFormValid.value = !!article.value.title && 
                      !!article.value.content && 
                      !!article.value.summary
}

// 保存为草稿
const saveAsDraft = async () => {
  savingDraft.value = true
  try {
    // 设置为草稿状态
    const draftData = { ...article.value, is_published: false }
    const response = await createArticle(draftData)
    
    // 显示成功消息
    alert('草稿保存成功!')
    
    // 可选：跳转到草稿管理页面
    // router.push('/drafts')
  } catch (err) {
    console.error('保存草稿失败:', err)
    error.value = '保存草稿失败，请重试'
  } finally {
    savingDraft.value = false
  }
}

// 提交文章
const submitArticle = async () => {
  if (!isFormValid.value) {
    error.value = '请填写所有必填字段'
    return
  }
  
  loading.value = true
  try {
    // 确保发布状态为true
    article.value.is_published = true
    
    const response = await createArticle(article.value)
    router.push(`/article/${response.data.id}`)
  } catch (err) {
    console.error('发布文章失败:', err)
    error.value = '发布文章失败，请重试'
  } finally {
    loading.value = false
  }
}

// 监听内容变化以验证表单
watch([() => article.value.title, () => article.value.content, () => article.value.summary], 
  () => checkFormValidity())

onMounted(() => {
  fetchTags()
  checkFormValidity()
  
  // 从本地存储恢复草稿
  const savedDraft = localStorage.getItem('article_draft')
  if (savedDraft) {
    try {
      const draftData = JSON.parse(savedDraft)
      article.value = { ...article.value, ...draftData }
      
      if (draftData.cover_image) {
        coverImagePreview.value = draftData.cover_image
      }
    } catch (e) {
      console.error('恢复草稿失败:', e)
    }
  }
  
  // 定期自动保存草稿
  setInterval(() => {
    if (article.value.title || article.value.content) {
      localStorage.setItem('article_draft', JSON.stringify(article.value))
    }
  }, 30000) // 每30秒保存一次
})
</script>

<style scoped>
.create-article {
  min-height: calc(100vh - 200px);
  background: radial-gradient(circle at 30% 30%, rgba(var(--primary-blue), 0.03), transparent 400px),
              radial-gradient(circle at 70% 70%, rgba(var(--accent-orange), 0.03), transparent 400px);
}

.create-article-card {
  backdrop-filter: blur(8px);
  background: rgba(var(--v-theme-surface), 0.9);
  border-radius: var(--border-radius);
  overflow: hidden;
  border: 1px solid rgba(var(--primary-blue), 0.1);
  transition: all var(--transition-default);
}

.create-article-card:hover {
  box-shadow: var(--hover-shadow);
  transform: translateY(-4px);
}

.card-header {
  background: linear-gradient(var(--gradient-angle), 
    rgba(var(--primary-blue), 0.05),
    rgba(var(--secondary-purple), 0.02));
  border-bottom: 1px solid rgba(var(--primary-blue), 0.07);
}

.gradient-text {
  background: var(--neon-gradient);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.image-placeholder {
  height: 150px;
  width: 280px;
  background-color: rgba(var(--v-theme-surface), 0.8);
  border: 2px dashed rgba(var(--primary-blue), 0.2);
}

.cover-upload {
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .cover-upload > div {
    margin-top: 16px;
    width: 100%;
  }
}

:deep(.md-editor) {
  border-radius: 8px !important;
  border-color: rgba(var(--primary-blue), 0.2) !important;
}

:deep(.md-editor-dark) {
  --md-border-color: rgba(255, 255, 255, 0.2) !important;
}
</style> 