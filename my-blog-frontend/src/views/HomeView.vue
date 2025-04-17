<template>
  <div class="home-view">
    <div class="hero-banner" ref="heroBanner">
      <v-container>
        <h1 class="hero-title">
          <span class="tagline-prefix" ref="tagline">抒情与逻辑之间的</span>
          <span class="gradient-text" ref="gradientText">自留地</span>
        </h1>
        <p class="hero-subtitle" ref="subtitle">在这里，未编译的诗歌，以及持续生长的胡思乱想</p>
        
        <v-text-field
          v-model="searchQuery"
          prepend-inner-icon="mdi-magnify"
          placeholder="搜索文章、标签或关键词..."
          variant="outlined"
          hide-details
          density="comfortable"
          class="search-input mt-8"
          @keyup.enter="searchArticles"
          bg-color="surface"
          ref="searchInput"
        ></v-text-field>
      </v-container>
    </div>
    
    <v-container class="main-content py-8">
      <!-- 分类标签 -->
      <div class="category-tags mb-8" ref="categories">
        <v-chip-group v-model="selectedCategory">
          <v-chip 
            v-for="(category, index) in availableCategories" 
            :key="category.id"
            filter
            :value="category.id"
            variant="elevated"
            class="category-chip"
            :data-index="index"
          >
            {{ category.name }}
          </v-chip>
        </v-chip-group>
      </div>
    
      <!-- 加载状态 -->
      <v-skeleton-loader
        v-if="loading"
        type="card, article, article"
        class="mx-auto"
      />
      
      <!-- 文章列表 - 确保网格始终存在 -->
      <div class="articles-container">
        <!-- 始终渲染article-grid容器，而不是使用v-else -->
        <div class="article-grid" ref="articleGrid">
          <template v-if="!loading && paginatedArticles.length > 0">
            <article-card
              v-for="(article, index) in paginatedArticles"
              :key="article.id"
              :article="article"
              @click="viewArticle(article.id)"
              class="mb-4 article-item"
              :data-index="index"
            />
          </template>
          <div v-else-if="!loading" class="no-articles-placeholder" style="height: 50px;"></div>
        </div>
        
        <!-- 空状态 - 仅在非加载且无文章时显示 -->
        <div v-if="!loading && filteredArticles.length === 0" class="empty-state text-center py-8" ref="emptyState">
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
        
        <!-- 分页控件 - 仅在非加载且有足够页数时显示 -->
        <div v-if="!loading && totalPages > 1" class="pagination-wrapper text-center my-8" ref="pagination">
          <div class="text-caption mb-2">
            当前页: {{ currentPage }}, 总页数: {{ totalPages }}
          </div>
          
          <v-pagination
            v-model="currentPage"
            :length="totalPages"
            :total-visible="5"
            rounded
            class="my-5 d-inline-flex"
            @update:model-value="handlePageChange"
          ></v-pagination>
          
          <div class="text-caption text-medium-emphasis mt-2">
            显示 {{ paginationInfo.from }}-{{ paginationInfo.to }} 条，共 {{ filteredArticles.length }} 条
          </div>
        </div>
      </div>
    </v-container>
    
    <!-- 返回顶部按钮 -->
    <v-btn
      v-show="showBackToTop"
      icon
      color="primary"
      size="large"
      class="back-to-top"
      @click="scrollToTop"
    >
      <v-icon>mdi-arrow-up</v-icon>
    </v-btn>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick, onUnmounted } from 'vue'
import ArticleCard from '../components/ArticleCard.vue'
import { useRouter } from 'vue-router'
import { getArticles } from '../api'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// 导入样式
import '@/assets/styles/views/home.css'

// 注册ScrollTrigger插件
gsap.registerPlugin(ScrollTrigger)

const router = useRouter()
const loading = ref(true)
const articles = ref([])
const currentPage = ref(1)
const totalPages = ref(0) 
const searchQuery = ref('')
const selectedCategory = ref('all')
const itemsPerPage = 6 // 每页显示的文章数量
const showBackToTop = ref(false)

// DOM引用
const heroBanner = ref(null)
const tagline = ref(null)
const gradientText = ref(null)
const subtitle = ref(null)
const searchInput = ref(null)
const categories = ref(null)
const articleGrid = ref(null)
const pagination = ref(null)
const emptyState = ref(null)

// 修复DOM检查错误，创建更安全的元素检查函数
const isValidElement = (el) => {
  try {
    return el && el instanceof Element && document.body.contains(el);
  } catch (error) {
    return false;
  }
};

// 从文章中获取唯一标签来生成分类列表
const availableCategories = computed(() => {
  const categories = [{ id: 'all', name: '全部' }];
  const uniqueTags = new Set();
  
  articles.value.forEach(article => {
    if (Array.isArray(article.tags)) {
      article.tags.forEach(tag => {
        uniqueTags.add(tag);
      });
    }
  });
  
  // 添加唯一标签到分类列表
  Array.from(uniqueTags).forEach(tag => {
    categories.push({ id: tag, name: tag });
  });
  
  return categories;
});

// 获取文章列表
const fetchArticles = async () => {
  loading.value = true
  try {
    console.log('开始获取文章数据...')
    const response = await getArticles(1, 100) // 一次获取所有文章，然后在前端进行分页
    
    // 检查响应格式
    if (response && response.data) {
      if (Array.isArray(response.data)) {
        articles.value = response.data
        console.log('成功获取文章数据:', articles.value.length, '篇文章')
      } else if (response.data.items && Array.isArray(response.data.items)) {
        // 处理可能的分页响应格式
        articles.value = response.data.items
        console.log('成功获取文章数据(分页格式):', articles.value.length, '篇文章')
      } else {
        console.error('API返回的数据格式不是数组:', response.data)
        articles.value = []
      }
    } else {
      console.error('API返回的数据格式不正确:', response)
      articles.value = []
    }
    
    // 确保文章数组有效
    if (!Array.isArray(articles.value)) {
      console.error('处理后的文章数据不是数组，重置为空数组')
      articles.value = []
    }
    
    // 更新总页数
    updateTotalPages()
  } catch (error) {
    console.error('获取文章失败:', error)
    articles.value = [] // 确保出错时文章列表为空数组
  } finally {
    loading.value = false
    
    // 确保DOM已完全更新后再尝试访问元素
    setTimeout(() => {
      nextTick(() => {
        try {
          // 检查数据是否正确
          console.log('数据加载完成，文章总数:', articles.value.length)
          console.log('过滤后文章数:', filteredArticles.value.length)
          console.log('当前页文章数:', paginatedArticles.value.length)
          console.log('总页数:', totalPages.value)
          
          // 确保引用可用 - 这里是函数移出onMounted后，可以直接调用
          ensureDomRefs();
          
          if (articleGrid.value) {
            console.log('找到文章网格容器，长度:', 
              articleGrid.value.children ? articleGrid.value.children.length : 0,
              '，可见性:', 
              window.getComputedStyle(articleGrid.value).display !== 'none'
            );
            forceRerender();
            animateArticles();
          } else {
            console.error('无法找到文章网格容器，尝试最后的修复方法');
            // 最后的尝试
            const gridElement = document.querySelector('.article-grid');
            if (gridElement) {
              articleGrid.value = gridElement;
              gridElement.style.display = 'grid';
              forceRerender();
              animateArticles();
            }
          }
        } catch (error) {
          console.error('处理加载后数据时出错:', error);
        }
      });
    }, 300);
  }
}

// 更新总页数
const updateTotalPages = () => {
  // 确保filteredArticles是有效的
  if (!filteredArticles.value || !Array.isArray(filteredArticles.value)) {
    totalPages.value = 1;
    return;
  }
  
  const filteredCount = filteredArticles.value.length;
  const calculatedPages = Math.max(1, Math.ceil(filteredCount / itemsPerPage));
  
  console.log(`更新总页数: ${calculatedPages} (基于 ${filteredCount} 篇文章, 每页 ${itemsPerPage} 篇)`);
  totalPages.value = calculatedPages;
  
  // 确保当前页在有效范围内
  if (currentPage.value > totalPages.value) {
    currentPage.value = Math.max(1, totalPages.value);
    console.log(`当前页超出范围，重置为: ${currentPage.value}`);
  }
};

// 筛选文章
const filteredArticles = computed(() => {
  let result = [...articles.value]
  
  // 搜索筛选
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(article => 
      article.title.toLowerCase().includes(query) || 
      article.summary.toLowerCase().includes(query) ||
      (Array.isArray(article.tags) && article.tags.some(tag => 
        tag.toLowerCase().includes(query)
      ))
    )
  }
  
  // 分类筛选
  if (selectedCategory.value && selectedCategory.value !== 'all') {
    result = result.filter(article => 
      Array.isArray(article.tags) && 
      article.tags.includes(selectedCategory.value)
    )
  }
  
  return result
})

// 分页后的文章
const paginatedArticles = computed(() => {
  // 确保当前页码有效
  if (currentPage.value < 1 || isNaN(currentPage.value)) {
    currentPage.value = 1;
  }
  
  // 确保总页数有效
  if (totalPages.value < 1) {
    updateTotalPages();
  }
  
  // 计算起始和结束索引
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  
  // 确保返回有效的数组切片
  return filteredArticles.value.slice(start, Math.min(end, filteredArticles.value.length));
})

// 分页信息
const paginationInfo = computed(() => {
  const total = filteredArticles.value.length
  const from = total === 0 ? 0 : (currentPage.value - 1) * itemsPerPage + 1
  const to = Math.min(currentPage.value * itemsPerPage, total)
  
  return { from, to, total }
})

const handlePageChange = (page) => {
  console.log('页码变化:', page);
  
  // 验证页码有效性
  if (page < 1 || page > totalPages.value || isNaN(page)) {
    console.error(`无效的页码: ${page}，范围应为 1-${totalPages.value}`);
    page = Math.max(1, Math.min(page, totalPages.value));
  }
  
  currentPage.value = page;
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
  setTimeout(() => {
    nextTick(() => {
      nextTick(() => {
        console.log('页面更新后的数据:', 
          '当前页:', currentPage.value, 
          '每页文章:', paginatedArticles.value.length
        );
        
        ensureDomRefs();
        forceRerender();
        animateArticles();
      });
    });
  }, 50);
};

// 搜索文章
const searchArticles = () => {
  // 重置到第一页
  currentPage.value = 1
  // 更新总页数
  updateTotalPages()
}

// 重置筛选器
const resetFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = 'all'
  currentPage.value = 1
  updateTotalPages()
}

// 查看文章详情
const viewArticle = (id) => {
  router.push(`/article/${id}`)
}

// 检查滚动位置
const checkScrollPosition = () => {
  showBackToTop.value = window.scrollY > (window.innerHeight / 3)
}

// 滚动到页面顶部
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// 监听筛选条件变化
watch([searchQuery, selectedCategory], () => {
  currentPage.value = 1 // 重置到第一页
  updateTotalPages() // 更新总页数
  
  nextTick(() => {
    if (filteredArticles.value.length === 0) {
      animateEmptyState()
    } else {
      animateArticles()
    }
  })
})

// 设置视差效果
const setupParallaxEffects = () => {
  ScrollTrigger.getAll().forEach(st => st.kill());
  
  // 使用window滚动监听器
  const handleScroll = () => {
    const scrollY = window.scrollY;
    const speed1 = 0.3;  // 标题移动速度
    const speed2 = 0.2;  // 副标题移动速度
    
    if (tagline.value) {
      gsap.set(tagline.value, { y: scrollY * speed1 });
    }
    
    if (gradientText.value) {
      gsap.set(gradientText.value, { 
        y: scrollY * speed1 * 0.7,
        backgroundPosition: `${scrollY * 0.05}% 50%` // 滚动时渐变背景移动
      });
    }
    
    if (subtitle.value) {
      const opacity = Math.max(0.7, 1 - (scrollY * 0.001));
      gsap.set(subtitle.value, { 
        y: scrollY * speed2,
        opacity: opacity
      });
    }
  };
  
  // 添加滚动监听器
  window.addEventListener('scroll', handleScroll);
  
  // 返回清理函数
  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
}

// 初始动画 - 使用GSAP
const animateHero = () => {
  try {
    // 更安全的元素检查
    const safeGradientText = gradientText.value && isValidElement(gradientText.value) ? gradientText.value : null;
    const safeTagline = tagline.value && isValidElement(tagline.value) ? tagline.value : null;
    const safeSubtitle = subtitle.value && isValidElement(subtitle.value) ? subtitle.value : null;
    const safeSearchInput = searchInput.value && isValidElement(searchInput.value) ? searchInput.value : null;
    
    // 提前检查是否有足够元素可用
    const hasEnoughElements = safeGradientText || safeTagline || safeSubtitle;
    if (!hasEnoughElements) {
      console.warn('关键DOM元素不足，跳过动画');
      return () => {}; // 返回空清理函数
    }
    
    // 构建有效元素列表
    const elements = [];
    if (safeGradientText) elements.push({ el: safeGradientText, name: 'gradientText' });
    if (safeTagline) elements.push({ el: safeTagline, name: 'tagline' });
    if (safeSubtitle) elements.push({ el: safeSubtitle, name: 'subtitle' });
    if (safeSearchInput) elements.push({ el: safeSearchInput, name: 'searchInput' });
    
    // 安全地设置样式
    elements.forEach(item => {
      try {
        if (item.el) {
          item.el.style.opacity = '1';
          item.el.style.transform = 'translateY(0)';
          console.log(`成功设置${item.name}样式`);
        }
      } catch (error) {
        console.error(`设置${item.name}样式时出错:`, error);
      }
    });
    
    // 添加类来激活CSS动画
    try {
      if (safeGradientText) {
        safeGradientText.classList.add('animated');
      }
    } catch (error) {
      console.error('添加动画类时出错:', error);
    }
    
    // 使用原生JS替代GSAP进行视差效果
    const setupBasicParallax = () => {
      const handleScroll = () => {
        requestAnimationFrame(() => {
          try {
            const scrollY = window.scrollY;
            const speed1 = 0.1; // 降低速度
            const speed2 = 0.05; // 降低速度
            
            // 安全地设置样式，使用先前验证过的元素
            elements.forEach(item => {
              try {
                if (item.el && isValidElement(item.el)) {
                  const speedFactor = item.name === 'gradientText' ? speed1 * 0.7 : 
                                    item.name === 'tagline' ? speed1 : speed2;
                  item.el.style.transform = `translateY(${scrollY * speedFactor}px)`;
                }
              } catch (error) {
                // 忽略滚动处理错误
              }
            });
          } catch (error) {
            // 忽略滚动处理错误
          }
        });
      };
      
      // 添加滚动监听器
      window.addEventListener('scroll', handleScroll);
      
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    };
    
    return setupBasicParallax();
  } catch (error) {
    console.error('animateHero函数执行错误:', error);
    return () => {}; // 出错时返回空清理函数
  }
};

// 文章项动画
const animateArticles = () => {
  console.log('开始执行文章动画，文章数量:', paginatedArticles.value.length)
  
  // 如果引用不存在，尝试重新获取DOM元素
  if (!articleGrid.value) {
    articleGrid.value = document.querySelector('.article-grid')
    console.log('尝试重新获取articleGrid:', articleGrid.value ? '成功' : '失败')
  }
  
  if (!articleGrid.value) {
    console.warn('articleGrid元素不存在，跳过动画')
    return
  }
  
  // 查找文章元素
  const articles = articleGrid.value.querySelectorAll('.article-item')
  console.log('找到文章DOM元素数量:', articles.length)
  
  if (articles.length === 0) {
    console.warn('未找到文章DOM元素')
    return
  }
  
  // 使用原生JS替代GSAP
  articles.forEach((article, index) => {
    // 安全检查
    if (!article || !document.body.contains(article)) return;
    
    // 设置初始样式
    article.style.opacity = '0';
    article.style.transform = 'translateY(20px)';
    
    // 设置过渡效果
    article.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
    
    // 延迟执行以确保过渡生效
    setTimeout(() => {
      article.style.opacity = '1';
      article.style.transform = 'translateY(0)';
    }, 10);
  });
  
  // 文章显示完成后，显示分页
  if (pagination.value) {
    // 安全检查
    if (document.body.contains(pagination.value)) {
      // 设置过渡效果
      pagination.value.style.opacity = '0';
      pagination.value.style.transform = 'translateY(10px)';
      pagination.value.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      
      // 延迟显示分页
      setTimeout(() => {
        pagination.value.style.opacity = '1';
        pagination.value.style.transform = 'translateY(0)';
      }, articles.length * 100 + 100); // 等待所有文章动画完成
    }
  }
}

// 空状态动画
const animateEmptyState = () => {
  if (!emptyState.value || !document.body.contains(emptyState.value)) return;
  
  emptyState.value.style.opacity = '0';
  emptyState.value.style.transform = 'translateY(30px)';
  emptyState.value.style.transition = 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.25, 0.1, 0.25, 1.5)';

  setTimeout(() => {
    emptyState.value.style.opacity = '1';
    emptyState.value.style.transform = 'translateY(0)';
  }, 10);
}

// 强制重新渲染组件
const forceRerender = () => {
  // 如果引用不存在，尝试重新获取DOM元素
  if (!articleGrid.value) {
    articleGrid.value = document.querySelector('.article-grid')
    console.log('尝试重新获取articleGrid (forceRerender):', articleGrid.value ? '成功' : '失败')
  }
  
  // 确保文章容器可见
  if (!articleGrid.value) {
    console.error('文章网格容器不存在')
    return
  }
  
  // 检查文章卡片是否存在
  const articleItems = articleGrid.value.querySelectorAll('.article-item')
  console.log('文章卡片元素数量:', articleItems.length, '，数据数量:', paginatedArticles.value.length)
  
  // 如果DOM中没有文章卡片但数据中有文章，执行手动渲染
  if (articleItems.length === 0 && paginatedArticles.value.length > 0) {
    console.log('执行手动渲染文章卡片...')
    
    // 先移除所有子元素
    while (articleGrid.value.firstChild) {
      articleGrid.value.removeChild(articleGrid.value.firstChild)
    }
    
    // 手动创建文章卡片元素
    paginatedArticles.value.forEach((article, index) => {
      const articleElement = document.createElement('div')
      articleElement.className = 'article-item mb-4'
      articleElement.setAttribute('data-index', index)
      articleElement.innerHTML = `
        <div class="article-card">
          <div class="card-content">
            <div class="title text-primary">${article.title || '无标题'}</div>
            <div class="preview">${article.summary || '暂无摘要'}</div>
            <div class="meta">
              <span>${article.created_at ? new Date(article.created_at).toLocaleDateString() : '未知日期'}</span>
              <span>浏览: ${article.views || 0}</span>
            </div>
          </div>
        </div>
      `
      articleElement.addEventListener('click', () => viewArticle(article.id))
      articleGrid.value.appendChild(articleElement)
      
      // 设置初始样式
      articleElement.style.opacity = '0';
      articleElement.style.transform = 'translateY(20px)';
      
      // 设置过渡效果
      articleElement.style.transition = `opacity 0.3s ease ${index * 0.1}s, transform 0.3s ease ${index * 0.1}s`;
      
      // 延迟执行以确保过渡生效
      setTimeout(() => {
        articleElement.style.opacity = '1';
        articleElement.style.transform = 'translateY(0)';
      }, 10);
    })
    
    console.log('手动渲染完成，添加了', paginatedArticles.value.length, '个文章卡片')
    
    // 如果分页控件存在，确保其可见
    if (pagination.value && totalPages.value > 1) {
      // 安全检查
      if (document.body.contains(pagination.value)) {
        pagination.value.style.opacity = '1';
        pagination.value.style.transform = 'translateY(0)';
      }
    }
  }
}

// 添加缺失的ensureDomRefs函数定义
// 改进ensureDomRefs函数，使用更稳定的DOM查询
const ensureDomRefs = () => {
  try {
    // 为了更稳定访问，使用延迟函数创建一次性定时器
    setTimeout(() => {
      try {
        // 等待DOM稳定后再查询
        const heroContainer = document.querySelector('.home-view');
        if (!heroContainer) {
          console.warn('找不到主容器.home-view');
          return;
        }
        
        // 主要容器都找到了，再查找内部元素
        if (!heroBanner.value) heroBanner.value = heroContainer.querySelector('.hero-banner');
        if (!tagline.value) tagline.value = heroContainer.querySelector('.tagline-prefix');
        if (!gradientText.value) gradientText.value = heroContainer.querySelector('.gradient-text');
        if (!subtitle.value) subtitle.value = heroContainer.querySelector('.hero-subtitle');
        if (!searchInput.value) searchInput.value = heroContainer.querySelector('.search-input');
        if (!categories.value) categories.value = heroContainer.querySelector('.category-tags');
        
        // 文章网格相关元素
        const articlesContainer = heroContainer.querySelector('.articles-container');
        if (articlesContainer) {
          if (!articleGrid.value) {
            articleGrid.value = articlesContainer.querySelector('.article-grid');
            if (articleGrid.value) {
              console.log('成功通过DOM查询找到文章网格');
              // 确保网格容器可见
              articleGrid.value.style.opacity = '1';
              articleGrid.value.style.display = 'grid';
            } else {
              console.error('DOM中不存在.article-grid元素，尝试创建');
              // 尝试创建缺失元素
              const newGrid = document.createElement('div');
              newGrid.className = 'article-grid';
              articlesContainer.insertBefore(newGrid, articlesContainer.firstChild);
              articleGrid.value = newGrid;
              console.log('已创建文章网格容器');
            }
          }
          
          if (!pagination.value) pagination.value = articlesContainer.querySelector('.pagination-wrapper');
          if (!emptyState.value) emptyState.value = articlesContainer.querySelector('.empty-state');
        } else {
          console.error('无法找到.articles-container容器');
        }
        
        // 记录结果
        console.log('DOM引用检查结果:', {
          heroBanner: !!heroBanner.value,
          tagline: !!tagline.value,
          gradientText: !!gradientText.value,
          subtitle: !!subtitle.value,
          searchInput: !!searchInput.value,
          categories: !!categories.value,
          articleGrid: !!articleGrid.value,
          pagination: !!pagination.value,
          emptyState: !!emptyState.value
        });
        
        // 检查文章网格的状态
        if (articleGrid.value && isValidElement(articleGrid.value)) {
          const style = window.getComputedStyle(articleGrid.value);
          console.log('文章网格详情:', {
            display: style.display,
            visibility: style.visibility,
            opacity: style.opacity,
            childrenCount: articleGrid.value.children.length
          });
        }
      } catch (error) {
        console.error('DOM引用检查失败(内部错误):', error);
      }
    }, 100);
  } catch (error) {
    console.error('DOM引用检查失败(外部错误):', error);
  }
};

// 存储清理函数
let cleanupFunction = null;

onMounted(() => {
  // 立即设置主容器可见
  document.documentElement.style.opacity = '1';
  const homeView = document.querySelector('.home-view');
  if (homeView) {
    homeView.style.opacity = '1';
    homeView.style.visibility = 'visible';
  }
  
  // 确保DOM引用可用
  nextTick(() => {
    try {
      // 延迟执行DOM引用检查，确保组件已经完全渲染
      setTimeout(() => {
        ensureDomRefs();
        
        // 在DOM更新后尝试应用动画
        nextTick(() => {
          try {
            // 然后应用动画
            cleanupFunction = animateHero();
          } catch (error) {
            console.error('初始化动画时出错:', error);
          }
          
          // 监听滚动事件（用于回到顶部按钮）
          window.addEventListener('scroll', checkScrollPosition);
          
          // 加载文章数据 - 放在最后确保DOM元素已准备好
          fetchArticles();
        });
      }, 200);
    } catch (error) {
      console.error('组件挂载时出错:', error);
      // 即使出错也尝试加载文章
      setTimeout(fetchArticles, 500);
    }
  });
});

// 组件卸载时清除
onUnmounted(() => {
  // 调用清理函数
  if (typeof cleanupFunction === 'function') {
    cleanupFunction();
  }
  
  // 移除事件监听
  window.removeEventListener('scroll', checkScrollPosition);
  
  // 清除所有ScrollTrigger实例
  ScrollTrigger.getAll().forEach(st => st.kill());
});
</script>