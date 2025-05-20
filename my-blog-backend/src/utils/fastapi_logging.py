import time
import uuid
import ipaddress
from typing import Callable

from fastapi import FastAPI, Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from sqlalchemy.orm import Session
from src.model.models import VisitorLog
from src.utils.auth import get_current_user_id_optional
from .logger import log_manager, log, api_log


class LoggingMiddleware(BaseHTTPMiddleware):
    """FastAPI日志中间件，记录请求和响应信息"""
    
    def __init__(self, app, db_session_maker=None):
        super().__init__(app)
        self.db_session_maker = db_session_maker
    
    def is_loopback_address(self, ip):
        """检查IP地址是否为环回地址（localhost）"""
        try:
            ip_obj = ipaddress.ip_address(ip)
            # 检查IPv4环回地址 (127.0.0.0/8) 或 IPv6环回地址 (::1)
            return ip_obj.is_loopback
        except ValueError:
            # 如果IP地址格式无效，默认不视为环回地址
            return False
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """处理请求和响应"""
        # 生成请求ID
        request_id = str(uuid.uuid4())
        
        # 获取认证信息和用户ID
        user_id = None
        try:
            # 尝试从请求头中获取token
            auth_header = request.headers.get("Authorization")
            if auth_header and auth_header.startswith("Bearer "):
                token = auth_header.replace("Bearer ", "")
                user_id = await get_current_user_id_optional(token)
        except Exception as e:
            log.warning(f"获取用户ID失败: {str(e)}")
        
        # 初始化请求日志上下文
        log_manager.init_request_logger(request_id, user_id)
        request_logger = log_manager.get_logger()
        
        # 获取API日志器
        api_logger = log_manager.get_api_logger()
        
        # 获取客户端真实IP地址
        client_ip = request.client.host if request.client else None
        forwarded_for = request.headers.get("X-Forwarded-For")
        if forwarded_for:
            # 如果存在X-Forwarded-For头，使用第一个IP地址
            client_ip = forwarded_for.split(",")[0].strip()
        
        # 检查是否为环回地址
        is_loopback = self.is_loopback_address(client_ip)
        
        # 获取请求相关信息
        user_agent = request.headers.get("User-Agent", "Unknown")
        path = request.url.path
        method = request.method
        referer = request.headers.get("Referer")
        
        # 记录请求开始信息
        start_time = time.time()
        api_logger.info(
            f"{method} {path} - 开始处理 - IP: {client_ip}{' (环回地址)' if is_loopback else ''}",
            extra={
                "method": method,
                "path": path,
                "query_params": str(request.query_params),
                "client_host": client_ip,
                "user_agent": user_agent
            }
        )
        
        # 处理请求
        try:
            response = await call_next(request)
            
            # 计算处理时间
            process_time = time.time() - start_time
            
            # 记录响应信息
            api_logger.info(
                f"{method} {path} - 状态码: {response.status_code}, 耗时: {process_time:.3f}秒",
                extra={
                    "status_code": response.status_code,
                    "process_time": process_time
                }
            )
            
            # 添加请求ID到响应头
            response.headers["X-Request-ID"] = request_id
            
            # 如果提供了数据库会话，且不是环回地址，则保存访问记录
            if self.db_session_maker and not is_loopback:
                db = None
                try:
                    db = self.db_session_maker()
                    visitor_log = VisitorLog(
                        ip_address=client_ip,
                        user_agent=user_agent,
                        path=path,
                        method=method,
                        status_code=response.status_code,
                        user_id=user_id if isinstance(user_id, int) else None,
                        process_time=process_time,
                        referer=referer
                    )
                    db.add(visitor_log)
                    db.commit()
                    log.debug(f"已保存访问记录: {path}, IP: {client_ip}")
                except Exception as e:
                    log.error(f"保存访问记录失败: {str(e)}")
                    if db:
                        db.rollback()
                finally:
                    if db:
                        db.close()
            elif is_loopback:
                log.debug(f"跳过环回地址访问记录: {path}, IP: {client_ip}")
            
            return response
            
        except Exception as exc:
            # 记录异常信息
            process_time = time.time() - start_time
            request_logger.exception(
                f"{method} {path} - 处理异常: {str(exc)}, 耗时: {process_time:.3f}秒"
            )
            raise  # 继续传播异常
            

def setup_logging_middleware(app: FastAPI, db_session_maker=None, admin_api_url: str = None, api_key: str = None):
    """设置FastAPI应用的日志中间件"""
    # 添加日志中间件
    app.add_middleware(LoggingMiddleware, db_session_maker=db_session_maker)
    
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