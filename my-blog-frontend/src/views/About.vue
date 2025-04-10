<template>
  <div class="about-page">
    <v-container class="py-8">
      <!-- 个人介绍卡片 -->
      <v-card class="about-card mx-auto mb-8" max-width="900" elevation="4">
        <div class="card-header pa-6">
          <h1 class="text-h4 font-weight-bold gradient-text mb-2">关于我</h1>
          <p class="text-subtitle-1 text-medium-emphasis">探索技术与思想的旅程</p>
        </div>
        
        <v-row class="pa-6">
          <v-col cols="12" md="4" class="text-center">
            <v-avatar size="180" class="profile-avatar mb-4">
              <v-img src="/profile-image.jpg" alt="个人头像">
                <template v-slot:placeholder>
                  <v-icon size="120" icon="mdi-account-circle"></v-icon>
                </template>
              </v-img>
            </v-avatar>
            
            <h2 class="text-h5 font-weight-bold mb-2">Noah.all</h2>
            <p class="text-body-1 text-medium-emphasis mb-4">全栈开发者 & 技术爱好者</p>
            
            <div class="social-links d-flex justify-center">
              <v-btn icon variant="text" color="primary" class="mx-1">
                <v-icon>mdi-github</v-icon>
              </v-btn>
              <v-btn icon variant="text" color="info" class="mx-1">
                <v-icon>mdi-twitter</v-icon>
              </v-btn>
              <v-btn icon variant="text" color="error" class="mx-1">
                <v-icon>mdi-email</v-icon>
              </v-btn>
            </div>
          </v-col>
          
          <v-col cols="12" md="8">
            <div class="bio-section">
              <h3 class="text-h6 font-weight-bold mb-3">
                <v-icon color="primary" class="mr-2">mdi-account-details</v-icon>
                个人简介
              </h3>
              <p class="text-body-1 mb-4">
                👋欢迎来到我的博客！我是Noahall，一名热爱技术和艺术的全栈开发者。我致力于探索最新的网络技术和开发方法，并在这里分享我的创作和开发心得。
              </p>
              <p class="text-body-1 mb-4">
                🚀我的技术栈涵盖前端Vue2、3框架，后端Python、Node.js，以及Docker、云服务部署。我相信技术应该服务于人类，使生活更加便捷和美好。
              </p>
              <p class="text-body-1">
                👨‍💻除了编程，我也热爱写作、观影、音乐、DIY、运动，这些爱好给了我不同的视角和灵感
              </p>
            </div>
          </v-col>
        </v-row>
      </v-card>
      <v-card class="about-card mx-auto mb-8" max-width="900" elevation="4">
        <div class="card-header pa-6">
          <h2 class="text-h5 font-weight-bold mb-2">
            <v-icon color="primary" class="mr-2">mdi-lightbulb</v-icon>
            专业技能
          </h2>
        </div>
        
        <v-container class="pa-6">
          <v-row>
            <v-col cols="12" md="4" v-for="(category, index) in skills" :key="index">
              <div class="skill-category mb-6">
                <h3 class="text-h6 font-weight-bold mb-3">{{ category.name }}</h3>
                
                <div v-for="(skill, i) in category.items" :key="i" class="skill-item mb-3">
                  <div class="d-flex justify-space-between mb-1">
                    <span class="text-subtitle-2">{{ skill.name }}</span>
                    <span class="text-caption">{{ skill.level }}%</span>
                  </div>
                  <v-progress-linear
                    :model-value="skill.level"
                    height="6"
                    rounded
                    :color="category.color"
                  ></v-progress-linear>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
      
      <!-- 博客历程卡片 -->
      <v-card class="about-card mx-auto mb-8" max-width="900" elevation="4">
        <div class="card-header pa-6">
          <h2 class="text-h5 font-weight-bold mb-2">
            <v-icon color="primary" class="mr-2">mdi-book-open-page-variant</v-icon>
            博客历程
          </h2>
        </div>
        
        <div class="pa-6">
          <v-timeline density="comfortable" align="start">
            <v-timeline-item
              v-for="(event, i) in timeline"
              :key="i"
              :dot-color="event.color"
              :icon="event.icon"
              size="small"
            >
              <template v-slot:opposite>
                <div class="text-caption">{{ event.date }}</div>
              </template>
              <v-card class="timeline-card" variant="outlined">
                <v-card-title class="text-subtitle-1 font-weight-bold">
                  {{ event.title }}
                </v-card-title>
                <v-card-text>
                  {{ event.description }}
                </v-card-text>
              </v-card>
            </v-timeline-item>
          </v-timeline>
        </div>
      </v-card>
      
      <!-- 联系卡片 -->
      <v-card class="about-card mx-auto" max-width="900" elevation="4">
        <div class="card-header pa-6">
          <h2 class="text-h5 font-weight-bold mb-2">
            <v-icon color="primary" class="mr-2">mdi-message-text</v-icon>
            如何找到我
          </h2>
          <p class="text-subtitle-1 text-medium-emphasis">有任何问题或想法，欢迎联系我</p>
        </div>
        
        <v-container class="pa-6">
          <v-row>
            <v-col cols="12" md="6">
              <v-form>
                <v-text-field
                  label="您的姓名"
                  variant="outlined"
                  prepend-inner-icon="mdi-account"
                  class="mb-4"
                ></v-text-field>
                
                <v-text-field
                  label="您的邮箱"
                  variant="outlined"
                  prepend-inner-icon="mdi-email"
                  class="mb-4"
                ></v-text-field>
                
                <v-textarea
                  label="您的留言"
                  variant="outlined"
                  prepend-inner-icon="mdi-comment-text"
                  rows="5"
                  class="mb-4"
                ></v-textarea>
                
                <v-btn
                  color="primary"
                  size="large"
                  prepend-icon="mdi-send"
                  block
                  elevation="2"
                >
                  发送留言
                </v-btn>
              </v-form>
            </v-col>
            
            <v-col cols="12" md="6" class="contact-info">
              <div class="d-flex align-center mb-6">
                <v-icon size="32" color="primary" class="mr-4">mdi-map-marker</v-icon>
                <div>
                  <h3 class="text-subtitle-1 font-weight-bold">地址</h3>
                  <p class="text-body-2">天津市武清区</p>
                </div>
              </div>
              
              <div class="d-flex align-center mb-6">
                <v-icon size="32" color="primary" class="mr-4">mdi-email</v-icon>
                <div>
                  <h3 class="text-subtitle-1 font-weight-bold">邮箱</h3>
                  <p class="text-body-2">noahall127@outlook.com.com</p>
                </div>
              </div>
              
              <div class="d-flex align-center mb-6">
                <v-icon size="32" color="primary" class="mr-4">mdi-web</v-icon>
                <div>
                  <h3 class="text-subtitle-1 font-weight-bold">网站</h3>
                  <p class="text-body-2">www.noahblog.com</p>
                </div>
              </div>
              
              <v-card class="mt-4" variant="outlined">
                <v-card-text class="text-center py-4">
                  <p class="text-h6 font-weight-bold mb-2">关注我的博客</p>
                  <p class="text-body-2">及时获取最新文章和动态</p>
                  <v-btn color="primary" variant="tonal" class="mt-2" prepend-icon="mdi-rss">
                    订阅 RSS
                  </v-btn>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-container>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 技能数据
const skills = ref([
  {
    name: '前端开发',
    color: 'primary',
    items: [
      { name: 'Vue.js', level: 80 },
      { name: 'JavaScript', level: 70 },
      { name: 'HTML/CSS', level: 55 },
      { name: 'React', level: 20 }
    ]
  },
  {
    name: '后端开发',
    color: 'secondary',
    items: [
      { name: 'Python', level: 82 },
      { name: 'Node.js', level: 50 },
      { name: 'MySQL', level: 60 },
      { name: 'Fastapi', level: 80 }
    ]
  },
  {
    name: '其他技能',
    color: 'info',
    items: [
      { name: 'Git', level: 85 },
      { name: 'Docker', level: 70 },
      { name: 'Linux', level: 86 },
      { name: '云服务', level: 65 }
    ]
  }
]);

// 博客历程
const timeline = ref([
  {
    date: '2025.2',
    title: '项目启动',
    description: `Noah's blog个人博客项目开始开发。`,
    color: 'info',
    icon: 'mdi-code-tags'
  },
  {
    date: '2025.5',
    title: '博客启航',
    description: '创建个人博客，记录我的技术探索和创作。',
    color: 'primary',
    icon: 'mdi-rocket-launch'
  },
  {
    date: '未来',
    title: '持续成长',
    description: '继续学习和探索，分享更多内容，与读者和世界共同成长。',
    color: 'success',
    icon: 'mdi-tree'
  }
]);
</script>

<style scoped>
.about-page {
  min-height: calc(100vh - 200px);
  background: radial-gradient(circle at 30% 30%, rgba(var(--primary-blue), 0.03), transparent 400px),
              radial-gradient(circle at 70% 70%, rgba(var(--accent-orange), 0.03), transparent 400px);
}

.about-card {
  backdrop-filter: blur(8px);
  background: rgba(var(--v-theme-surface), 0.9);
  border-radius: var(--border-radius);
  overflow: hidden;
  border: 1px solid rgba(var(--primary-blue), 0.1);
  transition: all var(--transition-default);
}

.about-card:hover {
  box-shadow: var(--hover-shadow);
  transform: translateY(-4px);
}

.card-header {
  background: linear-gradient(var(--gradient-angle), 
    rgba(var(--primary-blue), 0.05),
    rgba(var(--secondary-purple), 0.02));
  border-bottom: 1px solid rgba(var(--primary-blue), 0.07);
}

.gradient-text {
  background: var(--neon-gradient);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.profile-avatar {
  border: 4px solid rgba(var(--primary-blue), 0.2);
  box-shadow: 0 8px 30px rgba(var(--primary-blue), 0.15);
  transition: all var(--transition-default);
}

.profile-avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 12px 36px rgba(var(--primary-blue), 0.25);
}

.social-links .v-btn {
  transition: all var(--transition-default);
}

.social-links .v-btn:hover {
  transform: translateY(-5px);
}

.bio-section {
  border-left: 3px solid rgba(var(--primary-blue), 0.1);
  padding-left: 20px;
}

.skill-item {
  transition: all var(--transition-default);
}

.skill-item:hover {
  transform: translateX(5px);
}

.timeline-card {
  transition: all var(--transition-default);
}

.timeline-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(var(--primary-blue), 0.15);
}

.contact-info {
  position: relative;
}

@media (min-width: 960px) {
  .contact-info::before {
    content: '';
    position: absolute;
    left: 0;
    top: 10%;
    height: 80%;
    width: 1px;
    background: linear-gradient(to bottom,
      transparent,
      rgba(var(--primary-blue), 0.2),
      transparent
    );
  }
}

@media (max-width: 599px) {
  .profile-avatar {
    width: 140px;
    height: 140px;
  }
}
</style>
