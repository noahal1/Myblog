#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
JWT认证工具模块
"""
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from dotenv import load_dotenv
from pydantic import BaseModel
import os
from datetime import datetime, timedelta
from typing import Dict, Optional, Union

from .logger import log

# 加载环境变量
load_dotenv()

# JWT配置
SECRET_KEY = os.getenv("JWT_SECRET")
if not SECRET_KEY:
    # 在开发环境可以使用随机生成的密钥，但在生产环境中必须通过环境变量设置
    if os.getenv("ENVIRONMENT", "development") == "production":
        raise ValueError("在生产环境中必须设置JWT_SECRET环境变量")
    else:
        import secrets
        SECRET_KEY = secrets.token_hex(32)
        print("警告: 使用随机生成的JWT密钥，这在生产环境中是不安全的")

ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))  # 默认24小时
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("JWT_REFRESH_TOKEN_EXPIRE_DAYS", "30"))  # 刷新令牌有效期30天

# OAuth2密码流认证
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/token", auto_error=False)

# Token响应模型
class Token(BaseModel):
    access_token: str
    refresh_token: Optional[str] = None
    token_type: str
    expires_at: int  # UNIX时间戳，表示过期时间

# Token数据模型
class TokenData(BaseModel):
    user_id: Optional[str] = None
    exp: Optional[datetime] = None

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """创建JWT访问令牌
    
    Args:
        data: 要编码到令牌的数据
        expires_delta: 令牌过期时间
        
    Returns:
        str: 生成的JWT令牌
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt, int(expire.timestamp())

def create_refresh_token(data: dict):
    """创建刷新令牌
    
    Args:
        data: 要编码到令牌的数据
        
    Returns:
        str: 生成的刷新令牌
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "refresh": True})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def create_tokens_from_refresh_token(refresh_token: str):
    """从刷新令牌创建新的访问令牌
    
    Args:
        refresh_token: 刷新令牌
        
    Returns:
        dict: 新的访问令牌和刷新令牌
    """
    try:
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        is_refresh = payload.get("refresh", False)
        
        if not user_id or not is_refresh:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="无效的刷新令牌",
                headers={"WWW-Authenticate": "Bearer"},
            )
            
        # 创建新的访问令牌
        access_token, expires_at = create_access_token({"sub": user_id})
        
        # 创建新的刷新令牌
        new_refresh_token = create_refresh_token({"sub": user_id})
        
        return {
            "access_token": access_token,
            "refresh_token": new_refresh_token,
            "token_type": "bearer",
            "expires_at": expires_at
        }
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="无效的刷新令牌",
            headers={"WWW-Authenticate": "Bearer"},
        )

def verify_token(token: str):
    """验证令牌并提取用户ID
    
    Args:
        token: JWT令牌
        
    Returns:
        TokenData: 令牌数据
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="无法验证凭证",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        token_data = TokenData(user_id=user_id, exp=datetime.fromtimestamp(payload.get("exp")))
        return token_data
    except JWTError:
        raise credentials_exception

async def get_current_user_id(token: str = Depends(oauth2_scheme)) -> int:
    """从JWT令牌中获取当前用户ID
    Args:
        token: JWT令牌
    Returns:
        int: 用户ID
    Raises:
        HTTPException: 令牌无效或用户ID不存在
    """
    if not token:
        log.error("未提供JWT令牌")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="未提供认证信息",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    try:
        token_data = verify_token(token)
        
        user_id = token_data.user_id
        if not user_id:
            log.error("JWT中未包含用户ID")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="用户认证信息无效",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # 确保user_id是整数
        return int(user_id)
    except JWTError as e:
        log.error(f"JWT解析错误: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="无效的认证令牌",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except (ValueError, TypeError) as e:
        log.error(f"用户ID格式错误: {user_id}, 错误: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="用户认证信息无效",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        log.error(f"验证令牌时发生未知错误: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="认证过程中发生错误",
            headers={"WWW-Authenticate": "Bearer"},
        )

# 检查令牌是否接近过期
def is_token_about_to_expire(token: str, threshold_minutes: int = 30):
    """检查令牌是否接近过期（默认阈值为30分钟）"""
    try:
        token_data = verify_token(token)
        if token_data.exp:
            time_remaining = token_data.exp - datetime.utcnow()
            return time_remaining < timedelta(minutes=threshold_minutes)
        return False
    except:
        return True  # 如果验证失败，视为需要刷新 

async def get_current_user_id_optional(token: str = Depends(oauth2_scheme)) -> Optional[int]:
    """从JWT令牌中获取当前用户ID，如果令牌无效则返回None
    
    Args:
        token: JWT令牌
    
    Returns:
        Optional[int]: 用户ID，如果令牌无效则为None
    """
    if not token:
        return None
        
    try:
        token_data = verify_token(token)
        user_id = token_data.user_id
        if not user_id:
            return None
        
        # 确保user_id是整数
        return int(user_id)
    except JWTError as e:
        log.warning(f"JWT解析错误: {str(e)}")
        return None
    except Exception as e:
        log.warning(f"获取用户ID时发生错误: {str(e)}")
        # 如果验证失败，返回None
        return None 