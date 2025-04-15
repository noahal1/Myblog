#!/bin/bash

echo "请选择运行环境:"
read -p "输入 'prod' 启动生产环境，或 'test' 启动测试环境: " ENV
ENV=${ENV:-test}

# 如果未提供环境参数，默认使用测试环境
if [ -z "$ENV" ]; then
    ENV="test"
fi

# 输出当前运行环境
echo "正在启动 $ENV 环境的博客系统..."

# 创建日志目录
mkdir -p logs

# 定义日志文件
BACKEND_LOG="logs/backend-$ENV.log"
FRONTEND_LOG="logs/frontend-$ENV.log"

# 停止可能正在运行的进程
stop_services() {
    echo "停止可能运行中的服务..."
    # 使用 lsof 查找占用 8000 端口的后端服务进程
    PID=$(lsof -t -i:8000)
    if [ -n "$PID" ]; then
        kill -9 $PID || echo "无法终止后端进程 $PID"
    else
        echo "没有运行中的后端服务"
    fi
    
    # 查找并杀死前端服务
    if [ "$ENV" = "test" ]; then
        PIDS=$(pgrep -f "vite")
        if [ -n "$PIDS" ]; then
            for PID in $PIDS; do
                kill -9 $PID || echo "无法终止前端测试进程 $PID"
            done
        else
            echo "没有运行中的前端测试服务"
        fi
    else
        PIDS=$(pgrep -f "vite preview")
        if [ -n "$PIDS" ]; then
            for PID in $PIDS; do
                kill -9 $PID || echo "无法终止前端生产进程 $PID"
            done
        else
            echo "没有运行中的前端生产服务"
        fi
    fi
}

# 启动后端服务
start_backend() {
    echo "启动后端服务..."
    cd my-blog-backend
    
    if [ "$ENV" = "prod" ]; then
        # 生产环境
        uvicorn src.main:app --port 8000 > "../$BACKEND_LOG" 2>&1 &
    else
        # 测试环境
        uvicorn src.main:app --reload --port 8000 > "../$BACKEND_LOG" 2>&1 &
    fi
    
    cd ..
    echo "后端服务已启动，日志保存在 $BACKEND_LOG"
}

# 启动前端服务
start_frontend() {
    echo "启动前端服务..."
    cd my-blog-frontend
    
    if [ "$ENV" = "prod" ]; then
        npm run build && npm run preview -- --host 0.0.0.0 --port 5173 > "../$FRONTEND_LOG" 2>&1 &
    else
        npm run dev -- --host 0.0.0.0 > "../$FRONTEND_LOG" 2>&1 &
    fi
    
    cd ..
    echo "前端服务已启动，日志保存在 $FRONTEND_LOG"
}

# 主函数
main() {
    stop_services
    start_backend
    start_frontend
    
    echo "================================================"
    echo "博客系统($ENV 环境)已启动:"
    echo "后端服务: http://localhost:8000"
    echo "前端服务: http://localhost:5173"
    echo "================================================"
    echo "使用 'tail -f $BACKEND_LOG' 查看后端日志"
    echo "使用 'tail -f $FRONTEND_LOG' 查看前端日志"
}

# 执行主函数
main    