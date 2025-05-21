#!/bin/bash

echo "开始清理并重装依赖..."

# 进入前端目录
cd my-blog-frontend

# 删除node_modules和lock文件
echo "删除旧的依赖..."
rm -rf node_modules
rm -f package-lock.json
rm -f pnpm-lock.yaml
rm -f yarn.lock

# 清理npm缓存
echo "清理npm缓存..."
npm cache clean --force

# 使用兼容性参数重新安装
echo "重新安装依赖(使用legacy-peer-deps)..."
npm install --legacy-peer-deps

echo "依赖安装完成"

# 返回上级目录
cd ..

echo "清理并重装过程完成" 