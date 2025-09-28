"""
缓存工具模块
"""

from functools import wraps
from src.utils.logger import log

# 全局变量用于跟踪缓存状态
cache_enabled = False

def conditional_cache(expire: int = 300):
    """条件缓存装饰器"""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            if cache_enabled:
                # 如果缓存启用，使用缓存装饰器
                try:
                    from fastapi_cache.decorator import cache
                    cached_func = cache(expire=expire)(func)
                    return await cached_func(*args, **kwargs)
                except Exception as e:
                    log.warning(f"缓存操作失败，直接执行函数: {str(e)}")
                    return await func(*args, **kwargs)
            else:
                # 如果缓存未启用，直接执行函数
                return await func(*args, **kwargs)
        return wrapper
    return decorator