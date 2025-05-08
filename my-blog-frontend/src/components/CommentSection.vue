<template>
  <div class="comment-section">
    <h2 class="text-h5 mb-4" id="comments-heading">评论 ({{ comments.length }})</h2>
    
    <!-- 评论表单 -->
    <v-card class="mb-6 comment-form" elevation="1" variant="outlined">
      <v-card-text>
        <div v-if="!isLoggedIn" class="mb-4 pa-3 bg-grey-lighten-4 rounded-lg text-center">
          <p class="mb-2">请先登录后才能发表评论</p>
          <v-btn color="primary" to="/login" prepend-icon="mdi-login">
            登录
          </v-btn>
        </div>

        <div v-if="replyingTo" class="reply-info mb-2 px-2 py-1 rounded grey lighten-4">
          <div class="d-flex align-center">
            <span class="text-caption">回复 <strong>{{ replyingTo.username }}</strong>: {{ replyingTo.content.substring(0, 50) }}{{ replyingTo.content.length > 50 ? '...' : '' }}</span>
            <v-spacer></v-spacer>
            <v-btn
              icon="mdi-close"
              size="x-small"
              variant="text"
              @click="cancelReply"
            ></v-btn>
          </div>
        </div>
        
        <v-textarea
          v-model="newComment"
          label="发表你的评论"
          variant="outlined"
          rows="3"
          counter="1000"
          :disabled="!isLoggedIn"
          :rules="[v => !!v || '请输入评论内容']"
          placeholder="写下你的想法..."
          hide-details
          class="mb-2"
        ></v-textarea>
        
        <div class="d-flex align-center mt-2">
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn
                variant="text"
                icon="mdi-emoticon-outline"
                v-bind="props"
                :disabled="!isLoggedIn"
              ></v-btn>
            </template>
            <v-card>
              <v-card-text class="emoji-picker">
                <span 
                  v-for="emoji in commonEmojis"
                  :key="emoji"
                  class="emoji-item"
                  @click="insertEmoji(emoji)"
                >
                  {{ emoji }}
                </span>
              </v-card-text>
            </v-card>
          </v-menu>
          
          <v-spacer></v-spacer>
          
          <v-btn
            color="primary"
            :loading="submitting"
            :disabled="!isLoggedIn || !newComment.trim()"
            @click="submitComment"
            prepend-icon="mdi-send"
          >
            发表评论
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
    
    <!-- 评论列表 -->
    <div v-if="loading" class="text-center py-4">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
      <p class="mt-2 text-body-2">加载评论中...</p>
    </div>
    
    <div v-else-if="comments.length === 0" class="text-center py-8">
      <v-icon icon="mdi-comment-text-outline" size="64" color="grey-lighten-1" class="mb-2"></v-icon>
      <p class="text-subtitle-1 text-medium-emphasis">还没有评论，成为第一个评论的人吧！</p>
    </div>
    
    <v-timeline v-else density="compact" align="start" side="end">
      <v-timeline-item
        v-for="comment in comments"
        :key="comment.id"
        dot-color="primary"
        size="small"
      >
        <template v-slot:opposite>
          <div class="text-caption text-medium-emphasis">
            {{ formatDate(comment.created_at) }}
          </div>
        </template>
        
        <v-card class="comment-card" variant="outlined">
          <v-card-title class="d-flex align-center py-2">
            <v-avatar color="primary" class="mr-2" size="32">
              <span class="text-white">{{ getUserInitials(comment.username) }}</span>
            </v-avatar>
            <span class="text-subtitle-2">{{ comment.username || "匿名用户" }}</span>
            
            <v-chip
              v-if="comment.is_author"
              class="ml-2"
              size="x-small"
              color="info"
              label
            >作者</v-chip>
            
            <!-- 显示评论者位置信息 -->
            <v-chip
              v-if="comment.location"
              class="ml-2"
              size="x-small"
              color="success"
              variant="outlined"
              label
            >
              <v-icon start size="x-small">mdi-map-marker</v-icon>
              {{ comment.location }}
            </v-chip>
            
            <v-spacer></v-spacer>
            
            <v-menu v-if="canDelete(comment)">
              <template v-slot:activator="{ props }">
                <v-btn 
                  icon="mdi-dots-vertical" 
                  variant="text" 
                  size="small"
                  v-bind="props"
                ></v-btn>
              </template>
              <v-list>
                <v-list-item @click="deleteCommentItem(comment.id)">
                  <template v-slot:prepend>
                    <v-icon color="error">mdi-delete</v-icon>
                  </template>
                  <v-list-item-title class="text-error">删除</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-card-title>
          
          <v-divider></v-divider>
          
          <v-card-text class="py-3">
            <!-- 回复引用 -->
            <div v-if="comment.reply_to" class="reply-quote mb-2 pa-2 rounded grey lighten-4">
              <span class="text-caption">
                <strong>{{ comment.reply_to.username }}</strong>: {{ comment.reply_to.content.substring(0, 50) }}{{ comment.reply_to.content.length > 50 ? '...' : '' }}
              </span>
            </div>
            
            <p class="mb-0 text-body-1" v-html="renderCommentContent(comment.content)"></p>
          </v-card-text>
          
          <v-card-actions class="px-4 pb-2">
            <v-btn
              variant="text"
              size="small"
              @click="likeComment(comment)"
              class="text-caption"
              :color="comment.userLiked ? 'primary' : ''"
              prepend-icon="mdi-thumb-up-outline"
            >
              喜欢 ({{ comment.likes || 0 }})
            </v-btn>
            
            <v-btn
              variant="text"
              size="small"
              @click="replyToComment(comment)"
              class="text-caption"
              prepend-icon="mdi-reply-outline"
            >
              回复
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-timeline-item>
    </v-timeline>
    
    <!-- 加载更多按钮 -->
    <div v-if="hasMoreComments" class="text-center mt-4">
      <v-btn
        variant="outlined"
        @click="loadMoreComments"
        :loading="loadingMore"
        prepend-icon="mdi-chevron-down"
      >
        加载更多评论
      </v-btn>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getComments, createComment, deleteComment, likeComment as likeCommentApi } from '../api'
import DOMPurify from 'dompurify'
import { useUserStore } from '../stores/user'
import { safeRef } from '../fix-refs.js'

const props = defineProps({
  articleId: {
    type: [Number, String],
    required: true
  },
  authorId: {
    type: [Number, String],
    default: null
  }
})

const emit = defineEmits(['comment-added', 'comment-deleted'])

// 状态变量 - 使用计算属性包装所有在模板中使用的ref
const comments = ref([])
const newComment = ref('')
const loading = ref(false)
const submitting = ref(false)
const currentPage = ref(1)
const loadingMore = ref(false)
const totalComments = ref(0)
const commentsPerPage = 10
const hasMoreComments = computed(() => comments.value.length < totalComments.value)
const _replyingTo = ref(null)
const replyingTo = computed(() => _replyingTo.value)

// 表情符号
const commonEmojis = ['😊', '👍', '🎉', '❤️', '😂', '🙌', '🤔', '👏', '🔥', '✨', '😍', '🙏']

const userStore = useUserStore()
const isLoggedIn = computed(() => userStore.isAuthenticated)

// 插入表情符号
const insertEmoji = (emoji) => {
  newComment.value += emoji
}

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  })
}

// 获取用户名首字母
const getUserInitials = (username) => {
  if (!username) return '?'
  return username.charAt(0).toUpperCase()
}

// 判断是否可以删除评论
const canDelete = (comment) => {
  // 这里应该根据登录用户ID判断，暂时允许所有人删除
  return true
}

// 获取评论
const fetchComments = async () => {
  loading.value = true
  try {
    const response = await getComments(props.articleId, 1, commentsPerPage)
    
    // 获取本地存储的点赞状态
    const likedComments = JSON.parse(localStorage.getItem('likedComments') || '{}');
    
    // 处理评论数据，添加额外属性
    comments.value = response.data.map(comment => ({
      ...comment,
      userLiked: !!likedComments[comment.id], // 检查用户是否已点赞
      is_author: comment.user_id === props.authorId, // 是否是作者的评论
      location: comment.location || "未知地区" // 确保位置信息存在
    }))
    // 模拟一下，假设有更多评论
    totalComments.value = response.data.length + 5
  } catch (error) {
    console.error('获取评论失败:', error)
  } finally {
    loading.value = false
  }
}

// 加载更多评论
const loadMoreComments = async () => {
  if (loadingMore.value) return
  
  loadingMore.value = true
  try {
    currentPage.value++
    const response = await getComments(props.articleId, currentPage.value, commentsPerPage)
    
    // 获取本地存储的点赞状态
    const likedComments = JSON.parse(localStorage.getItem('likedComments') || '{}');
    
    // 处理评论数据，添加额外属性
    const newComments = response.data.map(comment => ({
      ...comment,
      userLiked: !!likedComments[comment.id], // 检查用户是否已点赞
      is_author: comment.user_id === props.authorId,
      location: comment.location || "未知地区" // 确保位置信息存在
    }))
    comments.value = [...comments.value, ...newComments]
  } catch (error) {
    console.error('加载更多评论失败:', error)
    currentPage.value--
  } finally {
    loadingMore.value = false
  }
}

// 提交评论
const submitComment = async () => {
  if (!newComment.value.trim()) return
  
  submitting.value = true
  try {
    const userStore = useUserStore()
    
    // 检查用户是否登录
    if (!userStore.isAuthenticated) {
      alert('请先登录再发表评论')
      submitting.value = false
      return
    }
    
    // 创建评论
    const replyToId = _replyingTo.value ? _replyingTo.value.id : null
    const response = await createComment(newComment.value, props.articleId, replyToId)
    
    // 将新评论添加到列表顶部
    const newCommentData = response.data
    
    // 如果添加成功，添加到评论列表
    if (newCommentData) {
      // 确保评论有用户名
      newCommentData.username = userStore.username || "匿名用户"
      newCommentData.userLiked = false
      newCommentData.is_author = newCommentData.user_id === props.authorId
      newCommentData.location = newCommentData.location || "未知地区"
      
      comments.value.unshift(newCommentData)
    totalComments.value++
    }
    
    // 清空输入框和回复状态
    newComment.value = ''
    _replyingTo.value = null
    
    emit('comment-added')
  } catch (error) {
    console.error('提交评论失败:', error)
    if (error.response && error.response.status === 401) {
      alert('需要登录才能发表评论')
    } else {
      alert('评论发表失败，请稍后重试')
    }
  } finally {
    submitting.value = false
  }
}

// 删除评论
const deleteCommentItem = async (commentId) => {
  if (!confirm('确定要删除这条评论吗？')) return
  
  try {
    await deleteComment(commentId)
    // 从列表中移除
    comments.value = comments.value.filter(c => c.id !== commentId)
    totalComments.value--
    
    emit('comment-deleted')
  } catch (error) {
    console.error('删除评论失败:', error)
  }
}

// 喜欢评论
const likeComment = async (comment) => {
  try {
    // 防止重复点赞
    if (comment.userLiked) return;
    
    // 调用API
    const response = await likeCommentApi(comment.id);
    
    // 更新UI
    if (response && response.data) {
      comment.likes = response.data.likes;
      comment.userLiked = true;
      
      // 保存点赞状态到本地存储
      const likedComments = JSON.parse(localStorage.getItem('likedComments') || '{}');
      likedComments[comment.id] = true;
      localStorage.setItem('likedComments', JSON.stringify(likedComments));
    }
  } catch (error) {
    console.error('点赞评论失败:', error);
  }
}

const replyToComment = (comment) => {
  _replyingTo.value = comment
  newComment.value = ''
  // 滚动到评论框
  document.querySelector('.comment-form').scrollIntoView({ behavior: 'smooth' })
}

// 取消回复
const cancelReply = () => {
  _replyingTo.value = null
}

const renderCommentContent = (content) => {
  if (!content) return ''
  
  // 安全处理内容
  let safeContent = DOMPurify.sanitize(content)
  
  // 链接转换
  safeContent = safeContent.replace(
    /(https?:\/\/[^\s]+)/g, 
    '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
  )
  
  // @用户处理
  safeContent = safeContent.replace(
    /@([a-zA-Z0-9_\u4e00-\u9fa5]+)/g,
    '<span class="mention">@$1</span>'
  )
  
  return safeContent
}

onMounted(() => {
  fetchComments()
})
</script>

<style scoped>
.comment-section {
  margin-top: 3rem;
  padding-top: 1rem;
}

.comment-card {
  transition: all 0.2s ease;
}

.comment-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.mention {
  color: #1976d2;
  font-weight: 500;
}

.emoji-picker {
  display: flex;
  flex-wrap: wrap;
  max-width: 250px;
}

.emoji-item {
  font-size: 1.5rem;
  padding: 6px;
  cursor: pointer;
  transition: transform 0.1s ease;
}

.emoji-item:hover {
  transform: scale(1.2);
}
</style> 