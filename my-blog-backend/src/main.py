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
from .database import SessionLocal, engine
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
    user = db.query(models.User).filter(models.User.username == credentials.username).first()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="用户名或密码错误")
    
    # 创建访问令牌 - 修复函数名错误
    access_token = create_access_token({"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

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
            'tags': tag_names
        })
    
    # 在响应头中添加分页信息
    response = Response(content=json.dumps(articles_data), media_type="application/json")
    response.headers["X-Total-Count"] = str(total_count)
    response.headers["X-Total-Pages"] = str(math.ceil(total_count / limit))
    return response

#标签api
@app.get('/api/tags', response_model=list[dict])
async def get_tags(db: Session = Depends(get_db)):
    tags = db.query(models.Tag).all()
    if not tags:
        return []
    return [{"id": tag.id, "name": tag.name} for tag in tags]
    
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
    tag_ids = ','.join(str(tag_id) for tag_id in article.tags) 
    db_article = models.Article(
        title=article.title,
        content=article.content,
        summary=article.summary,
        author_id=1,  
        tags=tag_ids
    )
    db.add(db_article)
    db.commit()
    db.refresh(db_article)
    return db_article

@app.lifespan("startup")
async def startup():
    redis = Redis(host="localhost", port=6379, db=0, decode_responses=True)
    FastAPICache.init(RedisBackend(redis), prefix="myblog-cache:")

# 启动服务器
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)