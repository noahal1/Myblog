from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
from fastapi_cache import FastAPICache
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request as StarletteRequest

from src.model import models
from src.model.database import engine, SessionLocal
from src.utils.cache import cache_enabled
from src.utils.logger import log
from src.utils.fastapi_logging import LoggingMiddleware

# 导入API路由
from src.api.upload import router as upload_router
from src.api.auth import router as auth_router
from src.api.articles import router as articles_router
from src.api.tags import router as tags_router
from src.api.comments import router as comments_router
from src.api.admin import router as admin_router
from src.api.notifications import router as notifications_router
from src.api.knowledge import router as knowledge_router
from src.api.email import router as email_router

load_dotenv(dotenv_path='./.env')

# 创建FastAPI应用
app = FastAPI(title="Noah's Blog API", description="noah's blog api doc", version="1.0.0")

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://noahblog.top",
        "http://www.noahblog.top",
        "https://noahblog.top",
        "https://www.noahblog.top"
    ],  # 允许的前端域，包含HTTP和HTTPS
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(LoggingMiddleware, db_session_maker=SessionLocal)

# 注册API路由
app.include_router(upload_router, prefix="/api", tags=["upload"])
app.include_router(auth_router, prefix="/api", tags=["auth"])
app.include_router(articles_router, prefix="/api", tags=["articles"])
app.include_router(tags_router, prefix="/api", tags=["tags"])
app.include_router(comments_router, prefix="/api", tags=["comments"])
app.include_router(admin_router, prefix="/api/admin", tags=["admin"])
app.include_router(notifications_router, prefix="/api", tags=["notifications"])
app.include_router(knowledge_router, prefix="/api", tags=["knowledge"])
app.include_router(email_router, prefix="/api", tags=["email"])

# 添加速率限制中间件
class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, max_requests: int = 100, window_seconds: int = 60):
        super().__init__(app)
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests = {}  # IP -> [timestamp1, timestamp2, ...]

    async def dispatch(self, request: StarletteRequest, call_next):
        # 获取客户端IP
        client_ip = request.client.host if request.client else None

        # 如果无法获取IP，直接通过
        if not client_ip:
            return await call_next(request)

        now = datetime.now()

        # 清理过期的请求记录
        if client_ip in self.requests:
            self.requests[client_ip] = [ts for ts in self.requests[client_ip] if now - ts < timedelta(seconds=self.window_seconds)]
        else:
            self.requests[client_ip] = []

        # 检查请求数量是否超过限制
        if len(self.requests[client_ip]) >= self.max_requests:
            return JSONResponse(
                status_code=429,
                content={"detail": "请求过于频繁，请稍后再试"}
            )

        # 记录当前请求
        self.requests[client_ip].append(now)

        # 继续处理请求
        return await call_next(request)


if os.getenv("ENVIRONMENT") == "production":
    # 添加可信主机中间件
    app.add_middleware(
        TrustedHostMiddleware, 
        allowed_hosts=os.getenv("ALLOWED_HOSTS", "*").split(",")
    )
    
    max_requests = int(os.getenv("RATE_LIMIT_MAX_REQUESTS", "100"))
    window_seconds = int(os.getenv("RATE_LIMIT_WINDOW_SECONDS", "60"))
    app.add_middleware(RateLimitMiddleware, max_requests=max_requests, window_seconds=window_seconds)

# 数据库配置
DATABASE_URL = f"mysql+pymysql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"

# 创建表
models.Base.metadata.create_all(bind=engine)

# Health check endpoint
@app.get('/api/health')
def health_check():
    return {"status": "ok"}


@app.on_event("startup")
async def startup():
    global cache_enabled
    try:
        # 使用内存缓存
        from fastapi_cache.backends.inmemory import InMemoryBackend
        FastAPICache.init(InMemoryBackend(), prefix="myblog-cache:")
        cache_enabled = True
        log.info("内存缓存初始化成功")
    except Exception as e:
        cache_enabled = False
        log.error(f"内存缓存初始化失败: {str(e)}")


# 启动服务器
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)