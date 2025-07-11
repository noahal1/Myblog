#!/bin/bash

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 显示帮助信息
show_help() {
    cat << EOF
博客项目部署脚本

用法: $0 [选项] <环境>

环境:
    dev         开发环境
    test        测试环境
    prod        生产环境

选项:
    -h, --help              显示帮助信息
    -c, --clean             清理旧的构建文件
    -b, --build-only        仅构建，不部署
    -d, --deploy-only       仅部署，不构建
    -f, --force             强制部署（跳过确认）
    --no-cache              构建时不使用缓存
    --backup                部署前备份数据库

示例:
    $0 dev                  部署到开发环境
    $0 prod --clean         清理并部署到生产环境
    $0 test --build-only    仅构建测试环境
EOF
}

# 默认参数
ENVIRONMENT=""
CLEAN=false
BUILD_ONLY=false
DEPLOY_ONLY=false
FORCE=false
NO_CACHE=false
BACKUP=false

# 解析命令行参数
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -c|--clean)
            CLEAN=true
            shift
            ;;
        -b|--build-only)
            BUILD_ONLY=true
            shift
            ;;
        -d|--deploy-only)
            DEPLOY_ONLY=true
            shift
            ;;
        -f|--force)
            FORCE=true
            shift
            ;;
        --no-cache)
            NO_CACHE=true
            shift
            ;;
        --backup)
            BACKUP=true
            shift
            ;;
        dev|test|prod)
            ENVIRONMENT=$1
            shift
            ;;
        *)
            log_error "未知参数: $1"
            show_help
            exit 1
            ;;
    esac
done

# 检查环境参数
if [[ -z "$ENVIRONMENT" ]]; then
    log_error "请指定部署环境 (dev/test/prod)"
    show_help
    exit 1
fi

# 检查必要的工具
check_dependencies() {
    log_info "检查依赖工具..."
    
    local tools=("docker" "docker-compose" "git")
    
    for tool in "${tools[@]}"; do
        if ! command -v $tool &> /dev/null; then
            log_error "$tool 未安装或不在PATH中"
            exit 1
        fi
    done
    
    log_success "依赖检查完成"
}

# 设置环境变量
setup_environment() {
    log_info "设置 $ENVIRONMENT 环境变量..."
    
    case $ENVIRONMENT in
        dev)
            export NODE_ENV=development
            export COMPOSE_FILE=docker-compose.yml:docker-compose.dev.yml
            ;;
        test)
            export NODE_ENV=test
            export COMPOSE_FILE=docker-compose.yml:docker-compose.test.yml
            ;;
        prod)
            export NODE_ENV=production
            export COMPOSE_FILE=docker-compose.yml:docker-compose.prod.yml
            ;;
    esac
    
    # 加载环境变量文件
    if [[ -f ".env.$ENVIRONMENT" ]]; then
        log_info "加载环境变量文件: .env.$ENVIRONMENT"
        set -a
        source ".env.$ENVIRONMENT"
        set +a
    fi
    
    log_success "环境变量设置完成"
}

# 清理旧文件
clean_build() {
    if [[ "$CLEAN" == true ]]; then
        log_info "清理旧的构建文件..."
        
        # 清理前端构建文件
        if [[ -d "my-blog-frontend/dist" ]]; then
            rm -rf my-blog-frontend/dist
            log_info "已清理前端构建文件"
        fi
        
        # 清理Docker镜像和容器
        docker-compose down --remove-orphans
        docker system prune -f
        
        log_success "清理完成"
    fi
}

# 备份数据库
backup_database() {
    if [[ "$BACKUP" == true && "$ENVIRONMENT" == "prod" ]]; then
        log_info "备份生产数据库..."
        
        local backup_file="backup_$(date +%Y%m%d_%H%M%S).sql"
        
        docker-compose exec -T db mysqldump \
            -u root -p${MYSQL_ROOT_PASSWORD} \
            ${MYSQL_DATABASE} > "backups/$backup_file"
        
        log_success "数据库备份完成: backups/$backup_file"
    fi
}

# 构建项目
build_project() {
    if [[ "$DEPLOY_ONLY" == true ]]; then
        return
    fi
    
    log_info "构建 $ENVIRONMENT 环境项目..."
    
    local build_args=""
    if [[ "$NO_CACHE" == true ]]; then
        build_args="--no-cache"
    fi
    
    # 构建Docker镜像
    docker-compose build $build_args
    
    log_success "项目构建完成"
}

# 部署项目
deploy_project() {
    if [[ "$BUILD_ONLY" == true ]]; then
        return
    fi
    
    log_info "部署到 $ENVIRONMENT 环境..."
    
    # 生产环境需要确认
    if [[ "$ENVIRONMENT" == "prod" && "$FORCE" != true ]]; then
        echo -n "确认部署到生产环境? (y/N): "
        read -r confirm
        if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
            log_warning "部署已取消"
            exit 0
        fi
    fi
    
    # 启动服务
    docker-compose up -d
    
    # 等待服务启动
    log_info "等待服务启动..."
    sleep 30
    
    # 健康检查
    check_health
    
    log_success "部署完成"
}

# 健康检查
check_health() {
    log_info "执行健康检查..."
    
    local services=("frontend" "backend" "db" "redis")
    local failed_services=()
    
    for service in "${services[@]}"; do
        if docker-compose ps $service | grep -q "Up (healthy)"; then
            log_success "$service 服务健康"
        else
            log_error "$service 服务不健康"
            failed_services+=($service)
        fi
    done
    
    if [[ ${#failed_services[@]} -gt 0 ]]; then
        log_error "以下服务不健康: ${failed_services[*]}"
        log_info "查看服务日志:"
        for service in "${failed_services[@]}"; do
            echo "=== $service 日志 ==="
            docker-compose logs --tail=20 $service
        done
        exit 1
    fi
    
    log_success "所有服务健康检查通过"
}

# 显示部署信息
show_deployment_info() {
    log_info "部署信息:"
    echo "环境: $ENVIRONMENT"
    echo "前端地址: http://localhost"
    echo "后端地址: http://localhost:8000"
    echo "数据库地址: localhost:3306"
    echo "Redis地址: localhost:6379"
    
    if [[ "$ENVIRONMENT" == "prod" ]]; then
        echo "生产环境监控: http://localhost/health"
    fi
}

# 主函数
main() {
    log_info "开始部署博客项目到 $ENVIRONMENT 环境"
    
    check_dependencies
    setup_environment
    clean_build
    backup_database
    build_project
    deploy_project
    show_deployment_info
    
    log_success "部署流程完成!"
}

# 执行主函数
main
