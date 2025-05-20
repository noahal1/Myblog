import time
import uuid
from typing import Optional, Callable
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp, Receive, Scope, Send
import json
import traceback

from src.utils.logger import log, log_manager
from src.utils.auth import get_current_user_id_optional

class LoggingMiddleware(BaseHTTPMiddleware):
    """日志中间件，记录请求和响应信息"""
    
    async def dispatch(
        self, request: Request, call_next: Callable
    ) -> Response:
        # 生成请求ID
        request_id = str(uuid.uuid4())
        
        # 获取IP地址
        ip_address = request.client.host
        forwarded_for = request.headers.get("X-Forwarded-For")
        if forwarded_for:
            ip_address = forwarded_for.split(",")[0].strip()
        
        # 尝试获取用户ID (可能为None)
        user_id = None
        try:
            token = request.headers.get("Authorization", "")
            if token and token.startswith("Bearer "):
                token = token.replace("Bearer ", "")
                if token:
                    user_id = await get_current_user_id_optional(token)
        except Exception as e:
            log.warning(f"获取用户ID时出错: {str(e)}")
            # 在这里捕获异常，不让它影响请求处理
            pass
        
        # 设置日志上下文
        log_manager.init_request_logger(
            request_id=request_id,
            user_id=str(user_id) if user_id else "anonymous",
            ip_address=ip_address
        )
        
        # 请求开始时间
        start_time = time.time()
        
        # 记录请求日志
        method = request.method
        url = request.url.path
        query_params = dict(request.query_params)
        headers = dict(request.headers)
        # 移除敏感信息
        if "authorization" in headers:
            headers["authorization"] = "***"
        
        log.info(
            f"收到请求 | {method} {url} | "
            f"查询参数: {json.dumps(query_params, ensure_ascii=False)} | "
            f"客户端: {request.client.host} | "
            f"用户代理: {request.headers.get('user-agent')}"
        )
        
        # 处理请求
        try:
            response = await call_next(request)
            
            # 记录响应日志
            process_time = time.time() - start_time
            status_code = response.status_code
            
            log.info(
                f"请求完成 | {method} {url} | "
                f"状态码: {status_code} | "
                f"处理时间: {process_time:.4f}秒"
            )
            
            # 添加请求ID到响应头
            response.headers["X-Request-ID"] = request_id
            
            return response
        except Exception as exc:
            # 记录异常日志
            process_time = time.time() - start_time
            error_detail = traceback.format_exc()
            log.error(
                f"请求异常 | {method} {url} | "
                f"处理时间: {process_time:.4f}秒 | "
                f"异常: {str(exc)}\n{error_detail}"
            )
            # 重新抛出异常，交由FastAPI全局异常处理器处理
            raise 