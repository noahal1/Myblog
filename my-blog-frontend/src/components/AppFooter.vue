<template>
  <v-footer app class="footer pa-0" style="position: relative;">
    <v-container>
      <v-row>
        <v-col cols="12" md="4" class="text-center text-md-left">
          <div class="text-h6 mb-2">Noah的博客</div>
          <p class="mb-0 text-body-2">分享技术，记录生活</p>
        </v-col>
        
        <v-col cols="12" md="4" class="text-center">
          <div class="text-subtitle-2 mb-2">友情链接</div>
          <div class="d-flex justify-center flex-wrap">
            <a href="https://vuejs.org" target="_blank" class="text-decoration-none mx-2 text-body-2">Vue官网</a>
            <a href="https://fastapi.tiangolo.com" target="_blank" class="text-decoration-none mx-2 text-body-2">FastAPI官网</a>
            <a href="https://developer.mozilla.org" target="_blank" class="text-decoration-none mx-2 text-body-2">MDN文档</a>
          </div>
        </v-col>
        
        <v-col cols="12" md="4" class="text-center text-md-right">
          <div class="text-subtitle-2 mb-2">联系我</div>
          <div class="social-links">
            <v-btn icon="mdi-github" variant="text" href="https://github.com/noahal1" target="_blank" class="mx-1"></v-btn>
            <v-btn icon="mdi-email" variant="text" href="mailto:noahall127@outlook.com" class="mx-1"></v-btn>
            <v-btn icon="mdi-sina-weibo" variant="text" href="#" target="_blank" class="mx-1"></v-btn>
          </div>
        </v-col>
      </v-row>
      
      <v-divider class="my-4" />
      
      <div class="text-center copyright pb-2">
        &copy; {{ new Date().getFullYear() }} Noah的博客 | 
        <span class="powered-by">Powered by <span class="gradient-text"> noahall</span> </span>
      </div>
    </v-container>
  </v-footer>
</template>

<script setup>
</script>

<style scoped>
.footer {
  background: linear-gradient(
    to right,
    rgba(var(--primary-blue), 0.05),
    rgba(var(--secondary-purple), 0.03),
    rgba(var(--accent-orange), 0.05)
  );
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(var(--primary-blue), 0.1);
  padding: 32px 0 16px;
}

.footer .text-h6 {
  background: var(--neon-gradient);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-weight: bold;
  display: inline-block;
}

.social-links .v-btn {
  transition: all var(--transition-default);
  position: relative;
  overflow: hidden;
}

.social-links .v-btn::after {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--neon-gradient);
  opacity: 0;
  transition: opacity var(--transition-default);
  border-radius: 50%;
  z-index: -1;
}

.social-links .v-btn:hover {
  transform: translateY(-3px);
  color: white;
}

.social-links .v-btn:hover::after {
  opacity: 0.8;
}

a {
  color: inherit;
  transition: all var(--transition-default);
  position: relative;
  display: inline-block;
}

a::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    rgba(var(--primary-blue), 0.7),
    rgba(var(--accent-orange), 0.7)
  );
  transition: width var(--transition-default);
}

a:hover {
  color: rgb(var(--primary-blue));
  transform: translateX(2px);
}

a:hover::after {
  width: 100%;
}

.copyright {
  opacity: 0.8;
  font-size: 0.9rem;
}

.powered-by {
  font-weight: 500;
  letter-spacing: 0.5px;
}
</style> 