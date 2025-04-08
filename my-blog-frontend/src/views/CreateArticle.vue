<template>
  <div class="create-article">
    <v-container>
      <h1 class="text-h4 mb-6">创建新文章</h1>
      
      <v-form @submit.prevent="submitArticle" v-model="isFormValid">
        <v-text-field
          v-model="article.title"
          label="文章标题"
          :rules="[rules.required]"
          variant="outlined"
          class="mb-4"
        ></v-text-field>
        
        <v-textarea
          v-model="article.summary"
          label="文章摘要"
          :rules="[rules.required]"
          variant="outlined"
          rows="3"
          class="mb-4"
        ></v-textarea>
        
        <v-textarea
          v-model="article.content"
          label="文章内容"
          :rules="[rules.required]"
          variant="outlined"
          rows="10"
          class="mb-6"
        ></v-textarea>
        
        <v-btn
          type="submit"
          color="primary"
          size="large"
          :loading="loading"
          :disabled="!isFormValid"
        >
          发布文章
        </v-btn>
      </v-form>
    </v-container>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { createArticle } from '../api'

const router = useRouter()
const loading = ref(false)
const isFormValid = ref(false)

const article = ref({
  title: '',
  summary: '',
  content: ''
})

const rules = {
  required: v => !!v || '该字段为必填项'
}

const submitArticle = async () => {
  loading.value = true
  
  try {
    const response = await createArticle(article.value)
    console.log('文章创建成功:', response.data)
    router.push(`/article/${response.data.id}`)
  } catch (error) {
    console.error('创建文章失败:', error)
    alert('创建文章失败: ' + (error.response?.data?.detail || '未知错误'))
  } finally {
    loading.value = false
  }
}
</script> 