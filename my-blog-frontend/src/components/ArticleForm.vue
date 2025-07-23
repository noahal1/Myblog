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

// 将标签名称数组转换为标签ID数组
const convertTagsToIds = (tagNames) => {
  if (!Array.isArray(tagNames) || tagNames.length === 0) {
    return []
  }

  // 如果已经是数字数组，直接返回
  if (typeof tagNames[0] === 'number') {
    return tagNames
  }

  // 如果是字符串数组，需要转换为ID数组
  if (availableTags.value.length === 0) {
    // 如果标签还没有加载，返回空数组，稍后会重新转换
    return []
  }

  return availableTags.value
    .filter(tag => tagNames.includes(tag.name))
    .map(tag => tag.id)
}

// 更新表单数据的函数
const updateFormData = (articleData) => {
  if (articleData) {
    console.log('更新表单数据:', articleData)
    form.value = {
      title: articleData.title || '',
      content: articleData.content || '',
      summary: articleData.summary || '',
      tags: convertTagsToIds(articleData.tags || [])
    }
    console.log('表单数据已更新:', form.value)
  }
}

watch(() => props.article, updateFormData, { immediate: true })

const fetchTags = async () => {
  loadingTags.value = true
  try {
    const res = await getTags()
    availableTags.value = res.data || []
    console.log('标签加载完成:', availableTags.value)

    // 如果有文章数据，重新更新表单数据（包括标签转换）
    if (props.article) {
      updateFormData(props.article)
    }
  } catch (e) {
    console.error('获取标签失败:', e)
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
