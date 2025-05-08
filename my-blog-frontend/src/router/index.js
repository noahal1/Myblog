import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ArticleView from '@/views/ArticleView.vue'
import Login from '@/components/Login.vue'
import About from '@/views/About.vue'
import CreateArticle from '../views/CreateArticle.vue'
import KnowledgeBase from '../views/KnowledgeBase.vue'
import { useUserStore } from '../stores/user'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/article/:id',
    name: 'article',
    component: ArticleView
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/about',
    name: 'about',
    component: About
  },
  {
    path: '/create-article',
    name: 'create-article',
    component: CreateArticle,
    meta: { requiresAuth: true }
  },
  {
    path: '/knowledge',
    name: 'knowledge',
    component: KnowledgeBase
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  }
})

// 导航守卫，验证用户身份
router.beforeEach(async (to, from, next) => {
  // 初始化用户状态
  const userStore = useUserStore();
  
  // 如果用户有token但未登录，则尝试验证
  if (userStore.token && !userStore.isLogin) {
    try {
      // 尝试验证token并刷新用户状态
      await userStore.initUserState();
    } catch (error) {
      console.error('验证用户身份失败:', error);
    }
  }
  
  // 如果页面需要认证
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 检查用户是否已登录
    if (!userStore.isAuthenticated) {
      // 未登录，重定向到登录页
      next({ 
        path: '/login',
        query: { redirect: to.fullPath } // 保存原目标路径
      });
    } else {
      // 已登录，继续
      next();
    }
  } else {
    // 页面不需要认证，继续
    next();
  }
});

export default router