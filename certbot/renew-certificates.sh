#!/bin/bash

# SSL证书自动续期脚本
# 此脚本用于定期检查和续期SSL证书

# 配置变量
COMPOSE_FILE="docker-compose.yml"
LOG_FILE="/var/log/certbot-renewal.log"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
    echo "$(date '+%Y-%m-%d %H:%M:%S') [INFO] $1" >> "$LOG_FILE"
}

echo_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
    echo "$(date '+%Y-%m-%d %H:%M:%S') [WARN] $1" >> "$LOG_FILE"
}

echo_error() {
    echo -e "${RED}[ERROR]${NC} $1"
    echo "$(date '+%Y-%m-%d %H:%M:%S') [ERROR] $1" >> "$LOG_FILE"
}

# 创建日志目录
mkdir -p "$(dirname "$LOG_FILE")"

echo_info "开始SSL证书续期检查..."

# 检查Docker Compose是否运行
if ! docker-compose ps | grep -q "Up"; then
    echo_warn "Docker Compose服务未运行，尝试启动..."
    docker-compose up -d
    sleep 10
fi

# 尝试续期证书
echo_info "检查证书是否需要续期..."
docker-compose run --rm certbot renew --quiet

# 检查续期结果
if [ $? -eq 0 ]; then
    echo_info "证书续期检查完成"
    
    # 重新加载nginx配置
    echo_info "重新加载nginx配置..."
    docker-compose exec nginx nginx -s reload
    
    if [ $? -eq 0 ]; then
        echo_info "nginx配置重新加载成功"
    else
        echo_error "nginx配置重新加载失败"
        exit 1
    fi
else
    echo_error "证书续期失败"
    exit 1
fi

# 清理旧的日志文件（保留最近30天）
find "$(dirname "$LOG_FILE")" -name "certbot-renewal.log*" -mtime +30 -delete 2>/dev/null

echo_info "SSL证书续期检查完成"
