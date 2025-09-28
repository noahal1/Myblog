#!/bin/bash

# HTTPS部署脚本
# 此脚本用于一键部署带有SSL证书的博客系统

# 配置变量
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
EMAIL="your-email@example.com"  # 请替换为您的邮箱地址

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

echo_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

echo_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

echo_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# 显示帮助信息
show_help() {
    echo "HTTPS部署脚本"
    echo ""
    echo "用法: $0 [选项]"
    echo ""
    echo "选项:"
    echo "  -e, --email EMAIL    设置Let's Encrypt邮箱地址"
    echo "  -s, --staging        使用Let's Encrypt测试环境"
    echo "  -h, --help          显示此帮助信息"
    echo ""
    echo "示例:"
    echo "  $0 -e your@email.com"
    echo "  $0 --email your@email.com --staging"
}

# 解析命令行参数
STAGING=0
while [[ $# -gt 0 ]]; do
    case $1 in
        -e|--email)
            EMAIL="$2"
            shift 2
            ;;
        -s|--staging)
            STAGING=1
            shift
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            echo_error "未知参数: $1"
            show_help
            exit 1
            ;;
    esac
done

# 验证邮箱地址
if [ "$EMAIL" = "your-email@example.com" ]; then
    echo_error "请提供有效的邮箱地址"
    echo "使用: $0 -e your@email.com"
    exit 1
fi

echo_step "开始HTTPS部署..."

# 检查必要的工具
echo_step "检查必要的工具..."
for tool in docker curl; do
    if ! command -v $tool &> /dev/null; then
        echo_error "$tool 未安装或不在PATH中"
        exit 1
    fi
done

# 检查docker compose
if ! docker compose version &> /dev/null; then
    echo_error "docker compose 未安装或不可用"
    exit 1
fi
echo_info "工具检查完成"

# 进入项目目录
cd "$PROJECT_DIR" || exit 1

# 停止现有服务
echo_step "停止现有服务..."
docker-compose down 2>/dev/null || true

# 创建必要的目录
echo_step "创建必要的目录..."
mkdir -p certbot/conf certbot/www nginx/logs

# 更新初始化脚本中的邮箱地址
echo_step "配置Let's Encrypt邮箱地址..."
sed -i "s/email=\"your-email@example.com\"/email=\"$EMAIL\"/" certbot/init-letsencrypt.sh

# 设置staging模式
if [ $STAGING -eq 1 ]; then
    echo_warn "使用Let's Encrypt测试环境"
    sed -i "s/staging=0/staging=1/" certbot/init-letsencrypt.sh
else
    echo_info "使用Let's Encrypt生产环境"
    sed -i "s/staging=1/staging=0/" certbot/init-letsencrypt.sh
fi

# 构建Docker镜像
echo_step "构建Docker镜像..."
docker-compose build

# 启动数据库
echo_step "启动数据库服务..."
docker-compose up -d db

# 等待数据库启动
echo_info "等待数据库启动..."
sleep 30

# 启动后端服务
echo_step "启动后端服务..."
docker-compose up -d backend

# 等待后端启动
echo_info "等待后端服务启动..."
sleep 20

# 构建前端
echo_step "构建前端应用..."
cd my-blog-frontend
npm run build:server
cd ..

# 启动前端服务
echo_step "启动前端服务..."
docker-compose up -d frontend

# 初始化SSL证书
echo_step "初始化SSL证书..."
chmod +x certbot/init-letsencrypt.sh
./certbot/init-letsencrypt.sh

# 检查证书获取结果
if [ $? -eq 0 ]; then
    echo_info "SSL证书获取成功！"
else
    echo_error "SSL证书获取失败！"
    exit 1
fi

# 设置自动续期
echo_step "设置证书自动续期..."
chmod +x scripts/setup-cron.sh
sudo scripts/setup-cron.sh

# 启动所有服务
echo_step "启动所有服务..."
docker-compose up -d

# 等待服务启动
echo_info "等待服务完全启动..."
sleep 30

# 健康检查
echo_step "执行健康检查..."
HEALTH_CHECK_PASSED=true

# 检查HTTPS访问
if curl -f -s https://noahblog.top/health > /dev/null; then
    echo_info "HTTPS访问正常"
else
    echo_error "HTTPS访问失败"
    HEALTH_CHECK_PASSED=false
fi

# 检查HTTP重定向
if curl -s -o /dev/null -w "%{http_code}" http://noahblog.top | grep -q "301"; then
    echo_info "HTTP到HTTPS重定向正常"
else
    echo_warn "HTTP到HTTPS重定向可能有问题"
fi

# 显示部署结果
echo ""
echo "========================================"
if [ "$HEALTH_CHECK_PASSED" = true ]; then
    echo_info "🎉 HTTPS部署成功！"
    echo_info "您的网站现在可以通过以下地址访问："
    echo_info "  https://noahblog.top"
    echo_info "  https://www.noahblog.top"
else
    echo_error "❌ 部署过程中出现问题"
    echo_error "请检查日志并重试"
fi
echo "========================================"

# 显示有用的命令
echo ""
echo "有用的命令："
echo "  查看所有服务状态: docker-compose ps"
echo "  查看nginx日志: docker-compose logs nginx"
echo "  查看证书状态: docker-compose run --rm certbot certificates"
echo "  手动续期证书: ./certbot/renew-certificates.sh"
