<template>
  <div
    class="glass-article-card organic-float asymmetric-layout organic-shadow hover-lift click-feedback"
    :class="{
      'hovered': isHovered,
      'organic-shape-1': cardVariant === 1,
      'organic-shape-2': cardVariant === 2,
      'subtle-tilt-1': cardVariant === 3,
      'subtle-tilt-2': cardVariant === 4
    }"
    :style="{ '--float-delay': `${cardDelay}s` }"
    @click="handleCardClick"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <!-- 装饰性渐变边框 -->
    <div class="card-border-glow"></div>

    <!-- 主要内容区域 -->
    <div class="card-content">
      <!-- 文章标题 -->
      <h3 class="article-title">
        {{ article.title }}
      </h3>

      <!-- 元信息 -->
      <div class="article-meta">
        <div class="meta-item">
          <v-icon icon="mdi-account-circle" size="16" class="meta-icon" />
          <span>{{ article.author_name || '未知作者' }}</span>
        </div>

        <div class="meta-item">
          <v-icon icon="mdi-calendar-outline" size="16" class="meta-icon" />
          <span>{{ formattedDate }}</span>
        </div>

        <div class="meta-item">
          <v-icon icon="mdi-eye-outline" size="16" class="meta-icon" />
          <span>{{ article.views || 0 }}</span>
        </div>

        <div class="meta-item">
          <v-icon icon="mdi-comment-outline" size="16" class="meta-icon" />
          <span>{{ article.comments_count || 0 }}</span>
        </div>
      </div>

      <!-- 文章摘要 -->
      <p class="article-summary">
        {{ article.summary }}
      </p>

      <!-- 底部操作区 -->
      <div class="card-actions">
        <div class="like-section">
          <button
            class="glass-btn-like button-magnetic click-feedback state-transition focus-ring"
            :class="{
              'liked': hasLiked,
              'state-success': likeSuccess
            }"
            @click.stop="handleLike"
            tabindex="0"
            :aria-label="`${hasLiked ? '取消' : ''}点赞文章`"
          >
            <v-icon
              :icon="hasLiked ? 'mdi-heart' : 'mdi-heart-outline'"
              size="18"
            />
            <span>{{ article.likes || 0 }}</span>
          </button>
        </div>

        <button
          class="glass-btn-read fluid-button button-magnetic click-feedback focus-ring"
          @click.stop="handleCardClick"
          tabindex="0"
          :aria-label="`阅读文章：${article.title}`"
        >
          <span>阅读更多</span>
          <v-icon icon="mdi-arrow-right" size="18" class="ml-1" />
        </button>
      </div>
    </div>

    <!-- 悬浮时的光效 -->
    <div class="card-shine"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { likeArticle } from '../api'
import '@/assets/styles/views/home.css'
import '../assets/animate.css'

// 定义props
const props = defineProps({
  article: {
    type: Object,
    required: true,
    default: () => ({
      id: 0,
      title: '无标题文章',
      summary: '暂无摘要',
      created_at: new Date(),
      views: 0,
      comments: 0
    })
  }
});

// 定义事件
defineEmits(['click']);

// 悬停状态
const isHovered = ref(false);
// 点赞状态
const hasLiked = ref(false);
// 点赞成功状态
const likeSuccess = ref(false);
// 卡片变体（用于非均匀化设计）
const cardVariant = ref(Math.floor(Math.random() * 4) + 1);
// 动画延迟
const cardDelay = ref(Math.random() * 2);

// 处理卡片点击
const handleCardClick = () => {
  console.log('查看文章:', props.article.id);
  emit('click');
};

// 处理点赞
const handleLike = async (event) => {
  event.stopPropagation(); // 阻止事件冒泡，避免触发卡片点击

  if (hasLiked.value) return; // 防止重复点赞

  try {
    const response = await likeArticle(props.article.id);
    if (response.data && response.data.likes) {
      props.article.likes = response.data.likes;
      hasLiked.value = true;

      // 显示成功状态
      likeSuccess.value = true;
      setTimeout(() => {
        likeSuccess.value = false;
      }, 600);

      // 将点赞状态保存到本地存储
      const likedArticles = JSON.parse(localStorage.getItem('likedArticles') || '{}');
      likedArticles[props.article.id] = true;
      localStorage.setItem('likedArticles', JSON.stringify(likedArticles));
    }
  } catch (error) {
    console.error('点赞失败:', error);
  }
};

// 使用固定颜色，不依赖主题
const primaryColor = '#3F51B5';

// 日期格式化
const formatDate = (date) => {
  if (!date) return '暂无日期';
  
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  });
};

const router = useRouter();

const viewArticle = () => {
  console.log('查看文章:', props.article.id)
  router.push({
    name: 'article',
    params: { id: props.article.id }
  })
};

// 使用计算属性优化频繁计算
const formattedDate = computed(() => formatDate(props.article.created_at))

// 检查是否已点赞
const checkIfLiked = () => {
  const likedArticles = JSON.parse(localStorage.getItem('likedArticles') || '{}');
  hasLiked.value = !!likedArticles[props.article.id];
};

// 在组件挂载时检查点赞状态
onMounted(() => {
  checkIfLiked();
});
</script>

<style scoped>
/* === 玻璃拟态文章卡片 === */
.glass-article-card {
  position: relative;
  background: var(--glass-gradient);
  backdrop-filter: var(--blur-md);
  -webkit-backdrop-filter: var(--blur-md);
  border: 1px solid var(--glass-border-light);
  border-radius: var(--radius-organic-lg);
  box-shadow: var(--shadow-glass-md);
  cursor: pointer;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
  transform: translateZ(0);
  will-change: transform, box-shadow;
}

/* 装饰性边框光效 */
.card-border-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(var(--primary-blue), 0.6) 25%,
    rgba(var(--secondary-purple), 0.4) 50%,
    rgba(var(--accent-orange), 0.3) 75%,
    transparent 100%);
  opacity: 0;
  transition: opacity 0.4s ease;
}

/* 悬浮状态 */
.glass-article-card:hover,
.glass-article-card.hovered {
  background: var(--glass-gradient-hover);
  box-shadow: var(--shadow-glass-xl);
  transform: translateY(-8px) scale(1.02) rotateX(2deg);
  border-color: rgba(var(--primary-blue), 0.3);
}

.glass-article-card:hover .card-border-glow {
  opacity: 1;
}

/* 内容区域 */
.card-content {
  padding: 24px;
  position: relative;
  z-index: 2;
}

/* 文章标题 */
.article-title {
  font-size: 1.35rem;
  font-weight: 700;
  line-height: 1.4;
  margin-bottom: 16px;
  color: var(--text-primary);
  transition: all 0.3s ease;
}

.glass-article-card:hover .article-title {
  color: rgb(var(--primary-indigo));
  transform: translateY(-2px);
  filter: drop-shadow(0 2px 8px rgba(var(--primary-indigo), 0.3));
}

/* 元信息区域 */
.article-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.glass-article-card:hover .article-meta {
  opacity: 1;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.meta-icon {
  opacity: 0.7;
  transition: all 0.3s ease;
}

.meta-item:hover .meta-icon {
  opacity: 1;
  color: rgb(var(--primary-blue));
  transform: scale(1.1);
}

/* 文章摘要 */
.article-summary {
  font-size: 0.95rem;
  line-height: 1.7;
  color: var(--text-secondary);
  margin-bottom: 20px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.3s ease;
}

.glass-article-card:hover .article-summary {
  color: var(--text-primary);
}

/* 底部操作区 */
.card-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

/* 点赞按钮 */
.glass-btn-like {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: transparent;
  border: 1px solid rgba(var(--accent-rose), 0.2);
  border-radius: var(--radius-organic-sm);
  color: var(--text-secondary);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.glass-btn-like:hover {
  background: rgba(var(--accent-rose), 0.1);
  border-color: rgba(var(--accent-rose), 0.4);
  color: rgb(var(--accent-rose));
  transform: scale(1.05);
  box-shadow: 0 0 15px rgba(var(--accent-rose), 0.2);
}

.glass-btn-like.liked {
  background: linear-gradient(135deg,
    rgba(var(--accent-rose), 0.2) 0%,
    rgba(var(--accent-rose), 0.1) 100%);
  border-color: rgba(var(--accent-rose), 0.5);
  color: rgb(var(--accent-rose));
  box-shadow: 0 0 20px rgba(var(--accent-rose), 0.3);
}

/* 阅读更多按钮 */
.glass-btn-read {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 10px 20px;
  background: var(--cosmic-gradient);
  border: 1px solid rgba(var(--primary-indigo), 0.3);
  border-radius: var(--radius-organic-sm);
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  backdrop-filter: var(--blur-sm);
  -webkit-backdrop-filter: var(--blur-sm);
  box-shadow: 0 0 15px rgba(var(--primary-indigo), 0.2);
}

.glass-btn-read:hover {
  background: var(--aurora-gradient);
  border-color: rgba(var(--accent-cyan), 0.4);
  transform: translateX(4px) scale(1.02);
  box-shadow:
    var(--shadow-glass-sm),
    0 0 25px rgba(var(--accent-cyan), 0.3);
}

/* 悬浮光效 */
.card-shine {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg,
    transparent 30%,
    rgba(255, 255, 255, 0.1) 50%,
    transparent 70%);
  transform: translateX(-100%) translateY(-100%) rotate(45deg);
  transition: transform 0.6s ease;
  pointer-events: none;
}

.glass-article-card:hover .card-shine {
  transform: translateX(100%) translateY(100%) rotate(45deg);
}

/* === 响应式设计优化 === */

/* 平板设备 */
@media (min-width: 768px) and (max-width: 1024px) {
  .card-content {
    padding: 22px;
  }

  .article-title {
    font-size: 1.3rem;
    margin-bottom: 14px;
  }

  .article-meta {
    gap: 14px;
    margin-bottom: 14px;
  }

  .meta-item {
    font-size: 0.83rem;
  }

  .article-summary {
    font-size: 0.93rem;
    margin-bottom: 18px;
  }

  .glass-btn-read {
    padding: 9px 18px;
    font-size: 0.88rem;
  }

  .glass-btn-like {
    padding: 7px 11px;
    font-size: 0.83rem;
  }
}

/* 移动设备 */
@media (max-width: 767px) {
  .glass-article-card {
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-radius: 16px;
    margin: 8px 0;
  }

  .glass-article-card:hover {
    transform: translateY(-3px) scale(1.01);
    box-shadow: var(--shadow-glass-lg);
  }

  .card-content {
    padding: 18px;
  }

  .article-title {
    font-size: 1.15rem;
    margin-bottom: 12px;
    line-height: 1.3;
  }

  .article-meta {
    gap: 10px;
    margin-bottom: 12px;
    flex-wrap: wrap;
  }

  .meta-item {
    font-size: 0.8rem;
  }

  .article-summary {
    font-size: 0.9rem;
    margin-bottom: 16px;
    -webkit-line-clamp: 2; /* 减少行数 */
  }

  .card-actions {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .glass-btn-read {
    padding: 12px 20px;
    font-size: 0.9rem;
    justify-content: center;
    width: 100%;
  }

  .glass-btn-like {
    padding: 8px 12px;
    font-size: 0.85rem;
    align-self: flex-start;
  }

  .like-section {
    order: 2;
  }

  /* 简化动画 */
  .organic-float {
    animation: none;
  }

  .card-shine {
    display: none; /* 禁用光效以提升性能 */
  }
}

/* 小屏幕移动设备 */
@media (max-width: 480px) {
  .glass-article-card {
    border-radius: 14px;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }

  .card-content {
    padding: 16px;
  }

  .article-title {
    font-size: 1.1rem;
    margin-bottom: 10px;
  }

  .article-meta {
    gap: 8px;
    margin-bottom: 10px;
  }

  .meta-item {
    font-size: 0.75rem;
  }

  .article-summary {
    font-size: 0.85rem;
    margin-bottom: 14px;
    line-height: 1.5;
  }

  .glass-btn-read {
    padding: 10px 16px;
    font-size: 0.85rem;
  }

  .glass-btn-like {
    padding: 6px 10px;
    font-size: 0.8rem;
  }

  /* 禁用复杂效果 */
  .glass-article-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }
}

/* 横屏移动设备 */
@media (max-width: 767px) and (orientation: landscape) {
  .card-content {
    padding: 14px 18px;
  }

  .article-title {
    font-size: 1.05rem;
    margin-bottom: 8px;
  }

  .article-summary {
    -webkit-line-clamp: 2;
    margin-bottom: 12px;
  }

  .card-actions {
    flex-direction: row;
    gap: 8px;
  }

  .glass-btn-read {
    width: auto;
    flex: 1;
  }
}

/* === 暗色模式专项适配 === */
.v-theme--dark .glass-article-card {
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.08) 0%,
    rgba(255, 255, 255, 0.04) 100%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

.v-theme--dark .glass-article-card:hover,
.v-theme--dark .glass-article-card.hovered {
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.12) 0%,
    rgba(255, 255, 255, 0.06) 100%);
  border-color: rgba(var(--primary-blue), 0.4);
  box-shadow:
    0 16px 64px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

.v-theme--dark .card-border-glow {
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(var(--primary-blue), 0.8) 25%,
    rgba(var(--secondary-purple), 0.6) 50%,
    rgba(var(--accent-orange), 0.5) 75%,
    transparent 100%);
}

.v-theme--dark .article-title {
  color: rgba(255, 255, 255, 0.95);
}

.v-theme--dark .glass-article-card:hover .article-title {
  color: rgba(var(--primary-blue), 1);
}

.v-theme--dark .article-meta {
  opacity: 0.7;
}

.v-theme--dark .glass-article-card:hover .article-meta {
  opacity: 0.9;
}

.v-theme--dark .meta-item {
  color: rgba(255, 255, 255, 0.7);
}

.v-theme--dark .meta-item:hover .meta-icon {
  color: rgba(var(--primary-blue), 0.9);
}

.v-theme--dark .article-summary {
  color: rgba(255, 255, 255, 0.7);
}

.v-theme--dark .glass-article-card:hover .article-summary {
  color: rgba(255, 255, 255, 0.9);
}

.v-theme--dark .glass-btn-like {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.7);
}

.v-theme--dark .glass-btn-like:hover {
  background: rgba(var(--accent-pink), 0.15);
  border-color: rgba(var(--accent-pink), 0.4);
  color: rgba(var(--accent-pink), 0.9);
}

.v-theme--dark .glass-btn-like.liked {
  background: rgba(var(--accent-pink), 0.2);
  border-color: rgba(var(--accent-pink), 0.5);
  color: rgba(var(--accent-pink), 1);
}

.v-theme--dark .glass-btn-read {
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.05) 100%);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: rgba(var(--primary-blue), 0.9);
}

.v-theme--dark .glass-btn-read:hover {
  background: linear-gradient(135deg,
    rgba(var(--primary-blue), 0.2) 0%,
    rgba(var(--secondary-purple), 0.15) 100%);
  border-color: rgba(var(--primary-blue), 0.4);
  color: rgba(var(--primary-blue), 1);
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.v-theme--dark .card-shine {
  background: linear-gradient(45deg,
    transparent 30%,
    rgba(255, 255, 255, 0.08) 50%,
    transparent 70%);
}
</style>