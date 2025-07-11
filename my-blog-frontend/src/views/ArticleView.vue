<template>
  <div class="article-view">
    <v-container class="py-8">
      <v-row>
        <!-- 文章目录 - 仅在知识库文章时显示 -->
        <v-col v-if="article && article.is_knowledge_base" cols="12" md="3" class="d-none d-md-block">
          <div class="glass-toc-container sticky-toc">
            <div class="glass-card glass-toc">
              <div class="toc-header">
                <v-icon icon="mdi-format-list-bulleted" class="me-2" aria-hidden="true"></v-icon>
                <h2 class="toc-title">目录</h2>
              </div>
              <div class="toc-divider"></div>
              <nav class="toc-nav" role="navigation" aria-label="文章目录">
                <ul class="toc-list">
                  <li v-for="(item, index) in tocItems" :key="index" class="toc-item">
                    <button
                      :class="['toc-link', 'toc-level-' + item.level, { 'active': activeTocItem === item.id }]"
                      :style="{ paddingLeft: (item.level - 1) * 16 + 'px' }"
                      @click="scrollToHeading(item.id)"
                      :aria-label="`跳转到${item.text}`"
                    >
                      <v-icon size="small" :icon="getTocIcon(item.level)" class="toc-icon" aria-hidden="true"></v-icon>
                      <span class="toc-text">{{ item.text }}</span>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </v-col>

        <!-- 文章内容 -->
        <v-col :cols="article?.is_knowledge_base ? 12 : 12" :md="article?.is_knowledge_base ? 9 : 12">
          <!-- 加载状态 -->
          <div v-if="loading" class="glass-card">
            <SkeletonLoader type="article-card" />
          </div>

          <!-- 文章内容 -->
          <template v-else-if="article">
            <article class="glass-article-container">
              <header class="glass-article-header">
                <h1 class="article-main-title">{{ article.title }}</h1>
                <div class="article-meta-section">
                <!-- 分类标签 -->
                <v-chip
                  v-if="article.category"
                  class="mr-2 mb-2"
                  color="primary"
                  label
                  size="small"
                >
                  {{ article.category }}
                </v-chip>
                </div>
                
                <!-- 文章标签 - 数组格式 -->
                <template v-if="article.tags && Array.isArray(article.tags) && article.tags.length > 0">
                  <v-chip
                    v-for="tag in article.tags"
                    :key="typeof tag === 'object' ? (tag.id || tag.name || JSON.stringify(tag)) : tag"
                    class="mr-2 mb-2"
                    color="secondary"
                    label
                    variant="outlined"
                    size="small"
                  >
                    {{ typeof tag === 'object' ? (tag.name || tag.tag_name || JSON.stringify(tag)) : tag }}
                  </v-chip>
                </template>
                
                <!-- 文章标签 - 字符串格式应急处理 -->
                <template v-else-if="article.tags && typeof article.tags === 'string' && article.tags.trim()">
                  <v-chip
                    class="mr-2 mb-2"
                    color="secondary"
                    label
                    variant="outlined"
                    size="small"
                  >
                    {{ article.tags }}
                  </v-chip>
                </template>
                <!-- 日期和作者 -->

                <div class="text-caption text-medium-emphasis ml-auto">
                  <v-chip
                  class="mr-2"
                  variant="outlined"
                  size="small"
                >
                  {{ article.author_name || '未知作者' }}
                </v-chip>作于
                  {{ formatDate(article.published_at || article.created_at || article.publish_date || new Date()) }} 
                  <span v-if="article.read_time">· {{ article.read_time }} 分钟阅读</span>
                </div>
              </header>
              
              <!-- 文章统计信息 -->
              <div class="d-flex align-center mb-4">
                <v-chip
                  class="mr-2"
                  variant="outlined"
                  prepend-icon="mdi-eye-outline"
                  size="small"
                >
                  {{ article.views || 0 }} 阅读
                </v-chip>
                
                <v-chip
                  class="mr-2"
                  variant="outlined"
                  prepend-icon="mdi-thumb-up-outline"
                  size="small"
                  :color="hasLiked ? 'primary' : ''"
                  @click="handleLike"
                >
                  {{ article.likes || 0 }} 喜欢
                </v-chip>
                
                <v-chip
                  variant="outlined"
                  prepend-icon="mdi-comment-outline"
                  size="small"
                  @click="scrollToComments"
                >
                  {{ article.comments_count || 0 }} 评论
                </v-chip>
              </div>
            </article>
            
            <v-img
              v-if="article.cover_image"
              :src="article.cover_image"
              :alt="article.title"
              class="rounded-lg mb-6"
              height="400"
              cover
            ></v-img>
            
            <v-divider class="mb-6"></v-divider>
            
            <!-- 文章内容 -->
            <div class="article-content">
              <div v-html="article.renderedContent" class="markdown-body"></div>
            </div>
            
            <v-divider class="my-6"></v-divider>
            
            <!-- 文章底部 -->
            <div class="article-footer">
              <div class="d-flex align-center">
                  <v-btn 
                  prepend-icon="mdi-arrow-left"
                    variant="text" 
                  @click="$router.go(-1)"
                  >
                  返回
                  </v-btn>
                
                <v-spacer></v-spacer>
                
                    <v-btn
                      color="primary"
                  prepend-icon="mdi-share-variant"
                  variant="tonal"
                    >
                  分享
                    </v-btn>
                  </div>
                </div>
                
            <!-- 评论区 -->
            <CommentSection 
              :article-id="article.id" 
              :author-id="article.author_id"
              @comment-added="handleCommentAdded"
              @comment-deleted="handleCommentDeleted"
            />
          </template>
          
          <!-- 文章不存在 -->
          <div v-else class="text-center py-12">
            <v-icon icon="mdi-alert-circle-outline" size="64" class="mb-4"></v-icon>
            <h2 class="text-h4 mb-2">文章不存在</h2>
            <p class="text-body-1 mb-6">抱歉，您要查看的文章不存在或已被删除</p>
                              <v-btn 
            color="primary"
            prepend-icon="mdi-home"
            @click="$router.push('/')"
          >
            返回首页
                              </v-btn>
                            </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchArticle as fetchMockArticle } from '../utils/mock-api'
import { renderMarkdown } from '../utils/markdown'  // 导入 markdown 渲染函数
import CommentSection from '../components/CommentSection.vue'
import SkeletonLoader from '../components/SkeletonLoader.vue'
import { getArticle, likeArticle } from '../api'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const article = ref(null)
const hasLiked = ref(false)

const tocItems = ref([])
const activeTocItem = ref(null)

// 处理点赞
const handleLike = async () => {
  if (hasLiked.value) return; // 防止重复点赞
  
  try {
    const response = await likeArticle(article.value.id);
    if (response.data && response.data.likes) {
      article.value.likes = response.data.likes;
      hasLiked.value = true;
      
      // 将点赞状态保存到本地存储
      const likedArticles = JSON.parse(localStorage.getItem('likedArticles') || '{}');
      likedArticles[article.value.id] = true;
      localStorage.setItem('likedArticles', JSON.stringify(likedArticles));
    }
  } catch (error) {
    console.error('点赞失败:', error);
  }
};

// 检查是否已点赞
const checkIfLiked = () => {
  if (!article.value) return;
  
  const likedArticles = JSON.parse(localStorage.getItem('likedArticles') || '{}');
  hasLiked.value = !!likedArticles[article.value.id];
};

// 检测内容是否为 HTML
function isHTML(str) {
  return /<[a-z][\s\S]*>/i.test(str);
}

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', { 
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 获取文章详情
const fetchArticle = async () => {
  loading.value = true
  try {
    const data = await getArticle(route.params.id)
    for (const key in data) {
      console.log(`- ${key}: ${typeof data[key]}`, 
                 Array.isArray(data[key]) ? `[${data[key].length}]` : '')
    }
    
    // 可能字段名不是tags，查找可能的标签字段
    const possibleTagFields = ['tags']
    const tagField = possibleTagFields.find(field => data[field])
    
    if (tagField) {
      console.log(`找到标签字段: ${tagField}`, data[tagField])
      // 赋值给标准字段名
      data.tags = data[tagField]
    }

    if (data.tags) {      
      if (typeof data.tags === 'string') {
        data.tags = data.tags.split(',').map(tagId => parseInt(tagId, 10))  // 将字符串转换为ID数组
      }
    } else {
      data.tags = []
    }
    const possibleContentFields = ['content', 'body', 'text', 'article_content', 'contents']
    const contentField = possibleContentFields.find(field => data[field])
    
    if (contentField && contentField !== 'content') {
      console.log(`找到内容字段: ${contentField}`)
      data.content = data[contentField]
    }
    
    article.value = data
    
    // 将Markdown转换为HTML
    if (article.value.content) {
      console.log('Original content:', article.value.content) // 调试日志
      if (isHTML(article.value.content)) {
        article.value.renderedContent = article.value.content
      } else {
        article.value.renderedContent = renderMarkdown(article.value.content)
        console.log('Rendered content:', article.value.renderedContent) // 调试日志
      }
    }
    
    // 设置文档标题
    document.title = `${data.title || '无标题'} - 我的博客`
    
    // 检查点赞状态
    checkIfLiked();
  } catch (error) {
    console.error('获取文章失败:', error)
    article.value = null
  } finally {
    loading.value = false
  }
}

// 评论相关处理方法
const handleCommentAdded = () => {
  // 可以在这里更新文章评论计数或其他相关状态
  console.log('评论已添加')
}

const handleCommentDeleted = () => {
  // 可以在这里更新文章评论计数或其他相关状态
  console.log('评论已删除')
}

// 滚动到评论区域
const scrollToComments = () => {
  const commentSection = document.querySelector('.comment-section')
  if (commentSection) {
    commentSection.scrollIntoView({ behavior: 'smooth' })
  }
}

// 生成目录
const generateToc = () => {
  const articleContent = document.querySelector('.markdown-body')
  if (!articleContent) return

  const headings = articleContent.querySelectorAll('h1, h2, h3, h4, h5, h6')
  tocItems.value = Array.from(headings).map((heading, index) => {
    const id = `heading-${index}`
    heading.id = id
    return {
      id,
      text: heading.textContent,
      level: parseInt(heading.tagName.charAt(1)),
      element: heading
    }
  })
}

// 获取目录图标
const getTocIcon = (level) => {
  const icons = {
    1: 'mdi-bookmark',
    2: 'mdi-bookmark-outline',
    3: 'mdi-chevron-right',
    4: 'mdi-chevron-right',
    5: 'mdi-chevron-right',
    6: 'mdi-chevron-right'
  }
  return icons[level] || icons[3]
}

// 滚动到指定标题
const scrollToHeading = (id) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

// 监听滚动更新当前目录项
const updateActiveTocItem = () => {
  if (!tocItems.value.length) return

  const scrollPosition = window.scrollY
  let activeItem = tocItems.value[0]

  for (const item of tocItems.value) {
    const element = document.getElementById(item.id)
    if (!element) continue

    const elementTop = element.offsetTop - 100
    if (scrollPosition >= elementTop) {
      activeItem = item
    }
  }

  activeTocItem.value = activeItem.id
}

// 监听文章内容变化
watch(() => article.value?.content, async (newContent) => {
  if (article.value?.is_knowledge_base && newContent) {
    await nextTick()
    generateToc()
  }
})

onMounted(() => {
  fetchArticle()
})

// 在文章加载完成后处理目录
watch(() => article.value, async (newArticle) => {
  if (newArticle?.is_knowledge_base) {
    await nextTick()
    generateToc()
    window.addEventListener('scroll', updateActiveTocItem)
  }
})

onUnmounted(() => {
  if (article.value?.is_knowledge_base) {
    window.removeEventListener('scroll', updateActiveTocItem)
  }
})
</script>

<style scoped>
/* 所有样式已移至 src/assets/styles/views/article.css */
.sticky-toc {
  position: sticky;
  top: 80px;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
}

.toc-list {
  padding: 8px 0;
}

.toc-item-level-1 {
  font-weight: bold;
}

.toc-item-level-2 {
  font-weight: 500;
}

.toc-item-level-3,
.toc-item-level-4,
.toc-item-level-5,
.toc-item-level-6 {
  font-size: 0.9em;
}

.v-list-item.active {
  background-color: rgba(var(--v-theme-primary), 0.1);
  color: rgb(var(--v-theme-primary));
}

.v-list-item {
  min-height: 36px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.v-list-item:hover {
  background-color: rgba(var(--v-theme-primary), 0.05);
}

/* 自定义滚动条样式 */
.sticky-toc::-webkit-scrollbar {
  width: 4px;
}

.sticky-toc::-webkit-scrollbar-track {
  background: transparent;
}

.sticky-toc::-webkit-scrollbar-thumb {
  background: rgba(var(--v-theme-primary), 0.3);
  border-radius: 2px;
}

.sticky-toc::-webkit-scrollbar-thumb:hover {
  background: rgba(var(--v-theme-primary), 0.5);
}
</style>