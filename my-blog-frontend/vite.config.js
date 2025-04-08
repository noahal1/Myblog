import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import path from 'path'
// 暂时注释掉这些导入
// import { VitePWA } from 'vite-plugin-pwa'
// import viteCompression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag === 'emoji-picker'
        }
      }
    }),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    }),
    // 暂时注释掉PWA配置
    // VitePWA({
    //   registerType: 'autoUpdate',
    //   includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
    //   manifest: {
    //     name: 'Noah\'s Blog',
    //     short_name: 'NoahBlog',
    //     description: 'Noah的个人技术博客',
    //     theme_color: '#3F51B5',
    //     icons: [
    //       {
    //         src: 'pwa-192x192.png',
    //         sizes: '192x192',
    //         type: 'image/png'
    //       },
    //       {
    //         src: 'pwa-512x512.png',
    //         sizes: '512x512',
    //         type: 'image/png'
    //       }
    //     ]
    //   }
    // }),
    // viteCompression()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia', 'vuetify'],
          markdown: ['marked', 'highlight.js']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
