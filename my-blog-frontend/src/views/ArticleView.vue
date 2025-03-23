<template>
  <v-main>
    <NavBar />
    
    <v-container class="main-content">
      <v-row>
        <v-col cols="12" lg="8">
          <v-card class="article-card pa-6 mb-6">
            <h1 class="text-h4 font-weight-bold mb-4">{{ article.title }}</h1>
            
            <div class="d-flex align-center mb-6">
              <v-avatar :size="40" :image="article.author.avatar" class="mr-3" />
              <div>
                <div class="text-subtitle-1 font-weight-medium">{{ article.author.name }}</div>
                <div class="text-caption text-medium-emphasis">{{ formatDate(article.createdAt) }}</div>
              </div>
              <v-spacer />
              <div class="d-flex align-center text-medium-emphasis">
                <v-icon icon="mdi-eye-outline" size="18" class="mr-1" />
                {{ article.views }}
                <v-icon icon="mdi-comment-outline" size="18" class="ml-3 mr-1" />
                {{ article.comments.length }}
              </div>
            </div>

            <v-divider class="mb-6" />
            
            <v-md-preview :text="article.content" class="markdown-body" />
          </v-card>

          <v-card class="comment-section pa-6">
            <h3 class="text-h6 mb-6">评论 ({{ article.comments.length }})</h3>
            
            <div class="comment-form">
              <v-textarea
                v-model="newComment"
                variant="outlined"
                rows="3"
                label="留下你的精彩评论..."
                auto-grow
                class="mb-4"
              />
              <div class="d-flex justify-end align-center">
                <v-menu location="top start">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      icon="mdi-emoticon-outline"
                      variant="text"
                      size="small"
                      class="mr-2"
                    />
                  </template>
                  <EmojiPicker @select="handleEmojiSelect" />
                </v-menu>
                <v-btn
                  color="primary"
                  @click="submitComment"
                  :disabled="!newComment.trim()"
                >
                  发表评论
                </v-btn>
              </div>
            </div>

            <div class="comment-list mt-6">
              <div v-for="comment in article.comments" :key="comment.id" class="comment-item pa-4 mb-4">
                <v-avatar :size="32" :image="comment.user.avatar" class="mr-3" />
                <div class="flex-grow-1">
                  <div class="d-flex align-center mb-1">
                    <span class="text-body-2 font-weight-medium">{{ comment.user.name }}</span>
                    <span class="text-caption text-medium-emphasis ml-2">{{ formatTime(comment.createdAt) }}</span>
                  </div>
                  <div class="text-body-2">{{ comment.content }}</div>
                </div>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

import VMdPreview from '@kangc/v-md-editor/lib/preview'
import '@kangc/v-md-editor/lib/style/preview.css'
import githubTheme from '@kangc/v-md-editor/lib/theme/github'
import 'highlight.js/styles/github.css'

VMdPreview.use(githubTheme)

const route = useRoute()
const articleId = route.params.id

const article = ref({
  id: articleId,
  title: '深入理解Vue3响应式原理',
  content: '## 响应式系统核心\n Vue3使用Proxy替代了Object.defineProperty...',
  author: {
    name: '技术达人',
    avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
  },
  createdAt: new Date(),
  views: 1234,
  comments: [
    {
      id: 1,
      content: '非常棒的解析！👍',
      user: {
        name: '前端小白',
        avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e99bcpng.png'
      },
      createdAt: new Date(Date.now() - 3600000)
    }
  ]
})

const newComment = ref('')

const formatDate = (date) => {
  return date.toLocaleDateString('zh-CN', { 
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

const formatTime = (date) => {
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const handleEmojiSelect = (emoji) => {
  newComment.value += emoji
}

const submitComment = () => {
  if (!newComment.value.trim()) return

  article.value.comments.push({
    id: Date.now(),
    content: newComment.value,
    user: {
      name: localStorage.getItem('username') || '游客',
      avatar: localStorage.getItem('avatar') || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
    },
    createdAt: new Date()
  })
  
  newComment.value = ''
  
  // 显示成功提示
  window.dispatchEvent(new CustomEvent('show-snackbar', {
    detail: {
      color: 'success',
      text: '评论发表成功！',
      timeout: 3000
    }
  }))
}
</script>

<style scoped>
.article-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.title {
  font-size: 2.2rem;
  margin-bottom: 1.5rem;
}

.meta-info {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
}

.author-info {
  margin-left: 1rem;
}

.author-name {
  font-weight: 500;
  display: block;
}

.post-time {
  color: #666;
  font-size: 0.9rem;
}

.stats {
  margin-left: auto;
  color: #666;
}

.markdown-body {
  padding: 20px 0;
}

.comment-section {
  margin-top: 2rem;
}

.comment-form {
  margin-bottom: 2rem;
}

.form-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 1rem;
}

.comment-list {
  margin-top: 2rem;
}

.card {
  padding: 2rem;
  margin: 2rem 0;
  background: rgba(16, 18, 27, 0.6);
  border-radius: 16px;
  border: 1px solid rgba(110, 231, 248, 0.3);
  box-shadow: 0 8px 32px rgba(110, 231, 248, 0.15);
  transform: perspective(1000px) translateZ(0);
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  backdrop-filter: blur(12px);
}

.card:hover {
  transform: translateY(-6px) rotateX(3deg) translateZ(20px);
  box-shadow: 0 12px 40px rgba(228, 96, 255, 0.25);
}

.comment-item {
  display: flex;
  margin-bottom: 1.5rem;
  padding: 1.2rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.comment-item::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    120deg,
    rgba(110, 231, 248, 0.1),
    rgba(228, 96, 255, 0.05)
  );
  z-index: -1;
}

.comment-item:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 8px 24px rgba(110, 231, 248, 0.2);
}

.comment-content {
  margin-left: 1rem;
  flex: 1;
}

.comment-header {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.username {
  font-weight: 500;
  margin-right: 1rem;
}

.comment-time {
  color: #666;
  font-size: 0.8rem;
}

.comment-text {
  line-height: 1.6;
}
</style>
.comment-section {
  background: rgba(var(--v-theme-surface), 0.8);
  border-radius: 16px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.comment-section:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(110, 231, 248, 0.15);
}
.comment-form {
  position: relative;
}

.comment-form:after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, rgba(var(--v-theme-primary), 0.3), transparent);
  transform-origin: left;
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.comment-form:focus-within:after {
  transform: scaleX(1);
}
import EmojiPicker from 'vue3-emoji-picker'