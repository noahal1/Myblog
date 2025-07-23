# 多阶段构建 - 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app

# 复制package文件
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production --no-audit --no-fund

# 复制源代码
COPY . .

# 构建应用
RUN npm run build:server

# 生产阶段
FROM node:18-alpine AS production

WORKDIR /app

# 安装serve用于提供静态文件
RUN npm install -g serve

# 从构建阶段复制构建产物
COPY --from=builder /app/dist ./dist

# 创建健康检查脚本
RUN echo '#!/bin/sh\ncurl -f http://localhost:5173/health || exit 1' > /health-check.sh && \
    chmod +x /health-check.sh

# 暴露端口
EXPOSE 5173

# 启动命令
CMD ["serve", "-s", "dist", "-l", "5173", "--cors"]
