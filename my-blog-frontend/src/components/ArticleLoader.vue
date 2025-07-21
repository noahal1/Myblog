<template>
  <div class="article-loader-container">
    <!-- 文章标题骨架屏 -->
    <div v-if="loading" class="article-title-skeleton">
      <div class="skeleton-title-main skeleton"></div>
      <div class="skeleton-title-meta">
        <div class="skeleton-meta-item skeleton"></div>
        <div class="skeleton-meta-item skeleton"></div>
        <div class="skeleton-meta-item skeleton"></div>
      </div>
    </div>

    <!-- 文章内容骨架屏 -->
    <div v-if="loading" class="article-content-skeleton">
      <!-- 模拟段落 -->
      <div v-for="paragraph in skeletonParagraphs" :key="paragraph.id" class="skeleton-paragraph">
        <div 
          v-for="line in paragraph.lines" 
          :key="line.id"
          class="skeleton-line skeleton"
          :class="line.width"
        ></div>

        <div v-if="paragraph.hasImage" class="skeleton-image-container">
          <div class="skeleton-image skeleton"></div>
          <div class="skeleton-image-caption skeleton"></div>
        </div>
      </div>

      <!-- 代码块骨架屏 -->
      <div v-if="hasCodeBlocks" class="skeleton-code-block">
        <div class="skeleton-code-header">
          <div class="skeleton-code-lang skeleton"></div>
          <div class="skeleton-code-copy skeleton"></div>
        </div>
        <div class="skeleton-code-content">
          <div v-for="n in 5" :key="n" class="skeleton-code-line skeleton"></div>
        </div>
      </div>

      <!-- 列表骨架屏 -->
      <div v-if="hasLists" class="skeleton-list">
        <div v-for="n in 4" :key="n" class="skeleton-list-item">
          <div class="skeleton-list-bullet skeleton"></div>
          <div class="skeleton-list-text skeleton"></div>
        </div>
      </div>
    </div>

    <!-- 加载进度指示器 -->
    <div v-if="loading" class="loading-progress">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: `${loadingProgress}%` }"></div>
      </div>
      <div class="progress-text">{{ loadingText }}</div>
    </div>

    <!-- 实际内容 -->
    <div v-if="!loading" class="article-content-wrapper" :class="{ 'content-loaded': contentLoaded }">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  loading: {
    type: Boolean,
    default: true
  },
  contentType: {
    type: String,
    default: 'article', // 'article', 'knowledge', 'tutorial'
    validator: (value) => ['article', 'knowledge', 'tutorial'].includes(value)
  },
  estimatedReadTime: {
    type: Number,
    default: 5 // 预估阅读时间（分钟）
  }
})

const contentLoaded = ref(false)
const loadingProgress = ref(0)
const loadingText = ref('正在加载文章...')

// 根据内容类型生成不同的骨架屏结构
const skeletonParagraphs = ref([])
const hasCodeBlocks = ref(false)
const hasLists = ref(false)

// 生成骨架屏结构
const generateSkeletonStructure = () => {
  const paragraphCount = props.contentType === 'tutorial' ? 8 : 
                        props.contentType === 'knowledge' ? 12 : 6
  
  skeletonParagraphs.value = Array.from({ length: paragraphCount }, (_, index) => ({
    id: index,
    lines: generateParagraphLines(),
    hasImage: Math.random() > 0.7 // 30% 概率有图片
  }))

  // 根据内容类型决定是否有代码块和列表
  hasCodeBlocks.value = props.contentType === 'tutorial' || Math.random() > 0.6
  hasLists.value = props.contentType === 'knowledge' || Math.random() > 0.5
}

// 生成段落行
const generateParagraphLines = () => {
  const lineCount = Math.floor(Math.random() * 4) + 2 // 2-5行
  const widthClasses = ['short', 'medium', 'long', 'full']
  
  return Array.from({ length: lineCount }, (_, index) => ({
    id: index,
    width: widthClasses[Math.floor(Math.random() * widthClasses.length)]
  }))
}

// 模拟加载进度
const simulateLoadingProgress = () => {
  const stages = [
    { progress: 20, text: '正在获取文章数据...' },
    { progress: 40, text: '正在解析Markdown内容...' },
    { progress: 60, text: '正在处理图片资源...' },
    { progress: 80, text: '正在渲染页面内容...' },
    { progress: 100, text: '加载完成！' }
  ]

  let currentStage = 0
  const interval = setInterval(() => {
    if (currentStage < stages.length && props.loading) {
      loadingProgress.value = stages[currentStage].progress
      loadingText.value = stages[currentStage].text
      currentStage++
    } else {
      clearInterval(interval)
    }
  }, 300)

  return interval
}

// 监听loading状态变化
watch(() => props.loading, (newLoading) => {
  if (!newLoading) {
    setTimeout(() => {
      contentLoaded.value = true
    }, 100)
  } else {
    contentLoaded.value = false
    loadingProgress.value = 0
    simulateLoadingProgress()
  }
})

onMounted(() => {
  generateSkeletonStructure()
  if (props.loading) {
    simulateLoadingProgress()
  }
})
</script>

<style scoped>
.article-loader-container {
  width: 100%;
  min-height: 400px;
}

/* 文章标题骨架屏 */
.article-title-skeleton {
  margin-bottom: 2rem;
}

.skeleton-title-main {
  height: 2.5rem;
  width: 80%;
  margin-bottom: 1rem;
  border-radius: 8px;
}

.skeleton-title-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.skeleton-meta-item {
  height: 1.5rem;
  width: 80px;
  border-radius: 4px;
}

/* 文章内容骨架屏 */
.article-content-skeleton {
  margin-bottom: 2rem;
}

.skeleton-paragraph {
  margin-bottom: 2rem;
}

.skeleton-line {
  height: 1.2rem;
  margin-bottom: 0.8rem;
  border-radius: 4px;
}

.skeleton-line.short { width: 60%; }
.skeleton-line.medium { width: 80%; }
.skeleton-line.long { width: 95%; }
.skeleton-line.full { width: 100%; }

/* 图片骨架屏 */
.skeleton-image-container {
  margin: 2rem 0;
}

.skeleton-image {
  height: 200px;
  width: 100%;
  border-radius: 8px;
  margin-bottom: 0.5rem;
}

.skeleton-image-caption {
  height: 1rem;
  width: 40%;
  border-radius: 4px;
}

/* 代码块骨架屏 */
.skeleton-code-block {
  margin: 2rem 0;
  border-radius: 8px;
  overflow: hidden;
  background: rgba(var(--mist-gray), 0.1);
}

.skeleton-code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: rgba(var(--prussian-blue), 0.1);
}

.skeleton-code-lang {
  height: 1rem;
  width: 80px;
  border-radius: 4px;
}

.skeleton-code-copy {
  height: 1rem;
  width: 60px;
  border-radius: 4px;
}

.skeleton-code-content {
  padding: 1rem;
}

.skeleton-code-line {
  height: 1rem;
  margin-bottom: 0.5rem;
  border-radius: 4px;
}

.skeleton-code-line:nth-child(1) { width: 90%; }
.skeleton-code-line:nth-child(2) { width: 75%; }
.skeleton-code-line:nth-child(3) { width: 85%; }
.skeleton-code-line:nth-child(4) { width: 60%; }
.skeleton-code-line:nth-child(5) { width: 80%; }

/* 列表骨架屏 */
.skeleton-list {
  margin: 2rem 0;
}

.skeleton-list-item {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.skeleton-list-bullet {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 1rem;
  flex-shrink: 0;
}

.skeleton-list-text {
  height: 1rem;
  flex: 1;
  border-radius: 4px;
}

/* 加载进度 */
.loading-progress {
  margin: 2rem 0;
  text-align: center;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: rgba(var(--mist-gray), 0.3);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, 
    rgb(var(--prussian-blue)), 
    rgba(var(--prussian-blue), 0.7));
  border-radius: 2px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.9rem;
  color: rgba(var(--prussian-blue), 0.8);
  font-weight: 500;
}

/* 内容加载完成动画 */
.article-content-wrapper {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s ease;
}

.article-content-wrapper.content-loaded {
  opacity: 1;
  transform: translateY(0);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .skeleton-title-main {
    height: 2rem;
  }
  
  .skeleton-image {
    height: 150px;
  }
  
  .skeleton-title-meta {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
