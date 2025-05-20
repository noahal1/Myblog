from fastapi import FastAPI, HTTPException, Depends, Request, BackgroundTasks, Form, Query, Response, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session, joinedload, sessionmaker
from sqlalchemy import create_engine, func, text, desc, asc, and_, or_
from typing import List, Optional, Dict, Union, Any
from datetime import datetime, timedelta, date
import os
import bcrypt
import json
import uuid
import time
import math
from pydantic import BaseModel
from dotenv import load_dotenv
from pathlib import Path
from passlib.context import CryptContext
from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend
from fastapi_cache.decorator import cache
from redis import Redis
from fastapi.middleware.trustedhost import TrustedHostMiddleware
import re
import ipaddress

from src.model import models
from src.model.database import engine, SessionLocal, get_db
from src.utils.auth import verify_token, create_access_token, create_refresh_token, get_current_user_id, get_current_user_id_optional, create_tokens_from_refresh_token
from src.utils.logger import log, api_log
from src.utils.ip_location import get_ip_location
from src.utils.fastapi_logging import LoggingMiddleware, setup_logging_middleware
from starlette.datastructures import State
from cachetools import TTLCache
from functools import wraps

load_dotenv(dotenv_path='./.env')

# 创建FastAPI应用
app = FastAPI(title="Noah's Blog API",description="noah's blog api doc",version="1.0.0")

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://noahblog.top", "http://www.noahblog.top"],  # 允许的前端域
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

app.add_middleware(LoggingMiddleware, db_session_maker=SessionLocal)

# 添加速率限制中间件
class RateLimitMiddleware:
    def __init__(self, app, max_requests: int = 100, window_seconds: int = 60):
        self.app = app
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests = {}  # IP -> [timestamp1, timestamp2, ...]

    async def __call__(self, request: Request, call_next):
        ip = request.client.host
        now = datetime.now()
        
        # 清理过期的请求记录
        if ip in self.requests:
            self.requests[ip] = [ts for ts in self.requests[ip] if now - ts < timedelta(seconds=self.window_seconds)]
        else:
            self.requests[ip] = []
        
        # 检查请求数量是否超过限制
        if len(self.requests[ip]) >= self.max_requests:
            from fastapi.responses import JSONResponse
            return JSONResponse(
                status_code=429,
                content={"detail": "请求过于频繁，请稍后再试"}
            )
        
        # 记录当前请求
        self.requests[ip].append(now)
        
        # 继续处理请求
        response = await call_next(request)
        return response


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

# 密码哈希工具
pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')

# 认证工具函数
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

# Pydantic模型
class ArticleResponse(BaseModel):
    id: int
    title: str
    content: str
    summary: str
    author_id: int
    created_at: datetime
    updated_at: datetime
    views: int
    likes: int
    tags: list[str]
    status: Optional[str] = "published"
    author_name: Optional[str] = None
    
    class Config:
        orm_mode = True

class ArticleCreate(BaseModel):
    title: str
    content: str
    summary: str
    tags: list[int]

class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    userId: int

class TagCreate(BaseModel):
    name: str

class TagResponse(BaseModel):
    id: int
    name: str
    
    class Config:
        orm_mode = True

class CommentCreate(BaseModel):
    content: str
    article_id: int
    user_id: Optional[int] = None  # 如果用户未登录，可以为空
    reply_to_id: Optional[int] = None  # 回复的评论ID，如果是直接评论则为None

class CommentResponse(BaseModel):
    id: int
    content: str
    user_id: Optional[int] = None
    article_id: int
    created_at: datetime
    likes: int
    username: str = None
    reply_to_id: Optional[int] = None
    reply_to: Optional[dict] = None
    ip_address: Optional[str] = None
    location: Optional[str] = None
    
    class Config:
        orm_mode = True

# 添加刷新令牌请求模型
class RefreshTokenRequest(BaseModel):
    refresh_token: str

# 用户Api
@app.post('/api/register', response_model=dict)
async def register(user: UserCreate, db: Session = Depends(get_db)):
    # 检查用户名是否已存在
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="用户名已被注册")
    
    # 检查邮箱是否已存在
    db_email = db.query(models.User).filter(models.User.email == user.email).first()
    if db_email:
        raise HTTPException(status_code=400, detail="邮箱已被注册")
    
    # 创建新用户
    hashed_password = get_password_hash(user.password)
    db_user = models.User( 
        username=user.username,
        email=user.email,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    # 记录注册日志
    log.info(f"用户 {db_user} 在 {datetime.now()} 注册成功")
    return {"message": "用户创建成功"}

# 刷新令牌API
@app.post('/api/token/refresh', response_model=Token)
async def refresh_token(request: RefreshTokenRequest):
    """使用刷新令牌获取新的访问令牌"""
    try:
        # 从刷新令牌创建新的令牌对
        tokens = create_tokens_from_refresh_token(request.refresh_token)
        return tokens
    except HTTPException as e:
        raise e
    except Exception as e:
        log.error(f"刷新令牌失败: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="刷新令牌过程中发生错误",
        )

# 用户登录api
@app.post('/api/login', response_model=Token)
async def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """用户登录获取JWT令牌"""
    # 查找用户
    user = db.query(models.User).filter(models.User.username == credentials.username).first()
    
    # 验证密码
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="用户名或密码错误"
        )
    
    # 创建访问令牌，将user_id作为sub字段存储
    access_token, expires_at = create_access_token({"sub": str(user.id)})
    
    # 创建刷新令牌
    refresh_token = create_refresh_token({"sub": str(user.id)})
    
    # 记录登录日志
    log.info(f"用户ID：{user.id} 在 {datetime.now()} 登录成功")

    return {
        "access_token": access_token, 
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "expires_at": expires_at,
        "userId": user.id
    }

@app.get('/api/health')
def health_check():
    return {"status": "ok"}

@app.get('/api/articles', response_model=list[ArticleResponse])
@cache(expire=300)  # 缓存5分钟
async def get_articles(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    """获取文章列表，仅返回已发布的文章"""
    # 只查询已发布的文章总数
    total_count = db.query(func.count(models.Article.id)).filter(models.Article.status == "published").scalar()

    # 只查询已发布的文章
    articles = db.query(models.Article).filter(
        models.Article.status == "published"
    ).options(
        joinedload(models.Article.tags_relationship),
        joinedload(models.Article.author)  # 预加载作者信息
    ).order_by(models.Article.created_at.desc()).offset(skip).limit(limit).all()

    articles_data = []
    for article in articles:
        tag_names = [tag.name for tag in article.tags_relationship] if article.tags_relationship else []
        
        articles_data.append({
            'id': article.id,
            'title': article.title,
            'content': article.content,
            'summary': article.summary,
            'author_id': article.author_id,
            'author_name': article.author.username if article.author else "未知作者",
            'created_at': article.created_at.isoformat(),
            'updated_at': article.updated_at.isoformat(),
            'views': article.views,
            'likes': article.likes,
            'tags': tag_names,
            'comments_count': article.comments_count if article.comments_count is not None else 0
        })
    # 在响应头中添加分页信息
    response = Response(content=json.dumps(articles_data), media_type="application/json")
    response.headers["X-Total-Count"] = str(total_count)
    response.headers["X-Total-Pages"] = str(math.ceil(total_count / limit))
    return response

#标签api
@app.get('/api/tags', response_model=list[TagResponse])
@cache(expire=300)  # 缓存5分钟
async def get_tags(db: Session = Depends(get_db)):
    """获取所有标签"""
    tags = db.query(models.Tag).all()
    return [{"id": tag.id, "name": tag.name} for tag in tags]

@app.post('/api/tags', response_model=TagResponse)
async def create_tag(tag: TagCreate, db: Session = Depends(get_db)):
    """创建新标签"""
    # 检查标签是否已存在
    db_tag = db.query(models.Tag).filter(models.Tag.name == tag.name).first()
    if db_tag:
        return db_tag
    
    # 创建新标签
    new_tag = models.Tag(name=tag.name)
    db.add(new_tag)
    db.commit()
    db.refresh(new_tag)

    return new_tag
    
@app.get('/api/articles/{article_id}', response_model=ArticleResponse)
async def get_article(article_id: int, db: Session = Depends(get_db), current_user_id: Optional[int] = Depends(get_current_user_id_optional)):
    """获取文章详情，普通用户只能查看已发布文章，作者和管理员可查看自己的未发布文章"""
    article = db.query(models.Article).options(joinedload(models.Article.tags_relationship)).filter(models.Article.id == article_id).first()
    if article is None:
        raise HTTPException(status_code=404, detail="文章不存在")
    
    # 检查文章状态和用户权限
    # 如果文章未发布，只有作者和管理员可以查看
    if article.status != "published":
        # 未登录用户不能查看未发布文章
        if not current_user_id:
            raise HTTPException(status_code=403, detail="该文章尚未发布")
        
        # 非文章作者且非管理员不能查看未发布文章
        if current_user_id != article.author_id and current_user_id != 1:
            raise HTTPException(status_code=403, detail="该文章尚未发布")
    
    # 增加访问量
    article.views += 1
    db.commit()
    
    tag_names = [tag.name for tag in article.tags_relationship] if article.tags_relationship else []
    
    article_data = {
        'id': article.id,
        'title': article.title,
        'content': article.content,
        'summary': article.summary,
        'author_id': article.author_id,
        'created_at': article.created_at.isoformat(),
        'updated_at': article.updated_at.isoformat(),
        'views': article.views,
        'likes': article.likes,
        'tags': tag_names  # 返回标签名称列表
    }
    return article_data


@app.post('/api/articles', response_model=ArticleResponse)
async def create_article(
    article: ArticleCreate, 
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)  # 使用依赖项获取当前用户ID
):
    """创建新文章"""
    # 记录API访问日志
    api_log.info(f"用户 {current_user_id} 正在创建文章: {article.title}")
    
    # 首先获取标签信息
    tag_objects = []
    tag_names = []

    if article.tags:
        # 获取所有标签
        tag_objects = db.query(models.Tag).filter(models.Tag.id.in_(article.tags)).all()
        tag_names = [tag.name for tag in tag_objects]

    # 创建新文章，使用当前登录用户的ID
    # 如果用户不是管理员（ID不为1），文章状态设为pending需要审核
    status = "published" if current_user_id == 1 else "pending"
    
    db_article = models.Article(
        title=article.title,
        content=article.content,
        summary=article.summary,
        author_id=current_user_id,  # 使用从JWT获取的用户ID
        tags=",".join(tag_names) if tag_names else None,  # 使用逗号分隔的标签名
        status=status  # 设置文章状态
    )

    db.add(db_article)
    
    # 处理标签关联
    if tag_objects:
        # 建立标签关联
        db_article.tags_relationship = tag_objects
    db.commit()
    db.refresh(db_article)
    
    # 转换标签为字符串列表
    tag_names = [tag.name for tag in db_article.tags_relationship] if db_article.tags_relationship else []
    
    # 创建文章日志记录
    log.info(f"用户id: {current_user_id} 在 {datetime.now()} 创建了文章 {db_article.title}")

    return {
        'id': db_article.id,
        'title': db_article.title,
        'content': db_article.content,
        'summary': db_article.summary,
        'author_id': db_article.author_id,
        'created_at': db_article.created_at.isoformat(),
        'updated_at': db_article.updated_at.isoformat(),
        'views': db_article.views,
        'likes': db_article.likes,
        'tags': tag_names
    }

@app.on_event("startup")
async def startup():
    redis = Redis(host="localhost", port=6379, db=0, decode_responses=True)
    FastAPICache.init(RedisBackend(redis), prefix="myblog-cache:")

# 评论API
@app.get('/api/articles/{article_id}/comments', response_model=list[CommentResponse])
async def get_comments(article_id: int, skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    """获取文章评论"""
    comments = db.query(models.Comment).filter(
        models.Comment.article_id == article_id
    ).options(
        joinedload(models.Comment.user),
        joinedload(models.Comment.parent)
    ).order_by(models.Comment.created_at.desc()).offset(skip).limit(limit).all()
    
    comments_data = []
    for comment in comments:
        # 获取回复的评论信息
        reply_to = None
        if comment.reply_to_id:
            parent_comment = comment.parent
            if parent_comment:
                parent_user = db.query(models.User).filter(models.User.id == parent_comment.user_id).first()
                reply_to = {
                    "id": parent_comment.id,
                    "username": parent_user.username if parent_user else "未知用户",
                    "content": parent_comment.content
                }
        
        comments_data.append({
            'id': comment.id,
            'content': comment.content,
            'user_id': comment.user_id,
            'article_id': comment.article_id,
            'created_at': comment.created_at,
            'likes': comment.likes,
            'username': comment.user.username if comment.user else "匿名用户",
            'reply_to_id': comment.reply_to_id if comment.reply_to_id else None,
            'reply_to': reply_to if reply_to else None,
            'ip_address': comment.ip_address,
            'location': comment.location
        })
    
    return comments_data

@app.post('/api/comments', response_model=CommentResponse)
async def create_comment(
    comment: CommentCreate, 
    request: Request,
    db: Session = Depends(get_db),
    current_user_id: Optional[int] = Depends(get_current_user_id_optional)
):
    """创建评论"""
    # 确保用户已登录
    if current_user_id is None:
        raise HTTPException(status_code=401, detail="需要登录才能发表评论")
    
    # 检查文章是否存在
    article = db.query(models.Article).filter(models.Article.id == comment.article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="文章不存在")
    
    # 如果是回复，检查回复的评论是否存在
    if comment.reply_to_id:
        reply_to = db.query(models.Comment).filter(models.Comment.id == comment.reply_to_id).first()
        if not reply_to:
            raise HTTPException(status_code=404, detail="回复的评论不存在")
    
    # 获取客户端IP地址
    ip_address = request.client.host
    
    # 如果有X-Forwarded-For头，使用它获取真实IP
    forwarded_for = request.headers.get("X-Forwarded-For")
    if forwarded_for:
        # 取第一个IP地址，即最原始的客户端IP
        ip_address = forwarded_for.split(",")[0].strip()
    
    # 查询IP地址的地理位置
    try:
        location_info = get_ip_location(ip_address)
        location = location_info.get("province", "未知")
    except Exception as e:
        log.error(f"获取IP位置信息失败: {str(e)}")
        location = "未知"
    
    # 创建评论
    db_comment = models.Comment(
        content=comment.content,
        article_id=comment.article_id,
        user_id=current_user_id,
        reply_to_id=comment.reply_to_id if comment.reply_to_id and comment.reply_to_id > 0 else None,
        ip_address=ip_address,
        location=location
    )
    
    db.add(db_comment)
    
    # 计算并更新文章的评论数
    article = db.query(models.Article).filter(models.Article.id == comment.article_id).first()
    if article:
        if article.comments_count is None:
            article.comments_count = 1
        else:
            article.comments_count += 1
        db.commit()
    
    db.refresh(db_comment)
    
    # 获取用户名
    username = None
    if db_comment.user_id:
        user = db.query(models.User).filter(models.User.id == db_comment.user_id).first()
        username = user.username if user else "未知用户"
    else:
        username = "匿名用户"
    
    # 获取回复的评论信息
    reply_to = None
    if db_comment.reply_to_id:
        parent_comment = db.query(models.Comment).filter(models.Comment.id == db_comment.reply_to_id).first()
        if parent_comment:
            parent_username = "匿名用户"
            if parent_comment.user_id:
                parent_user = db.query(models.User).filter(models.User.id == parent_comment.user_id).first()
                if parent_user:
                    parent_username = parent_user.username
            
            reply_to = {
                "id": parent_comment.id,
                "username": parent_username,
                "content": parent_comment.content
            }
    
    # 记录评论日志
    log.info(f"用户 {username}(ID:{current_user_id}) 在文章 {article.id} 添加了评论")
    
    return {
        'id': db_comment.id,
        'content': db_comment.content,
        'user_id': db_comment.user_id,
        'article_id': db_comment.article_id,
        'created_at': db_comment.created_at,
        'likes': db_comment.likes,
        'username': username,
        'reply_to_id': db_comment.reply_to_id,
        'reply_to': reply_to,
        'ip_address': db_comment.ip_address,
        'location': db_comment.location
    }

@app.delete('/api/comments/{comment_id}')
async def delete_comment(
    comment_id: int, 
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """删除评论"""
    comment = db.query(models.Comment).filter(models.Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="评论不存在")
    
    # 检查用户是否有权限删除此评论
    if comment.user_id != current_user_id:
        raise HTTPException(status_code=403, detail="无权删除此评论")
    
    # 更新文章评论计数
    article = db.query(models.Article).filter(models.Article.id == comment.article_id).first()
    if article:
        if article.comments_count is None:
            article.comments_count = 0
        elif article.comments_count > 0:
            article.comments_count -= 1
    
    # 获取用户名用于日志记录
    username = "未知用户"
    if comment.user_id:
        user = db.query(models.User).filter(models.User.id == comment.user_id).first()
        if user:
            username = user.username
    
    # 删除评论
    db.delete(comment)
    db.commit()
    
    # 记录删除日志
    log.info(f"用户 {username}(ID:{current_user_id}) 删除了评论 {comment_id}")
    
    return {"message": "评论已删除"}

@app.post('/api/articles/{article_id}/like')
async def like_article(
    article_id: int, 
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """点赞文章"""
    article = db.query(models.Article).filter(models.Article.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="文章不存在")
    
    # 增加点赞数
    if article.likes is None:
        article.likes = 0
    article.likes += 1
    
    db.commit()
    
    # 记录点赞日志
    api_log.info(f"用户 {current_user_id} 点赞了文章 {article_id}")
    
    return {"likes": article.likes}

@app.post('/api/comments/{comment_id}/like')
async def like_comment(
    comment_id: int, 
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """点赞评论"""
    comment = db.query(models.Comment).filter(models.Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="评论不存在")
    
    # 增加点赞数
    if comment.likes is None:
        comment.likes = 0
    comment.likes += 1
    
    db.commit()
    
    # 记录点赞日志
    api_log.info(f"用户 {current_user_id} 点赞了评论 {comment_id}")
    
    return {"likes": comment.likes}

# 访问记录相关Pydantic模型
class VisitorLogResponse(BaseModel):
    id: int
    ip_address: str
    user_agent: str
    path: str
    method: str
    status_code: int
    user_id: Optional[int] = None
    request_time: datetime
    process_time: float
    referer: Optional[str] = None
    
    class Config:
        orm_mode = True

# 访问记录统计响应
class VisitorStatsResponse(BaseModel):
    total_visits: int
    unique_ips: int
    average_response_time: float
    path_stats: dict
    ip_stats: dict

# 访问记录查询参数
class VisitorLogQueryParams(BaseModel):
    limit: int = 50
    offset: int = 0
    ip_address: Optional[str] = None
    path: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None

# 访问记录API端点
@app.get('/api/admin/visitor-logs', response_model=List[VisitorLogResponse])
async def get_visitor_logs(
    limit: int = 50, 
    offset: int = 0,
    ip_address: Optional[str] = None,
    path: Optional[str] = None,
    status_code: Optional[int] = None,
    days: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """获取访问记录列表（需要管理员权限）"""
    # 验证用户是否为管理员（ID为1）
    if current_user_id != 1:
        raise HTTPException(status_code=403, detail="没有权限访问该资源")
    
    # 构建查询
    query = db.query(models.VisitorLog)
    
    # 应用过滤条件
    if ip_address:
        query = query.filter(models.VisitorLog.ip_address == ip_address)
    if path:
        query = query.filter(models.VisitorLog.path.contains(path))
    if status_code:
        query = query.filter(models.VisitorLog.status_code == status_code)
    if days:
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        query = query.filter(models.VisitorLog.request_time >= cutoff_date)
    
    # 获取总记录数
    total = query.count()
    
    # 应用分页并获取结果
    logs = query.order_by(models.VisitorLog.request_time.desc()).offset(offset).limit(limit).all()
    
    return logs

@app.get('/api/admin/visitor-stats', response_model=VisitorStatsResponse)
async def get_visitor_stats(
    days: int = 7,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """获取访问统计数据（需要管理员权限）"""
    # 验证用户是否为管理员，只检查ID是否为1
    if current_user_id != 1:
        raise HTTPException(status_code=403, detail="没有权限访问该资源")
    
    # 设置时间范围
    cutoff_date = datetime.utcnow() - timedelta(days=days)
    
    # 基本统计
    total_visits = db.query(models.VisitorLog).filter(models.VisitorLog.request_time >= cutoff_date).count()
    unique_ips = db.query(models.VisitorLog.ip_address).filter(
        models.VisitorLog.request_time >= cutoff_date
    ).distinct().count()
    
    # 平均响应时间
    avg_response_time = db.query(func.avg(models.VisitorLog.process_time)).filter(
        models.VisitorLog.request_time >= cutoff_date
    ).scalar() or 0.0
    
    # 路径统计 - 最常访问的路径
    path_stats_query = db.query(
        models.VisitorLog.path, 
        func.count(models.VisitorLog.id).label('count')
    ).filter(
        models.VisitorLog.request_time >= cutoff_date
    ).group_by(
        models.VisitorLog.path
    ).order_by(
        func.count(models.VisitorLog.id).desc()
    ).limit(10).all()
    
    path_stats = {path: count for path, count in path_stats_query}
    
    # IP统计 - 最活跃的IP
    ip_stats_query = db.query(
        models.VisitorLog.ip_address, 
        func.count(models.VisitorLog.id).label('count')
    ).filter(
        models.VisitorLog.request_time >= cutoff_date
    ).group_by(
        models.VisitorLog.ip_address
    ).order_by(
        func.count(models.VisitorLog.id).desc()
    ).limit(10).all()
    
    ip_stats = {ip: count for ip, count in ip_stats_query}
    
    return {
        "total_visits": total_visits,
        "unique_ips": unique_ips,
        "average_response_time": avg_response_time,
        "path_stats": path_stats,
        "ip_stats": ip_stats
    }

# IP地理位置查询API端点
@app.get('/api/admin/ip-geolocation')
async def get_ip_geolocation(
    ip: str,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """获取IP地址的地理位置信息（需要管理员权限）"""
    # 验证用户是否为管理员（ID为1）
    if current_user_id != 1:
        raise HTTPException(status_code=403, detail="没有权限访问该资源")
    
    # 不再查询IP地理位置，直接返回"未知"
    return {
        "ip": ip,
        "country": "未知",
        "region": "未知",
        "city": "未知",
        "isp": "未知"
    }

# 文章审核相关API
@app.get('/api/admin/pending-articles', response_model=list[ArticleResponse])
async def get_pending_articles(
    skip: int = 0, 
    limit: int = 10, 
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """获取待审核文章列表（仅管理员可访问）"""
    # 检查当前用户是否为管理员（ID为1）
    if current_user_id != 1:
        raise HTTPException(status_code=403, detail="仅管理员可以访问此功能")
    
    # 查询状态为pending的文章
    articles = db.query(models.Article).filter(
        models.Article.status == "pending"
    ).options(
        joinedload(models.Article.tags_relationship),
        joinedload(models.Article.author)
    ).order_by(models.Article.created_at.desc()).offset(skip).limit(limit).all()
    
    # 转换查询结果
    articles_data = []
    for article in articles:
        tag_names = [tag.name for tag in article.tags_relationship] if article.tags_relationship else []
        
        articles_data.append({
            'id': article.id,
            'title': article.title,
            'content': article.content,
            'summary': article.summary,
            'author_id': article.author_id,
            'author_name': article.author.username if article.author else "未知",
            'created_at': article.created_at.isoformat(),
            'updated_at': article.updated_at.isoformat(),
            'views': article.views,
            'likes': article.likes,
            'tags': tag_names,
            'status': article.status
        })
    
    return articles_data

@app.put('/api/admin/articles/{article_id}/status')
async def update_article_status(
    article_id: int,
    status: str,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """更新文章状态（审核）"""
    # 检查当前用户是否为管理员（ID为1）
    if current_user_id != 1:
        raise HTTPException(status_code=403, detail="仅管理员可以审核文章")
    
    # 检查状态值是否有效
    valid_statuses = ["pending", "published", "rejected"]
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail="无效的状态值")
    
    # 查找文章
    article = db.query(models.Article).filter(models.Article.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="文章不存在")
    
    # 更新状态
    article.status = status
    db.commit()
    
    # 返回成功信息
    return {"message": "文章状态已更新", "article_id": article_id, "status": status}

@app.get('/api/admin/articles', response_model=list[ArticleResponse])
async def get_admin_articles(
    skip: int = 0, 
    limit: int = 10,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """获取文章列表（管理员专用，可过滤状态）"""
    # 检查当前用户是否为管理员
    if current_user_id != 1:
        raise HTTPException(status_code=403, detail="仅管理员可以访问此功能")
    
    # 构建查询
    query = db.query(models.Article)
    
    # 如果指定了状态，则按状态过滤
    if status:
        query = query.filter(models.Article.status == status)
    
    # 获取总数
    total_count = query.count()
    
    # 查询文章
    articles = query.options(
        joinedload(models.Article.tags_relationship),
        joinedload(models.Article.author)
    ).order_by(models.Article.created_at.desc()).offset(skip).limit(limit).all()
    
    # 转换查询结果
    articles_data = []
    for article in articles:
        tag_names = [tag.name for tag in article.tags_relationship] if article.tags_relationship else []
        
        articles_data.append({
            'id': article.id,
            'title': article.title,
            'content': article.content,
            'summary': article.summary,
            'author_id': article.author_id,
            'author_name': article.author.username if article.author else "未知",
            'created_at': article.created_at.isoformat(),
            'updated_at': article.updated_at.isoformat(),
            'views': article.views,
            'likes': article.likes,
            'tags': tag_names,
            'status': article.status
        })
    
    # 在响应头中添加分页信息
    response = Response(content=json.dumps(articles_data), media_type="application/json")
    response.headers["X-Total-Count"] = str(total_count)
    response.headers["X-Total-Pages"] = str(math.ceil(total_count / limit))
    return response

@app.get('/api/admin/articles/{article_id}', response_model=ArticleResponse)
async def get_admin_article(
    article_id: int, 
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """管理员获取任意文章详情（无状态限制）"""
    # 检查当前用户是否为管理员
    if current_user_id != 1:
        raise HTTPException(status_code=403, detail="仅管理员可以访问此功能")
    
    article = db.query(models.Article).options(joinedload(models.Article.tags_relationship)).filter(models.Article.id == article_id).first()
    if article is None:
        raise HTTPException(status_code=404, detail="文章不存在")
    
    tag_names = [tag.name for tag in article.tags_relationship] if article.tags_relationship else []
    
    # 获取作者信息
    author = db.query(models.User).filter(models.User.id == article.author_id).first()
    author_name = author.username if author else "未知"
    
    article_data = {
        'id': article.id,
        'title': article.title,
        'content': article.content,
        'summary': article.summary,
        'author_id': article.author_id,
        'author_name': author_name,
        'created_at': article.created_at.isoformat(),
        'updated_at': article.updated_at.isoformat(),
        'views': article.views,
        'likes': article.likes,
        'tags': tag_names,
        'status': article.status
    }
    
    return article_data

# 启动服务器
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)