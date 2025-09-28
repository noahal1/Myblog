"""
用户认证相关API
"""

from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from datetime import datetime
from pydantic import BaseModel

from src.model.database import get_db
from src.model import models
from src.utils.auth import verify_token, create_access_token, create_refresh_token, get_current_user_id, create_tokens_from_refresh_token
from src.utils.logger import log
from passlib.context import CryptContext

router = APIRouter()

# 密码哈希工具
pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

# Pydantic模型
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

class RefreshTokenRequest(BaseModel):
    refresh_token: str

@router.post('/register', response_model=dict)
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
        hashed_password=hashed_password,
        role=models.UserRole.USER  # 设置默认角色为普通用户
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    # 记录注册日志
    log.info(f"用户 {db_user} 在 {datetime.now()} 注册成功")
    return {"message": "用户创建成功"}

@router.post('/token/refresh', response_model=Token)
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

@router.post('/login', response_model=Token)
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
    user.last_login = datetime.utcnow()  # 更新最后登录时间
    db.commit()
    
    log.info(f"用户ID：{user.id} 在 {datetime.now()} 登录成功")

    return {
        "access_token": access_token, 
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "expires_at": expires_at,
        "userId": user.id
    }