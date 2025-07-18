import MarkdownIt from 'markdown-it'
import anchor from 'markdown-it-anchor'
import Prism from 'prismjs'

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

// 自定义图片渲染规则
md.renderer.rules.image = function (tokens, idx, options, env) {
  const token = tokens[idx]
  const src = token.attrGet('src')
  const alt = token.attrGet('alt') || ''
  const title = token.attrGet('title') || ''

  // 确保图片有正确的属性
  return `<img src="${src}" alt="${alt}" title="${title}" style="max-width: 100%; height: auto; border-radius: 4px; margin: 1em 0;" loading="lazy" />`
}

// 导出 markdown 渲染函数
export function renderMarkdown(content) {
  if (!content) return ''
  try {
    const rendered = md.render(content)
    console.log('Markdown rendered:', rendered) // 调试日志
    return rendered
  } catch (error) {
    console.error('Markdown rendering error:', error)
    return content
  }
}