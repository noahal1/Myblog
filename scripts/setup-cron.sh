#!/bin/bash

# 设置SSL证书自动续期的定时任务

# 配置变量
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
CRON_LOG="/var/log/certbot-cron.log"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

# 检查是否以root权限运行
if [ "$EUID" -ne 0 ]; then
    echo_error "请以root权限运行此脚本"
    echo "使用: sudo $0"
    exit 1
fi

echo_info "设置SSL证书自动续期定时任务..."

# 创建日志目录
mkdir -p "$(dirname "$CRON_LOG")"

# 创建cron任务
CRON_JOB="0 12 * * * cd $PROJECT_DIR && ./certbot/renew-certificates.sh >> $CRON_LOG 2>&1"

# 检查是否已存在相同的cron任务
if crontab -l 2>/dev/null | grep -q "renew-certificates.sh"; then
    echo_warn "SSL证书续期任务已存在，跳过添加"
else
    # 添加cron任务
    (crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -
    echo_info "SSL证书续期任务已添加到crontab"
    echo_info "任务将在每天中午12点执行"
fi

# 显示当前的cron任务
echo_info "当前的cron任务:"
crontab -l | grep -E "(renew-certificates|certbot)" || echo "未找到相关任务"

# 创建logrotate配置
LOGROTATE_CONFIG="/etc/logrotate.d/certbot-renewal"
cat > "$LOGROTATE_CONFIG" << EOF
$CRON_LOG {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 root root
}
EOF

echo_info "已创建logrotate配置: $LOGROTATE_CONFIG"

echo_info "SSL证书自动续期设置完成！"
echo_info "证书将每天检查一次，如需要会自动续期"
echo_info "日志文件: $CRON_LOG"
