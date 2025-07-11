<template>
  <v-form ref="formRef" @submit.prevent="onSubmit" v-model="isFormValid" class="pa-6">
    <v-text-field
      v-model="form.title"
      label="文章标题"
      required
      variant="outlined"
      :rules="[v => !!v || '标题不能为空']"
      class="mb-4"
    />
    <v-textarea
      v-model="form.summary"
      label="文章摘要"
      required
      variant="outlined"
      rows="3"
      class="mb-4"
      :rules="[v => !!v || '摘要不能为空']"
    />
    <MdEditor
      v-model="form.content"
      :theme="editorTheme"
      previewTheme="github"
      style="height: 400px"
      codeTheme="github"
      class="mb-4"
      @onUploadImg="handleImageUpload"
    />
    <v-autocomplete
      v-model="form.tags"
      :items="availableTags"
      item-title="name"
      item-value="id"
      label="文章标签"
      variant="outlined"
      chips
      multiple
      closable-chips
      class="mb-4"
      :loading="loadingTags"
      placeholder="选择相关标签"
    />
    <div class="d-flex justify-end">
      <v-btn color="primary" type="submit" :loading="loading" :disabled="!isFormValid">
        保存
      </v-btn>
    </div>
  </v-form>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { getTags, uploadImage } from '../api'
import { MdEditor } from 'md-editor-v3'
import { useTheme } from 'vuetify'
import 'md-editor-v3/lib/style.css'

const props = defineProps({
  article: {
    type: Object,
    default: () => ({ title: '', content: '', summary: '', tags: [] })
  },
  loading: Boolean
})
const emit = defineEmits(['submit'])

const theme = useTheme()
const editorTheme = computed(() => {
  try {
    return theme.global.current.value?.dark ? 'dark' : 'light'
  } catch (e) {
    console.warn('无法获取主题状态:', e)
    return 'light'
  }
})

const isFormValid = ref(false)
const formRef = ref(null)
const loadingTags = ref(false)
const availableTags = ref([])

const form = ref({
  title: '',
  content: '',
  summary: '',
  tags: []
})

watch(() => props.article, (val) => {
  if (val) {
    form.value = {
      title: val.title || '',
      content: val.content || '',
      summary: val.summary || '',
      tags: val.tags || []
    }
  }
}, { immediate: true })

const fetchTags = async () => {
  loadingTags.value = true
  try {
    const res = await getTags()
    availableTags.value = res.data || []
  } catch (e) {
    availableTags.value = []
  } finally {
    loadingTags.value = false
  }
}

onMounted(fetchTags)

// Markdown编辑器图片上传处理
const handleImageUpload = async (files, callback) => {
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

const onSubmit = () => {
  if (!isFormValid.value) {
    // 重置表单验证状态，允许用户重新输入
    if (formRef.value) {
      formRef.value.resetValidation()
    }
    return
  }
  emit('submit', { ...form.value })
}

// 暴露重置验证方法给父组件
const resetValidation = () => {
  if (formRef.value) {
    formRef.value.resetValidation()
  }
}

// 暴露方法给父组件
defineExpose({
  resetValidation
})
</script>
