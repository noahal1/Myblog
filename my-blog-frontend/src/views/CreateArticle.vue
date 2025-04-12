<template>
  <div class="create-article">
    <v-container class="py-8">
      <v-card class="create-article-card mx-auto" max-width="900" elevation="4">
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
          
          <v-textarea
            v-model="article.content"
            label="文章内容"
            required
            variant="outlined"
            rows="15"
            class="mb-6"
            :rules="[v => !!v || '内容不能为空']"
            placeholder="支持Markdown格式编写"
            prepend-inner-icon="mdi-text-box"
          ></v-textarea>
          
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
            placeholder="选择相关标签，可多选"
          ></v-autocomplete>
          
          <div class="d-flex justify-space-between mt-6">
            <v-btn
              variant="outlined"
              color="secondary"
              @click="router.go(-1)"
              prepend-icon="mdi-arrow-left"
            >
              返回
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
        </v-form>
      </v-card>
    </v-container>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '../api'

const router = useRouter()
const loading = ref(false)
const isFormValid = ref(false)
const error = ref(null)

const article = ref({
  title: '',
  content: '',
  summary: '',
  tags: []
})

const availableTags = ref([])

// 获取标签列表
const fetchTags = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await apiClient.get('/api/tags')
    if (!response.ok) {
      throw new Error('获取标签失败')
    }
    availableTags.value = await response.json()
  } catch (error) {
    error.value = error.message
    console.error('获取标签失败:', error)
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

// 提交文章
const submitArticle = async () => {
  loading.value = true
  try {
    const response = await apiClient.post('/api/articles', article.value)
    router.push(`/article/${response.data.id}`)
  } catch (error) {
    console.error('发布文章失败:', error)
    // 这里可以添加错误提示
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchTags()
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
</style> 