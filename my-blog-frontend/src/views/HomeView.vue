<template>
  <div class="home-view">
    <section class="hero-banner" ref="heroBanner" role="banner" aria-labelledby="hero-title">
      <tree-background :height="400" />
      <v-container>
        <h1 id="hero-title" class="hero-title">
          <span class="tagline-prefix" ref="tagline">抒情与逻辑之间的</span>
          <span class="gradient-text" ref="gradientText">自留地</span>
        </h1>
        <p class="hero-subtitle" ref="subtitle">在这里，未编译的诗歌，以及持续生长的胡思乱想</p>
        
        <div class="glass-search-container">
          <div class="search-wrapper hover-lift-subtle focus-ring">
            <v-icon icon="mdi-magnify" class="search-icon" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索文章、标签或关键词..."
              class="glass-search-input focus-ring"
              @keyup.enter="searchArticles"
              @focus="onSearchFocus"
              @blur="onSearchBlur"
              ref="searchInput"
              :aria-label="'搜索文章'"
            />
            <div class="search-glow"></div>
            <div v-if="isSearching" class="search-loading">
              <div class="loading-pulse"></div>
            </div>
          </div>
        </div>
      </v-container>
    </section>
    
    <v-container class="main-content py-4 pb-0">
      <!-- 分类标签 -->
      <section class="glass-category-section mb-6" ref="categories" role="region" aria-labelledby="category-heading">
        <div class="category-container">
          <h2 id="category-heading" class="category-label">
            <v-icon icon="mdi-tag-multiple-outline" class="mr-2" aria-hidden="true" />
            <span>分类筛选</span>
          </h2>
          <div class="glass-chip-group" role="group" aria-labelledby="category-heading">
            <button
              v-for="category in availableCategories"
              :key="category.id"
              :class="['glass-chip', 'button-magnetic', 'click-feedback', 'focus-ring', { 'active': selectedCategory === category.id }]"
              @click="handleCategorySelect(category.id)"
              tabindex="0"
              :aria-label="`筛选${category.name}分类`"
              :aria-pressed="selectedCategory === category.id"
              role="button"
            >
              <span>{{ category.name }}</span>
              <div class="chip-glow" aria-hidden="true"></div>
            </button>
          </div>
        </div>
      </section>
    
      <!-- 内容区域：包含加载状态、文章列表和分页 -->
      <div class="content-area">
        <!-- 加载状态 -->
        <v-skeleton-loader
          v-if="loading"
          type="card, article, article"
          class="mx-auto"
        />
        
        <!-- 文章列表 -->
        <div v-else class="articles-container">
          <!-- 空状态 -->
          <div v-if="filteredArticles.length === 0" class="empty-state text-center py-8" ref="emptyState">
            <v-icon icon="mdi-text-search" size="64" class="mb-4 empty-icon"></v-icon>
            <h3 class="text-h5">无法找到符合条件的文章</h3>
            <p class="text-body-1">尝试调整搜索条件或查看其他分类</p>
            <v-btn 
              color="primary" 
              class="mt-4"
              prepend-icon="mdi-refresh"
              @click="resetFilters"
            >
              重置筛选条件
            </v-btn>
          </div>
          
          <!-- 文章网格 -->
          <section v-else role="main" aria-labelledby="articles-heading">
            <h2 id="articles-heading" class="sr-only">文章列表</h2>

            <!-- 加载状态 -->
            <div v-if="isLoading" class="article-grid" aria-live="polite" aria-label="正在加载文章">
              <SkeletonLoader
                v-for="n in itemsPerPage"
                :key="`skeleton-${n}`"
                type="article-card"
                class="mb-4 article-item gpu-accelerated"
                :aria-label="`加载中 ${n}`"
              />
            </div>

            <!-- 文章内容 -->
            <div
              v-else
              class="article-grid"
              ref="articleGrid"
              role="feed"
              :aria-label="`共${filteredArticles.length}篇文章，当前显示第${currentPage}页`"
            >
              <article-card
                v-for="(article, index) in paginatedArticles"
                :key="article.id"
                :article="article"
                @click="viewArticle(article.id)"
                class="mb-4 article-item gpu-accelerated"
                :class="{'animate-item': true}"
                :style="{
                  '--animation-delay': `${index * 0.1}s`,
                  'animation-play-state': isAnimating ? 'running' : 'paused'
                }"
                role="article"
                :aria-label="`文章：${article.title}`"
              />
            </div>
            
            <!-- 玻璃拟态分页控件 -->
            <div class="glass-pagination-wrapper" ref="pagination">
              <div class="pagination-container hover-lift-subtle">
                <button
                  v-if="currentPage > 1"
                  @click="handlePageChange(currentPage - 1)"
                  class="glass-pagination-btn prev-btn button-magnetic click-feedback focus-ring"
                  :aria-label="'上一页'"
                >
                  <v-icon icon="mdi-chevron-left" size="20" />
                </button>

                <div class="pagination-numbers">
                  <button
                    v-for="page in visiblePages"
                    :key="page"
                    @click="handlePageChange(page)"
                    :class="['glass-pagination-number', 'button-magnetic', 'click-feedback', 'focus-ring', { 'active': page === currentPage }]"
                    :aria-label="`第${page}页`"
                    :aria-current="page === currentPage ? 'page' : undefined"
                  >
                    {{ page }}
                  </button>
                </div>

                <button
                  v-if="currentPage < totalPages"
                  @click="handlePageChange(currentPage + 1)"
                  class="glass-pagination-btn next-btn button-magnetic click-feedback focus-ring"
                  :aria-label="'下一页'"
                >
                  <v-icon icon="mdi-chevron-right" size="20" />
                </button>
              </div>

              <div class="pagination-info">
                <span class="info-text">共 {{ filteredArticles.length }} 篇文章</span>
              </div>
            </div>
          </section>
          
        </div>
      </div>
    </v-container>
    <!-- 玻璃拟态返回顶部按钮 -->
    <button
      v-show="showBackToTop"
      class="glass-back-to-top organic-pulse button-magnetic click-feedback focus-ring"
      @click="scrollToTop"
      :aria-label="'返回顶部'"
      tabindex="0"
    >
      <v-icon icon="mdi-arrow-up" size="24" />
      <div class="button-glow"></div>
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import ArticleCard from '../components/ArticleCard.vue';
import SkeletonLoader from '../components/SkeletonLoader.vue';
import TreeBackground from '../components/TreeBackground.vue';
import { getArticles } from '../api';

import '@/assets/styles/views/home.css';

// 基本状态
const router = useRouter();
const loading = ref(true);
const articles = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
const searchQuery = ref('');
const selectedCategory = ref('all');
const showBackToTop = ref(false);
const isAnimating = ref(false);
const isSearching = ref(false);
const isLoading = ref(true);
const itemsPerPage = 6; // 每页显示的文章数量

// DOM引用
const heroBanner = ref(null);
const tagline = ref(null);
const gradientText = ref(null);
const subtitle = ref(null);
const searchInput = ref(null);
const categories = ref(null);
const articleGrid = ref(null);
const pagination = ref(null);
const emptyState = ref(null);

// 滚动监听器清理函数
let scrollCleanup = null;

// 从文章中提取唯一标签作为分类
const availableCategories = computed(() => {
  const categories = [{ id: 'all', name: '全部' }];
  const uniqueTags = new Set();
  
  if (!articles.value || !Array.isArray(articles.value)) return categories;
  
  articles.value.forEach(article => {
    if (Array.isArray(article.tags)) {
      article.tags.forEach(tag => {
        if (tag) uniqueTags.add(tag);
      });
    }
  });
  
  Array.from(uniqueTags).forEach(tag => {
    categories.push({ id: tag, name: tag });
  });
  
  return categories;
});

// 筛选文章
const filteredArticles = computed(() => {
  if (!articles.value || !Array.isArray(articles.value)) return [];
  
  let result = [...articles.value];
  
  // 搜索筛选
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(article => 
      (article.title && article.title.toLowerCase().includes(query)) || 
      (article.summary && article.summary.toLowerCase().includes(query)) ||
      (Array.isArray(article.tags) && article.tags.some(tag => 
        tag && tag.toLowerCase().includes(query)
      ))
    );
  }
  
  // 分类筛选
  if (selectedCategory.value && selectedCategory.value !== 'all') {
    result = result.filter(article => 
      Array.isArray(article.tags) && 
      article.tags.includes(selectedCategory.value)
    );
  }
  
  return result;
});

// 分页后的文章
const paginatedArticles = computed(() => {
  // 确保当前页码有效
  const validCurrentPage = Math.max(1, Math.min(currentPage.value, totalPages.value));
  if (validCurrentPage !== currentPage.value) {
    currentPage.value = validCurrentPage;
  }

  // 计算切片范围
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  return filteredArticles.value.slice(start, end);
});

// 可见的分页页码
const visiblePages = computed(() => {
  const total = totalPages.value;
  const current = currentPage.value;
  const visible = [];

  if (total <= 7) {
    // 如果总页数小于等于7，显示所有页码
    for (let i = 1; i <= total; i++) {
      visible.push(i);
    }
  } else {
    // 否则显示当前页前后各2页
    const start = Math.max(1, current - 2);
    const end = Math.min(total, current + 2);

    for (let i = start; i <= end; i++) {
      visible.push(i);
    }
  }

  return visible;
});

// 分页信息
const paginationInfo = computed(() => {
  const total = filteredArticles.value.length;
  const from = total === 0 ? 0 : (currentPage.value - 1) * itemsPerPage + 1;
  const to = Math.min(currentPage.value * itemsPerPage, total);
  
  return { from, to, total };
});

const fetchArticles = async () => {
  loading.value = true;
  isLoading.value = true;

  try {
    // 设置knowledge_base=false参数，只获取非知识库文章
    const response = await getArticles(1, 100, false);

    // 处理响应
    if (response && response.data) {
      if (Array.isArray(response.data)) {
        articles.value = response.data;
      } else if (response.data.items && Array.isArray(response.data.items)) {
        articles.value = response.data.items;
      } else {
        articles.value = [];
        console.error('API返回的数据格式不是数组:', response.data);
      }
    } else {
      articles.value = [];
    }

    console.log(`获取到 ${articles.value.length} 篇文章`);
    
    // 更新总页数
    updateTotalPages();
  } catch (error) {
    console.error('获取文章失败:', error);
    articles.value = [];
  } finally {
    loading.value = false;

    // 模拟加载时间以展示骨架屏效果
    setTimeout(() => {
      isLoading.value = false;

      // 加载完成后应用动画效果
      nextTick(() => {
        isAnimating.value = true;
        setupHeroAnimation();
      });
    }, 800);
  }
};

// 更新总页数
const updateTotalPages = () => {
  const count = filteredArticles.value.length;
  totalPages.value = Math.max(1, Math.ceil(count / itemsPerPage));
  
  // 确保当前页在有效范围内
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value;
  }
};

// 处理页码变化 - 简化逻辑
const handlePageChange = (page) => {
  // 确保页码有效
  currentPage.value = Math.max(1, Math.min(page, totalPages.value));
  
  // 平滑滚动到顶部
  window.scrollTo({ top: 0, behavior: 'smooth' });
  isAnimating.value = false;
  nextTick(() => {
    isAnimating.value = true;
  });
};

// 搜索文章
const searchArticles = () => {
  isSearching.value = true;
  setTimeout(() => {
    currentPage.value = 1;
    updateTotalPages();
    isSearching.value = false;
  }, 300);
};

// 处理分类选择
const handleCategorySelect = (categoryId) => {
  selectedCategory.value = categoryId;
  currentPage.value = 1;
  updateTotalPages();
};

// 搜索框焦点事件
const onSearchFocus = () => {
  console.log('搜索框获得焦点');
};

const onSearchBlur = () => {
  console.log('搜索框失去焦点');
};

// 重置筛选器
const resetFilters = () => {
  searchQuery.value = '';
  selectedCategory.value = 'all';
  currentPage.value = 1;
  updateTotalPages();
};

// 查看文章详情
const viewArticle = (id) => {
  router.push(`/article/${id}`);
};

// 检查滚动位置 (用于返回顶部按钮)
const checkScrollPosition = () => {
  showBackToTop.value = window.scrollY > (window.innerHeight / 3);
};

// 滚动到页面顶部
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

const setupHeroAnimation = () => {
  // 先检查元素是否存在
  const elements = {
    tagline: tagline.value,
    gradientText: gradientText.value,
    subtitle: subtitle.value
  };
  
  // 如果关键元素不存在，则不设置动画
  if (!elements.tagline || !elements.gradientText || !elements.subtitle) {
    console.warn('部分关键元素缺失，跳过设置动画');
    return;
  }
  
  // 添加渐变文本动画类
  if (elements.gradientText) {
    elements.gradientText.classList.add('animated');
  }
  
  // 设置视差滚动
  const handleScroll = () => {
    requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      const speed1 = 0.1; // 标题移动速度
      const speed2 = 0.05; // 副标题移动速度
      
      // 安全地应用变换
      try {
        
        
        if (elements.subtitle && document.body.contains(elements.subtitle)) {
          elements.subtitle.style.transform = `translateY(${scrollY * speed2}px)`;
          elements.subtitle.style.opacity = Math.max(0.7, 1 - (scrollY * 0.01));
        }
      } catch (error) {
      }
    });
  };
  
  // 添加滚动监听器
  window.addEventListener('scroll', handleScroll);
  
  // 返回清理函数
  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
};

// 监听筛选条件变化
watch([searchQuery, selectedCategory], () => {
  currentPage.value = 1;
  updateTotalPages();
  
  // 重置动画
  isAnimating.value = false;
  nextTick(() => {
    isAnimating.value = true;
  });
});

// 组件挂载
onMounted(() => {
  // 确保页面可见
  const homeView = document.querySelector('.home-view');
  if (homeView) homeView.style.opacity = '1';
  
  // 监听滚动事件
  window.addEventListener('scroll', checkScrollPosition);
  
  // 获取文章数据
  fetchArticles();
  
  // 设置视差动画
  nextTick(() => {
    scrollCleanup = setupHeroAnimation();
  });
});

// 组件卸载
onUnmounted(() => {
  // 移除滚动监听
  window.removeEventListener('scroll', checkScrollPosition);
  
  // 清理视差动画
  if (typeof scrollCleanup === 'function') {
    scrollCleanup();
  }
});

// 获取最近更新日期
const getLatestUpdateDate = () => {
  if (!articles.value || articles.value.length === 0) return '暂无';
  
  const sortedArticles = [...articles.value].sort((a, b) => {
    const dateA = a.updated_at || a.created_at;
    const dateB = b.updated_at || b.created_at;
    return new Date(dateB) - new Date(dateA);
  });
  
  const latestArticle = sortedArticles[0];
  const dateStr = latestArticle.updated_at || latestArticle.created_at;
  
  if (!dateStr) return '暂无';
  
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return '暂无';
  }
};
</script>

<style scoped>
.animate-item {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 2s forwards;
  animation-delay: var(--animation-delay, 1s);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 空状态动画 */
.empty-state {
  animation: bounceIn 0.8s cubic-bezier(0.25, 0.1, 0.25, 1.5);
}

@keyframes bounceIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.article-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 2rem;
}

@media (max-width: 600px) {
  .article-grid {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 601px) and (max-width: 960px) {
  .article-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 分页控件优化样式 */
.pagination-wrapper {
  opacity: 1 !important;
  visibility: visible !important;
  display: flex !important;
  flex-direction: column;
  align-items: center;
  margin-top: 1rem !important;
  margin-bottom: 0 !important;
  padding-bottom: 0 !important;
  transition: all 0.3s ease;
}

.pagination-component {
  position: relative;
  z-index: 1;
}

.pagination-component :deep(.v-pagination__item) {
  transition: transform 0.2s ease, background-color 0.2s ease;
  font-weight: 500;
  min-width: 36px;
  height: 36px;
  margin: 0 4px;
  border-radius: 50%;
}

.pagination-component :deep(.v-pagination__item--is-active) {
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.pagination-component :deep(.v-pagination__item:not(.v-pagination__item--is-active):hover) {
  background-color: rgba(var(--v-theme-primary), 0.1);
  transform: translateY(-2px);
}

.pagination-component :deep(.v-pagination__navigation) {
  border-radius: 50%;
  background-color: rgba(var(--v-theme-primary), 0.05);
  transition: all 0.2s ease;
}

.pagination-component :deep(.v-pagination__navigation:hover) {
  background-color: rgba(var(--v-theme-primary), 0.15);
  transform: translateY(-2px);
}

.page-info {
  font-size: 0.85rem;
  color: rgba(0, 0, 0, 0.6);
  transition: opacity 0.3s ease;
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* 响应式调整 */
@media (max-width: 600px) {
  .pagination-component :deep(.v-pagination__item) {
    min-width: 32px;
    height: 32px;
    margin: 0 2px;
  }
  
  .pagination-component :deep(.v-pagination__navigation) {
    min-width: 32px;
    height: 32px;
  }
}

:deep(.v-main) {
  --v-layout-bottom: 0px !important;
;
}

:deep(.v-application__wrap) {
  min-height: auto !important;
}

.main-content {
  padding-bottom: 0 !important;
  margin-bottom: 0 !important;
}

.home-view {
  margin-bottom: 0 !important;
  padding-bottom: 0 !important;
}

:deep(.v-container) {
  padding-bottom: 0 !important;
}

:deep(.v-footer) {
  margin-top: 0 !important;
}

</style>