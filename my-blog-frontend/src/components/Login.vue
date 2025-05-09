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
          :type="alertType"
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
            ></v-text-field>
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
            ></v-text-field>
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import LogoIcon from './icons/LogoIcon.vue'
import apiClient from '../api'

const router = useRouter()
const userStore = useUserStore()

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
const alertType = ref('error')

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
}

// 处理表单提交
const handleSubmit = async () => {
  loading.value = true;
  errorMessage.value = '';
  
  try {
    if (isLogin.value) {
      // 登录逻辑
      const response = await apiClient.post('/api/login', {
        username: form.value.username,
        password: form.value.password,
      });
      
      if (!response.data) {
        console.error('登录失败:', response);
        throw new Error(response.data?.detail || '登录失败');
      }
      
      const { data } = response;
      console.log('登录成功:', data);
      
      if (data && data.access_token) {
        // 创建用户对象
        const userData = {
          username: form.value.username,
          token: data.access_token,
          refreshToken: data.refresh_token,
          expiresAt: data.expires_at,
          userId: data.userId,
          isLogin: true,
          lastLoginTime: new Date().toISOString()
        };
        
        // 保存用户信息到localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        
        // 使用userStore登录方法更新状态
        userStore.login({
          username: form.value.username,
          token: data.access_token,
          refreshToken: data.refresh_token,
          expiresAt: data.expires_at,
          userId: data.userId
        });
        
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
      alertType.value = 'success';
    }
  } catch (error) {
    console.error('操作失败:', error);
    errorMessage.value = error.response?.data?.detail || error.message || '操作失败';
    alertType.value = 'error';
  } finally {
    loading.value = false;
  }
};

// 计算属性：表单标题
const formTitle = computed(() => isLogin.value ? '登录' : '注册')
</script>

<style scoped>
/* 所有样式已移至 src/assets/styles/components/login.css */
</style>
