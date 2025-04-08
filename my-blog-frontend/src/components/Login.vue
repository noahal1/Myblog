<template>
  <div class="login-container">
    <v-card
      class="login-card mx-auto"
      max-width="500"
      :elevation="8"
    >
      <!-- 卡片头部 -->
      <div class="card-header">
        <logo-icon 
          :width="60" 
          :height="60" 
          color="rgba(63, 81, 181, 0.9)"
          theme="light" 
          class="logo-svg mb-4" 
        />
        <h1 class="text-h4 font-weight-bold text-center gradient-title mb-2">
          {{ isLogin ? '欢迎回来' : '加入我们' }}
        </h1>
        <p class="text-subtitle-1 text-medium-emphasis text-center mb-6">
          {{ isLogin ? '登录您的账号畅所欲言' : '创建一个新的Noah\'s Blog账号' }}
        </p>
      </div>
      
      <!-- 表单 -->
      <v-form 
        ref="form"
        @submit.prevent="handleSubmit" 
        class="login-form px-6 py-4"
        v-model="isFormValid"
      >
        <!-- 错误提示 -->
        <v-alert
          v-if="errorMessage"
          type="error"
          variant="tonal"
          closable
          class="mb-4"
          @click:close="errorMessage = ''"
        >
          {{ errorMessage }}
        </v-alert>
        
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="form.username"
              label="用户名"
              variant="solo-filled"
              prepend-inner-icon="mdi-account"
              density="comfortable"
              :rules="[rules.required, rules.username]"
              autocomplete="username"
              @focus="errorMessage = ''"
              class="input-field"
            />
          </v-col>

          <v-col cols="12">
            <v-text-field
              v-model="form.password"
              label="密码"
              variant="solo-filled"
              prepend-inner-icon="mdi-lock"
              :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="showPassword = !showPassword"
              :type="showPassword ? 'text' : 'password'"
              density="comfortable"
              :rules="isLogin ? [rules.required] : [rules.required, rules.password]"
              autocomplete="current-password"
              @focus="errorMessage = ''"
              class="input-field"
            />
          </v-col>
          
          <!-- 仅在注册模式显示邮箱字段 -->
          <v-col cols="12">
            <v-text-field
              v-if="!isLogin"
              v-model="form.email"
              label="邮箱"
              variant="outlined"
              prepend-inner-icon="mdi-email"
              density="comfortable"
              :rules="[rules.required, rules.email]"
              autocomplete="email"
              @focus="errorMessage = ''"
              class="input-field"
            />
          </v-col>

          <v-col cols="12" style="padding: 0%;">
            <v-checkbox
              v-if="isLogin"
              v-model="rememberMe"
              label="记住我"
              color="primary"
              hide-details
              class="mb-2"  
            ></v-checkbox>
          </v-col>

          <v-col cols="12">
            <v-btn
              block
              size="large"
              color="primary"
              type="submit"
              :loading="loading"
              :disabled="!isFormValid"
              class="submit-btn"
              elevation="2"
            >
              {{ isLogin ? '立即登录' : '注册账号' }}
              <v-icon icon="mdi-arrow-right" class="ml-2"></v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
      
      <!-- 卡片底部 -->
      <div class="text-center py-4 switch-mode">
        <span>{{ isLogin ? '还没有账号？' : '已有账号？' }}</span>
        <a class="switch-link ml-1" @click="switchMode">
          {{ isLogin ? '立即注册' : '立即登录' }}
        </a>
      </div>
      
      <div class="social-login pa-6 d-flex flex-column align-center">
        <div class="divider-container">
          <v-divider></v-divider>
          <span class="divider-text">OR</span>
          <v-divider></v-divider>
        </div>
        
        <div class="social-buttons d-flex justify-center mt-4" style=" padding: 0%"> 
          <v-btn 
            variant="text" 
            icon="mdi-github" 
            class="mx-2"
            color="primary"
          ></v-btn>
          <v-btn 
            variant="text"
            icon="mdi-wechat" 
            class="mx-2"
            color="success"
          ></v-btn>
          <v-btn 
            variant="text" 
            icon="mdi-sina-weibo" 
            class="mx-2"
            color="error"
          ></v-btn>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import LogoIcon from './icons/LogoIcon.vue'
import apiClient from '../api'

const router = useRouter()
const userStore = useUserStore()

// 添加调试代码
console.log('userStore:', userStore)
console.log('userStore.login:', userStore.login)
console.log('typeof userStore.login:', typeof userStore.login)

// 表单状态
const form = ref({
  username: '',
  email: '',
  password: ''
})

// 表单验证
const isFormValid = ref(false)
const formRef = ref(null)

// 登录/注册模式切换
const isLogin = ref(true)
const showPassword = ref(false)
const rememberMe = ref(false)
const loading = ref(false)
const errorMessage = ref('')

// 表单验证规则
const rules = {
  required: v => !!v || '该字段为必填项',
  username: v => v.length >= 3 || '用户名至少需要3个字符',
  password: v => v.length >= 6 || '密码至少需要6个字符',
  email: v => /.+@.+\..+/.test(v) || '请输入有效的邮箱地址'
}

// 切换登录/注册模式
const switchMode = () => {
  isLogin.value = !isLogin.value
  errorMessage.value = ''
  // 不重置表单数据，保留用户已输入的内容
}

// 处理表单提交
const handleSubmit = async () => {
  loading.value = true;
  errorMessage.value = '';
  
  try {
    if (isLogin.value) {
      // 登录逻辑
      const loginData = {
        username: form.value.username,
        password: form.value.password
      };
      
      console.log('发送登录请求:', loginData);
      
      // 使用更简单的方式发送请求
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
      });
      
      console.log('收到响应状态:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('登录失败:', errorData);
        throw new Error(errorData.detail || '登录失败');
      }
      
      const data = await response.json();
      console.log('登录成功:', data);
      
      if (data && data.access_token) {
        // 保存用户信息
        localStorage.setItem('user', JSON.stringify({
          username: form.value.username,
          token: data.access_token,
          isLogin: true
        }));
        
        // 更新状态
        userStore.username = form.value.username;
        userStore.token = data.access_token;
        userStore.isLogin = true;
        
        // 导航到首页
        router.replace('/');
      } else {
        throw new Error('登录响应中缺少访问令牌');
      }
    } else {
      // 注册逻辑
      const response = await apiClient.post('/api/register', {
        username: form.value.username,
        email: form.value.email,
        password: form.value.password
      });
      
      console.log('注册成功:', response.data);
      isLogin.value = true;
      errorMessage.value = '注册成功，请登录';
    }
  } catch (error) {
    console.error('操作失败:', error);
    errorMessage.value = error.message || '操作失败';
  } finally {
    loading.value = false;
  }
};

// 计算属性：表单标题
const formTitle = computed(() => isLogin.value ? '登录' : '注册')
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(80vh - 160px);
  padding: 32px 16px;
  background: radial-gradient(circle at 30% 30%, rgba(var(--primary-blue), 0.03), transparent 400px),
              radial-gradient(circle at 70% 70%, rgba(var(--accent-orange), 0.03), transparent 400px);
}

.login-card {
  overflow: hidden;
  border-radius: var(--border-radius, 16px);
  background: rgba(var(--v-theme-surface), 0.9);
  backdrop-filter: blur(12px);
  box-shadow: var(--card-shadow);
  border: 1px solid rgba(var(--primary-blue), 0.1);
  transition: all var(--transition-default);
  max-width: 95%;
}

.login-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(var(--primary-blue), 0.15);
}

.card-header {
  background: linear-gradient(var(--gradient-angle, 135deg), 
    rgba(var(--primary-blue), 0.05),
    rgba(var(--secondary-purple, 156, 39, 176), 0.02));
  padding: 2.5rem 1.5rem 1rem;
  text-align: center;
  border-bottom: 1px solid rgba(var(--primary-blue), 0.07);
}

.gradient-title {
  background: var(--neon-gradient, linear-gradient(90deg, #3f51b5, #9c27b0));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.login-form {
  padding-top: 1.3rem;
}

.input-field :deep(.v-field) {
  border-radius: 8px;
  transition: all var(--transition-default);
}

.input-field:hover :deep(.v-field) {
  border-color: rgba(var(--primary-blue), 0.5);
}

.submit-btn {
  margin-top: 0rem;
  border-radius: 8px;
  text-transform: none;
  letter-spacing: 0.5px;
  transition: all var(--transition-default);
  position: relative;
  overflow: hidden;
}

.submit-btn::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: all 0.5s;
}

.submit-btn:hover::before {
  left: 100%;
}

.switch-mode {
  background: rgba(var(--primary-blue), 0.03);
}

.switch-link {
  color: rgb(var(--primary-blue));
  font-weight: 500;
  cursor: pointer;
  position: relative;
  transition: all var(--transition-default);
}

.switch-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(
    90deg,
    rgba(var(--primary-blue), 0.7),
    rgba(var(--accent-orange), 0.7)
  );
  transition: width var(--transition-default);
}

.switch-link:hover {
  color: rgb(var(--accent-orange));
}

.switch-link:hover::after {
  width: 100%;
}

.divider-container {
  display: flex;
  align-items: center;
  width: 100%;
  margin: 0.5rem 0;
}

.divider-text {
  padding: 0 16px;
  color: rgba(var(--v-theme-on-surface), 0.5);
  font-size: 0.875rem;
}

.divider-container .v-divider {
  flex-grow: 1;
  opacity: 0.3;
}

.social-buttons .v-btn {
  transition: all var(--transition-default);
}

.social-buttons .v-btn:hover {
  transform: translateY(-3px);
}

/* 动画 */
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

.login-card {
  animation: fadeInUp 0.5s ease forwards;
}

/* 响应式调整 */
@media (max-width: 600px) {
  .login-container {
    padding: 16px;
  }
  
  .card-header {
    padding: 1.5rem 1rem 0.75rem;
  }
  
  .login-card {
    margin-top: 0;
  }
}
</style>
