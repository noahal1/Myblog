<template>
  <v-footer app class="footer-container" style="position: relative; margin-top: 0; padding-top: 0;">
    <v-container>
      <v-row>
        <!-- Logo & 简介 -->
        <v-col cols="12" md="4" class="footer-section">
          <div class="footer-logo d-flex align-center mb-4">
            <logo-icon :width="40" :height="40" :color="logoColor" class="footer-icon" />
            <h3 class="footer-title">Noah's Blog</h3>
          </div>
          
          <p class="footer-description">
            抒情与逻辑之间的自留地，记录技术与思考。
          </p>
          
          <div class="social-links mt-4">
            <v-tooltip location="top">
              <template v-slot:activator="{ props }">
                <v-btn 
                  v-bind="props"
                  variant="text"
                  icon="mdi-github"
                  href="https://github.com/noahal1"
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
                  icon="mdi-sina-weibo"
                  href="https://weibo.com/u/3273752025"
                  target="_blank"
                  class="social-btn"
                ></v-btn>
              </template>
              <span>Weibo</span>
            </v-tooltip>
            
            <v-tooltip location="top">
              <template v-slot:activator="{ props }">
                <v-btn 
                  v-bind="props"
                  variant="text"
                  icon="mdi-wechat"
                  @click="openWechatDialog"
                  class="social-btn"
                ></v-btn>
              </template>
              <span>微信二维码</span>
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
          >鲁ICP备2025161138号</a>
        </div>
      </div>
    </v-container>
    
    <!-- 微信二维码对话框 -->
    <v-dialog v-model="wechatDialog" max-width="400px">
      <v-card class="wechat-dialog">
        <v-card-title class="text-center">
          <v-icon color="success" class="mr-2">mdi-wechat</v-icon>
          <v-spacer></v-spacer>
        </v-card-title>
        <v-card-text class="text-center">
          <div class="qrcode-container">
            <v-img
              :src="wechatQRCodeUrl"
              alt="noahall"
              class="mx-auto qrcode-image"
              contain
              max-height="250"
            ></v-img>
          </div>
          <p class="mt-4 wechat-text">扫描二维码添加我的微信</p>
          <v-btn icon="mdi-close" variant="text" size="small" @click="wechatDialog = false" class="text-center"></v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
    
    <!-- 订阅成功提示 -->
    <v-snackbar v-model="showSubscribeSuccess" color="success">
      订阅成功！感谢您的关注。
      <template v-slot:actions>
        <v-btn
          variant="text"
          @click="_showSubscribeSuccess = false"
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
  padding: 24px 0 24px;
  margin-top: 0 !important;
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
  align-items: center;
}

.social-btn {
  margin-right: 8px;
  opacity: 0.8;
  transition: all var(--transition-default);
}

.social-btn:hover {
  opacity: 1;
  transform: translateY(-3px);
}

.subscribe-input {
  background: rgba(var(--background), 0.5);
  border-radius: 4px;
}

.subscribe-btn {
  height: 40px;
  min-width: 80px;
}

.footer-bottom {
  font-size: 0.85rem;
  color: rgba(var(--text-secondary), 0.8);
}

.beian-link {
  color: rgba(var(--text-secondary), 0.8);
  text-decoration: none;
  transition: color var(--transition-default);
}

.beian-link:hover {
  color: rgba(var(--primary-blue), 1);
}

/* 微信二维码样式 */
.wechat-dialog {
  border-radius: 12px;
  overflow: hidden;
}

.qrcode-container {
  position: relative;
  width: 250px;
  height: 250px;
  margin: 0 auto;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.qrcode-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.qrcode-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.85);
  border-radius: 50%;
  padding: 4px;
}

.qrcode-avatar {
  border: 2px solid #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
}

.wechat-text {
  color: rgba(var(--text-secondary), 1);
  font-size: 1rem;
}

@media (max-width: 600px) {
  .subscribe-btn {
    height: 40px;
    min-width: 60px;
    font-size: 0.85rem;
  }
  
  .footer-section {
    margin-bottom: 24px;
  }
}
</style>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTheme } from 'vuetify'
import LogoIcon from './icons/LogoIcon.vue'

// 微信二维码相关
const wechatDialog = ref(false)
const wechatQRCodeUrl = ref('/images/wechat.png')
const avatarUrl = ref('/images/avatar.jpg')

// 主题相关
const theme = useTheme()
const logoColor = computed(() => {
  try {
    return theme.global.current.value?.dark ? '#ffffff' : '#3F51B5'
  } catch (e) {
    console.warn('无法获取主题状态:', e)
    return '#3F51B5'
  }
})

// 快速链接
const quickLinks = ref([
  { text: '首页', to: '/' },
  { text: '归档', to: '/archive' },
  { text: '标签', to: '/tags' },
  { text: '关于', to: '/about' },
  { text: '友链', to: '/friends' }
])

// 分类
const categories = ref([
  { id: 'frontend', name: '前端开发' },
  { id: 'backend', name: '后端技术' },
  { id: 'design', name: '设计与UI' },
  { id: 'devops', name: 'DevOps' },
  { id: 'thoughts', name: '随想随笔' }
])

// 邮箱订阅相关
const email = ref('')
const subscribing = ref(false)
const _showSubscribeSuccess = ref(false)
const showSubscribeSuccess = computed({
  get: () => _showSubscribeSuccess.value,
  set: (val) => { _showSubscribeSuccess.value = val }
})

// 打开微信二维码对话框
function openWechatDialog() {
  wechatDialog.value = true
}

// 订阅
async function subscribeNewsletter() {
  if (!email.value) return
  
  subscribing.value = true
  
  try {
    // 模拟订阅API请求
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    email.value = ''
    _showSubscribeSuccess.value = true
  } catch (error) {
    console.error('订阅失败:', error)
  } finally {
    subscribing.value = false
  }
}
</script> 