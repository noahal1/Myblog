import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import path from 'path'
// 引入压缩插件
import viteCompression from 'vite-plugin-compression'
// 引入可视化构建分析工具
import { visualizer } from 'rollup-plugin-visualizer'

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
      resolvers: [ElementPlusResolver()],
      // 自动导入Vue和Vue Router相关API
      imports: [
        'vue',
        'vue-router',
        'pinia'
      ],
      dts: 'src/auto-imports.d.ts',
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      // 配置自动导入的组件目录
      dirs: ['src/components'],
      extensions: ['vue'],
      dts: 'src/components.d.ts',
    }),
    // 启用压缩
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240, // 大于10kb的文件才会被压缩
      algorithm: 'gzip',
      ext: '.gz',
    }),
    // 构建分析工具 - 仅在分析模式下启用
    process.env.MODE === 'analyze' ? visualizer({
      open: true,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true
    }) : null,
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
    // 启用CSS代码分割
    cssCodeSplit: true,
    // 使用terser压缩器进行更彻底的优化
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // 生产环境下移除console
        drop_debugger: true // 移除debugger
      }
    },
    // 分包策略优化
    rollupOptions: {
      output: {
        // 将依赖包分开打包
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            // 将第三方库分成不同的块以优化缓存
            if (id.includes('vue') || id.includes('pinia') || id.includes('vue-router')) {
              return 'vendor-vue'
            }
            if (id.includes('vuetify')) {
              return 'vendor-vuetify'
            }
            if (id.includes('marked') || id.includes('highlight.js')) {
              return 'vendor-markdown'
            }
            if (id.includes('@mdi') || id.includes('material-design-icons')) {
              return 'vendor-icons'
            }
            return 'vendor' // 所有其他第三方库
          }
        },
        // 静态资源分类打包
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          let extType = info[info.length - 1]
          if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i.test(assetInfo.name)) {
            extType = 'media'
          } else if (/\.(png|jpe?g|gif|svg|webp)(\?.*)?$/i.test(assetInfo.name)) {
            extType = 'img'
          } else if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(assetInfo.name)) {
            extType = 'fonts'
          }
          return `assets/${extType}/[name]-[hash][extname]`
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      }
    },
    // 提高大型包警告限制
    chunkSizeWarningLimit: 1500,
    // 禁用源码映射以减小构建体积
    sourcemap: false
  },
  css: {
    // 启用CSS预处理
    preprocessorOptions: {
      scss: {
        additionalData: ''
      }
    }
  },
  // 性能优化
  optimizeDeps: {
    include: [
      'vue', 
      'vue-router', 
      'pinia', 
      'vuetify', 
      'marked', 
      'highlight.js', 
      'axios'
    ]
  },
  // 缓存设置
  cacheDir: '.vite_cache'
})
