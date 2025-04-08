<template>
  <div class="article-view">
    <v-container class="py-8">
      <!-- 加载状态 -->
        <v-skeleton-loader
        v-if="loading"
        type="article, image, paragraph, paragraph"
        class="mx-auto"
      />
      
      <!-- 文章内容 -->
      <template v-else-if="article">
        <div class="article-header mb-6">
          <h1 class="text-h3 mb-3">{{ article.title }}</h1>
          <div class="d-flex flex-wrap align-center mb-4">
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
            
            <!-- 日期和阅读时间 -->
            <div class="text-caption text-medium-emphasis ml-auto">
              {{ formatDate(article.published_at || article.created_at || article.publish_date || new Date()) }} 
              <span v-if="article.read_time">· {{ article.read_time }} 分钟阅读</span>
            </div>
          </div>
        </div>
        
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
    </v-container>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchArticle as fetchMockArticle } from '../utils/mock-api'
import { renderMarkdown } from '../utils/markdown'  // 导入 markdown 渲染函数

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const article = ref(null)

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
import { getArticle } from '../api'

const fetchArticle = async () => {
  loading.value = true
  try {
    console.log('获取文章ID:', route.params.id)
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
      if (isHTML(article.value.content)) {
        article.value.renderedContent = article.value.content
      } else {
        article.value.renderedContent = renderMarkdown(article.value.content)
      }
    }
    
    // 设置文档标题
    document.title = `${data.title || '无标题'} - 我的博客`
  } catch (error) {
    console.error('获取文章失败:', error)
    article.value = null
  } finally {
    loading.value = false
  }
}

// 在组件挂载时获取文章
onMounted(() => {
  fetchArticle()
})
</script>

<style scoped>
.article-view {
  min-height: 100vh;
}

.article-content {
  font-size: 1.1rem;
  line-height: 1.8;
}

/* Markdown 内容样式 */
.markdown-body {
  color: var(--text-primary);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
  font-size: 16px;
  line-height: 1.6;
  word-wrap: break-word;
  padding: 16px 0;
}

.markdown-body h1,
.markdown-body h2,
.markdown-body h3,
.markdown-body h4,
.markdown-body h5,
.markdown-body h6 {
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  font-weight: 600;
  line-height: 1.25;
}

.markdown-body h1 { font-size: 2em; border-bottom: 1px solid var(--border-color, #eaecef); padding-bottom: 0.3em; }
.markdown-body h2 { font-size: 1.5em; border-bottom: 1px solid var(--border-color, #eaecef); padding-bottom: 0.3em; }
.markdown-body h3 { font-size: 1.25em; }
.markdown-body h4 { font-size: 1em; }
.markdown-body h5 { font-size: 0.875em; }
.markdown-body h6 { font-size: 0.85em; color: var(--text-secondary); }

.markdown-body p {
  margin-bottom: 1.2em;
}

.markdown-body a {
  color: var(--primary);
  text-decoration: none;
}

.markdown-body a:hover {
  text-decoration: underline;
}

.markdown-body img {
  max-width: 100%;
  border-radius: 4px;
  margin: 1em 0;
}

.markdown-body pre {
  background-color: var(--surface);
  padding: 1em;
  border-radius: 4px;
  overflow-x: auto;
  margin: 1em 0;
}

.markdown-body code {
  background-color: rgba(var(--primary-blue), 0.1);
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-family: 'Fira Code', monospace;
  font-size: 0.9em;
}

.markdown-body pre code {
  background-color: transparent;
  padding: 0;
}

.markdown-body blockquote {
  border-left: 4px solid var(--primary);
  padding-left: 1em;
  margin-left: 0;
  color: var(--text-secondary);
}
</style>