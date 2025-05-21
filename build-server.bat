@echo off
SETLOCAL EnableDelayedExpansion

echo 服务器优化构建脚本启动...

:: 设置Node.js内存限制
set NODE_OPTIONS=--max_old_space_size=1024
set LOW_MEMORY=true

:: 进入前端目录
cd my-blog-frontend

:: 清理缓存，避免旧依赖问题
echo 清理npm缓存...
call npm cache clean --force
if exist node_modules\.vite rd /s /q node_modules\.vite

:: 安装依赖（如果需要）
echo 检查依赖...
call npm install --no-fund --no-audit --prefer-offline --legacy-peer-deps

:: 执行低内存优化构建
echo 开始低内存优化构建...
:: 使用--no-minify选项跳过压缩步骤
call npm run build -- --mode production --no-minify --emptyOutDir

:: 检查构建结果
if exist "dist" (
    echo 构建成功！
    echo 构建产物在 my-blog-frontend\dist 目录
) else (
    echo 构建失败，请检查错误信息
    exit /b 1
)

:: 返回上级目录
cd ..

echo 构建完成
pause 