#!/bin/bash

echo "服务器优化构建脚本启动..."

# 设置Node.js内存限制
export NODE_OPTIONS="--max_old_space_size=1024"

# 进入前端目录
cd my-blog-frontend

# 清理缓存，避免旧依赖问题
echo "清理npm缓存..."
npm cache clean --force
rm -rf node_modules/.vite || true

# 安装依赖（如果需要）
echo "检查依赖..."
npm install --no-fund --no-audit --prefer-offline --legacy-peer-deps

# 执行低内存优化构建
echo "开始低内存优化构建..."
export LOW_MEMORY=true
# 使用--no-minify选项跳过压缩步骤
npm run build -- --mode production --no-minify --emptyOutDir

# 检查构建结果
if [ -d "dist" ]; then
    echo "构建成功！"
    echo "构建产物在 my-blog-frontend/dist 目录"
else
    echo "构建失败，请检查错误信息"
    exit 1
fi

# 返回上级目录
cd ..

echo "构建完成" 