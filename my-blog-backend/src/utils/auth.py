#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
JWT认证工具模块
"""

import os
from datetime import datetime, timedelta
from typing import Dict, Optional, Union

from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from dotenv import load_dotenv

from .logger import log

# 加载环境变量
load_dotenv()

# JWT配置
SECRET_KEY = os.getenv("JWT_SECRET_KEY")
if not SECRET_KEY:
    log.warning("未设置JWT_SECRET_KEY环境变量，使用默认密钥")
    SECRET_KEY = "noahblog_jwt_secret_key_2023"  # 默认密钥，生产环境应使用环境变量

# 添加调试日志
log.info(f"JWT配置: SECRET_KEY长度={len(SECRET_KEY) if SECRET_KEY else 0}, ALGORITHM={ALGORITHM}")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24小时

# OAuth2密码流认证
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/login")


def create_access_token(data: Dict, expires_delta: Optional[timedelta] = None) -> str:
    """创建JWT访问令牌
    
    Args:
        data: 要编码到令牌的数据
        expires_delta: 令牌过期时间
        
    Returns:
        str: 生成的JWT令牌
    """
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        
    to_encode.update({"exp": expire})
    
    # 生成JWT
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def decode_token(token: str) -> Dict:
    """解码JWT令牌
    
    Args:
        token: JWT令牌
        
    Returns:
        Dict: 解码后的令牌数据
        
    Raises:
        HTTPException: 令牌无效或过期
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError as e:
        log.error(f"JWT解码错误: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="无效的认证凭据",
            headers={"WWW-Authenticate": "Bearer"},
        )


def get_current_user_id(token: str = Depends(oauth2_scheme)) -> int:
    """从JWT令牌中获取当前用户ID
    Args:
        token: JWT令牌
    Returns:
        int: 用户ID
    Raises:
        HTTPException: 令牌无效或用户ID不存在
    """
    payload = decode_token(token)
    
    user_id = payload.get("sub")
    if not user_id:
        log.error("JWT中未包含用户ID")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="用户认证信息无效",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    try:
        # 确保user_id是整数
        return int(user_id)
    except (ValueError, TypeError):
        log.error(f"用户ID格式错误: {user_id}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="用户认证信息无效",
            headers={"WWW-Authenticate": "Bearer"},
        ) 