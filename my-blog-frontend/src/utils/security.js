// 添加XSS防护工具
export function sanitizeHtml(html) {
  // 简单的HTML净化，生产环境应使用DOMPurify等库
  return html
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// 输入验证
export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(String(email).toLowerCase())
}

export function validateUsername(username) {
  return username.length >= 3 && username.length <= 20
} 