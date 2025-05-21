@echo off
SETLOCAL EnableDelayedExpansion

echo 请选择运行环境:
set /p ENV=输入 'prod' 启动生产环境，或 'test' 启动测试环境: 

:: 如果未提供环境参数，默认使用测试环境
if "!ENV!"=="" (
    set ENV=test
)

:: 输出当前运行环境
echo 正在启动 !ENV! 环境的博客系统...

:: 创建日志目录
mkdir logs 2>nul

:: 定义日志文件
set BACKEND_LOG=logs\backend-!ENV!.log
set FRONTEND_LOG=logs\frontend-!ENV!.log

:: 停止可能运行中的服务
echo 停止可能运行中的服务...

:: 检查并终止后端服务(使用netstat查找端口8000的进程)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8000 ^| findstr LISTENING') do (
    echo 正在终止端口8000的后端进程: %%a
    taskkill /F /PID %%a 2>nul || echo 无法终止后端进程 %%a
)

:: 终止前端服务(vite服务)
taskkill /F /FI "WINDOWTITLE eq *vite*" /IM node.exe 2>nul || echo 没有找到前端服务进程

:: 启动后端服务
echo 启动后端服务...
cd my-blog-backend

if "!ENV!"=="prod" (
    :: 生产环境
    start /B cmd /c "uvicorn src.main:app --port 8000 > ..\!BACKEND_LOG! 2>&1"
) else (
    :: 测试环境
    :: 先尝试激活虚拟环境
    if exist dev\Scripts\activate.bat (
        call dev\Scripts\activate.bat
    ) else if exist .venv\Scripts\activate.bat (
        call .venv\Scripts\activate.bat
    )
    start /B cmd /c "uvicorn src.main:app --reload --port 8000 > ..\!BACKEND_LOG! 2>&1"
)

cd ..
echo 后端服务已启动，日志保存在 !BACKEND_LOG!

:: 启动前端服务
echo 启动前端服务...
cd my-blog-frontend

if "!ENV!"=="prod" (
    :: 生产环境：先构建再预览
    call npm run build:server && start /B cmd /c "npm run preview -- --host 0.0.0.0 --port 5173 > ..\!FRONTEND_LOG! 2>&1"
) else (
    :: 测试环境：启动开发服务器
    start /B cmd /c "npm run dev -- --host 0.0.0.0 > ..\!FRONTEND_LOG! 2>&1"
)

cd ..
echo 前端服务已启动，日志保存在 !FRONTEND_LOG!

echo ================================================
echo 博客系统(!ENV! 环境)已启动:
echo 后端服务: http://localhost:8000
echo 前端服务: http://localhost:5173
echo ================================================
echo 使用 'type !BACKEND_LOG!' 查看后端日志
echo 使用 'type !FRONTEND_LOG!' 查看前端日志

:: 保持窗口开启
pause 