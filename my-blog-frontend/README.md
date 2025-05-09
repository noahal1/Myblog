# 诺亚的博客 - 前端

## 项目介绍

这是一个基于Vue 3和Vite的个人博客系统前端。

## 安全功能

本项目实现了多种安全机制：

1. **安全存储**：敏感数据使用AES加密存储在本地存储中，可通过环境变量配置是否启用。
2. **内容安全策略**：实现CSP头，限制资源加载来源，防止XSS攻击。
3. **XSS保护**：启用浏览器内置的XSS过滤器。
4. **点击劫持保护**：通过X-Frame-Options头防止页面被嵌入其他站点。
5. **动态API地址**：根据部署环境动态配置API地址，不再硬编码。
6. **用户认证**：使用基于Token的认证机制，支持自动刷新。

## 环境变量配置

项目使用以下环境变量进行配置：

```
# API配置
VITE_API_BASE_URL=http://localhost:8000
VITE_API_TIMEOUT=10000
VITE_API_RETRY_COUNT=3
VITE_API_CACHE_TIME=300000
VITE_TOKEN_REFRESH_THRESHOLD=5
VITE_USE_COOKIES=false

# 应用配置
VITE_SITE_NAME=诺亚的博客
VITE_PAGINATION_SIZE=10
VITE_SESSION_PERSISTENCE=true
VITE_MAX_SESSION_DAYS=7

# 安全配置
VITE_ENABLE_SECURE_STORAGE=true
VITE_ENCRYPTION_KEY=your-secret-key-here  # 请更换为复杂的随机密钥

# 内容安全策略设置
VITE_ENABLE_CSP=true
VITE_ENABLE_XSS_PROTECTION=true
VITE_ENABLE_FRAME_PROTECTION=true
```

## 开发

1. 安装依赖：
```bash
npm install
```

2. 创建环境变量文件：
```bash
cp .env.example .env.local  # 复制示例环境变量文件
```

3. 启动开发服务器：
```bash
npm run dev
```

## 构建

```bash
npm run build
```
