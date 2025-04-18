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
  border-radius: var(--border-radius);
  overflow: hidden;
  transition: all var(--transition-slow), transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  background: linear-gradient(
    var(--gradient-angle),
    rgba(var(--v-theme-surface), 0.85),
    rgba(var(--v-theme-surface), 0.75)
  );
  backdrop-filter: blur(10px);
  box-shadow: var(--card-shadow);
  height: 100%;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  border: 1px solid rgba(var(--primary-blue), 0.08);
  position: relative;
  will-change: transform, box-shadow;
}

.article-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: var(--hover-shadow);
  border-color: rgba(var(--primary-blue), 0.15);
}

.article-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg,
    rgba(var(--primary-blue), 0.7),
    rgba(var(--secondary-purple), 0.5),
    rgba(var(--accent-orange), 0.3)
  );
  transform: scaleX(0);
  transform-origin: top;
  transition: transform var(--transition-default);
}

.article-card:hover::before {
  transform: scaleX(1);
}

.card-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px;
}

.title {
  font-size: 1.35rem;
  font-weight: 700;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color var(--transition-default);
  margin-bottom: 8px;
}

.article-card:hover .title {
  background: var(--neon-gradient);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.meta {
  display: flex;
  align-items: center;
  opacity: 0.8;
  margin-bottom: 12px;
}

.preview {
  flex: 1;
  line-height: 1.6;
  color: rgb(var(--text-secondary));
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 16px;
}

.actions {
  margin-top: auto;
  padding-bottom: 0%;
  padding-top: 4px;
  border-top: 1px solid rgba(var(--text-primary), 0.1);
}

.read-more {
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.read-more::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 0;
  background: linear-gradient(90deg, 
    rgba(var(--primary-blue), 0.1), 
    rgba(var(--secondary-purple), 0.05)
  );
  transition: height var(--transition-default);
  z-index: -1;
  border-radius: 4px;
}

.read-more:hover::after {
  height: 100%;
}

.read-more .v-icon {
  transition: transform var(--transition-default);
}

.read-more:hover .v-icon {
  transform: translateX(4px);
}

@media (max-width: 600px) {
  .title {
    font-size: 1.2rem;
  }
  
  .preview {
    -webkit-line-clamp: 2;
    font-size: 0.95rem;
  }
}
</style>