<template>
  <v-card
    class="article-card"
    :elevation="isHovered ? 8 : 2"
    :ripple="false"
    @click="$emit('click')"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <div class="card-content">
      <!-- 文章标题 -->
      <v-card-title class="title text-primary pb-0" v-once>
        {{ article.title }}
      </v-card-title>
      <v-card-subtitle class="meta py-2">
        <v-icon icon="mdi-calendar" size="small" class="mr-1" />
        <span class="text-caption">{{ formattedDate }}</span>
        
        <v-icon icon="mdi-eye" size="small" class="ml-3 mr-1" />
        <span class="text-caption">{{ article.views || 0 }}</span>
        
        <v-icon icon="mdi-comment" size="small" class="ml-3 mr-1" />
        <span class="text-caption">{{ article.comments_count || 0 }}</span>

        <v-btn
          icon="mdi-thumb-up-outline"
          size="x-small"
          variant="text"
          class="ml-2"
          @click.stop="handleLike"
          :color="hasLiked ? 'primary' : ''"
        ></v-btn>
        <span class="text-caption">{{ article.likes || 0 }}</span>
      </v-card-subtitle>
      
      <!-- 文章摘要 -->
      <v-card-text class="preview py-2">
        {{ article.summary }}
      </v-card-text>
      
      <!-- 阅读更多按钮 -->
      <v-card-actions class="actions">
        <v-spacer></v-spacer>
        <v-btn
          variant="text"
          color="primary"
          @click.stop="$emit('click')"
          class="mt-2"
        >
          阅读更多
        </v-btn>
      </v-card-actions>
    </div>
  </v-card>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { likeArticle } from '../api'

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

// 处理点赞
const handleLike = async (event) => {
  event.stopPropagation(); // 阻止事件冒泡，避免触发卡片点击
  
  if (hasLiked.value) return; // 防止重复点赞
  
  try {
    const response = await likeArticle(props.article.id);
    if (response.data && response.data.likes) {
      props.article.likes = response.data.likes;
      hasLiked.value = true;
      
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
    month: 'long',
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
.article-card {
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 100%;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  will-change: transform, box-shadow; /* 性能优化 */
  transform: translateZ(0); /* 硬件加速 */
  contain: content; /* 内容包含优化 */
}

.article-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.card-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  height: 100%;
  contain: content; /* 内容包含优化 */
}

.title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.preview {
  font-size: 0.95rem;
  color: #666;
  margin-bottom: 1rem;
  line-height: 1.5;
  contain: content; /* 内容包含优化 */
}

.meta {
  font-size: 0.85rem;
  color: #999;
  display: flex;
  align-items: center;
}

.actions {
  margin-top: auto;
}

/* 深色模式适配 */
:deep(.v-theme--dark) .article-card {
  background: #212121;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

:deep(.v-theme--dark) .article-card:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

/* 响应式调整 */
@media (max-width: 600px) {
  .title {
    font-size: 1.1rem;
  }
  
  .preview {
    font-size: 0.85rem;
  }
}
</style>