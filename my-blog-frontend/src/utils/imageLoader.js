/**
 * 图片加载增强工具
 * 提供图片预加载、懒加载、错误处理等功能
 */

// 图片缓存
const imageCache = new Map()
const loadingPromises = new Map()

/**
 * 预加载图片
 * @param {string} src - 图片URL
 * @returns {Promise<HTMLImageElement>}
 */
export function preloadImage(src) {
  // 如果已经缓存，直接返回
  if (imageCache.has(src)) {
    return Promise.resolve(imageCache.get(src))
  }

  // 如果正在加载，返回现有的Promise
  if (loadingPromises.has(src)) {
    return loadingPromises.get(src)
  }

  const promise = new Promise((resolve, reject) => {
    const img = new Image()
    
    img.onload = () => {
      imageCache.set(src, img)
      loadingPromises.delete(src)
      resolve(img)
    }
    
    img.onerror = () => {
      loadingPromises.delete(src)
      reject(new Error(`Failed to load image: ${src}`))
    }
    
    img.src = src
  })

  loadingPromises.set(src, promise)
  return promise
}

/**
 * 批量预加载图片
 * @param {string[]} urls - 图片URL数组
 * @returns {Promise<HTMLImageElement[]>}
 */
export function preloadImages(urls) {
  return Promise.all(urls.map(url => preloadImage(url)))
}

/**
 * 从Markdown内容中提取图片URL
 * @param {string} markdownContent - Markdown内容
 * @returns {string[]} 图片URL数组
 */
export function extractImageUrls(markdownContent) {
  if (!markdownContent) return []
  
  const imageRegex = /!\[.*?\]\((.*?)\)/g
  const urls = []
  let match
  
  while ((match = imageRegex.exec(markdownContent)) !== null) {
    const url = match[1]
    if (url && !url.startsWith('data:')) {
      // 处理相对路径
      const fullUrl = url.startsWith('http') ? url : 
                     url.startsWith('/') ? url : `/${url}`
      urls.push(fullUrl)
    }
  }
  
  return urls
}

/**
 * 智能图片加载器
 * 根据网络状况和设备性能调整加载策略
 */
export class SmartImageLoader {
  constructor() {
    this.isSlowConnection = this.detectSlowConnection()
    this.isLowEndDevice = this.detectLowEndDevice()
    this.loadQueue = []
    this.isProcessing = false
    this.maxConcurrent = this.isSlowConnection ? 2 : 4
  }

  /**
   * 检测慢速网络连接
   */
  detectSlowConnection() {
    if ('connection' in navigator) {
      const connection = navigator.connection
      return connection.effectiveType === 'slow-2g' || 
             connection.effectiveType === '2g' ||
             connection.saveData
    }
    return false
  }

  /**
   * 检测低端设备
   */
  detectLowEndDevice() {
    if ('deviceMemory' in navigator) {
      return navigator.deviceMemory <= 2
    }
    // 基于硬件并发数判断
    return navigator.hardwareConcurrency <= 2
  }

  /**
   * 添加图片到加载队列
   * @param {string} src - 图片URL
   * @param {number} priority - 优先级 (1-10, 10最高)
   * @returns {Promise<HTMLImageElement>}
   */
  loadImage(src, priority = 5) {
    return new Promise((resolve, reject) => {
      this.loadQueue.push({
        src,
        priority,
        resolve,
        reject,
        timestamp: Date.now()
      })
      
      // 按优先级排序
      this.loadQueue.sort((a, b) => b.priority - a.priority)
      
      this.processQueue()
    })
  }

  /**
   * 处理加载队列
   */
  async processQueue() {
    if (this.isProcessing || this.loadQueue.length === 0) {
      return
    }

    this.isProcessing = true
    const concurrent = Math.min(this.maxConcurrent, this.loadQueue.length)
    const batch = this.loadQueue.splice(0, concurrent)

    try {
      await Promise.all(batch.map(item => this.loadSingleImage(item)))
    } catch (error) {
      console.warn('Batch image loading error:', error)
    }

    this.isProcessing = false
    
    // 继续处理剩余队列
    if (this.loadQueue.length > 0) {
      setTimeout(() => this.processQueue(), 100)
    }
  }

  /**
   * 加载单个图片
   */
  async loadSingleImage({ src, resolve, reject }) {
    try {
      const img = await preloadImage(src)
      resolve(img)
    } catch (error) {
      reject(error)
    }
  }

  /**
   * 清空加载队列
   */
  clearQueue() {
    this.loadQueue.forEach(item => {
      item.reject(new Error('Queue cleared'))
    })
    this.loadQueue = []
  }
}

// 全局智能加载器实例
export const smartLoader = new SmartImageLoader()

/**
 * 图片懒加载观察器
 */
export class LazyImageObserver {
  constructor(options = {}) {
    this.options = {
      rootMargin: '50px',
      threshold: 0.1,
      ...options
    }
    
    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      this.options
    )
    
    this.loadedImages = new Set()
  }

  /**
   * 观察图片元素
   * @param {HTMLElement} element - 图片元素
   */
  observe(element) {
    if (element && !this.loadedImages.has(element)) {
      this.observer.observe(element)
    }
  }

  /**
   * 停止观察图片元素
   * @param {HTMLElement} element - 图片元素
   */
  unobserve(element) {
    if (element) {
      this.observer.unobserve(element)
      this.loadedImages.delete(element)
    }
  }

  /**
   * 处理交叉观察
   */
  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target
        const src = img.dataset.src || img.src
        
        if (src && !this.loadedImages.has(img)) {
          this.loadImage(img, src)
          this.observer.unobserve(img)
        }
      }
    })
  }

  /**
   * 加载图片
   */
  async loadImage(img, src) {
    try {
      this.loadedImages.add(img)
      
      // 显示加载状态
      img.classList.add('loading')
      
      // 使用智能加载器加载图片
      await smartLoader.loadImage(src, 7) // 懒加载图片优先级较高
      
      // 更新图片源
      img.src = src
      img.classList.remove('loading')
      img.classList.add('loaded')
      
      // 触发自定义事件
      img.dispatchEvent(new CustomEvent('imageLoaded', {
        detail: { src, element: img }
      }))
      
    } catch (error) {
      console.error('Lazy load image error:', error)
      img.classList.remove('loading')
      img.classList.add('error')
      
      // 显示错误占位符
      this.showErrorPlaceholder(img)
    }
  }

  /**
   * 显示错误占位符
   */
  showErrorPlaceholder(img) {
    const placeholder = document.createElement('div')
    placeholder.className = 'image-error-placeholder'
    placeholder.innerHTML = `
      <div class="error-icon">❌</div>
      <div class="error-text">图片加载失败</div>
    `
    
    if (img.parentNode) {
      img.parentNode.replaceChild(placeholder, img)
    }
  }

  /**
   * 销毁观察器
   */
  destroy() {
    this.observer.disconnect()
    this.loadedImages.clear()
  }
}

// 全局懒加载观察器实例
export const lazyObserver = new LazyImageObserver()

/**
 * 初始化图片增强功能
 * @param {HTMLElement} container - 容器元素
 */
export function initImageEnhancements(container = document) {
  // 为所有markdown图片添加懒加载
  const images = container.querySelectorAll('.markdown-image')
  images.forEach(img => {
    if (!img.complete) {
      lazyObserver.observe(img)
    }
  })
  
  // 预加载关键图片（首屏图片）
  const criticalImages = container.querySelectorAll('.markdown-image[data-critical="true"]')
  criticalImages.forEach(img => {
    const src = img.dataset.src || img.src
    if (src) {
      smartLoader.loadImage(src, 10) // 最高优先级
    }
  })
}

/**
 * 清理图片缓存
 * @param {number} maxAge - 最大缓存时间（毫秒）
 */
export function clearImageCache(maxAge = 30 * 60 * 1000) { // 默认30分钟
  const now = Date.now()
  for (const [src, img] of imageCache.entries()) {
    if (now - img.loadTime > maxAge) {
      imageCache.delete(src)
    }
  }
}
