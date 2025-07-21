<template>
  <div class="create-article animated fadeIn">
    <v-container class="py-8">
      <v-card class="create-article-card mx-auto animated slideInUp" max-width="1000" elevation="4">
        <div class="card-header pa-6">
          <h1 class="text-h4 font-weight-bold gradient-text mb-2">创建新文章</h1>
          <p class="text-subtitle-1 text-medium-emphasis">在这里分享您的想法和知识</p>
        </div>
        
        <v-form ref="formRef" @submit.prevent="submitArticle" v-model="isFormValid" class="pa-6">
          <!-- 错误提示 -->
          <v-alert
            v-if="error"
            type="error"
            variant="tonal"
            closable
            class="mb-6"
            @click:close="error = null"
          >
            {{ error }}
          </v-alert>

          <v-text-field
            v-model="article.title"
            label="文章标题"
            required
            variant="outlined"
            prepend-inner-icon="mdi-format-title"
            class="mb-6 animated fadeIn"
            :rules="[v => !!v || '标题不能为空']"
            placeholder="输入一个吸引人的标题"
          ></v-text-field>
          
          
          <!-- Markdown 编辑器 -->
          <div class="mb-6 animated fadeIn" style="animation-delay:0.2s;">
            <label class="text-subtitle-1 mb-2 d-block">文章内容</label>

            <!-- 图片操作按钮 -->
            <div class="mb-3">
              <ImagePicker @select="insertSelectedImages" />
              <v-btn
                variant="outlined"
                prepend-icon="mdi-upload"
                @click="triggerImageUpload"
              >
                上传新图片
              </v-btn>
            </div>

            <MdEditor
              v-model="article.content"
              :theme="editorTheme"
              previewTheme="github"
              :autoFocus="false"
              @onChange="checkFormValidity"
              @onUploadImg="handleMarkdownImageUpload"
              style="height: 500px"
              codeTheme="github"
              :toolbars="['bold','underline','italic','strikeThrough','title','sub','sup','quote','unorderedList','orderedList','task','codeRow','code','link','image','table','mermaid','katex','revoke','next','save','prettier','pageFullscreen','fullscreen','preview','htmlPreview','catalog']"
            />
          </div>
          
          <v-textarea
            v-model="article.summary"
            label="文章摘要"
            required
            variant="outlined"
            rows="3"
            class="mb-6 animated fadeIn"
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
            class="mb-6 animated fadeIn"
            :loading="tagsLoading"
            :error-messages="tagsError"
            prepend-inner-icon="mdi-tag-multiple"
            placeholder="选择或创建新标签"
          >
            <template v-slot:prepend-item>
              <v-list-item>
                <v-text-field
                  v-model="newTagName"
                  label="创建新标签"
                  variant="outlined"
                  density="compact"
                  hide-details
                  class="mx-2"
                  :loading="creatingTag"
                  append-inner-icon="mdi-plus"
                  @click:append-inner="createNewTag"
                  @keyup.enter="createNewTag"
                ></v-text-field>
              </v-list-item>
              <v-divider class="mt-2"></v-divider>
            </template>
            <template v-slot:chip="{ props, item }">
              <v-chip
                v-bind="props"
                :color="getTagColor(item.raw.name)"
                class="ma-1"
              >
                {{ item.raw.name }}
              </v-chip>
            </template>
          </v-autocomplete>
          
          <v-switch
            v-model="article.is_knowledge_base"
            color="primary"
            label="添加到知识库"
            hint="知识库文章将在知识库页面展示，用于整理技术笔记和教程"
            persistent-hint
            class="mb-6 animated fadeIn"
          ></v-switch>
          
          <div class="d-flex justify-space-between mt-6">
            <v-btn
              variant="outlined"
              color="secondary"
              @click="router.go(-1)"
              prepend-icon="mdi-arrow-left"
              class="animated fadeIn"
            >
              返回
            </v-btn>
            
            <div>
              <v-btn
                variant="outlined"
                color="secondary"
                class="me-2 animated fadeIn"
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
                class="px-6 animated fadeIn"
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
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getTags, createArticle, createTag, uploadImage } from '../api'
import { MdEditor } from 'md-editor-v3'
import ImagePicker from '../components/ImagePicker.vue'
import { useTheme } from 'vuetify'
import { useUserStore } from '../stores/user'
import 'md-editor-v3/lib/style.css'
import '@mdi/font/css/materialdesignicons.min.css'
import '../assets/animate.css'
import 'katex/dist/katex.min.css'
import 'highlight.js/styles/github.css'


const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)
const savingDraft = ref(false)
const isFormValid = ref(false)
const formRef = ref(null)
const error = ref(null)
const theme = useTheme()

// 封面图片
const coverImage = ref(null)
const coverImagePreview = ref(null)
const uploadingImage = ref(false)

// 编辑器主题
const editorTheme = computed(() => {
  try {
    return theme.global.current.value?.dark ? 'dark' : 'light'
  } catch (e) {
    console.warn('无法获取主题状态:', e)
    return 'light'
  }
})

const article = ref({
  title: '',
  content: '',
  summary: '',
  tags: [],
  cover_image: '',
  is_published: true,
  is_knowledge_base: false
})

const availableTags = ref([])
const tagsLoading = ref(false)
const tagsError = ref(null)
const newTagName = ref('')
const creatingTag = ref(false)

// 封面图片上传处理
const handleCoverImageUpload = async () => {
  if (!coverImage.value || coverImage.value.length === 0) {
    coverImagePreview.value = null
    article.value.cover_image = ''
    return
  }
  
  const file = coverImage.value[0]
  
  // 创建本地预览
  coverImagePreview.value = URL.createObjectURL(file)
  
  // 上传图片到服务器
  uploadingImage.value = true
  try {
    // API调用
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

// Markdown编辑器图片上传处理
const handleMarkdownImageUpload = async (files, callback) => {
  try {
    const uploadPromises = files.map(async (file) => {
      try {
        console.log('开始上传图片:', file.name)
        const response = await uploadImage(file)
        console.log('图片上传响应:', response)

        if (response && response.data && response.data.success) {
          return {
            url: response.data.data.url,
            alt: response.data.data.original_name || file.name,
            title: response.data.data.original_name || file.name
          }
        } else {
          console.error('上传响应格式错误:', response)
          throw new Error(response?.data?.message || '上传失败')
        }
      } catch (error) {
        console.error('图片上传失败:', error)
        throw error
      }
    })

    const results = await Promise.all(uploadPromises)
    console.log('所有图片上传完成:', results)
    callback(results)
  } catch (error) {
    console.error('批量上传图片失败:', error)
    // 如果上传失败，传递空数组给回调
    callback([])
  }
}

// 插入选择的图片
const insertSelectedImages = (images) => {
  const markdownImages = images.map(image =>
    `![${image.alt}](${image.url})`
  ).join('\n\n')

  // 在当前光标位置插入图片
  const currentContent = article.value.content
  article.value.content = currentContent + '\n\n' + markdownImages + '\n\n'
}

// 触发图片上传（可以用于打开文件选择器）
const triggerImageUpload = () => {
  // 这个功能可以通过MdEditor的工具栏实现，这里只是一个占位符
  console.log('触发图片上传')
}

// 获取标签列表
const fetchTags = async () => {
  tagsLoading.value = true
  try {
    const response = await getTags()
    availableTags.value = response.data
  } catch (error) {
    tagsError.value = '获取标签失败，请稍后重试'
    console.error('获取标签失败:', error)
  } finally {
    tagsLoading.value = false
  }
}

// 创建新标签
const createNewTag = async () => {
  if (!newTagName.value.trim()) return
  
  creatingTag.value = true
  try {
    const response = await createTag(newTagName.value.trim())
    const newTag = response.data
    availableTags.value.push(newTag)
    article.value.tags.push(newTag.id)
    newTagName.value = ''
  } catch (error) {
    console.error('创建标签失败:', error)
  } finally {
    creatingTag.value = false
  }
}

// 获取标签颜色
const getTagColor = (tagName) => {
  const colors = ['primary', 'secondary', 'success', 'info', 'warning']
  const hash = tagName.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc)
  }, 0)
  return colors[Math.abs(hash) % colors.length]
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
  error.value = null
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
    // 重置表单验证状态，允许用户重新输入
    if (formRef.value) {
      formRef.value.resetValidation()
    }
  } finally {
    savingDraft.value = false
  }
}

// 提交文章
const submitArticle = async () => {
  if (!isFormValid.value) {
    error.value = '请填写所有必填字段'
    // 重置表单验证状态，允许用户重新输入
    if (formRef.value) {
      formRef.value.resetValidation()
    }
    return
  }

  loading.value = true
  error.value = null
  try {
    // 确保发布状态为true
    article.value.is_published = true

    const response = await createArticle(article.value)
    // 清除草稿
    localStorage.removeItem('article_draft')
    router.push(`/article/${response.data.id}`)
  } catch (err) {
    console.error('发布文章失败:', err)
    error.value = '发布文章失败，请重试'
    // 重置表单验证状态，允许用户重新输入
    if (formRef.value) {
      formRef.value.resetValidation()
    }
  } finally {
    loading.value = false
  }
}

// 监听内容变化以验证表单
watch([() => article.value.title, () => article.value.content, () => article.value.summary], 
  () => checkFormValidity())

// 定时器引用
let draftSaveInterval = null

onMounted(() => {
  // 检查用户认证状态
  if (!userStore.isAuthenticated) {
    router.push('/login')
    return
  }

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
  draftSaveInterval = setInterval(() => {
    if (article.value && (article.value.title || article.value.content)) {
      localStorage.setItem('article_draft', JSON.stringify(article.value))
    }
  }, 30000) // 每30秒保存一次
})

// 组件卸载时清理
onUnmounted(() => {
  if (draftSaveInterval) {
    clearInterval(draftSaveInterval)
    draftSaveInterval = null
  }
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

.v-chip {
  transition: all 0.3s ease;
}
.v-chip:hover {
  transform: scale(1.05);
}
</style>