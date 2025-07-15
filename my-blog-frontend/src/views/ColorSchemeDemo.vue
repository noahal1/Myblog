<template>
  <div class="color-demo-page premium-bg-gradient">
    <v-container class="py-8">
      <div class="text-center mb-8">
        <h1 class="premium-gradient-text text-h3 mb-4">
          高级感配色方案展示
        </h1>
        <p class="text-h6" style="color: rgb(var(--mist-gray-dark))">
          普鲁士蓝 × 雾灰色设计系统
        </p>
      </div>

      <!-- 配色板展示 -->
      <div class="premium-card mb-8 pa-6">
        <h2 class="text-h5 mb-4" style="color: rgb(var(--prussian-blue))">配色板</h2>
        <v-row>
          <v-col cols="12" md="6">
            <h3 class="text-h6 mb-3">主色调</h3>
            <div class="color-palette mb-4">
              <div class="color-item">
                <div class="color-swatch" style="background: rgb(var(--prussian-blue))"></div>
                <div class="color-info">
                  <div class="color-name">普鲁士蓝</div>
                  <div class="color-code">#003153</div>
                </div>
              </div>
              <div class="color-item">
                <div class="color-swatch" style="background: rgb(var(--prussian-blue-light))"></div>
                <div class="color-info">
                  <div class="color-name">浅普鲁士蓝</div>
                  <div class="color-code">#194A6C</div>
                </div>
              </div>
              <div class="color-item">
                <div class="color-swatch" style="background: rgb(var(--mist-gray))"></div>
                <div class="color-info">
                  <div class="color-name">雾灰色</div>
                  <div class="color-code">#E5DDD7</div>
                </div>
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <h3 class="text-h6 mb-3">辅助色调</h3>
            <div class="color-palette">
              <div class="color-item">
                <div class="color-swatch" style="background: rgb(var(--sage-green))"></div>
                <div class="color-info">
                  <div class="color-name">鼠尾草绿</div>
                  <div class="color-code">#81B29A</div>
                </div>
              </div>
              <div class="color-item">
                <div class="color-swatch" style="background: rgb(var(--soft-lavender))"></div>
                <div class="color-info">
                  <div class="color-name">柔和薰衣草</div>
                  <div class="color-code">#9FA8DA</div>
                </div>
              </div>
              <div class="color-item">
                <div class="color-swatch" style="background: rgb(var(--accent-gold))"></div>
                <div class="color-info">
                  <div class="color-name">雅致金色</div>
                  <div class="color-code">#D4AF37</div>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
      </div>

      <!-- 组件展示 -->
      <div class="premium-card mb-8 pa-6">
        <h2 class="text-h5 mb-4" style="color: rgb(var(--prussian-blue))">UI组件展示</h2>
        
        <!-- 按钮展示 -->
        <div class="mb-6">
          <h3 class="text-h6 mb-3">按钮样式</h3>
          <div class="d-flex flex-wrap gap-3">
            <button class="premium-btn">主要按钮</button>
            <button class="premium-btn-secondary">次要按钮</button>
            <v-btn color="primary" variant="outlined">Vuetify按钮</v-btn>
          </div>
        </div>

        <!-- 输入框展示 -->
        <div class="mb-6">
          <h3 class="text-h6 mb-3">输入框样式</h3>
          <div class="d-flex flex-wrap gap-3">
            <input class="premium-input" placeholder="高级输入框" style="width: 200px;">
            <v-text-field 
              label="Vuetify输入框" 
              variant="outlined"
              style="width: 200px;"
            ></v-text-field>
          </div>
        </div>

        <!-- 标签展示 -->
        <div class="mb-6">
          <h3 class="text-h6 mb-3">标签样式</h3>
          <div class="d-flex flex-wrap gap-2">
            <span class="premium-chip">设计</span>
            <span class="premium-chip active">开发</span>
            <span class="premium-chip">艺术</span>
            <span class="premium-chip">技术</span>
          </div>
        </div>
      </div>

      <!-- 卡片展示 -->
      <div class="premium-card mb-8 pa-6">
        <h2 class="text-h5 mb-4" style="color: rgb(var(--prussian-blue))">卡片效果展示</h2>
        <v-row>
          <v-col cols="12" md="4" v-for="i in 3" :key="i">
            <div class="premium-card premium-hover-lift pa-4">
              <h3 class="text-h6 mb-2 premium-gradient-text">示例卡片 {{ i }}</h3>
              <p style="color: rgb(var(--mist-gray-dark))">
                这是一个使用新配色方案的高级感卡片组件，具有优雅的玻璃拟态效果和精致的阴影。
              </p>
              <div class="premium-divider"></div>
              <div class="d-flex justify-space-between align-center">
                <span class="premium-chip">标签</span>
                <button class="premium-btn" style="padding: 8px 16px; font-size: 0.875rem;">
                  查看详情
                </button>
              </div>
            </div>
          </v-col>
        </v-row>
      </div>

      <!-- 渐变文字展示 -->
      <div class="premium-card pa-6">
        <h2 class="text-h5 mb-4" style="color: rgb(var(--prussian-blue))">文字效果展示</h2>
        <div class="text-center">
          <h1 class="premium-gradient-text text-h2 mb-4">
            优雅的渐变文字
          </h1>
          <p class="text-h5" style="color: rgb(var(--mist-gray-dark))">
            普鲁士蓝与雾灰色的完美融合
          </p>
          <div class="premium-divider"></div>
          <p class="text-body-1" style="color: rgb(var(--charcoal))">
            这套配色方案体现了现代设计的高级感，通过深邃的普鲁士蓝和柔和的雾灰色，
            营造出既专业又温馨的视觉体验。配合精致的玻璃拟态效果和有机圆角设计，
            为用户带来愉悦的交互体验。
          </p>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script setup>
// 配色方案演示页面
</script>

<style scoped>
.color-demo-page {
  min-height: 100vh;
  padding-top: 80px;
}

.color-palette {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.color-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.color-swatch {
  width: 60px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid rgba(var(--mist-gray), 0.3);
  box-shadow: 0 2px 8px rgba(var(--prussian-blue), 0.1);
}

.color-info {
  flex: 1;
}

.color-name {
  font-weight: 500;
  color: rgb(var(--charcoal));
  margin-bottom: 2px;
}

.color-code {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 0.875rem;
  color: rgb(var(--mist-gray-dark));
}

.gap-3 {
  gap: 12px;
}

.gap-2 {
  gap: 8px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .color-palette {
    flex-direction: column;
  }
  
  .d-flex.flex-wrap {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
