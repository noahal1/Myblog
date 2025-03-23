<template>
  <div class="article-list">
    <div
      v-for="article in articles"
      :key="article.id"
      class="md-card"
      @click="navigateToArticle(article.id)"
    >
      <div class="card-content">
        <h3 class="title text-primary">{{ article.title }}</h3>
        <div class="meta">
          <v-icon name="schedule" class="mr-2" />
          <span class="caption">{{ formatDate(article.created_at) }}</span>
        </div>
        <p class="preview">{{ article.summary }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.md-card {
  border-radius: 16px;
  margin-bottom: 24px;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1),
              0 2px 8px rgba(0, 0, 0, 0.08);
  width: calc(100% - 40px);
  margin: 0 auto 24px;
  padding: 24px;

  &:hover {
    transform: translateY(-6px) scale(1.02);
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15),
                0 4px 16px rgba(0, 0, 0, 0.12);
    background: rgba(255, 255, 255, 0.85);
    cursor: pointer;
  }

  @media (max-width: 768px) {
    width: calc(100% - 20px);
    margin: 0 auto 16px;
    padding: 16px;
    .title {
      font-size: 1.35rem;
      margin-bottom: 1rem;
    }
    .preview {
      -webkit-line-clamp: 3;
      font-size: 0.95rem;
    }
    .meta {
      font-size: 0.85rem;
      .vi-icon {
        width: 16px;
        height: 16px;
      }
    }
  }
}

.title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.25rem;
  line-height: 1.3;
}

.meta {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.preview {
  color: var(--text-primary);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 0.5rem;
}
</style>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import NavBar from '@/components/NavBar.vue'

const router = useRouter()

// 模拟数据
const articles = ref(Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  title: `技术文章标题 ${i + 1}`,
  summary: '这是文章的摘要内容，简要说明文章的核心观点和技术细节...',
  createdAt: new Date(),
  views: Math.floor(Math.random() * 1000),
  comments: Math.floor(Math.random() * 50)
})))

const total = ref(100)
const pageSize = ref(12)

const formatDate = (article) => {
  return article?.createdAt?.toLocaleDateString('zh-CN') ?? '暂无日期';
};

const navigateToArticle = (id) => {
  router.push(`/article/${id}`)
}

const handlePageChange = (currentPage) => {
  console.log('当前页码:', currentPage)
}
</script>

.article-list {
  margin-top: 70px; /* 为固定导航栏预留空间 */
}

.article-card {
  margin-bottom: 20px;
  transition: transform 0.3s;
}

.article-card:hover {
  transform: translateY(-5px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  margin: 0;
  font-size: 1.1em;
}

.time {
  color: #999;
  font-size: 0.9em;
}

.content {
  color: #666;
  line-height: 1.6;
  height: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
}

.stats {
  color: #999;
  font-size: 0.9em;
}

.stats span {
  margin-left: 10px;
}
<style scoped>
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
}
.stats {
  color: #999;
  font-size: 0.9em;
}
.stats span {
  margin-left: 10px;
}
.pagination {
  margin-top: 30px;
  justify-content: center;
}

.title {
  color: #3442509f;
  font-weight: 800;
}

.preview {
  color: #34495e;
  line-height: 1.8;
}

.md-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
}

.meta {
  color: #666;
}

.vi-icon {
  width: 18px;
  height: 18px;
}
</style>