import MarkdownIt from 'markdown-it'
import anchor from 'markdown-it-anchor'
import Prism from 'prismjs'
import { extractImageUrls, smartLoader, initImageEnhancements } from './imageLoader'

// 导入 Prism 的样式 (在实际使用时按需选择主题)
import 'prismjs/themes/prism-tomorrow.css'
// 导入常用语言
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-json'

// 创建 markdown-it 实例
const md = new MarkdownIt({
  html: true,        // 允许 HTML 标签
  breaks: true,      // 转换 '\n' 为 <br>
  linkify: true,     // 自动将 URL 转换为链接
  typographer: true, // 替换引号和破折号等为排版正确的实体
  highlight: function (str, lang) {
    if (lang && Prism.languages[lang]) {
      try {
        return `<pre class="language-${lang}"><code>${Prism.highlight(str, Prism.languages[lang], lang)}</code></pre>`
      } catch (__) {}
    }
    return `<pre class="language-text"><code>${md.utils.escapeHtml(str)}</code></pre>`
  }
})

// 使用 anchor 插件为标题添加锚点
md.use(anchor, {
  permalink: true,
  permalinkBefore: true,
  permalinkSymbol: '#'
})

// 自定义图片渲染规则 - 增强版
md.renderer.rules.image = function (tokens, idx, options, env) {
  const token = tokens[idx]
  const src = token.attrGet('src')
  const alt = token.attrGet('alt') || ''
  const title = token.attrGet('title') || ''

  // 生成唯一ID用于图片加载状态管理
  const imageId = `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  // 检查是否是相对路径，如果是则添加基础URL
  let imageSrc = src
  if (src && !src.startsWith('http') && !src.startsWith('data:')) {
    // 如果是相对路径，可以在这里添加您的图片基础URL
    imageSrc = src.startsWith('/') ? src : `/${src}`
  }

  // 创建带有加载状态的图片容器
  return `
    <div class="markdown-image-container" data-image-id="${imageId}">
      <div class="markdown-image-skeleton" id="skeleton-${imageId}">
        <div class="image-skeleton-placeholder">
          <div class="image-skeleton-icon">📷</div>
          <div class="image-skeleton-text">加载中...</div>
        </div>
      </div>
      <img
        id="${imageId}"
        src="${imageSrc}"
        alt="${alt}"
        title="${title}"
        class="markdown-image"
        loading="lazy"
        onload="window.markdownImageLoaded && window.markdownImageLoaded('${imageId}')"
        onerror="window.markdownImageError && window.markdownImageError('${imageId}')"
        style="display: none;"
      />
    </div>
  `
}

// 图片加载状态管理
window.markdownImageLoaded = function(imageId) {
  const img = document.getElementById(imageId)
  const skeleton = document.getElementById(`skeleton-${imageId}`)

  if (img && skeleton) {
    // 隐藏骨架屏，显示图片
    skeleton.style.display = 'none'
    img.style.display = 'block'
    img.classList.add('fade-in')
  }
}

window.markdownImageError = function(imageId) {
  const skeleton = document.getElementById(`skeleton-${imageId}`)

  if (skeleton) {
    skeleton.innerHTML = `
      <div class="image-skeleton-error">
        <div class="image-skeleton-icon">❌</div>
        <div class="image-skeleton-text">图片加载失败</div>
      </div>
    `
    skeleton.classList.add('error-state')
  }
}

// 导出 markdown 渲染函数 - 增强版
export function renderMarkdown(content) {
  if (!content) return ''
  try {
    // 预加载图片
    const imageUrls = extractImageUrls(content)
    if (imageUrls.length > 0) {
      // 预加载前3张图片（优先级较高）
      imageUrls.slice(0, 3).forEach((url, index) => {
        smartLoader.loadImage(url, 8 - index)
      })

      // 其余图片较低优先级预加载
      imageUrls.slice(3).forEach(url => {
        smartLoader.loadImage(url, 3)
      })
    }

    const rendered = md.render(content)
    console.log('Markdown rendered:', rendered) // 调试日志

    // 在渲染完成后，初始化图片增强功能
    setTimeout(() => {
      initializeImageLoading()
      initImageEnhancements()
    }, 100)

    return rendered
  } catch (error) {
    console.error('Markdown rendering error:', error)
    return content
  }
}

// 初始化图片加载
function initializeImageLoading() {
  const images = document.querySelectorAll('.markdown-image')
  images.forEach(img => {
    if (img.complete && img.naturalHeight !== 0) {
      // 图片已经加载完成
      window.markdownImageLoaded(img.id)
    }
  })
}