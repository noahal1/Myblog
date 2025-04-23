from fastapi import FastAPI, Depends, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, func
from sqlalchemy.orm import sessionmaker, Session, joinedload
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from .model import models
import json
import math
from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend
from fastapi_cache.decorator import cache
from redis import Redis

load_dotenv(dotenv_path='./.env')

# 创建FastAPI应用
app = FastAPI(title="Noah's Blog API", 
              description="博客后端API服务",
              version="1.0.0")

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 数据库配置
DATABASE_URL = f"mysql+pymysql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 认证配置
SECRET_KEY = os.getenv('SECRET_KEY')
ALGORITHM = 'HS256'
ACCESS_TOKEN_EXPIRE_MINUTES = 10080  # 7天

pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')

# 创建数据库表
models.Base.metadata.create_all(bind=engine)

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
    user_id: int = None  # 如果用户未登录，可以为空
    reply_to_id: int = None  # 回复的评论ID，如果是直接评论则为None

class CommentResponse(BaseModel):
    id: int
    content: str
    user_id: int = None
    article_id: int
    created_at: datetime
    likes: int
    username: str = None
    reply_to_id: int | None = None  # 使用 Union 类型
    reply_to: dict | None = None    # 使用 Union 类型
    
    class Config:
        orm_mode = True

# 认证工具函数
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# 依赖项
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

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
    return {"message": "用户创建成功"}

@app.post('/api/login', response_model=Token)
async def login(credentials: UserLogin, db: Session = Depends(get_db)):
    # 查找用户
    user = db.query(models.User.id, models.User.hashed_password).filter(
            models.User.username == credentials.username
        ).first()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="用户名或密码错误")
    user_id = user[0]
    # 创建访问令牌 - 修复函数名错误
    access_token = create_access_token({"sub": credentials.username})
    return {"access_token": access_token, "token_type": "bearer", "userId": user_id}

@app.get('/api/health')
async def health_check():
    return {"status": "OK", "timestamp": datetime.utcnow().isoformat()}

@app.get('/api/articles', response_model=list[ArticleResponse])
@cache(expire=300)  # 缓存5分钟
async def get_articles(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    """获取文章列表"""
    # 查询文章总数用于分页
    total_count = db.query(func.count(models.Article.id)).scalar()
    
    # 查询文章
    articles = db.query(models.Article).options(
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
async def get_article(article_id: int, db: Session = Depends(get_db)):
    article = db.query(models.Article).options(joinedload(models.Article.tags_relationship)).filter(models.Article.id == article_id).first()
    if article is None:
        raise HTTPException(status_code=404, detail="文章不存在")
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
async def create_article(article: ArticleCreate, db: Session = Depends(get_db)):
    # 首先获取标签信息
    tag_objects = []
    tag_names = []
    
    if article.tags:
        # 获取所有标签
        tag_objects = db.query(models.Tag).filter(models.Tag.id.in_(article.tags)).all()
        tag_names = [tag.name for tag in tag_objects]
    
    # 创建新文章
    db_article = models.Article(
        title=article.title,
        content=article.content,
        summary=article.summary,
        author_id=1,  # 这里应该从JWT令牌中获取用户ID
        tags=",".join(tag_names) if tag_names else None  # 使用逗号分隔的标签名
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
            'reply_to': reply_to if reply_to else None
        })
    
    return comments_data

@app.post('/api/comments', response_model=CommentResponse)
async def create_comment(comment: CommentCreate, db: Session = Depends(get_db)):
    """创建评论"""
    # 检查文章是否存在
    article = db.query(models.Article).filter(models.Article.id == comment.article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="文章不存在")
    
    # 如果是回复，检查回复的评论是否存在
    if comment.reply_to_id:
        reply_to = db.query(models.Comment).filter(models.Comment.id == comment.reply_to_id).first()
        if not reply_to:
            raise HTTPException(status_code=404, detail="回复的评论不存在")
    
    # 创建评论
    db_comment = models.Comment(
        content=comment.content,
        article_id=comment.article_id,
        user_id=comment.user_id,  # 如果不提供user_id，则为匿名评论
        reply_to_id=comment.reply_to_id
    )
    
    db.add(db_comment)
    
    # 更新文章评论计数
    if article.comments_count is None:
        article.comments_count = 0
    article.comments_count = article.comments_count + 1
    
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
            parent_user = db.query(models.User).filter(models.User.id == parent_comment.user_id).first()
            reply_to = {
                "id": parent_comment.id,
                "username": parent_user.username if parent_user else "未知用户",
                "content": parent_comment.content
            }
    
    return {
        'id': db_comment.id,
        'content': db_comment.content,
        'user_id': db_comment.user_id,
        'article_id': db_comment.article_id,
        'created_at': db_comment.created_at,
        'likes': db_comment.likes,
        'username': username,
        'reply_to_id': db_comment.reply_to_id if db_comment.reply_to_id else None,
        'reply_to': reply_to if reply_to else None
    }

@app.delete('/api/comments/{comment_id}')
async def delete_comment(comment_id: int, db: Session = Depends(get_db)):
    """删除评论"""
    comment = db.query(models.Comment).filter(models.Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="评论不存在")
    
    # 更新文章评论计数
    article = db.query(models.Article).filter(models.Article.id == comment.article_id).first()
    if article and article.comments_count > 0:
        article.comments_count = article.comments_count - 1
    
    db.delete(comment)
    db.commit()
    return {"message": "评论已删除"}

@app.post('/api/articles/{article_id}/like')
async def like_article(article_id: int, db: Session = Depends(get_db)):
    """点赞文章"""
    article = db.query(models.Article).filter(models.Article.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="文章不存在")
    
    # 增加点赞数
    if article.likes is None:
        article.likes = 0
    article.likes += 1
    
    db.commit()
    return {"likes": article.likes}

# 启动服务器
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

# 添加评论点赞API端点
@app.post('/api/comments/{comment_id}/like')
async def like_comment(comment_id: int, db: Session = Depends(get_db)):
    """点赞评论"""
    comment = db.query(models.Comment).filter(models.Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="评论不存在")
    
    # 增加点赞数
    if comment.likes is None:
        comment.likes = 0
    comment.likes += 1
    
    db.commit()
    return {"likes": comment.likes}