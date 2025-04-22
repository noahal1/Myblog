<template>
  <div class="about-page">
    <!-- 移除粒子背景，添加渐变波浪背景 -->
    <div class="gradient-wave-background">
      <div class="wave wave1"></div>
      <div class="wave wave2"></div>
      <div class="wave wave3"></div>
    </div>
    
    <!-- 鼠标跟随效果 -->
    <div class="follower" ref="follower"></div>
    <div class="parallax-container" ref="parallaxContainer">
      <v-container class="py-8">
        <v-card class="about-card mx-auto mb-8 tilt-card" max-width="900" elevation="4" ref="profileCard">
          <div class="card-header pa-6">
            <h1 class="text-h4 font-weight-bold gradient-text mb-2" data-aos="fade-up">关于我</h1>
            <p class="text-subtitle-1 text-medium-emphasis" data-aos="fade-up" data-aos-delay="100">探索技术与思想的旅程</p>
          </div>
          
          <v-row class="pa-6">
            <v-col cols="12" md="4" class="text-center">
              <v-avatar size="180" class="profile-avatar mb-4" data-aos="zoom-in">
                <v-img src="/profile-image.jpg" alt="个人头像">
                  <template v-slot:placeholder>
                    <v-icon size="120" icon="mdi-account-circle"></v-icon>
                  </template>
                </v-img>
              </v-avatar>
              
              <div class="typing-container">
                <span class="text-h5 font-weight-bold mb-2 typing-text" ref="typingName"></span>
              </div>
              
              <p class="text-body-1 text-medium-emphasis mb-4 fade-in-text" data-aos="fade-up" data-aos-delay="200">全栈开发者 & 技术爱好者</p>
              
              <div class="social-links d-flex justify-center" data-aos="fade-up" data-aos-delay="300">
                <v-btn icon variant="text" color="primary" class="mx-1 floating-icon"href="https://github.com/noahal1">
                  <v-icon>mdi-github</v-icon>
                </v-btn>
                <v-btn icon variant="text" color="info" class="mx-1 floating-icon">
                  <v-icon>mdi-twitter</v-icon>
                </v-btn>
                <v-btn icon variant="text" color="error" class="mx-1 floating-icon">
                  <v-icon>mdi-email</v-icon>
                </v-btn>
              </div>
            </v-col>
            
            <v-col cols="12" md="8">
              <div class="bio-section" data-aos="fade-left" data-aos-duration="800">
                <h3 class="text-h6 font-weight-bold mb-3">
                  <v-icon color="primary" class="mr-2 pulse-icon">mdi-account-details</v-icon>
                  个人简介
                </h3>
                <p class="text-body-1 mb-4 slide-up-text">
                  👋欢迎来到我的博客！我是Noahall，一名热爱技术和艺术的全栈开发者。我致力于探索最新的网络技术和开发方法，并在这里分享我的创作和开发心得。
                </p>
                <p class="text-body-1 mb-4 slide-up-text" data-aos="fade-up" data-aos-delay="100">
                  🚀我的技术栈涵盖前端Vue2、3框架，后端Python、Node.js，以及Docker、云服务部署。我相信技术应该服务于人类，使生活更加便捷和美好。
                </p>
                <p class="text-body-1 slide-up-text" data-aos="fade-up" data-aos-delay="200">
                  👨‍💻除了编程，我也热爱写作、观影、音乐、DIY、运动，这些爱好给了我不同的视角和灵感
                </p>
              </div>
            </v-col>
          </v-row>
        </v-card>
        
        <!-- 技能卡片 -->
        <v-card class="about-card mx-auto mb-8 tilt-card" max-width="900" elevation="4" ref="skillsCard">
          <div class="card-header pa-6">
            <h2 class="text-h5 font-weight-bold mb-2" data-aos="fade-up">
              <v-icon color="primary" class="mr-2 rotating-icon">mdi-lightbulb</v-icon>
              专业技能
            </h2>
          </div>
          
          <v-container class="pa-6">
            <v-row>
              <v-col cols="12" md="4" v-for="(category, index) in skills" :key="index" data-aos="flip-up" :data-aos-delay="index * 100">
                <div class="skill-category mb-6">
                  <h3 class="text-h6 font-weight-bold mb-3">{{ category.name }}</h3>
                  
                  <div v-for="(skill, i) in category.items" :key="i" class="skill-item mb-3" :data-aos="index % 2 ? 'fade-left' : 'fade-right'" :data-aos-delay="i * 50">
                    <div class="d-flex justify-space-between mb-1">
                      <span class="text-subtitle-2">{{ skill.name }}</span>
                      <span class="text-caption counter" :data-target="skill.level">0</span>
                    </div>
                    <v-progress-linear
                      :model-value="skill.level"
                      height="6"
                      rounded
                      :color="category.color"
                      class="skill-progress"
                    ></v-progress-linear>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
        
        <!-- 博客历程卡片 -->
        <v-card class="about-card mx-auto mb-8 tilt-card" max-width="900" elevation="4" ref="timelineCard">
          <div class="card-header pa-6">
            <h2 class="text-h5 font-weight-bold mb-2" data-aos="fade-up">
              <v-icon color="primary" class="mr-2 bounce-icon">mdi-book-open-page-variant</v-icon>
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
                data-aos="zoom-in-left"
                :data-aos-delay="i * 200"
                class="timeline-item"
              >
                <template v-slot:opposite>
                  <div class="text-caption">{{ event.date }}</div>
                </template>
                <v-card class="timeline-card floating-card" variant="outlined">
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
        <v-card class="about-card mx-auto tilt-card" max-width="900" elevation="4" ref="contactCard">
          <div class="card-header pa-6">
            <h2 class="text-h5 font-weight-bold mb-2" data-aos="fade-up">
              <v-icon color="primary" class="mr-2 swing-icon">mdi-message-text</v-icon>
              如何找到我
            </h2>
            <p class="text-subtitle-1 text-medium-emphasis" data-aos="fade-up" data-aos-delay="100">有任何问题或想法，欢迎联系我</p>
          </div>
          
          <v-container class="pa-6">
            <v-row>
              <v-col cols="12" md="6" data-aos="fade-right">
                <v-form>
                  <v-text-field
                    label="您的姓名"
                    variant="outlined"
                    prepend-inner-icon="mdi-account"
                    class="mb-4 form-field"
                  ></v-text-field>
                  
                  <v-text-field
                    label="您的邮箱"
                    variant="outlined"
                    prepend-inner-icon="mdi-email"
                    class="mb-4 form-field"
                  ></v-text-field>
                  
                  <v-textarea
                    label="您的留言"
                    variant="outlined"
                    prepend-inner-icon="mdi-comment-text"
                    rows="5"
                    class="mb-4 form-field"
                  ></v-textarea>
                  
                  <v-btn
                    color="primary"
                    size="large"
                    prepend-icon="mdi-send"
                    block
                    elevation="2"
                    class="pulse-btn"
                  >
                    发送留言
                  </v-btn>
                </v-form>
              </v-col>
              
              <v-col cols="12" md="6" class="contact-info" data-aos="fade-left">
                <div class="d-flex align-center mb-6 contact-item" data-aos="fade-up" data-aos-delay="100">
                  <v-icon size="32" color="primary" class="mr-4 pulse-icon">mdi-map-marker</v-icon>
                  <div>
                    <h3 class="text-subtitle-1 font-weight-bold">地址</h3>
                    <p class="text-body-2">天津市武清区</p>
                  </div>
                </div>
                
                <div class="d-flex align-center mb-6 contact-item" data-aos="fade-up" data-aos-delay="200">
                  <v-icon size="32" color="primary" class="mr-4 pulse-icon">mdi-email</v-icon>
                  <div>
                    <h3 class="text-subtitle-1 font-weight-bold">邮箱</h3>
                    <p class="text-body-2">noahall127@outlook.com.com</p>
                  </div>
                </div>
                
                <div class="d-flex align-center mb-6 contact-item" data-aos="fade-up" data-aos-delay="300">
                  <v-icon size="32" color="primary" class="mr-4 pulse-icon">mdi-web</v-icon>
                  <div>
                    <h3 class="text-subtitle-1 font-weight-bold">网站</h3>
                    <p class="text-body-2">www.noahblog.com</p>
                  </div>
                </div>
                
                <v-card class="mt-4 floating-card" variant="outlined" data-aos="zoom-in" data-aos-delay="400">
                  <v-card-text class="text-center py-4">
                    <p class="text-h6 font-weight-bold mb-2">关注我的博客</p>
                    <p class="text-body-2">及时获取最新文章和动态</p>
                    <v-btn color="primary" variant="tonal" class="mt-2 glow-btn" prepend-icon="mdi-rss">
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
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import AOS from 'aos';
import 'aos/dist/aos.css';
import VanillaTilt from 'vanilla-tilt';
import Typed from 'typed.js';

// 注册GSAP插件
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// DOM引用
const follower = ref(null);
const parallaxContainer = ref(null);
const profileCard = ref(null);
const skillsCard = ref(null);
const timelineCard = ref(null);
const contactCard = ref(null);
const typingName = ref(null);

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

const initAOS = () => {
  AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    mirror: false
  });
};

// 初始化3D倾斜效果
const initTiltCards = () => {
  // 确保DOM已完全渲染
  nextTick(() => {
    const cards = document.querySelectorAll('.tilt-card');
    if (cards && cards.length > 0) {
      try {
        VanillaTilt.init(cards, {
          max: 5,
          speed: 300,
          glare: true,
          'max-glare': 0.1,
          gyroscope: true
        });
      } catch (error) {
        console.error('初始化VanillaTilt时出错:', error);
      }
    } else {
      console.warn('跳过VanillaTilt初始化');
    }
  });
};

// 专门为打字机效果创建一个初始化函数，确保正确位置
const initTypedText = () => {
  if (!typingName.value || !document.body.contains(typingName.value)) {
    console.warn('打字机容器元素不存在或未渲染');
    
    // 延迟重试
    setTimeout(() => {
      if (typingName.value && document.body.contains(typingName.value)) {
        console.log('延迟后找到了打字机元素，现在初始化');
        createTypedInstance();
      } else {
        console.error('即使延迟后仍未找到打字机元素');
      }
    }, 1000);
    
    return;
  }
  
  createTypedInstance();
};

// 单独提取出创建Typed实例的函数
const createTypedInstance = () => {
  // 首先清除可能存在的旧实例
  const oldCursor = document.querySelector('.typed-cursor');
  if (oldCursor && oldCursor.parentNode) {
    oldCursor.parentNode.removeChild(oldCursor);
  }
  
  // 确保DOM元素存在
  if (!typingName.value || !document.body.contains(typingName.value)) {
    return;
  }
  
  try {
    typingName.value.style.position = 'relative';
    typingName.value.style.display = 'inline-block';
    typingName.value.style.whiteSpace = 'nowrap';
    typingName.value.style.textAlign = 'center';
    typingName.value.innerHTML = ''; // 清空内容以避免冲突
  } catch (err) {
    console.error('设置打字机样式失败:', err);
  }
  
  // 创建Typed实例
  try {
    const typed = new Typed(typingName.value, {
      strings: ['Noah.all', '全栈开发者', '技术爱好者', 'MES工程师'],
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000,
      loop: true,
      showCursor: true, 
      cursorChar: '|',
      onComplete: (self) => {
        console.log('打字机初始化完成');
      }
    });
    
    console.log('打字机实例创建成功');
    
    // 手动调整光标位置
    setTimeout(() => {
      const cursor = document.querySelector('.typed-cursor');
      if (cursor) {
        try {
          cursor.style.display = 'inline-block';
          cursor.style.position = 'relative';
          cursor.style.opacity = '1';
          cursor.style.marginLeft = '1px';
        } catch (err) {
          console.error('调整光标样式失败:', err);
        }
      }
    }, 100);
    
    return typed;
  } catch (error) {
    console.error('打字机初始化错误:', error);
  }
};

// 初始化鼠标跟随效果
const initMouseFollower = () => {
  if (!follower.value || !document.body.contains(follower.value.$el || follower.value)) {
    console.warn('鼠标跟随元素不存在');
    return;
  }
  
  // 实际DOM元素
  const followerEl = follower.value.$el || follower.value;
  
  // 使用常规DOM事件代替GSAP
  const handleMouseMove = (e) => {
    try {
      // 使用requestAnimationFrame优化性能
      requestAnimationFrame(() => {
        if (followerEl && document.body.contains(followerEl)) {
          followerEl.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        }
      });
    } catch (err) {
      console.error('鼠标跟随错误:', err);
    }
  };

  // 添加事件监听
  document.addEventListener('mousemove', handleMouseMove);
  
  // 返回清理函数
  return () => {
    document.removeEventListener('mousemove', handleMouseMove);
  };
};

// 数字增长动画
const initCounters = () => {
  // 确保DOM已完全渲染
  nextTick(() => {
    const counters = document.querySelectorAll('.counter');
    if (!counters || counters.length === 0) {
      return;
    }
    
    const countUp = (counter) => {
      if (!counter) return;
      
      try {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const increment = target / 100;
        
        if (count < target) {
          counter.innerText = Math.ceil(count + increment);
          setTimeout(() => countUp(counter), 20);
        } else {
          counter.innerText = target + '%';
        }
      } catch (error) {
        console.error('执行计数器动画时出错:', error);
      }
    };
    
    try {
      // 创建观察器以确定元素是否在视口中
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            countUp(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      
      counters.forEach(counter => {
        if (counter) observer.observe(counter);
      });
    } catch (error) {
      console.error('初始化计数器观察器时出错:', error);
    }
  });
};

// 初始化滚动触发动画
const initScrollAnimations = () => {
  // 确保ScrollTrigger已注册
  if (!ScrollTrigger) {
    console.error('ScrollTrigger未注册');
    return;
  }

  // 延迟执行，确保DOM已完全加载
  setTimeout(() => {
    // 使用try-catch包裹整个函数
    try {
      // 技能条动画 - 使用原生DOM操作
      const skillBars = document.querySelectorAll('.v-progress-linear');
      if (skillBars && skillBars.length > 0) {
        console.log('找到技能条元素:', skillBars.length);
        
        // 首先将所有进度条设置为0
        skillBars.forEach((bar) => {
          if (!bar || !document.body.contains(bar)) return;
          
          try {
            // 找到关联的进度值
            const valueElem = bar.closest('.skill-item');
            if (valueElem) {
              const counterElem = valueElem.querySelector('.counter');
              if (counterElem) {
                const target = counterElem.getAttribute('data-target');
                if (target) {
                  // 保存目标值
                  bar.setAttribute('data-target-value', target);
                  
                  // 重置进度条 - 不使用GSAP，直接使用DOM操作
                  const innerBar = bar.querySelector('.v-progress-linear__determinate');
                  if (innerBar) {
                    innerBar.style.width = '0%';
                    innerBar.style.transform = 'none';
                  }
                }
              }
            }
          } catch (error) {
            console.error('处理进度条时出错:', error);
          }
        });
        
        // 创建一个安全的观察器
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const bar = entry.target;
              try {
                const targetValue = bar.getAttribute('data-target-value') || "0";
                const numValue = parseInt(targetValue) || 0;
                
                // 使用原生动画而不是GSAP
                const innerBar = bar.querySelector('.v-progress-linear__determinate');
                if (innerBar) {
                  let width = 0;
                  const duration = 1500; // 1.5秒
                  const interval = 16; // 约60fps
                  const steps = duration / interval;
                  const increment = numValue / steps;
                  
                  const animation = setInterval(() => {
                    width += increment;
                    if (width >= numValue) {
                      width = numValue;
                      clearInterval(animation);
                    }
                    innerBar.style.width = `${width}%`;
                  }, interval);
                }
                
                // 更新计数器
                const skillItem = bar.closest('.skill-item');
                if (skillItem) {
                  const counter = skillItem.querySelector('.counter');
                  if (counter) {
                    let count = 0;
                    const interval = setInterval(() => {
                      count += 1;
                      if (counter && document.body.contains(counter)) {
                        counter.textContent = count;
                        if (count >= numValue) {
                          counter.textContent = numValue + '%';
                          clearInterval(interval);
                        }
                      } else {
                        clearInterval(interval);
                      }
                    }, 15);
                  }
                }
                
                // 一旦处理过，就不再观察
                observer.unobserve(bar);
              } catch (error) {
                console.error('处理进度条动画时出错:', error);
                observer.unobserve(bar);
              }
            }
          });
        }, { threshold: 0.1 });
        
        // 开始观察所有进度条
        skillBars.forEach(bar => {
          if (bar && document.body.contains(bar)) {
            observer.observe(bar);
          }
        });
      } else {
        console.warn('未找到.v-progress-linear元素，跳过技能条动画初始化');
      }
      
      // 时间线动画 - 使用IntersectionObserver替代ScrollTrigger
      const timelineItems = document.querySelectorAll('.timeline-item');
      if (timelineItems && timelineItems.length > 0) {
        timelineItems.forEach((item, index) => {
          if (!item || !document.body.contains(item)) return;
          
          try {
            // 首先设置初始状态
            item.style.opacity = '0';
            item.style.transform = `translateX(${index % 2 ? '100px' : '-100px'})`;
            
            // 使用IntersectionObserver代替ScrollTrigger
            const observer = new IntersectionObserver((entries) => {
              entries.forEach(entry => {
                if (entry.isIntersecting) {
                  const item = entry.target;
                  
                  // 使用CSS过渡动画替代GSAP
                  item.style.transition = `transform 0.8s ease ${index * 0.2}s, opacity 0.8s ease ${index * 0.2}s`;
                  item.style.transform = 'translateX(0)';
                  item.style.opacity = '1';
                  
                  // 一旦处理过，就不再观察
                  observer.unobserve(item);
                }
              });
            }, { threshold: 0.1 });
            
            observer.observe(item);
          } catch (error) {
            console.error('初始化时间线动画时出错:', error);
          }
        });
      } else {
        console.warn('未找到.timeline-item元素，跳过时间线动画初始化');
      }
    } catch (e) {
      console.error('动画初始化全局错误:', e);
    }
  }, 500); // 添加延迟确保DOM已完全准备好
};

// 添加变量保存清理函数
let cleanupFunctions = null;

onMounted(() => {
  const aboutPage = document.querySelector('.about-page');
  if (aboutPage) {
    aboutPage.style.opacity = '1';
  }

  setTimeout(() => {
    cleanupFunctions = initializeEffects();
  }, 1000);
});

onUnmounted(() => {
  if (cleanupFunctions) {
    Object.values(cleanupFunctions).forEach(fn => {
      if (typeof fn === 'function') {
        try { fn(); } catch (e) { console.error('清理函数执行错误:', e); }
      }
    });
  }

  try { AOS.refresh(); } catch (e) { console.error('AOS清理错误:', e); }
});

// 单独提取初始化效果的函数
const initializeEffects = () => {
  // 确保文档已完全加载
  if (!document.body) {
    return;
  }
  
  const aboutPage = document.querySelector('.about-page');
  if (aboutPage) {
    aboutPage.style.opacity = '1';
  }
 
  const initSequence = async () => {
    try {
      await new Promise(resolve => {
        setTimeout(() => {
          try { initAOS(); } catch (e) { console.error('AOS初始化失败:', e); }
          resolve();
        }, 300);
      });

      await new Promise(resolve => {
        setTimeout(() => {
          try { initTiltCards(); } catch (e) { console.error('3D卡片效果初始化失败:', e); }
          resolve();
        }, 300);
      });

      await new Promise(resolve => {
        setTimeout(() => {
          try { initTypedText(); } catch (e) { console.error('打字机效果初始化失败:', e); }
          resolve();
        }, 300);
      });
      
      const cleanupMouseFollower = await new Promise(resolve => {
        setTimeout(() => {
          let cleanup = null;
          try { cleanup = initMouseFollower(); } catch (e) { console.error('鼠标跟随效果初始化失败:', e); }
          resolve(cleanup);
        }, 300);
      });
      
      await new Promise(resolve => {
        setTimeout(() => {
          try { initCounters(); } catch (e) { console.error('计数器初始化失败:', e); }
          try { initScrollAnimations(); } catch (e) { console.error('滚动动画初始化失败:', e); }
          resolve();
        }, 300);
      });
      
      // 返回清理函数
      return {
        cleanupMouseFollower: typeof cleanupMouseFollower === 'function' ? cleanupMouseFollower : null
      };
    } catch (error) {
      console.error('初始化序列错误:', error);
      return {};
    }
  };
  
  // 执行初始化序列
  return initSequence();
};
</script>

<style scoped>
/* 添加渐变波浪背景 */
.gradient-wave-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
}

.wave {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0.3;
  border-radius: 40%;
}

.wave1 {
  background: radial-gradient(circle at center, rgba(63, 81, 181, 0.4) 0%, transparent 70%);
  animation: wave 20s linear infinite;
  z-index: -3;
}

.wave2 {
  background: radial-gradient(circle at center, rgba(103, 58, 183, 0.3) 0%, transparent 70%);
  animation: wave 25s linear infinite;
  animation-delay: -5s;
  z-index: -2;
}

.wave3 {
  background: radial-gradient(circle at center, rgba(33, 150, 243, 0.2) 0%, transparent 70%);
  animation: wave 30s linear infinite;
  animation-delay: -10s;
  z-index: -1;
}

@keyframes wave {
  0% {
    transform: translate(-50%, -50%) rotate(0deg) scale(1);
  }
  50% {
    transform: translate(-50%, -50%) rotate(180deg) scale(1.2);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg) scale(1);
  }
}

/* 页面基本样式 */
.about-page {
  min-height: calc(100vh - 200px);
  position: relative;
  overflow: hidden;
  background-color: transparent !important;
}

.about-page::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 30% 30%, rgba(var(--primary-blue), 0.03), transparent 400px),
              radial-gradient(circle at 70% 70%, rgba(var(--accent-orange), 0.03), transparent 400px);
  pointer-events: none;
  z-index: -1;
}

.follower {
  position: fixed;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: rgba(var(--primary-blue), 0.1);
  pointer-events: none;
  z-index: 9999;
  mix-blend-mode: difference;
  transform: translate(-50%, -50%);
  transition: transform 0.1s ease;
}


.parallax-container {
  perspective: 1000px;
  transform-style: preserve-3d;
}

.about-card {
  backdrop-filter: blur(8px);
  background: rgba(var(--v-theme-surface), 0.85);
  border-radius: var(--border-radius);
  overflow: hidden;
  border: 1px solid rgba(var(--primary-blue), 0.1);
  transition: all var(--transition-default);
  transform-style: preserve-3d;
  will-change: transform;
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
  animation: gradient-shift 15s ease infinite;
}

.profile-avatar {
  border: 4px solid rgba(var(--primary-blue), 0.2);
  box-shadow: 0 8px 30px rgba(var(--primary-blue), 0.15);
  transition: all var(--transition-default);
  animation: float 6s ease-in-out infinite;
}

.profile-avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 12px 36px rgba(var(--primary-blue), 0.25);
}

/* 浮动动画 */
@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
}

/* 社交图标动画 */
.floating-icon {
  animation: floating 3s ease-in-out infinite;
  transition: all var(--transition-default);
}

.floating-icon:nth-child(1) {
  animation-delay: 0s;
}

.floating-icon:nth-child(2) {
  animation-delay: 0.2s;
}

.floating-icon:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes floating {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
  100% {
    transform: translateY(0px);
  }
}

.social-links .v-btn:hover {
  transform: translateY(-5px) scale(1.2);
  box-shadow: 0 8px 16px rgba(var(--primary-blue), 0.2);
}

.bio-section {
  border-left: 3px solid rgba(var(--primary-blue), 0.1);
  padding-left: 20px;
  position: relative;
}

.bio-section::after {
  content: '';
  position: absolute;
  top: 0;
  left: -3px;
  width: 3px;
  height: 0;
  background: linear-gradient(to bottom, rgba(var(--primary-blue), 0.8), rgba(var(--accent-orange), 0.6));
  animation: fill-line 2s ease-out forwards;
  animation-delay: 1s;
}

@keyframes fill-line {
  0% {
    height: 0;
  }
  100% {
    height: 100%;
  }
}

.typing-container {
  position: relative;
  margin: 10px auto 15px;
  min-height: 20px;
  text-align: center;
}

.typing-text {
  display: inline !important;
  font-weight: bold;
  margin: 0 auto;
  white-space: nowrap;
}

/* 确保Typed.js的光标正确显示 */
:deep(.typed-cursor) {
  opacity: 1;
  font-weight: 500;
  margin-left: 1px;
  display: inline-block;
  position: relative;
  animation: blink 0.7s infinite;
  color: var(--v-primary-base);
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* 上滑文本 */
.slide-up-text {
  opacity: 0;
  transform: translateY(20px);
  animation: slide-up 0.8s forwards;
}

.slide-up-text:nth-child(1) {
  animation-delay: 0.3s;
}

.slide-up-text:nth-child(2) {
  animation-delay: 0.6s;
}

.slide-up-text:nth-child(3) {
  animation-delay: 0.9s;
}

@keyframes slide-up {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}


.skill-item {
  transition: all var(--transition-default);
}

.skill-item:hover {
  transform: translateX(10px);
}

.skill-progress {
  position: relative;
  overflow: hidden;
}

.skill-progress::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
  transform: translateX(-100%);
  animation: shine 3s infinite;
}

@keyframes shine {
  100% {
    transform: translateX(100%);
  }
}

/* 3D卡片效果 */
.floating-card {
  transition: all 2s ease;
  transform: translateZ(10px);
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.1);
}

.floating-card:hover {
  transform: translateY(-10px) translateZ(10px);
  box-shadow: 0 15px 40px rgba(var(--primary-blue), 0.2);
}

/* 闪烁按钮 */
.glow-btn {
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.glow-btn::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(var(--primary-blue), 0.1), transparent);
  transform: rotate(45deg);
  animation: glow 3s infinite;
}

@keyframes glow {
  0% {
    transform: rotate(45deg) translateX(-100%);
  }
  100% {
    transform: rotate(45deg) translateX(100%);
  }
}

/* 脉冲图标 */
.pulse-icon {
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

/* 旋转图标 */
.rotating-icon {
  animation: rotate 3s infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 弹跳图标 */
.bounce-icon {
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

/* 摇摆图标 */
.swing-icon {
  animation: swing 1s infinite;
}

@keyframes swing {
  20% {
    transform: rotate(15deg);
  }
  40% {
    transform: rotate(-10deg);
  }
  60% {
    transform: rotate(5deg);
  }
  80% {
    transform: rotate(-5deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

/* 按钮脉冲效果 */
.pulse-btn {
  position: relative;
  animation: button-pulse 2s infinite;
}

@keyframes button-pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(var(--primary-blue), 0.5);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(var(--primary-blue), 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(var(--primary-blue), 0);
  }
}

/* 表单字段动画 */
.form-field {
  transition: all 0.3s ease;
}

.form-field:focus {
  transform: scale(1.02);
}

/* 联系项目动画 */
.contact-item {
  transition: all 0.3s ease;
}

.contact-item:hover {
  transform: translateX(10px);
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
    animation: pulse-line 2s infinite;
  }
}

@keyframes pulse-line {
  0% {
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.3;
  }
}

@media (max-width: 768px) {
  .wave {
    /* 移动端上减少动画强度，降低资源消耗 */
    animation-duration: 40s;
    opacity: 0.2;
  }
  
  .follower {
    display: none;
  }
  
  .about-card {
    margin-left: 12px !important;
    margin-right: 12px !important;
  }
  
  .profile-avatar {
    width: 120px !important;
    height: 120px !important;
  }
  
  .typed-cursor {
    font-size: 0.9rem;
  }
}

/* 平板优化 */
@media (min-width: 769px) and (max-width: 1024px) {
  .wave {
    animation-duration: 35s;
    opacity: 0.25;
  }
}
</style>
