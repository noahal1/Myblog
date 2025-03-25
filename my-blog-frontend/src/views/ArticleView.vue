<template>
  <div class="article-view">
    <v-container class="article-container py-8">
      <template v-if="loading">
        <v-skeleton-loader
          type="article"
          class="mx-auto my-4"
        ></v-skeleton-loader>
        <v-skeleton-loader
          type="list-item-avatar"
          class="mx-auto my-4"
        ></v-skeleton-loader>
      </template>
      
      <template v-else-if="error">
        <v-alert
          type="error"
          variant="tonal"
          title="加载失败"
          :text="error"
          class="mb-4"
        >
          <template v-slot:append>
            <v-btn color="error" @click="fetchArticle(route.params.id)">重试</v-btn>
          </template>
        </v-alert>
      </template>
      
      <template v-else>
        <!-- 文章卡片 -->
        <v-card class="article-card mb-8" elevation="3">
          <v-card-item>
            <h1 class="text-h4 font-weight-bold mb-4">{{ article.title }}</h1>
            
            <div class="d-flex align-center mb-6">
              <v-avatar :size="40" :image="article.author?.avatar" class="mr-3">
                <v-icon v-if="!article.author?.avatar" icon="mdi-account"></v-icon>
              </v-avatar>
              <div>
                <div class="text-subtitle-1 font-weight-medium">{{ article.author?.name || '未知作者' }}</div>
                <div class="text-caption text-medium-emphasis">{{ formatDate(article.createdAt) }}</div>
              </div>
              <v-spacer />
              <div class="d-flex align-center text-medium-emphasis">
                <v-icon icon="mdi-eye-outline" size="18" class="mr-1" />
                {{ article.views || 0 }}
                <v-icon icon="mdi-comment-outline" size="18" class="ml-3 mr-1" />
                {{ article.comments?.length || 0 }}
                <v-icon icon="mdi-heart-outline" size="18" class="ml-3 mr-1" />
                <span>{{ article.likes || 0 }}</span>
              </div>
            </div>

            <v-divider class="my-4" />
            
            <div class="article-content">
              <v-md-preview 
                :text="article.content || '文章内容加载中...'" 
                class="markdown-body py-4" 
                :class="previewClass"
              />
            </div>
            
            <!-- 文章标签 -->
            <div class="article-tags mt-6 d-flex flex-wrap">
              <v-chip
                v-for="tag in article.tags || []"
                :key="tag"
                class="mr-2 mb-2"
                color="primary"
                variant="outlined"
                size="small"
              >
                {{ tag }}
              </v-chip>
            </div>
            <v-card-actions class="mt-4">
              <v-btn 
                prepend-icon="mdi-thumb-up-outline" 
                variant="text" 
                @click="likeArticle"
                :color="hasLiked ? 'primary' : undefined"
              >
                赞 ({{ article.likes || 0 }})
              </v-btn>
              <v-btn prepend-icon="mdi-share-variant-outline" variant="text">
                分享
              </v-btn>
              <v-spacer />
              <v-btn icon="mdi-bookmark-outline" variant="text"></v-btn>
            </v-card-actions>
          </v-card-item>
        </v-card>

        <!-- 评论部分 -->
        <v-card class="comment-section" elevation="3">
          <v-card-title class="pb-0">
            <h3 class="text-h6">评论 ({{ article.comments.length }})</h3>
          </v-card-title>
          
          <v-card-item>
            <!-- 评论表单 -->
            <div class="comment-form mt-4">
              <v-textarea
                v-model="newComment"
                variant="outlined"
                rows="3"
                label="留下你的精彩评论..."
                auto-grow
                hide-details
                class="mb-2"
              />
              <div class="d-flex justify-end align-center mt-2">
                <v-menu location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      icon="mdi-emoticon-outline"
                      variant="text"
                      size="small"
                      class="mr-2"
                    />
                  </template>
                  <emoji-picker @select="handleEmojiSelect" />
                </v-menu>
                <v-btn
                  color="primary"
                  @click="submitComment"
                  :disabled="!newComment.trim() || submitting"
                  :loading="submitting"
                >
                  发表评论
                </v-btn>
              </div>
            </div>

            <!-- 评论列表 -->
            <v-expand-transition>
              <div class="comment-list mt-6">
                <v-divider class="mb-4" />
                
                <div v-if="article.comments.length === 0" class="text-center pa-4 text-medium-emphasis">
                  暂无评论，快来发表第一条评论吧！
                </div>
                
                <transition-group name="comment">
                  <v-card
                    v-for="comment in sortedComments"
                    :key="comment.id"
                    class="comment-item mb-4"
                    variant="outlined"
                    flat
                  >
                    <div class="d-flex pa-4">
                      <v-avatar :size="36" :image="comment.user.avatar" class="mr-3">
                        <v-icon v-if="!comment.user.avatar" icon="mdi-account"></v-icon>
                      </v-avatar>
                      <div class="flex-grow-1">
                        <div class="d-flex align-center mb-1">
                          <span class="text-subtitle-2 font-weight-medium">{{ comment.user.name }}</span>
                          <span class="text-caption text-medium-emphasis ml-2">{{ formatTime(comment.createdAt) }}</span>
                        </div>
                        <p class="text-body-2 mb-1 comment-content">{{ comment.content }}</p>
                        <div class="d-flex align-center mt-2">
                          <v-btn 
                            size="x-small" 
                            variant="text" 
                            density="comfortable"
                            prepend-icon="mdi-thumb-up-outline"
                            @click="likeComment(comment)"
                          >
                            {{ comment.likes || 0 }}
                          </v-btn>
                          <v-btn 
                            size="x-small" 
                            variant="text" 
                            density="comfortable"
                            class="ml-2"
                            @click="replyTo(comment)"
                            prepend-icon="mdi-reply"
                          >
                            回复
                          </v-btn>
                        </div>
                      </div>
                    </div>
                  </v-card>
                </transition-group>
                
                <!-- 分页控件 -->
                <div v-if="totalCommentPages > 1" class="d-flex justify-center mt-4">
                  <v-pagination
                    v-model="commentPage"
                    :length="totalCommentPages"
                    rounded
                    :total-visible="5"
                  />
                </div>
              </div>
            </v-expand-transition>
          </v-card-item>
        </v-card>
        
        <!-- 相关文章 -->
        <v-card class="mt-8" elevation="3">
          <v-card-title>相关文章</v-card-title>
          <v-card-text>
            <v-row>
              <v-col v-for="n in 3" :key="n" cols="12" md="4">
                <v-card class="related-article" variant="outlined" flat>
                  <v-card-title class="text-subtitle-1">相关文章标题 {{ n }}</v-card-title>
                  <v-card-subtitle>2023-10-10</v-card-subtitle>
                  <v-card-actions>
                    <v-btn variant="text" color="primary">阅读</v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </template>
    </v-container>
    
    <!-- 回到顶部按钮 -->
    <v-btn
      v-show="showBackToTop"
      icon="mdi-arrow-up"
      color="primary"
      size="small"
      class="back-to-top"
      @click="scrollToTop"
      elevation="2"
    />
    
    <!-- 提示消息 -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      timeout="3000"
      location="top"
    >
      {{ snackbar.text }}
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDisplay, useTheme } from 'vuetify'
import EmojiPicker from 'vue3-emoji-picker'
import 'vue3-emoji-picker/css'

import VMdPreview from '@kangc/v-md-editor/lib/preview'
import '@kangc/v-md-editor/lib/style/preview.css'
import githubTheme from '@kangc/v-md-editor/lib/theme/github'
import 'highlight.js/styles/github.css'
import 'highlight.js/styles/github-dark.css'

VMdPreview.use(githubTheme)

const route = useRoute()
const router = useRouter()
const display = useDisplay()
const theme = useTheme()

// 初始化所有数据，确保没有undefined
const article = ref({
  id: 0,
  title: '加载中...',
  content: '',
  author: {
    name: '',
    avatar: ''
  },
  createdAt: new Date(),
  views: 0,
  likes: 0,
  tags: [],
  comments: []
})
const loading = ref(true)
const error = ref(null)
const newComment = ref('')
const submitting = ref(false)
const showBackToTop = ref(false)
const relatedArticles = ref([])
const hasLiked = ref(false)
const snackbar = ref({
  show: false,
  text: '',
  color: 'success'
})

// 计算属性
const isDarkMode = computed(() => {
  return theme.global.current.value.dark
})

const previewClass = computed(() => 
  isDarkMode.value ? 'markdown-body-dark' : 'markdown-body'
)

// 获取文章详情 - 添加更多错误处理
const fetchArticle = async (id) => {
  if (!id) {
    error.value = '无效的文章ID'
    loading.value = false
    return
  }
  
  loading.value = true
  error.value = null
  
  try {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // 模拟文章数据
    article.value = {
      id: Number(id),
      title: `Vue3高级技巧：${id}个你应该知道的开发技巧`,
      content: `# 这是一个测试文章 ${id}
      
## 前言
Vue 3 是Vue.js框架的最新主要版本，它带来了许多令人兴奋的新特性和性能改进。

\`\`\`javascript
// Composition API示例
import { ref, computed, onMounted } from 'vue'

export default {
  setup() {
    const count = ref(0)
    
    const doubleCount = computed(() => count.value * 2)
    
    function increment() {
      count.value++
    }
    
    onMounted(() => {
      console.log('组件已挂载')
    })
    
    return {
      count,
      doubleCount,
      increment
    }
  }
}
\`\`\`

## 主要内容
Vue 3带来了Composition API、Teleport、Fragments等重要特性。

> Composition API是Vue 3中最重要的新特性之一，它提供了一种更灵活的方式来组织组件逻辑。

## 总结
学习和掌握Vue 3的新特性可以帮助你更好地构建现代Web应用。`,
      author: {
        name: "Noah",
        avatar: ""
      },
      createdAt: new Date(),
      views: Math.floor(Math.random() * 1000),
      likes: Math.floor(Math.random() * 100),
      tags: ["Vue", "JavaScript", "Web开发", "前端"],
      comments: Array.from({ length: Math.floor(Math.random() * 5) }, (_, i) => ({
        id: i + 1,
        user: {
          name: `用户${i + 1}`,
          avatar: ""
        },
        content: `这是第${i + 1}条评论内容，非常感谢分享这篇文章！`,
        created_at: new Date(),
        likes: Math.floor(Math.random() * 10)
      }))
    }
    
    // 获取相关文章
    fetchRelatedArticles()
    
  } catch (err) {
    console.error('获取文章失败:', err)
    error.value = '获取文章失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

// 排序评论，最新的优先
const sortedComments = computed(() => {
  const start = (commentPage.value - 1) * commentsPerPage
  const end = start + commentsPerPage
  return [...article.value.comments]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(start, end)
})

// 计算总页数
const totalCommentPages = computed(() => 
  Math.ceil(article.value.comments.length / commentsPerPage)
)

// 日期格式化
const formatDate = (date) => {
  if (!date) return '暂无日期'
  
  if (typeof date === 'string') {
    date = new Date(date)
  }
  
  return date.toLocaleDateString('zh-CN', { 
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 时间格式化
const formatTime = (date) => {
  if (!date) return ''
  
  if (typeof date === 'string') {
    date = new Date(date)
  }
  
  const now = new Date()
  const diff = now - date
  
  // 如果小于1小时，显示"x分钟前"
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000)
    return `${minutes}分钟前`
  }
  
  // 如果是今天，显示"今天 HH:MM"
  if (date.toDateString() === now.toDateString()) {
    return `今天 ${date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`
  }
  
  // 如果是昨天，显示"昨天 HH:MM"
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  if (date.toDateString() === yesterday.toDateString()) {
    return `昨天 ${date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`
  }
  
  // 其他情况显示完整日期和时间
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 处理emoji选择
const handleEmojiSelect = (emoji) => {
  newComment.value += emoji
}

// 提交评论
const submitComment = async () => {
  if (!newComment.value.trim()) return
  
  submitting.value = true
  
  try {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const commentContent = replyingTo.value
      ? `@${replyingTo.value.user.name} ${newComment.value}`
      : newComment.value
    
    article.value.comments.unshift({
      id: Date.now(),
      content: commentContent,
      user: {
        name: localStorage.getItem('username') || '游客',
        avatar: localStorage.getItem('avatar') || ''
      },
      createdAt: new Date(),
      likes: 0
    })
    
    newComment.value = ''
    replyingTo.value = null
    commentPage.value = 1 // 重置到第一页以显示新评论
    
    // 显示成功提示
    showSnackbar('评论发表成功！', 'success')
  } catch (error) {
    console.error('发表评论失败:', error)
    showSnackbar('评论发表失败，请稍后重试', 'error')
  } finally {
    submitting.value = false
  }
}

// 回复评论
const replyTo = (comment) => {
  replyingTo.value = comment
  newComment.value = `@${comment.user.name} `
  // 滚动到评论框
  document.querySelector('.comment-form').scrollIntoView({ behavior: 'smooth' })
}

// 点赞文章
const likeArticle = () => {
  if (hasLiked.value) {
    article.value.likes--
    hasLiked.value = false
    showSnackbar('已取消点赞', 'info')
  } else {
    article.value.likes++
    hasLiked.value = true
    showSnackbar('感谢您的点赞！', 'success')
  }
}

// 点赞评论
const likeComment = (comment) => {
  comment.likes = (comment.likes || 0) + 1
}

// 显示提示信息
const showSnackbar = (text, color = 'success') => {
  snackbar.value = {
    show: true,
    text,
    color
  }
}

// 回到顶部
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 监听滚动事件
const handleScroll = () => {
  showBackToTop.value = window.scrollY > 300
}

// 生命周期钩子
onMounted(() => {
  // 先安全处理数据初始化，再添加事件监听
  if (route.params.id) {
    fetchArticle(route.params.id)
  } else {
    error.value = '未找到文章ID'
    loading.value = false
  }
  
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// 确保在路由参数变化时重新获取数据
watch(() => route.params.id, (newId, oldId) => {
  if (newId && newId !== oldId) {
    fetchArticle(newId)
  }
})
</script>

<style scoped>
.article-view {
  position: relative;
  min-height: 100vh;
}

.article-container {
  max-width: 900px;
  margin: 0 auto;
  padding-top: 32px;
  padding-bottom: 64px;
}

.article-card {
  border-radius: var(--border-radius);
  overflow: hidden;
  background: rgba(var(--v-theme-surface), 0.85);
  backdrop-filter: blur(15px);
  transition: all var(--transition-default);
  box-shadow: var(--card-shadow);
  border: 1px solid rgba(var(--primary-blue), 0.1);
}

.article-card:hover {
  box-shadow: var(--hover-shadow);
}

.article-content {
  line-height: 1.8;
  font-size: 1.05rem;
}

.markdown-body {
  padding: 16px 0;
}

.markdown-body-dark {
  background-color: transparent;
  color: rgb(var(--text-primary));
}

.markdown-body-dark pre {
  background-color: rgba(22, 27, 34, 0.8);
  border-radius: 8px;
}

.markdown-body-dark code {
  color: #79c0ff;
}

.article-tags {
  margin-top: 24px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.comment-section {
  background: rgba(var(--v-theme-surface), 0.85);
  border-radius: var(--border-radius);
  backdrop-filter: blur(15px);
  transition: all var(--transition-default);
  box-shadow: var(--card-shadow);
  border: 1px solid rgba(var(--primary-blue), 0.1);
  margin-top: 24px;
}

.comment-form {
  position: relative;
  transition: all var(--transition-default);
  padding: 16px;
  border-radius: 8px;
  background: rgba(var(--primary-blue), 0.05);
}

.comment-form:focus-within {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(var(--primary-blue), 0.1);
}

.comment-item {
  transition: all var(--transition-default);
  border-radius: 8px;
  overflow: hidden;
  background: rgba(var(--v-theme-surface), 0.7);
  border: 1px solid rgba(var(--primary-blue), 0.05);
}

.comment-item:hover {
  background: linear-gradient(
    90deg,
    rgba(var(--v-theme-surface), 0.8),
    rgba(var(--primary-blue), 0.05) 
  );
  transform: translateX(4px);
  border-color: rgba(var(--primary-blue), 0.1);
}

.comment-content {
  white-space: pre-wrap;
  word-break: break-word;
  padding: 8px;
  background: rgba(var(--primary-blue), 0.03);
  border-radius: 6px;
  margin-top: 4px;
}

.back-to-top {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 99;
  border-radius: 50%;
  opacity: 0.8;
  transition: all var(--transition-default);
  box-shadow: 0 4px 12px rgba(var(--primary-blue), 0.2);
}

.back-to-top:hover {
  opacity: 1;
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(var(--primary-blue), 0.3);
}

/* 评论动画 */
.comment-enter-active,
.comment-leave-active {
  transition: all 0.5s ease;
}

.comment-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.comment-leave-to {
  opacity: 0;
  transform: translateX(80px);
}

/* 相关文章卡片 */
.related-article {
  transition: all var(--transition-default);
  height: 100%;
  border-radius: 8px;
  background: rgba(var(--v-theme-surface), 0.7);
  border: 1px solid rgba(var(--primary-blue), 0.05);
}

.related-article:hover {
  transform: translateY(-4px);
  background: linear-gradient(
    var(--gradient-angle),
    rgba(var(--v-theme-surface), 0.8),
    rgba(var(--primary-blue), 0.05)
  );
  box-shadow: 0 4px 12px rgba(var(--primary-blue), 0.15);
  border-color: rgba(var(--primary-blue), 0.1);
}

@media (max-width: 600px) {
  .article-container {
    padding: 16px;
  }
  
  .article-card {
    padding: 16px;
  }
  
  .comment-item {
    padding: 12px;
  }
}
</style>