#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import sys
import time
from pathlib import Path
from types import FrameType
from typing import cast, Dict, List, Union, Optional, Callable, Any

import httpx
from loguru import logger


class LogManager:
    """日志管理器，用于统一管理系统中的日志配置和输出"""

    def __init__(self):
        self.log_path = os.path.join(os.getcwd(), "logs")
        # 确保日志目录存在
        if not os.path.exists(self.log_path):
            os.makedirs(self.log_path)
        
        # 初始化日志器
        self._init_loggers()
        
        # 请求相关的上下文日志
        self.request_id = None
        self.user_id = None
        self.ip_address = None
    
    def _init_loggers(self):
        """初始化所有日志记录器"""
        # 清除默认的处理器
        logger.remove()
        
        # 添加控制台输出
        logger.add(
            sys.stdout,
            level="INFO",
            format="<green>{time:YYYY-MM-DD HH:mm:ss.SSS}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>",
        )
        
        # 添加一般日志文件
        logger.add(
            os.path.join(self.log_path, "app_{time:YYYY-MM-DD}.log"),
            rotation="00:00",  # 每天零点创建新文件
            retention="30 days",  # 保留30天
            compression="zip",  # 压缩旧日志
            level="DEBUG",
            format="{time:YYYY-MM-DD HH:mm:ss.SSS} | {level: <8} | {name}:{function}:{line} - {message}",
            encoding="utf-8"
        )
        
        # 添加错误日志文件
        logger.add(
            os.path.join(self.log_path, "error_{time:YYYY-MM-DD}.log"),
            rotation="00:00",
            retention="30 days",
            compression="zip",
            level="ERROR",
            format="{time:YYYY-MM-DD HH:mm:ss.SSS} | {level: <8} | {name}:{function}:{line} - {message}",
            encoding="utf-8"
        )
        
        # 添加API访问日志文件
        logger.add(
            os.path.join(self.log_path, "api_{time:YYYY-MM-DD}.log"),
            rotation="00:00",
            retention="30 days",
            compression="zip",
            level="INFO",
            format="{time:YYYY-MM-DD HH:mm:ss.SSS} | {level: <8} | 请求ID:{extra[request_id]} | 用户:{extra[user_id]} | IP:{extra[ip_address]} | {message}",
            filter=lambda record: record["extra"].get("api_log") is True,
            encoding="utf-8"
        )
    
    def add_backend_sink(self, url: str, api_key: str, interval: int = 60):
        """添加后台管理系统日志接收器
        
        Args:
            url: 后台API地址
            api_key: API认证密钥
            interval: 发送间隔，默认60秒
        """
        async def send_logs(message):
            """异步发送日志到后台"""
            record = message.record
            data = {
                "level": record["level"].name,
                "message": record["message"],
                "time": record["time"].timestamp(),
                "name": record["name"],
                "function": record["function"],
                "line": record["line"],
                "extra": dict(record["extra"])
            }
            
            try:
                async with httpx.AsyncClient() as client:
                    response = await client.post(
                        url,
                        json=data,
                        headers={"X-API-Key": api_key},
                        timeout=5.0
                    )
                    response.raise_for_status()
            except Exception as e:
                # 避免递归日志
                print(f"Failed to send log to backend: {e}")
        
        # 添加后台日志接收器
        logger.add(
            send_logs,
            level="INFO",
            format="{message}",
            enqueue=True,  # 使用队列以避免阻塞
            backtrace=False,
            diagnose=False,
            catch=True,
        )
    
    def filter_by_module(self, module_name: str, level: str = "DEBUG"):
        """按模块名过滤日志
        
        Args:
            module_name: 模块名称
            level: 日志级别
        """
        from datetime import datetime
        current_date = datetime.now().strftime("%Y-%m-%d")
        
        logger.add(
            os.path.join(self.log_path, f"{module_name}_{current_date}.log"),
            rotation="00:00",
            retention="30 days",
            compression="zip",
            level=level,
            format="{time:YYYY-MM-DD HH:mm:ss.SSS} | {level: <8} | {name}:{function}:{line} - {message}",
            filter=lambda record: record["name"].startswith(module_name),
            encoding="utf-8"
        )
    
    def init_request_logger(self, request_id: str, user_id: Optional[str] = None, ip_address: Optional[str] = None):
        """初始化请求上下文日志器
        
        Args:
            request_id: 请求ID
            user_id: 用户ID
            ip_address: IP地址
        """
        self.request_id = request_id
        self.user_id = user_id or "anonymous"
        self.ip_address = ip_address or "unknown"
    
    def get_logger(self):
        """获取常规日志记录器"""
        return logger.bind(request_id=self.request_id, user_id=self.user_id, ip_address=self.ip_address)
    
    def get_api_logger(self):
        """获取API日志记录器"""
        return logger.bind(api_log=True, request_id=self.request_id, user_id=self.user_id, ip_address=self.ip_address)
    
    def format_exception(self, exc: Exception) -> str:
        """格式化异常信息
        
        Args:
            exc: 异常对象
            
        Returns:
            str: 格式化后的异常信息
        """
        import traceback
        tb = traceback.format_exception(type(exc), exc, exc.__traceback__)
        return "".join(tb)


# 创建全局实例
log_manager = LogManager()
log = log_manager.get_logger()
api_log = log_manager.get_api_logger() 

def setup_logging():
    """初始化应用程序的日志系统
    
    可以在应用程序启动时调用此函数来确保日志系统被正确设置
    
    Returns:
        LogManager: 日志管理器实例
    """
    return log_manager 