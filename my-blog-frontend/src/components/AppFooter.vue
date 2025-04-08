<template>
  <v-footer app class="footer-container" style="position: relative;">
    <v-container>
      <v-row>
        <!-- Logo & 简介 -->
        <v-col cols="12" md="4" class="footer-section">
          <div class="footer-logo d-flex align-center mb-4">
            <logo-icon :width="40" :height="40" :color="logoColor" class="footer-icon" />
            <h3 class="footer-title">Noah's Blog</h3>
          </div>
          
          <p class="footer-description">
            抒情与逻辑之间的自留地，记录技术、思考与生活的点滴。
          </p>
          
          <div class="social-links mt-4">
            <v-tooltip location="top">
              <template v-slot:activator="{ props }">
                <v-btn 
                  v-bind="props"
                  variant="text"
                  icon="mdi-github"
                  href="https://github.com/yourusername"
                  target="_blank"
                  class="social-btn"
                ></v-btn>
              </template>
              <span>GitHub</span>
            </v-tooltip>
            
            <v-tooltip location="top">
              <template v-slot:activator="{ props }">
                <v-btn 
                  v-bind="props"
                  variant="text"
                  icon="mdi-twitter"
                  href="https://twitter.com/yourusername"
                  target="_blank"
                  class="social-btn"
                ></v-btn>
              </template>
              <span>Twitter</span>
            </v-tooltip>
            
            <v-tooltip location="top">
              <template v-slot:activator="{ props }">
                <v-btn 
                  v-bind="props"
                  variant="text"
                  icon="mdi-email-outline"
                  @click="showContactForm = true"
                  class="social-btn"
                ></v-btn>
              </template>
              <span>联系我</span>
            </v-tooltip>
          </div>
        </v-col>
        
        <!-- 快速链接 -->
        <v-col cols="6" md="2" class="footer-section">
          <h4 class="footer-heading">快速链接</h4>
          <ul class="footer-links">
            <li v-for="(link, i) in quickLinks" :key="i">
              <router-link :to="link.to" class="footer-link">
                {{ link.text }}
              </router-link>
            </li>
          </ul>
        </v-col>
        
        <!-- 分类 -->
        <v-col cols="6" md="2" class="footer-section">
          <h4 class="footer-heading">内容分类</h4>
          <ul class="footer-links">
            <li v-for="(category, i) in categories" :key="i">
              <router-link 
                :to="`/categories/${category.id}`" 
                class="footer-link"
              >
                {{ category.name }}
              </router-link>
            </li>
          </ul>
        </v-col>
        
        <!-- 订阅 -->
        <v-col cols="12" md="4" class="footer-section">
          <h4 class="footer-heading">订阅更新</h4>
          <p class="footer-text mb-3">
            订阅我的博客更新，获取最新文章和技术分享。
          </p>
          
          <v-form @submit.prevent="subscribeNewsletter">
            <div class="d-flex">
              <v-text-field
                v-model="email"
                label="您的邮箱"
                placeholder="example@domain.com"
                variant="outlined"
                density="compact"
                hide-details
                class="subscribe-input"
              ></v-text-field>
              
              <v-btn
                type="submit"
                color="primary"
                class="ml-2 subscribe-btn"
                :loading="subscribing"
              >
                订阅
              </v-btn>
            </div>
          </v-form>
        </v-col>
      </v-row>
      
      <!-- 版权与备案 -->
      <v-divider class="my-4"></v-divider>
      
      <div class="footer-bottom d-flex flex-wrap justify-space-between align-center">
        <div class="copyright">
          &copy; {{ new Date().getFullYear() }} Noah's Blog. All rights reserved.
        </div>
        
        <div class="beian">
          <a 
            href="https://beian.miit.gov.cn/" 
            target="_blank"
            class="beian-link"
          >浙ICP备XXXXXXXX号</a>
        </div>
      </div>
    </v-container>
    
    <!-- 联系表单对话框 -->
    <v-dialog v-model="showContactForm" max-width="600px">
      <v-card class="contact-dialog">
        <v-card-title class="dialog-title">
          <span>联系我</span>
          <v-btn icon @click="showContactForm = false" class="close-btn">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        
        <v-card-text>
          <v-form @submit.prevent="submitContactForm">
            <v-text-field
              v-model="contactForm.name"
              label="您的姓名"
              variant="outlined"
              required
            ></v-text-field>
            
            <v-text-field
              v-model="contactForm.email"
              label="您的邮箱"
              variant="outlined"
              type="email"
              required
            ></v-text-field>
            
            <v-textarea
              v-model="contactForm.message"
              label="您的留言"
              variant="outlined"
              rows="4"
              required
            ></v-textarea>
            
            <div class="d-flex justify-end">
              <v-btn
                variant="text"
                @click="showContactForm = false"
                class="mr-2"
              >
                取消
              </v-btn>
              
              <v-btn
                type="submit"
                color="primary"
                :loading="sending"
              >
                发送
              </v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    
    <!-- 订阅成功提示 -->
    <v-snackbar v-model="showSubscribeSuccess" color="success">
      订阅成功！感谢您的关注。
      <template v-slot:actions>
        <v-btn
          variant="text"
          @click="showSubscribeSuccess = false"
        >
          关闭
        </v-btn>
      </template>
    </v-snackbar>
  </v-footer>
</template>

<style scoped>
.footer-container {
  background: var(--header-gradient);
  border-top: var(--border-subtle);
  padding: 48px 0 24px;
  color: rgba(var(--text-primary), 0.9);
  width: 100%;
  height: auto;
}

.footer-logo {
  display: flex;
  align-items: center;
}

.footer-icon {
  margin-right: 12px;
}

.footer-title {
  font-size: 1.5rem;
  font-weight: 700;
  background: var(--neon-gradient);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin: 0;
}

.footer-description {
  color: rgba(var(--text-secondary), 1);
  margin-top: 12px;
  font-size: 0.95rem;
  line-height: 1.6;
}

.footer-heading {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 16px;
  position: relative;
  display: inline-block;
}

.footer-heading::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 40px;
  height: 3px;
  background: var(--neon-gradient);
  border-radius: 2px;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 8px;
}

.footer-link {
  color: rgba(var(--text-secondary), 1);
  text-decoration: none;
  font-size: 0.95rem;
  transition: all var(--transition-default);
  position: relative;
  display: inline-block;
}

.footer-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: var(--neon-gradient);
  transition: width var(--transition-default);
}

.footer-link:hover {
  color: rgba(var(--primary-blue), 1);
  transform: translateX(4px);
}

.footer-link:hover::after {
  width: 100%;
}

.footer-text {
  color: rgba(var(--text-secondary), 1);
  font-size: 0.95rem;
  line-height: 1.6;
}

.social-links {
  display: flex;
  gap: 8px;
}

.social-btn {
  color: rgba(var(--text-secondary), 1);
  transition: all var(--transition-default);
}

.social-btn:hover {
  color: rgba(var(--primary-blue), 1);
  transform: translateY(-2px);
}

.copyright, .beian {
  font-size: 0.85rem;
  color: rgba(var(--text-tertiary), 1);
}

.beian-link {
  color: rgba(var(--text-tertiary), 1);
  text-decoration: none;
  transition: color var(--transition-default);
}

.beian-link:hover {
  color: rgba(var(--primary-blue), 0.8);
}

.subscribe-input {
  max-width: 280px;
}

.subscribe-btn {
  height: 40px;
}

.dialog-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.contact-dialog {
  background: rgba(var(--v-theme-surface), 0.95);
  backdrop-filter: blur(15px);
  border-radius: var(--border-radius-md);
  border: var(--border-subtle);
}

@media (max-width: 960px) {
  .footer-section {
    margin-bottom: 32px;
  }
  
  .footer-bottom {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useTheme } from 'vuetify'
import LogoIcon from './icons/LogoIcon.vue'

// 使用固定颜色，不依赖主题
const logoColor = ref('#3F51B5')

// 快速链接
const quickLinks = [
  { text: '首页', to: '/' },
  { text: '归档', to: '/archive' },
  { text: '标签', to: '/tags' },
  { text: '关于', to: '/about' },
  { text: '友链', to: '/friends' }
]

// 分类
const categories = [
  { id: 'frontend', name: '前端开发' },
  { id: 'backend', name: '后端技术' },
  { id: 'design', name: '设计与UI' },
  { id: 'devops', name: 'DevOps' },
  { id: 'thoughts', name: '随想随笔' }
]

// 订阅状态
const email = ref('')
const subscribing = ref(false)
const showSubscribeSuccess = ref(false)

// 联系表单
const showContactForm = ref(false)
const contactForm = ref({
  name: '',
  email: '',
  message: ''
})
const sending = ref(false)

// 订阅处理
const subscribeNewsletter = async () => {
  if (!email.value) return
  
  subscribing.value = true
  
  // 模拟API请求
  setTimeout(() => {
    subscribing.value = false
    showSubscribeSuccess.value = true
    email.value = ''
  }, 1500)
}

// 联系表单提交
const submitContactForm = async () => {
  sending.value = true
  
  // 模拟API请求
  setTimeout(() => {
    sending.value = false
    showContactForm.value = false
    
    // 重置表单
    contactForm.value = {
      name: '',
      email: '',
      message: ''
    }
  }, 1500)
}
</script> 