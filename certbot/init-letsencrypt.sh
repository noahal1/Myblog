#!/bin/bash

# 配置变量
domains=(noahblog.top www.noahblog.top)
rsa_key_size=4096
data_path="./certbot"
email="noahall127@outlook.com" 
staging=0 # 设置为1使用测试环境，0使用生产环境

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

# 检查是否已存在证书
if [ -d "$data_path/conf/live/${domains[0]}" ]; then
  echo_warn "现有证书已找到，跳过证书获取过程"
  exit 0
fi

# 检查邮箱是否已配置
if [ "$email" = "noahall127@outlook.com" ]; then
  echo_error "请先在脚本中配置您的邮箱地址"
  exit 1
fi

# 创建必要的目录
echo_info "创建必要的目录..."
mkdir -p "$data_path/conf"
mkdir -p "$data_path/www"

# 下载推荐的TLS参数
echo_info "下载推荐的TLS参数..."
if [ ! -e "$data_path/conf/options-ssl-nginx.conf" ] || [ ! -e "$data_path/conf/ssl-dhparams.pem" ]; then
  echo_info "下载推荐的TLS参数..."
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf > "$data_path/conf/options-ssl-nginx.conf"
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem > "$data_path/conf/ssl-dhparams.pem"
  echo_info "TLS参数下载完成"
fi

# 创建虚拟证书用于nginx启动
echo_info "创建虚拟证书用于nginx启动..."
path="/etc/letsencrypt/live/${domains[0]}"
mkdir -p "$data_path/conf/live/${domains[0]}"
docker-compose run --rm --entrypoint "\
  openssl req -x509 -nodes -newkey rsa:$rsa_key_size -days 1\
    -keyout '$path/privkey.pem' \
    -out '$path/fullchain.pem' \
    -subj '/CN=localhost'" certbot
echo_info "虚拟证书创建完成"

# 启动nginx
echo_info "启动nginx..."
docker-compose up --force-recreate -d nginx
echo_info "nginx启动完成"

# 删除虚拟证书
echo_info "删除虚拟证书..."
docker-compose run --rm --entrypoint "\
  rm -Rf /etc/letsencrypt/live/${domains[0]} && \
  rm -Rf /etc/letsencrypt/archive/${domains[0]} && \
  rm -Rf /etc/letsencrypt/renewal/${domains[0]}.conf" certbot
echo_info "虚拟证书删除完成"

# 选择适当的邮箱参数
case "$email" in
  "") email_arg="--register-unsafely-without-email" ;;
  *) email_arg="--email $email" ;;
esac

# 启用staging模式（如果需要）
if [ $staging != "0" ]; then staging_arg="--staging"; fi

# 请求Let's Encrypt证书
echo_info "请求Let's Encrypt证书..."
domain_args=""
for domain in "${domains[@]}"; do
  domain_args="$domain_args -d $domain"
done

docker-compose run --rm --entrypoint "\
  certbot certonly --webroot -w /var/www/certbot \
    $staging_arg \
    $email_arg \
    $domain_args \
    --rsa-key-size $rsa_key_size \
    --agree-tos \
    --force-renewal" certbot

if [ $? -eq 0 ]; then
    echo_info "证书获取成功！"
else
    echo_error "证书获取失败！"
    exit 1
fi

# 重新加载nginx
echo_info "重新加载nginx..."
docker-compose exec nginx nginx -s reload
echo_info "Let's Encrypt证书初始化完成！"
