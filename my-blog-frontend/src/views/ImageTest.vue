<template>
  <v-container class="pa-6">
    <v-card class="pa-6">
      <v-card-title>图片显示测试</v-card-title>
      
      <v-divider class="my-4"></v-divider>
      
      <!-- 直接HTML图片测试 -->
      <h3>1. 直接HTML图片测试</h3>
      <img 
        src="https://cdn.jsdelivr.net/gh/Noahall1/imageblog@main/images/20250709_091601_4f27272a.jpg" 
        alt="测试图片" 
        style="max-width: 100%; height: auto; border-radius: 4px; margin: 1em 0;"
      />
      
      <v-divider class="my-4"></v-divider>
      
      <!-- Markdown渲染测试 -->
      <h3>2. Markdown渲染测试</h3>
      <div v-html="renderedMarkdown" class="markdown-body"></div>
      
      <v-divider class="my-4"></v-divider>
      
      <!-- 原始Markdown内容 -->
      <h3>3. 原始Markdown内容</h3>
      <pre>{{ markdownContent }}</pre>
      
      <v-divider class="my-4"></v-divider>
      
      <!-- 渲染后的HTML */
      <h3>4. 渲染后的HTML</h3>
      <pre>{{ renderedMarkdown }}</pre>
      
      <v-divider class="my-4"></v-divider>
      
      <!-- 网络测试 -->
      <h3>5. 网络连接测试</h3>
      <v-btn @click="testImageUrl" color="primary">测试图片URL</v-btn>
      <p v-if="urlTestResult">{{ urlTestResult }}</p>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { renderMarkdown } from '../utils/markdown'

const markdownContent = ref('![测试图片](https://cdn.jsdelivr.net/gh/Noahall1/imageblog@main/images/20250709_091601_4f27272a.jpg)')
const renderedMarkdown = ref('')
const urlTestResult = ref('')

onMounted(() => {
  renderedMarkdown.value = renderMarkdown(markdownContent.value)
  console.log('Markdown content:', markdownContent.value)
  console.log('Rendered HTML:', renderedMarkdown.value)
})

const testImageUrl = async () => {
  try {
    const response = await fetch('https://cdn.jsdelivr.net/gh/Noahall1/imageblog@main/images/20250709_091601_4f27272a.jpg', {
      method: 'HEAD'
    })
    if (response.ok) {
      urlTestResult.value = '✅ 图片URL可以正常访问'
    } else {
      urlTestResult.value = `❌ 图片URL访问失败: ${response.status}`
    }
  } catch (error) {
    urlTestResult.value = `❌ 网络错误: ${error.message}`
  }
}
</script>

<style scoped>
.markdown-body img {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  margin: 1em 0;
  display: block;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

pre {
  background-color: #f5f5f5;
  padding: 1em;
  border-radius: 4px;
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
