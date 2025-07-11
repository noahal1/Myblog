<template>
  <div class="test-upload pa-6">
    <h1>图片上传测试</h1>
    
    <v-file-input
      v-model="selectedFile"
      label="选择图片文件"
      accept="image/*"
      @change="handleFileChange"
      class="mb-4"
    />
    
    <v-btn 
      @click="testUpload" 
      :loading="uploading"
      color="primary"
      class="mb-4"
    >
      测试上传
    </v-btn>
    
    <v-card v-if="result" class="mb-4">
      <v-card-title>上传结果</v-card-title>
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
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { uploadImage } from '../api'

const selectedFile = ref(null)
const uploading = ref(false)
const result = ref(null)
const error = ref(null)

const handleFileChange = () => {
  result.value = null
  error.value = null
}

const testUpload = async () => {
  if (!selectedFile.value || selectedFile.value.length === 0) {
    error.value = '请选择文件'
    return
  }
  
  uploading.value = true
  result.value = null
  error.value = null
  
  try {
    console.log('开始测试上传:', selectedFile.value[0])
    const response = await uploadImage(selectedFile.value[0])
    console.log('上传响应:', response)
    result.value = response
  } catch (err) {
    console.error('上传失败:', err)
    error.value = {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status
    }
  } finally {
    uploading.value = false
  }
}
</script>

<style scoped>
.test-upload {
  max-width: 800px;
  margin: 0 auto;
}

pre {
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
