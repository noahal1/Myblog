// 模拟 API 响应
const mockArticles = [
  {
    id: '1',
    title: 'Vue 3 组合式 API 详解',
    summary: 'Vue 3 引入了组合式 API，这是一种全新的组织组件逻辑的方式...',
    content: '<p>Vue 3 的组合式 API 是一个游戏规则改变者，它允许我们基于逻辑关注点组织代码...</p><h2>为什么需要组合式 API？</h2><p>随着组件变得越来越复杂，代码的组织和重用变得越来越困难...</p>',
    category: '前端开发',
    tags: ['Vue', 'JavaScript', '前端框架'],
    published_at: '2023-03-15T08:00:00Z',
    read_time: 8,
    cover_image: 'https://picsum.photos/seed/vue3/1200/600'
  },
  // 添加更多文章...
]

// 模拟 API 请求
export const fetchArticle = async (id) => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const article = mockArticles.find(a => a.id === id)
  if (!article) {
    throw new Error('文章不存在')
  }
  
  return article
} 