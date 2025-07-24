#!/bin/bash

# Docker镜像源切换脚本
# 用于在不同的Docker镜像源之间切换

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

# 显示帮助信息
show_help() {
    echo "Docker镜像源切换脚本"
    echo ""
    echo "用法: $0 [镜像源]"
    echo ""
    echo "支持的镜像源:"
    echo "  official          - Docker官方镜像源"
    echo "  xuanyuan          - 轩辕镜像源 (docker.xuanyuan.me)"
    echo "  aliyun            - 阿里云镜像源 (registry.cn-hangzhou.aliyuncs.com)"
    echo "  tencent           - 腾讯云镜像源 (ccr.ccs.tencentyun.com)"
    echo "  <custom-url>      - 自定义镜像源URL"
    echo ""
    echo "示例:"
    echo "  $0 official"
    echo "  $0 xuanyuan"
    echo "  $0 registry.example.com"
}

# 获取当前镜像源
get_current_registry() {
    if grep -q "docker.xuanyuan.me" docker-compose.yml; then
        echo "xuanyuan"
    elif grep -q "registry.cn-hangzhou.aliyuncs.com" docker-compose.yml; then
        echo "aliyun"
    elif grep -q "ccr.ccs.tencentyun.com" docker-compose.yml; then
        echo "tencent"
    elif grep -q "image: [a-zA-Z]" docker-compose.yml | grep -v "build:" | head -1 | grep -qv "/"; then
        echo "official"
    else
        echo "custom"
    fi
}

# 替换镜像源
replace_registry() {
    local old_registry="$1"
    local new_registry="$2"
    local files=("docker-compose.yml" "my-blog-frontend/Dockerfile" "my-blog-backend/Dockerfile")
    
    for file in "${files[@]}"; do
        if [ -f "$file" ]; then
            echo_info "更新 $file"
            if [ "$new_registry" = "official" ]; then
                # 切换到官方镜像源（移除镜像源前缀）
                sed -i "s|${old_registry}/||g" "$file"
            else
                # 切换到指定镜像源
                if [ "$old_registry" = "official" ]; then
                    # 从官方镜像源切换
                    sed -i "s|image: \([^/]*\):|image: ${new_registry}/\1:|g" "$file"
                    sed -i "s|FROM \([^/]*\)|FROM ${new_registry}/\1|g" "$file"
                else
                    # 从其他镜像源切换
                    sed -i "s|${old_registry}|${new_registry}|g" "$file"
                fi
            fi
        fi
    done
}

# 主函数
main() {
    local target_registry="$1"
    
    # 检查参数
    if [ -z "$target_registry" ]; then
        echo_error "请指定目标镜像源"
        show_help
        exit 1
    fi
    
    if [ "$target_registry" = "-h" ] || [ "$target_registry" = "--help" ]; then
        show_help
        exit 0
    fi
    
    # 获取当前镜像源
    local current_registry=$(get_current_registry)
    echo_info "当前镜像源: $current_registry"
    
    # 设置目标镜像源URL
    local target_url
    case "$target_registry" in
        "official")
            target_url="official"
            ;;
        "xuanyuan")
            target_url="docker.xuanyuan.me"
            ;;
        "aliyun")
            target_url="registry.cn-hangzhou.aliyuncs.com"
            ;;
        "tencent")
            target_url="ccr.ccs.tencentyun.com"
            ;;
        *)
            target_url="$target_registry"
            ;;
    esac
    
    # 检查是否需要切换
    if [ "$current_registry" = "$target_registry" ]; then
        echo_warn "已经在使用 $target_registry 镜像源，无需切换"
        exit 0
    fi
    
    # 获取当前镜像源URL
    local current_url
    case "$current_registry" in
        "official")
            current_url="official"
            ;;
        "xuanyuan")
            current_url="docker.xuanyuan.me"
            ;;
        "aliyun")
            current_url="registry.cn-hangzhou.aliyuncs.com"
            ;;
        "tencent")
            current_url="ccr.ccs.tencentyun.com"
            ;;
        *)
            current_url=$(grep -o '[a-zA-Z0-9.-]*\.[a-zA-Z0-9.-]*/' docker-compose.yml | head -1 | sed 's|/$||')
            ;;
    esac
    
    echo_info "切换镜像源: $current_registry -> $target_registry"
    
    # 备份配置文件
    echo_info "备份配置文件..."
    cp docker-compose.yml docker-compose.yml.bak
    cp my-blog-frontend/Dockerfile my-blog-frontend/Dockerfile.bak
    cp my-blog-backend/Dockerfile my-blog-backend/Dockerfile.bak
    
    # 执行替换
    replace_registry "$current_url" "$target_url"
    
    # 更新配置文件
    echo "DOCKER_REGISTRY=$target_url" > docker-registry.conf
    echo "# 当前使用的镜像源: $target_registry" >> docker-registry.conf
    echo "# 切换时间: $(date)" >> docker-registry.conf
    
    echo_info "镜像源切换完成！"
    echo_info "当前使用: $target_registry ($target_url)"
    echo_warn "建议重新构建镜像: docker-compose build --no-cache"
}

# 执行主函数
main "$@"
