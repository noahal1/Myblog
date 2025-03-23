<template>
  <div class="login-container">
    <form @submit.prevent="handleSubmit">
      <h2>{{ isLogin ? '登录' : '注册' }}</h2>
      
      <div class="form-group">
        <label>用户名</label>
        <input v-model="form.username" type="text" required />
      </div>

      <div class="form-group">
        <label>密码</label>
        <input v-model="form.password" type="password" required />
      </div>

      <button type="submit">{{ isLogin ? '登录' : '注册' }}</button>
      <p class="toggle-mode" @click="isLogin = !isLogin">
        {{ isLogin ? '没有账号？立即注册' : '已有账号？立即登录' }}
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const isLogin = ref(true)
const form = ref({
  username: '',
  password: ''
})

const handleSubmit = async () => {
  try {
    const url = isLogin.value ? '/api/login' : '/api/register'
    const response = await axios.post(url, form.value)
    
    if (isLogin.value) {
      localStorage.setItem('token', response.data.access_token)
      router.push('/dashboard')
    } else {
      alert('注册成功，请登录')
      isLogin.value = true
    }
  } catch (error) {
    alert(isLogin.value ? '登录失败' : '注册失败')
    console.error(error)
  }
}
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

.form-group {
  margin-bottom: 1rem;
}

input {
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.3rem;
}

button {
  width: 100%;
  padding: 0.7rem;
  background: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

.toggle-mode {
  margin-top: 1rem;
  cursor: pointer;
  color: #007bff;
}
</style>