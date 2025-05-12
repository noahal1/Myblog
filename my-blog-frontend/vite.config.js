import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import path from 'path'
// 引入压缩插件
import viteCompression from 'vite-plugin-compression'
// 引入可视化构建分析工具
import { visualizer } from 'rollup-plugin-visualizer'
// 引入PWA插件
import { VitePWA } from 'vite-plugin-pwa'
// 引入图片压缩插件
import viteImagemin from 'vite-plugin-imagemin'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // 根据当前工作目录中的 `mode` 加载 .env 文件
  // 设置第三个参数为 '' 来加载所有环境变量，而不管是否有 `VITE_` 前缀。
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
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
      // 图片压缩 - 仅在生产环境启用
      mode === 'production' && viteImagemin({
        gifsicle: {
          optimizationLevel: 7,
          interlaced: false,
        },
        optipng: {
          optimizationLevel: 7,
        },
        mozjpeg: {
          quality: 80,
        },
        pngquant: {
          quality: [0.8, 0.9],
          speed: 4,
        },
        svgo: {
          plugins: [
            {
              name: 'removeViewBox',
            },
            {
              name: 'removeEmptyAttrs',
              active: false,
            },
          ],
        },
      }),
      mode === 'production' && VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
        manifest: {
          name: 'Noahblog',
          short_name: 'Noahblog',
          description: "'noah's blog'",
          theme_color: '#3F51B5',
          background_color: '#f5f5f5',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable',
            },
          ],
        },
        workbox: {
          // 缓存配置
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // 1年
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // 1年
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'images-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24 * 7, // 1周
                },
              },
            },
            {
              urlPattern: new RegExp('^' + env.VITE_API_BASE_URL + '/api/articles'),
              handler: 'NetworkFirst',
              options: {
                cacheName: 'api-articles-cache',
                expiration: {
                  maxEntries: 20,
                  maxAgeSeconds: 60 * 5, // 5分钟
                },
              },
            },
          ],
        },
      }),
      // 构建分析工具 - 仅在分析模式下启用
      mode === 'analyze' && visualizer({
        open: true,
        filename: 'dist/stats.html',
        gzipSize: true,
        brotliSize: true
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:8000',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path
        }
      },
      open: true, // 自动打开浏览器
      hmr: {
        overlay: true, // 热更新错误遮罩层
      }
    },
    build: {
      cssCodeSplit: true,
      // 使用terser压缩器进行更彻底的优化
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: mode === 'production', // 生产环境下移除console
          drop_debugger: mode === 'production', // 生产环境下移除debugger
          pure_funcs: mode === 'production' ? ['console.log'] : []
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
              if (id.includes('marked') || id.includes('highlight.js') || id.includes('prismjs') || id.includes('md-editor')) {
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
      // 只在生产环境禁用源码映射
      sourcemap: mode !== 'production'
    },
    css: {
      // 启用CSS预处理
      preprocessorOptions: {
        scss: {
          additionalData: ''
        }
      },
      devSourcemap: true // 开发环境启用CSS源码映射
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
        'axios',
        'prismjs',
        'dompurify',
        'gsap'
      ]
    },
    // 缓存设置
    cacheDir: '.vite_cache'
  }
})
