/**
 * CDN工具函数
 * 用于处理GitHub图床的CDN加速
 */

// 从环境变量获取配置
const USE_CDN = import.meta.env.VITE_USE_CDN === 'true'
const CDN_PROVIDER = import.meta.env.VITE_CDN_PROVIDER || 'jsdelivr'
const GITHUB_REPO = import.meta.env.VITE_GITHUB_REPO || ''
const GITHUB_BRANCH = import.meta.env.VITE_GITHUB_BRANCH || 'main'
const GITHUB_PATH = import.meta.env.VITE_GITHUB_PATH || 'images'

/**
 * 获取CDN加速的图片URL
 * @param {string} filename - 文件名
 * @param {string} provider - CDN提供商 (jsdelivr, statically, githack)
 * @returns {string} CDN URL
 */
export function getCdnUrl(filename, provider = CDN_PROVIDER) {
  if (!GITHUB_REPO) {
    console.warn('GitHub仓库配置未设置')
    return filename
  }

  switch (provider) {
    case 'jsdelivr':
      // jsDelivr CDN格式: https://cdn.jsdelivr.net/gh/用户名/仓库名@分支名/路径/文件名
      return `https://cdn.jsdelivr.net/gh/${GITHUB_REPO}@${GITHUB_BRANCH}/${GITHUB_PATH}/${filename}`
    
    case 'statically':
      // Statically CDN格式: https://cdn.statically.io/gh/用户名/仓库名/分支名/路径/文件名
      return `https://cdn.statically.io/gh/${GITHUB_REPO}/${GITHUB_BRANCH}/${GITHUB_PATH}/${filename}`
    
    case 'githack':
      // GitHack CDN格式: https://raw.githack.com/用户名/仓库名/分支名/路径/文件名
      return `https://raw.githack.com/${GITHUB_REPO}/${GITHUB_BRANCH}/${GITHUB_PATH}/${filename}`
    
    default:
      // 默认使用GitHub原始链接
      return `https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}/${GITHUB_PATH}/${filename}`
  }
}

/**
 * 获取GitHub原始URL
 * @param {string} filename - 文件名
 * @returns {string} GitHub原始URL
 */
export function getRawUrl(filename) {
  if (!GITHUB_REPO) {
    console.warn('GitHub仓库配置未设置')
    return filename
  }
  return `https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}/${GITHUB_PATH}/${filename}`
}

/**
 * 转换GitHub URL为CDN URL
 * @param {string} githubUrl - GitHub原始URL
 * @param {string} provider - CDN提供商
 * @returns {string} CDN URL
 */
export function convertToCdnUrl(githubUrl, provider = CDN_PROVIDER) {
  // 匹配GitHub raw URL格式
  const githubRawPattern = /https:\/\/raw\.githubusercontent\.com\/([^\/]+)\/([^\/]+)\/([^\/]+)\/(.+)/
  const match = githubUrl.match(githubRawPattern)
  
  if (!match) {
    console.warn('无法解析GitHub URL:', githubUrl)
    return githubUrl
  }
  
  const [, username, repo, branch, filePath] = match
  const filename = filePath.split('/').pop()
  
  switch (provider) {
    case 'jsdelivr':
      return `https://cdn.jsdelivr.net/gh/${username}/${repo}@${branch}/${filePath}`
    
    case 'statically':
      return `https://cdn.statically.io/gh/${username}/${repo}/${branch}/${filePath}`
    
    case 'githack':
      return `https://raw.githack.com/${username}/${repo}/${branch}/${filePath}`
    
    default:
      return githubUrl
  }
}

/**
 * 获取图片URL（根据配置决定是否使用CDN）
 * @param {string} filename - 文件名
 * @returns {string} 图片URL
 */
export function getImageUrl(filename) {
  if (USE_CDN) {
    return getCdnUrl(filename)
  } else {
    return getRawUrl(filename)
  }
}

/**
 * 获取所有可用的CDN选项
 * @param {string} filename - 文件名
 * @returns {Object} 包含所有CDN选项的对象
 */
export function getAllCdnOptions(filename) {
  return {
    jsdelivr: getCdnUrl(filename, 'jsdelivr'),
    statically: getCdnUrl(filename, 'statically'),
    githack: getCdnUrl(filename, 'githack'),
    raw: getRawUrl(filename)
  }
}

/**
 * 检测URL是否可访问
 * @param {string} url - 要检测的URL
 * @returns {Promise<boolean>} 是否可访问
 */
export async function checkUrlAccessibility(url) {
  try {
    const response = await fetch(url, { 
      method: 'HEAD',
      mode: 'no-cors' // 避免CORS问题
    })
    return true
  } catch (error) {
    console.warn('URL不可访问:', url, error)
    return false
  }
}

/**
 * 自动选择最快的CDN
 * @param {string} filename - 文件名
 * @returns {Promise<string>} 最快的CDN URL
 */
export async function getOptimalCdnUrl(filename) {
  const options = getAllCdnOptions(filename)
  const providers = ['jsdelivr', 'statically', 'githack', 'raw']
  
  // 并发测试所有CDN
  const promises = providers.map(async (provider) => {
    const url = options[provider]
    const startTime = Date.now()
    
    try {
      const accessible = await checkUrlAccessibility(url)
      const responseTime = Date.now() - startTime
      
      return {
        provider,
        url,
        accessible,
        responseTime
      }
    } catch (error) {
      return {
        provider,
        url,
        accessible: false,
        responseTime: Infinity
      }
    }
  })
  
  const results = await Promise.all(promises)
  
  // 选择可访问且响应时间最短的CDN
  const bestOption = results
    .filter(result => result.accessible)
    .sort((a, b) => a.responseTime - b.responseTime)[0]
  
  if (bestOption) {
    console.log(`选择最优CDN: ${bestOption.provider} (${bestOption.responseTime}ms)`)
    return bestOption.url
  } else {
    console.warn('所有CDN都不可访问，使用默认URL')
    return getRawUrl(filename)
  }
}

// 导出配置信息
export const CDN_CONFIG = {
  USE_CDN,
  CDN_PROVIDER,
  GITHUB_REPO,
  GITHUB_BRANCH,
  GITHUB_PATH
}
