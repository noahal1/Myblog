#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
在FastAPI应用中集成日志系统
"""

import time
import uuid
from typing import Callable

from fastapi import FastAPI, Request, Response
from fastapi.middleware.base import BaseHTTPMiddleware

from .logger import log_manager, log, api_log


class LoggingMiddleware(BaseHTTPMiddleware):
    """FastAPI日志中间件，记录请求和响应信息"""
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """处理请求和响应"""
        # 生成请求ID
        request_id = str(uuid.uuid4())
        
        # 获取认证信息和用户ID
        user_id = "anonymous"
        authorization = request.headers.get("Authorization", "")
        if authorization and authorization.startswith("Bearer "):
            # 从认证令牌提取用户信息 - 这里是简化示例
            # 实际实现会从JWT令牌中解析用户ID
            user_id = "authenticated_user"  
        
        # 初始化请求日志上下文
        log_manager.init_request_logger(request_id, user_id)
        request_logger = log_manager.get_logger()
        
        # 获取API日志器
        api_logger = log_manager.get_api_logger()
        
        # 记录请求开始信息
        start_time = time.time()
        api_logger.info(
            f"{request.method} {request.url.path} - 开始处理",
            extra={
                "method": request.method,
                "path": request.url.path,
                "query_params": str(request.query_params),
                "client_host": request.client.host if request.client else None,
                "user_agent": request.headers.get("User-Agent", "Unknown")
            }
        )
        
        # 处理请求
        try:
            response = await call_next(request)
            
            # 计算处理时间
            process_time = time.time() - start_time
            
            # 记录响应信息
            api_logger.info(
                f"{request.method} {request.url.path} - 状态码: {response.status_code}, 耗时: {process_time:.3f}秒",
                extra={
                    "status_code": response.status_code,
                    "process_time": process_time
                }
            )
            
            # 添加请求ID到响应头
            response.headers["X-Request-ID"] = request_id
            
            return response
            
        except Exception as exc:
            # 记录异常信息
            process_time = time.time() - start_time
            request_logger.exception(
                f"{request.method} {request.url.path} - 处理异常: {str(exc)}, 耗时: {process_time:.3f}秒"
            )
            raise  # 继续传播异常
            

def setup_logging_middleware(app: FastAPI, admin_api_url: str = None, api_key: str = None):
    """设置FastAPI应用的日志中间件"""
    # 添加日志中间件
    app.add_middleware(LoggingMiddleware)
    
    # 如果提供了后台API，添加后台日志接收器
    if admin_api_url and api_key:
        log_manager.add_backend_sink(admin_api_url, api_key)
    
    # 为常见模块添加特定的日志过滤器
    log_manager.filter_by_module("app.models", level="DEBUG")
    log_manager.filter_by_module("app.api", level="INFO")
    log_manager.filter_by_module("app.services", level="INFO")
    
    # 记录应用启动日志
    log.info("FastAPI应用启动，日志系统初始化完成")
    
    return app


# 示例：如何在FastAPI应用中使用
def get_application() -> FastAPI:
    """创建并配置FastAPI应用"""
    app = FastAPI(title="MyBlog API", version="1.0.0")
    
    # 添加日志配置
    setup_logging_middleware(
        app, 
        admin_api_url="http://admin.example.com/api/logs",
        api_key="your_secret_api_key"
    )
    
    # 其他应用配置...
    
    return app


# 如果需要直接在main.py中使用
app = get_application() 