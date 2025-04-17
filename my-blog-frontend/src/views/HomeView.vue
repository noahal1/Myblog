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
      
      <!-- 文章列表 -->
      <div v-else class="articles-container">
        <div class="article-grid" ref="articleGrid">
          <template v-if="paginatedArticles.length > 0">
            <article-card
              v-for="(article, index) in paginatedArticles"
              :key="article.id"
              :article="article"
              @click="viewArticle(article.id)"
              class="mb-4 article-item"
              :data-index="index"
            />
          </template>
          <div v-else class="no-articles-placeholder" style="height: 50px;"></div>
        </div>
        
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
        
        <!-- 分页控件 -->
        <div v-if="totalPages > 1" class="pagination-wrapper text-center my-8" ref="pagination">
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
    const response = await getArticles(1, 100) 
    
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
        // 检查数据是否正确
        console.log('数据加载完成，文章总数:', articles.value.length)
        console.log('过滤后文章数:', filteredArticles.value.length)
        console.log('当前页文章数:', paginatedArticles.value.length)
        console.log('总页数:', totalPages.value)
        
        // 确保引用可用
        ensureDomRefs();
        
        if (articleGrid.value) {
          console.log('找到文章网格容器，长度:', 
            articleGrid.value.children.length,
            '，可见性:', 
            window.getComputedStyle(articleGrid.value).display !== 'none'
          );
          forceRerender();
          animateArticles();
        } else {
          console.error('无法找到文章网格容器，尝试最后的修复方法');
          // 最后的尝试 - 直接在DOM中查找并强制显示
          const gridElement = document.querySelector('.article-grid');
          if (gridElement) {
            articleGrid.value = gridElement;
            gridElement.style.display = 'grid';
            forceRerender();
            animateArticles();
          }
        }
      });
    }, 300); // 增加延迟以确保DOM更新
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

// 处理页码变化
const handlePageChange = (page) => {
  console.log('页码变化:', page);
  
  // 验证页码有效性
  if (page < 1 || page > totalPages.value || isNaN(page)) {
    console.error(`无效的页码: ${page}，范围应为 1-${totalPages.value}`);
    page = Math.max(1, Math.min(page, totalPages.value));
  }
  
  currentPage.value = page;
  
  // 滚动到顶部
  window.scrollTo({ top: 0, behavior: 'smooth' });
  
  // 使用延时和双重nextTick确保在生产环境中也能正确更新
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
  // 清除之前可能存在的ScrollTrigger实例
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
      // 保持副标题可见但有轻微移动
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
  // 检查元素存在性
  if (!gradientText.value || !tagline.value || !subtitle.value || !searchInput.value) {
    console.warn('部分DOM元素未找到，跳过动画');
    return () => {}; // 返回空清理函数
  }
  
  // 首先确保元素可见（初始不透明度设置为1）
  const elements = [gradientText.value, tagline.value, subtitle.value, searchInput.value].filter(Boolean);
  
  // 安全地设置样式
  elements.forEach(el => {
    if (el && document.body.contains(el)) {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }
  });
  
  // 添加类来激活CSS动画
  if (gradientText.value && document.body.contains(gradientText.value)) {
    gradientText.value.classList.add('animated');
  }
  
  // 使用原生JS替代GSAP进行视差效果
  const setupBasicParallax = () => {
    const handleScroll = () => {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const speed1 = 0.1; // 降低速度
        const speed2 = 0.05; // 降低速度
        
        // 安全地设置样式
        if (tagline.value && document.body.contains(tagline.value)) {
          tagline.value.style.transform = `translateY(${scrollY * speed1}px)`;
        }
        
        if (gradientText.value && document.body.contains(gradientText.value)) {
          gradientText.value.style.transform = `translateY(${scrollY * speed1 * 0.7}px)`;
        }
        
        if (subtitle.value && document.body.contains(subtitle.value)) {
          subtitle.value.style.transform = `translateY(${scrollY * speed2}px)`;
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
}

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
  
  // 使用原生JS替代GSAP
  emptyState.value.style.opacity = '0';
  emptyState.value.style.transform = 'translateY(30px)';
  emptyState.value.style.transition = 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.25, 0.1, 0.25, 1.5)';
  
  // 延迟执行以确保过渡生效
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

// 存储清理函数
let cleanupFunction = null;

onMounted(() => {
  // 为了确保DOM引用更稳定，添加备用获取方法
  const ensureDomRefs = () => {
    // 重新获取引用
    if (!heroBanner.value) heroBanner.value = document.querySelector('.hero-banner');
    if (!tagline.value) tagline.value = document.querySelector('.tagline-prefix');
    if (!gradientText.value) gradientText.value = document.querySelector('.gradient-text');
    if (!subtitle.value) subtitle.value = document.querySelector('.hero-subtitle');
    if (!searchInput.value) searchInput.value = document.querySelector('.search-input');
    if (!categories.value) categories.value = document.querySelector('.category-tags');
    if (!articleGrid.value) {
      const grid = document.querySelector('.article-grid');
      if (grid) {
        articleGrid.value = grid;
        console.log('成功通过DOM查询找到文章网格');
      } else {
        console.error('DOM中不存在.article-grid元素');
      }
    }
    if (!pagination.value) pagination.value = document.querySelector('.pagination-wrapper');
    if (!emptyState.value) emptyState.value = document.querySelector('.empty-state');
    
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
    if (articleGrid.value) {
      console.log('文章网格详情:', {
        display: window.getComputedStyle(articleGrid.value).display,
        visibility: window.getComputedStyle(articleGrid.value).visibility,
        opacity: window.getComputedStyle(articleGrid.value).opacity,
        childrenCount: articleGrid.value.children.length
      });
    }
  };

  // 立即设置所有关键元素为可见状态
  const homeView = document.querySelector('.home-view')
  if (homeView) homeView.style.opacity = '1'
  
  // 确保DOM引用可用
  nextTick(() => {
    ensureDomRefs();
    
    try {
      // 确保元素在动画之前可见
      const elements = [
        { ref: gradientText, name: 'gradientText' },
        { ref: tagline, name: 'tagline' }, 
        { ref: subtitle, name: 'subtitle' }, 
        { ref: searchInput, name: 'searchInput' }
      ];
      
      elements.forEach(el => {
        if (el.ref && el.ref.value) {
          el.ref.value.style.opacity = '1';
          console.log(`设置${el.name}元素可见`);
        } else {
          console.warn(`${el.name}元素未找到`);
        }
      });
      
      // 设置文章列表容器为可见
      if (articleGrid.value) {
        articleGrid.value.style.opacity = '1';
      }
      
      // 然后应用动画
      cleanupFunction = animateHero();
    } catch (error) {
      console.error('初始化动画时出错:', error);
    }
    
    // 监听滚动事件（用于回到顶部按钮）
    window.addEventListener('scroll', checkScrollPosition);
    
    // 加载文章数据 - 放在最后确保DOM元素已准备好
    setTimeout(() => {
      fetchArticles();
    }, 500);
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