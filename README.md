# Noah's blog

## 项目结构

- `my-blog-frontend`: Vue 3 + Vuetify 构建的前端应用
- `my-blog-backend`: FastAPI 构建的后端API

## 技术栈

### 前端

- Vue 3
- Vuetify 3
- Vue Router
- Pinia (状态管理)
- Markdown编辑器
- PWA支持 (离线访问)
- Vite (构建工具)

### 后端

- FastAPI
- SQLAlchemy
- MySQL
- Docker

## 功能特性

- 响应式设计，支持移动设备
- 文章撰写与发布
- Markdown支持
- 评论系统
- 标签分类
- 用户登录/注册
- JWT身份验证
- 离线访问 (PWA)

## 部署指南

### 前端部署

```bash
cd my-blog-frontend

# 安装依赖
pnpm install

# 开发环境运行
pnpm dev

# 生产环境构建
pnpm build
```

### 后端部署

#### 使用Docker Compose (推荐)

```bash
cd my-blog-backend

# 启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f
```

#### 手动部署

```bash
cd my-blog-backend

# 安装依赖
pip install -r requirements.txt

# 运行数据库迁移
alembic upgrade head

# 启动服务
uvicorn src.main:app --host 0.0.0.0 --port 8000
```

## 开发指南

### 环境变量

前端的环境变量在以下文件中配置:
- `.env.development`: 开发环境配置
- `.env.production`: 生产环境配置

后端的环境变量在`.env`文件中配置。
```env
# GitHub图床配置
GITHUB_TOKEN=your_github_token_here
GITHUB_REPO=your_username/your_repo_name
GITHUB_BRANCH=main
GITHUB_PATH=images
# 数据库配置
- DB_USER - 数据库用户名
- DB_PASSWORD - 数据库密码
- DB_HOST - 数据库主机地址
- DB_PORT - 数据库端口
- DB_NAME - 数据库名称
- ADMIN_USERNAME - 管理员用户名
```

## 性能优化

- 图片压缩
- 前端代码分割
- Redis缓存常用API响应
- PWA支持离线访问
- CDN优化静态资源

## 许可证

MIT

## 作者

Noah.yin