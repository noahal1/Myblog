"""
管理员相关API
"""

from fastapi import APIRouter, HTTPException, Depends, Query
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, desc
from typing import List, Optional, Dict, Union, Any
from datetime import datetime, timedelta
from pydantic import BaseModel
import math

from src.model.database import get_db
from src.model import models
from src.utils.auth import get_current_user_id
from src.utils.logger import log, api_log

router = APIRouter()

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
    is_knowledge_base: Optional[bool] = False
    
    class Config:
        from_attributes = True

class ArticleCreate(BaseModel):
    title: str
    content: str
    summary: str
    tags: list[int]
    is_knowledge_base: Optional[bool] = False

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
        from_attributes = True

class VisitorStatsResponse(BaseModel):
    total_visits: int
    unique_ips: int
    average_response_time: float
    path_stats: dict
    ip_stats: dict

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    role: str
    is_active: bool
    is_verified: bool
    created_at: datetime
    last_login: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class UserRoleUpdate(BaseModel):
    role: str

# 访问记录API端点
@router.get('/visitor-logs', response_model=List[VisitorLogResponse])
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
    
    # 设置响应头，包含总数信息
    response = JSONResponse(content=[{
        "id": log.id,
        "ip_address": log.ip_address,
        "user_agent": log.user_agent,
        "path": log.path,
        "method": log.method,
        "status_code": log.status_code,
        "user_id": log.user_id,
        "request_time": log.request_time.isoformat() if log.request_time else None,
        "process_time": log.process_time,
        "referer": log.referer
    } for log in logs])
    response.headers["X-Total-Count"] = str(total)
    
    return response

@router.get('/visitor-stats', response_model=VisitorStatsResponse)
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
@router.get('/ip-geolocation')
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
@router.get('/articles', response_model=list[ArticleResponse])
async def get_admin_articles(
    skip: int = 0, 
    limit: int = 10, 
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """获取文章列表（管理员版，可按状态筛选）"""
    # 检查当前用户是否为管理员（ID为1）
    if current_user_id != 1:
        raise HTTPException(status_code=403, detail="仅管理员可以访问此功能")
    
    # 构建基础查询
    query = db.query(models.Article).options(
        joinedload(models.Article.tags_relationship),
        joinedload(models.Article.author)
    )
    
    # 如果指定了状态，进行过滤
    if status:
        query = query.filter(models.Article.status == status)
    
    # 获取总数
    total_count = query.count()
    
    # 分页和排序
    articles = query.order_by(
        models.Article.created_at.desc()
    ).offset(skip).limit(limit).all()
    
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
    
    # 设置响应头，包含总数信息
    response = JSONResponse(content=articles_data)
    response.headers["X-Total-Count"] = str(total_count)
    
    return response

@router.get('/articles/to-process', response_model=list[ArticleResponse])
async def get_to_process_articles(
    skip: int = 0, 
    limit: int = 10, 
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """获取需要处理的文章（待审核+已拒绝）"""
    # 检查当前用户是否为管理员（ID为1）
    if current_user_id != 1:
        raise HTTPException(status_code=403, detail="仅管理员可以访问此功能")
    
    # 查询待审核和已拒绝的文章
    query = db.query(models.Article).filter(
        models.Article.status.in_(["pending", "rejected"])
    ).options(
        joinedload(models.Article.tags_relationship),
        joinedload(models.Article.author)
    )
    
    # 获取总数
    total_count = query.count()
    
    # 获取文章并按创建时间排序
    articles = query.order_by(
        models.Article.created_at.desc()
    ).offset(skip).limit(limit).all()
    
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
    
    # 设置响应头，包含总数信息
    response = JSONResponse(content=articles_data)
    response.headers["X-Total-Count"] = str(total_count)
    
    return response

@router.get('/articles/{article_id}', response_model=ArticleResponse)
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
        'status': article.status,
        'is_knowledge_base': article.is_knowledge_base
    }
    
    return article_data

@router.put('/articles/{article_id}', response_model=ArticleResponse)
async def update_article_detail(
    article_id: int,
    article_update: ArticleCreate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """更新文章详情（仅管理员）"""
    # 检查当前用户是否为管理员（ID为1）
    if current_user_id != 1:
        raise HTTPException(status_code=403, detail="仅管理员可以更新文章")

    # 查找文章
    article = db.query(models.Article).options(joinedload(models.Article.tags_relationship)).filter(models.Article.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="文章不存在")

    # 记录API访问日志
    api_log.info(f"管理员 {current_user_id} 正在更新文章: {article_id}")

    # 处理标签
    tag_objects = []

    if article_update.tags:
        # 获取所有标签
        tag_objects = db.query(models.Tag).filter(models.Tag.id.in_(article_update.tags)).all()

    # 更新文章字段
    article.title = article_update.title
    article.content = article_update.content
    article.summary = article_update.summary
    article.is_knowledge_base = article_update.is_knowledge_base
    article.updated_at = datetime.utcnow()

    # 更新标签关联
    article.tags_relationship = tag_objects

    db.commit()
    db.refresh(article)

    # 获取作者信息
    author = db.query(models.User).filter(models.User.id == article.author_id).first()
    author_name = author.username if author else "未知作者"

    # 转换标签为字符串列表
    tag_names = [tag.name for tag in article.tags_relationship] if article.tags_relationship else []

    # 记录更新日志
    log.info(f"管理员 {current_user_id} 在 {datetime.now()} 更新了文章 {article.title}")

    return {
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
        'status': article.status,
        'is_knowledge_base': article.is_knowledge_base
    }

@router.put('/articles/{article_id}/status')
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
    old_status = article.status
    article.status = status
    db.commit()
    
    # 如果状态发生变化，创建通知
    if old_status != status and article.author_id != current_user_id:
        notification_title = ""
        notification_content = ""
        notification_type = ""
        
        if status == "published":
            notification_title = "文章审核通过"
            notification_content = f"您的文章《{article.title}》已通过审核并发布"
            notification_type = "article_approved"
        elif status == "rejected":
            notification_title = "文章审核未通过"
            notification_content = f"您的文章《{article.title}》未通过审核，请修改后重新提交"
            notification_type = "article_rejected"
        
        if notification_title:
            notification = models.Notification(
                user_id=article.author_id,
                type=notification_type,
                title=notification_title,
                content=notification_content,
                article_id=article.id
            )
            db.add(notification)
            db.commit()
            log.info(f"为用户 {article.author_id} 创建文章状态变更通知: {notification_title}")
    
    # 返回成功信息
    return {"message": "文章状态已更新", "article_id": article_id, "status": status}

# 用户角色管理API
@router.get('/users', response_model=List[UserResponse])
async def get_users(
    skip: int = 0,
    limit: int = 50,
    role: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """获取用户列表（仅管理员）"""
    if current_user_id != 1:
        raise HTTPException(status_code=403, detail="仅管理员可以查看用户列表")
    
    query = db.query(models.User)
    
    if role:
        query = query.filter(models.User.role == role)
    
    users = query.order_by(models.User.created_at.desc()).offset(skip).limit(limit).all()
    
    return users

@router.get('/users/{user_id}', response_model=UserResponse)
async def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """获取用户详情（管理员或用户本人）"""
    if current_user_id != 1 and current_user_id != user_id:
        raise HTTPException(status_code=403, detail="无权访问其他用户信息")
    
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="用户不存在")
    
    return user

@router.put('/users/{user_id}/role')
async def update_user_role(
    user_id: int,
    role_update: UserRoleUpdate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """更新用户角色（仅管理员）"""
    if current_user_id != 1:
        raise HTTPException(status_code=403, detail="仅管理员可以更新用户角色")
    
    # 验证角色值
    valid_roles = ["admin", "editor", "user"]
    if role_update.role not in valid_roles:
        raise HTTPException(status_code=400, detail="无效的角色值")
    
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="用户不存在")
    
    # 防止管理员修改自己的角色
    if user_id == 1:
        raise HTTPException(status_code=403, detail="不能修改主管理员的角色")
    
    user.role = role_update.role
    db.commit()
    
    log.info(f"管理员更新用户 {user_id} 角色为 {role_update.role}")
    
    return {"message": "用户角色已更新", "user_id": user_id, "new_role": role_update.role}