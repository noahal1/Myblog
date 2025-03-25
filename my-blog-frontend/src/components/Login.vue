<template>
  <v-card
    class="mx-auto"
    max-width="500"
    :title="isLogin ? 'Login' : 'Register'"

  >
    <v-form @submit.prevent="handleSubmit" class="pa-6">
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="form.username"
            label="用户名"
            variant="outlined"
            prepend-inner-icon="mdi-account"
            density="comfortable"
            :rules="[requiredRule]"
          />
        </v-col>

        <v-col cols="12">
          <v-text-field
            v-model="form.password"
            label="密码"
            variant="outlined"
            prepend-inner-icon="mdi-lock"
            type="password"
            density="comfortable"
            :rules="[requiredRule]"
          />
        </v-col>

        <v-col cols="12">
          <v-btn
            block
            size="large"
            color="primary"
            type="submit"
            :loading="loading"
          >
            {{ isLogin ? '立即登录' : '注册账号' }}
          </v-btn>
        </v-col>

        <v-col cols="12" class="text-center">
          <a 
            class="text-caption text-primary text-decoration-none"
            @click="isLogin = !isLogin"
          >
            {{ isLogin ? '没有账号？立即注册' : '已有账号？立即登录' }}
          </a>
        </v-col>
      </v-row>
    </v-form>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const isLogin = ref(true)
const loading = ref(false)
const form = ref({
  username: '',
  password: ''
})

const requiredRule = value => !!value || '该字段为必填项'

const handleSubmit = async () => {
  try {
    loading.value = true
    const url = isLogin.value ? '/api/login' : '/api/register'
    const { data } = await axios.post(url, form.value)
    
    if (isLogin.value) {
      localStorage.setItem('token', data.access_token)
      router.replace('/dashboard')
    } else {
      isLogin.value = true
    }
  } catch (error) {
    const message = error.response?.data?.message || 
      (isLogin.value ? '登录失败' : '注册失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.v-card {
  margin-top: 25vh;
  background-color: rgba(116, 107, 137, 0.433);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.793);
  transition: transform 0.3s ease;
}

.v-card:hover {
  transform: translateY(-2px);
}

.text-primary {
  color: rgb(var(--v-theme-primary));
  transition: opacity 0.2s;
}

.text-primary:hover {
  opacity: 0.8;
}
</style>
