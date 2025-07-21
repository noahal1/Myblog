<template>
  <div class="article-demo">
    <v-container class="py-8">
      <v-row>
        <v-col cols="12">
          <h1 class="text-h3 mb-6 text-center">文章加载器演示</h1>
          
          <!-- 控制面板 -->
          <v-card class="mb-6" elevation="2">
            <v-card-title>演示控制</v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" md="4">
                  <v-btn 
                    @click="toggleLoading" 
                    :color="loading ? 'error' : 'primary'"
                    block
                  >
                    {{ loading ? '停止加载' : '开始加载演示' }}
                  </v-btn>
                </v-col>
                <v-col cols="12" md="4">
                  <v-select
                    v-model="contentType"
                    :items="contentTypes"
                    label="内容类型"
                    @update:model-value="updateContentType"
                  ></v-select>
                </v-col>
                <v-col cols="12" md="4">
                  <v-slider
                    v-model="readTime"
                    :min="1"
                    :max="20"
                    label="预估阅读时间（分钟）"
                    thumb-label
                  ></v-slider>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- 文章加载器演示 -->
          <ArticleLoader 
            :loading="loading" 
            :content-type="contentType"
            :estimated-read-time="readTime"
          >
            <!-- 演示内容 -->
            <v-card elevation="2">
              <v-card-title>演示文章标题</v-card-title>
              <v-card-text>
                <div class="demo-content" v-html="demoContent"></div>
              </v-card-text>
            </v-card>
          </ArticleLoader>

          <!-- Markdown 图片演示 -->
          <v-card class="mt-6" elevation="2" v-if="!loading">
            <v-card-title>Markdown 图片增强演示</v-card-title>
            <v-card-text>
              <div class="markdown-demo">
                <h3>图片加载效果</h3>
                <p>以下图片展示了增强的加载效果，包括骨架屏、渐进式加载和灯箱功能：</p>
                
                <!-- 模拟 markdown 图片 -->
                <div class="markdown-image-container">
                  <div class="markdown-image-skeleton" v-if="imageLoading">
                    <div class="image-skeleton-placeholder">
                      <div class="image-skeleton-icon">📷</div>
                      <div class="image-skeleton-text">加载中...</div>
                    </div>
                  </div>
                  <img 
                    v-show="!imageLoading"
                    src="https://picsum.photos/800/400?random=1" 
                    alt="演示图片 1" 
                    class="markdown-image fade-in"
                    @load="imageLoading = false"
                    @click="openLightbox"
                  />
                </div>

                <p>点击图片可以打开灯箱查看大图。支持键盘 ESC 键关闭。</p>

                <!-- 更多演示图片 -->
                <div class="markdown-images-grid grid-2 mt-4">
                  <div class="markdown-image-container">
                    <img 
                      src="https://picsum.photos/400/300?random=2" 
                      alt="演示图片 2" 
                      class="markdown-image"
                      @click="openLightbox"
                    />
                  </div>
                  <div class="markdown-image-container">
                    <img 
                      src="https://picsum.photos/400/300?random=3" 
                      alt="演示图片 3" 
                      class="markdown-image"
                      @click="openLightbox"
                    />
                  </div>
                </div>

                <h3 class="mt-6">代码块演示</h3>
                <pre class="language-javascript"><code>// 示例代码
function enhancedImageLoader() {
  const images = document.querySelectorAll('.markdown-image');
  images.forEach(img => {
    img.addEventListener('load', () => {
      img.classList.add('fade-in');
    });
  });
}</code></pre>

                <h3 class="mt-6">列表演示</h3>
                <ul>
                  <li>增强的骨架屏加载效果</li>
                  <li>智能图片预加载和懒加载</li>
                  <li>图片灯箱功能</li>
                  <li>渐进式内容加载</li>
                  <li>响应式设计适配</li>
                </ul>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- 图片灯箱 -->
    <div v-if="lightboxVisible" class="image-lightbox-overlay active" @click="closeLightbox">
      <div class="image-lightbox-content" @click.stop>
        <img :src="lightboxImage" :alt="lightboxAlt" class="image-lightbox-img" />
        <button class="image-lightbox-close" @click="closeLightbox">×</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import ArticleLoader from '../components/ArticleLoader.vue'

// 响应式数据
const loading = ref(false)
const contentType = ref('article')
const readTime = ref(5)
const imageLoading = ref(true)

// 灯箱状态
const lightboxVisible = ref(false)
const lightboxImage = ref('')
const lightboxAlt = ref('')

// 内容类型选项
const contentTypes = [
  { title: '普通文章', value: 'article' },
  { title: '知识库', value: 'knowledge' },
  { title: '教程', value: 'tutorial' }
]

// 演示内容
const demoContent = ref(`
  <h2>这是一个演示文章</h2>
  <p>这里展示了增强的文章加载器功能，包括：</p>
  <ul>
    <li>智能骨架屏生成</li>
    <li>加载进度指示</li>
    <li>内容渐进式显示</li>
    <li>图片增强处理</li>
  </ul>
  <p>加载器会根据不同的内容类型生成相应的骨架屏结构，提供更好的用户体验。</p>
`)

// 切换加载状态
const toggleLoading = () => {
  loading.value = !loading.value
  if (loading.value) {
    // 模拟加载过程
    setTimeout(() => {
      loading.value = false
    }, 3000)
  }
}

// 更新内容类型
const updateContentType = () => {
  if (loading.value) {
    // 如果正在加载，重新开始演示
    loading.value = false
    setTimeout(() => {
      loading.value = true
      setTimeout(() => {
        loading.value = false
      }, 3000)
    }, 100)
  }
}

// 打开灯箱
const openLightbox = (event) => {
  if (event.target.tagName === 'IMG') {
    lightboxImage.value = event.target.src
    lightboxAlt.value = event.target.alt || ''
    lightboxVisible.value = true
    document.body.style.overflow = 'hidden'
  }
}

// 关闭灯箱
const closeLightbox = () => {
  lightboxVisible.value = false
  lightboxImage.value = ''
  lightboxAlt.value = ''
  document.body.style.overflow = ''
}

// 键盘事件处理
const handleKeydown = (event) => {
  if (event.key === 'Escape' && lightboxVisible.value) {
    closeLightbox()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  
  // 模拟图片加载
  setTimeout(() => {
    imageLoading.value = false
  }, 2000)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.article-demo {
  min-height: 100vh;
  background: linear-gradient(135deg, 
    rgba(var(--mist-gray), 0.1) 0%, 
    rgba(var(--prussian-blue), 0.05) 100%);
}

.demo-content {
  line-height: 1.8;
}

.demo-content h2 {
  color: rgb(var(--prussian-blue));
  margin-bottom: 1rem;
}

.demo-content p {
  margin-bottom: 1rem;
  color: rgba(var(--prussian-blue), 0.8);
}

.demo-content ul {
  margin-left: 2rem;
  margin-bottom: 1rem;
}

.demo-content li {
  margin-bottom: 0.5rem;
  color: rgba(var(--prussian-blue), 0.7);
}

.markdown-demo h3 {
  color: rgb(var(--prussian-blue));
  margin: 2rem 0 1rem 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.markdown-demo p {
  margin-bottom: 1rem;
  line-height: 1.6;
  color: rgba(var(--prussian-blue), 0.8);
}

.markdown-demo ul {
  margin-left: 1.5rem;
}

.markdown-demo li {
  margin-bottom: 0.5rem;
  color: rgba(var(--prussian-blue), 0.7);
}

/* 代码块样式 */
pre {
  background: rgba(var(--prussian-blue), 0.05);
  border: 1px solid rgba(var(--prussian-blue), 0.1);
  border-radius: 8px;
  padding: 1rem;
  overflow-x: auto;
  margin: 1rem 0;
}

code {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.9rem;
  color: rgba(var(--prussian-blue), 0.9);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .markdown-images-grid.grid-2 {
    grid-template-columns: 1fr;
  }
}
</style>
