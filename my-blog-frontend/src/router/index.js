import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ArticleView from '@/views/ArticleView.vue'
import Login from '@/components/Login.vue'
import About from '@/views/About.vue'
import CreateArticle from '../views/CreateArticle.vue'
import KnowledgeBase from '../views/KnowledgeBase.vue'

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

export default router