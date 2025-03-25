<template>
  <div class="about-view">
    <div class="hero-banner mb-8">
      <v-container class="py-8">
        <h1 class="text-h3 font-weight-bold mb-4">关于<span class="gradient-text">我</span></h1>
        <p class="text-subtitle-1">这里是Noah的个人空间，记录成长与思考</p>
      </v-container>
    </div>
    
    <v-container class="about-container">
      <v-row>
        <v-col cols="12" md="4">
          <v-card class="card-effect h-100">
            <v-card-item>
              <div class="text-center">
                <v-avatar size="150" class="mb-4 elevation-6">
                  <v-img src="https://avatars.githubusercontent.com/u/noahal1" alt="Noah">
                    <template v-slot:placeholder>
                      <v-icon size="150" icon="mdi-account-circle"></v-icon>
                    </template>
                  </v-img>
                </v-avatar>
                <h2 class="text-h5 font-weight-bold mb-2">Noah</h2>
                <p class="text-subtitle-2 text-medium-emphasis">全栈开发工程师</p>
                
                <v-divider class="my-4"></v-divider>
                
                <div class="social-links d-flex justify-center mt-4">
                  <v-btn icon="mdi-github" variant="text" href="https://github.com/noahal1" target="_blank" class="mx-1"></v-btn>
                  <v-btn icon="mdi-email" variant="text" href="mailto:noahall127@outlook.com" class="mx-1"></v-btn>
                  <v-btn icon="mdi-sina-weibo" variant="text" href="#" target="_blank" class="mx-1"></v-btn>
                </div>
              </div>
            </v-card-item>
          </v-card>
        </v-col>
        
        <v-col cols="12" md="8">
          <v-card class="card-effect mb-6">
            <v-card-item>
              <div class="d-flex align-center mb-4">
                <v-avatar color="primary" rounded size="42" class="mr-4">
                  <v-icon icon="mdi-account" size="24"></v-icon>
                </v-avatar>
                <h2 class="text-h5 font-weight-bold">自我介绍</h2>
              </div>
              
              <v-divider class="mb-4"></v-divider>
              
              <div class="about-content pa-2">
                <p class="text-body-1 mb-4" style="font-size: 1.1rem; line-height: 1.8;">
                  👋 Hello，this is Noah.
                </p>
                <p class="text-body-1 mb-4" style="font-size: 1.1rem; line-height: 1.8;">
                  🎯 目标成为具有全栈开发能力的全端工程师。
                </p>
                <p class="text-body-1 mb-4" style="font-size: 1.1rem; line-height: 1.8;">
                  🚀 目前在学习前端、网络、数据库等技术。focus on Python,MySQL and JavaScript.
                </p>
                <p class="text-body-1 mb-4" style="font-size: 1.1rem; line-height: 1.8;">
                  我热衷于探索新技术，解决复杂问题，并构建能够改善用户体验的应用程序。在技术学习的路上，我相信持续学习和实践是提升自己的最佳方式。
                </p>
              </div>
            </v-card-item>
          </v-card>
          
          <v-card class="card-effect mb-6">
            <v-card-item>
              <div class="d-flex align-center mb-4">
                <v-avatar color="primary" rounded size="42" class="mr-4">
                  <v-icon icon="mdi-code-tags" size="24"></v-icon>
                </v-avatar>
                <h2 class="text-h5 font-weight-bold">技能专长</h2>
              </div>
              
              <v-divider class="mb-4"></v-divider>
              
              <div class="skills-container pa-2">
                <div class="mb-5">
                  <h3 class="text-h6 mb-3">编程语言</h3>
                  <div class="d-flex flex-wrap">
                    <v-chip class="ma-1" color="primary" variant="elevated">Python</v-chip>
                    <v-chip class="ma-1" color="primary" variant="elevated">数据库DML</v-chip>
                    <v-chip class="ma-1" color="primary" variant="elevated">JavaScript</v-chip>
                    <v-chip class="ma-1" color="primary" variant="elevated">C/C++</v-chip>
                    <v-chip class="ma-1" color="primary" variant="elevated">HTML/CSS</v-chip>
                  </div>
                </div>
                
                <div class="mb-5">
                  <h3 class="text-h6 mb-3">前端技术</h3>
                  <div class="d-flex flex-wrap">
                    <v-chip class="ma-1" color="secondary" variant="elevated">Vue.js</v-chip>
                    <v-chip class="ma-1" color="secondary" variant="elevated">Vuetify</v-chip>
                    <v-chip class="ma-1" color="secondary" variant="elevated">Element-Plus</v-chip>
                  </div>
                </div>
                
                <div class="mb-5">
                  <h3 class="text-h6 mb-3">后端技术</h3>
                  <div class="d-flex flex-wrap">
                    <v-chip class="ma-1" color="info" variant="elevated">FastAPI</v-chip>
                    <v-chip class="ma-1" color="info" variant="elevated">Node.js</v-chip>
                    <v-chip class="ma-1" color="info" variant="elevated">Flask</v-chip>
                  </div>
                </div>
                
                <div>
                  <h3 class="text-h6 mb-3">数据库与工具</h3>
                  <div class="d-flex flex-wrap">
                    <v-chip class="ma-1" color="success" variant="elevated">MySQL</v-chip>
                    <v-chip class="ma-1" color="success" variant="elevated">Redis</v-chip>
                    <v-chip class="ma-1" color="success" variant="elevated">Git</v-chip>
                    <v-chip class="ma-1" color="success" variant="elevated">Docker</v-chip>
                  </div>
                </div>
              </div>
            </v-card-item>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
// 导入你需要的依赖和组件
</script>

<style scoped>
.about-view {
  min-height: 100vh;
}

.hero-banner {
  background: linear-gradient(
    var(--gradient-angle),
    rgba(var(--primary-blue), 0.1),
    rgba(var(--secondary-purple), 0.05),
    rgba(var(--accent-orange), 0.08)
  );
  padding: 40px 0;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero-banner::before {
  content: '';
  position: absolute;
  top: -10%;
  left: -10%;
  width: 120%;
  height: 120%;
  background: 
    radial-gradient(circle at 20% 30%, rgba(var(--primary-blue), 0.05) 0%, transparent 70%),
    radial-gradient(circle at 80% 60%, rgba(var(--accent-orange), 0.05) 0%, transparent 70%);
  z-index: -1;
}

.about-container {
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 64px;
}

.social-links .v-btn {
  transition: all var(--transition-default);
}

.social-links .v-btn:hover {
  transform: translateY(-3px);
  color: rgb(var(--primary-blue));
}

.hobby-item {
  padding: 16px;
  border-radius: var(--border-radius);
  transition: all var(--transition-default);
  background: rgba(var(--v-theme-surface), 0.6);
  height: 100%;
}

.hobby-item:hover {
  transform: translateY(-5px);
  background: linear-gradient(
    var(--gradient-angle),
    rgba(var(--v-theme-surface), 0.8),
    rgba(var(--primary-blue), 0.05)
  );
  box-shadow: var(--card-shadow);
}

/* 响应式调整 */
@media (max-width: 960px) {
  .about-content p {
    font-size: 1rem !important;
  }
}

@media (max-width: 600px) {
  .hero-banner {
    padding: 32px 0;
  }
  
  .hobby-item {
    margin-bottom: 16px;
  }
}
</style>
