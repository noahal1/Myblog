FROM node:20-slim AS builder

WORKDIR /app

# 更换Debian软件源为阿里云镜像
RUN sed -i 's/deb.debian.org/mirrors.aliyun.com/g' /etc/apt/sources.list.d/debian.sources && \
    sed -i 's/security.debian.org/mirrors.aliyun.com/g' /etc/apt/sources.list.d/debian.sources

# 更新包管理器并安装必要的构建工具
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    autoconf \
    automake \
    libtool \
    nasm \
    pkg-config \
    libpng-dev \
    libjpeg-dev \
    libgif-dev \
    && rm -rf /var/lib/apt/lists/*

# 安装pnpm
RUN npm install -g pnpm

# 设置pnpm镜像源
RUN pnpm config set registry https://registry.npmmirror.com && \
    pnpm config set disturl https://npmmirror.com/dist && \
    pnpm config set sass_binary_site https://npmmirror.com/mirrors/node-sass && \
    pnpm config set electron_mirror https://npmmirror.com/mirrors/electron/ && \
    pnpm config set puppeteer_download_host https://npmmirror.com/mirrors

# 复制package文件
COPY package.json pnpm-lock.yaml ./

# 设置环境变量
ENV NODE_ENV=production
ENV VITE_NODE_ENV=production
ENV ROLLUP_BINARY_PATH=/app/node_modules/@rollup/rollup-linux-x64-gnu/rollup.linux-x64-gnu.node
ENV NODE_OPTIONS="--max-old-space-size=4096"

# 安装依赖
RUN pnpm install --frozen-lockfile

# 确保安装了正确的Rollup二进制文件
RUN pnpm add @rollup/rollup-linux-x64-gnu --save-optional || true

COPY . .

# 构建应用
RUN pnpm run build

FROM node:20-slim AS production

WORKDIR /app

# 更换Debian软件源为阿里云镜像
RUN sed -i 's/deb.debian.org/mirrors.aliyun.com/g' /etc/apt/sources.list.d/debian.sources && \
    sed -i 's/security.debian.org/mirrors.aliyun.com/g' /etc/apt/sources.list.d/debian.sources

# 更新包管理器
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

RUN npm install -g serve

COPY --from=builder /app/dist ./dist

RUN echo '#!/bin/sh\ncurl -f http://localhost:5173/health || exit 1' > /health-check.sh && \
    chmod +x /health-check.sh

# 暴露端口
EXPOSE 5173

# 启动命令
CMD ["serve", "-s", "dist", "-l", "5173", "--cors"]