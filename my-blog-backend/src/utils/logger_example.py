#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
日志管理系统使用示例
"""

import time
import uuid
from .logger import log, api_log, log_manager


def example_basic_logging():
    """基本日志记录示例"""
    log.debug("这是一条调试日志")
    log.info("这是一条信息日志")
    log.warning("这是一条警告日志")
    log.error("这是一条错误日志")
    log.critical("这是一条严重错误日志")


def example_structured_logging():
    """结构化日志记录示例"""
    # 添加额外字段
    log.bind(user_id="10001", action="login").info("用户登录成功")
    log.bind(item_id="1234", price=99.9).info("产品已被添加到购物车")
    
    # 嵌套结构
    log.bind(
        transaction={
            "id": "tx-123456",
            "amount": 199.99,
            "status": "completed"
        }
    ).info("交易完成")


def example_request_logging():
    """请求日志记录示例"""
    # 初始化请求上下文
    request_id = str(uuid.uuid4())
    user_id = "user-10001"
    log_manager.init_request_logger(request_id, user_id)
    
    # 获取带上下文的日志器
    request_log = log_manager.get_logger()
    
    # 记录请求信息
    request_log.info("请求开始处理")
    
    # 模拟处理请求
    time.sleep(0.5)
    
    # 记录处理结果
    request_log.info("请求处理完成")


def example_api_logging():
    """API日志记录示例"""
    # 初始化请求上下文
    request_id = str(uuid.uuid4())
    user_id = "user-10002"
    log_manager.init_request_logger(request_id, user_id)
    
    # 获取API日志器
    api_logger = log_manager.get_api_logger()
    
    # 记录API访问信息
    api_logger.info("GET /api/articles")
    
    # 模拟API处理
    time.sleep(0.3)
    
    # 记录处理结果
    api_logger.info("API响应：状态码 200，耗时 300ms")


def example_exception_logging():
    """异常日志记录示例"""
    try:
        # 制造一个异常
        result = 1 / 0
    except Exception as e:
        log.exception(f"发生了一个异常: {str(e)}")


def example_module_specific_logging():
    """模块特定日志记录示例"""
    # 为特定模块创建日志处理器
    log_manager.filter_by_module("app.models", level="DEBUG")
    log_manager.filter_by_module("app.api", level="INFO")
    
    # 现在，来自这些模块的日志会被记录到单独的文件中


def example_backend_sink():
    """后台管理系统日志接收器示例"""
    # 添加后台管理系统日志接收器
    log_manager.add_backend_sink(
        url="http://admin-api.example.com/logs",
        api_key="your_secret_api_key", 
        interval=60  # 每60秒批量发送一次
    )
    
    # 现在，所有INFO级别以上的日志会被发送到后台管理系统


def run_all_examples():
    """运行所有示例"""
    example_basic_logging()
    example_structured_logging()
    example_request_logging()
    example_api_logging()
    example_exception_logging()
    example_module_specific_logging()
    example_backend_sink()


if __name__ == "__main__":
    run_all_examples() 