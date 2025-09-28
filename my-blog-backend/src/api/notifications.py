"""
通知系统相关API
"""

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel

from src.model.database import get_db
from src.model import models
from src.utils.auth import get_current_user_id
from src.utils.logger import log

router = APIRouter()

class NotificationCreate(BaseModel):
    user_id: int
    type: str
    title: str
    content: str
    article_id: Optional[int] = None
    comment_id: Optional[int] = None

class NotificationResponse(BaseModel):
    id: int
    user_id: int
    type: str
    title: str
    content: str
    is_read: bool
    created_at: datetime
    article_id: Optional[int] = None
    comment_id: Optional[int] = None
    
    class Config:
        from_attributes = True

@router.get('/notifications', response_model=List[NotificationResponse])
async def get_notifications(
    skip: int = 0,
    limit: int = 50,
    unread_only: bool = False,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """获取当前用户的通知列表"""
    query = db.query(models.Notification).filter(models.Notification.user_id == current_user_id)
    
    if unread_only:
        query = query.filter(models.Notification.is_read == False)
    
    notifications = query.order_by(models.Notification.created_at.desc()).offset(skip).limit(limit).all()
    
    return notifications

@router.post('/notifications', response_model=NotificationResponse)
async def create_notification(
    notification: NotificationCreate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """创建新通知（仅管理员）"""
    if current_user_id != 1:
        raise HTTPException(status_code=403, detail="仅管理员可以创建通知")
    
    # 验证通知类型
    valid_types = ["comment", "reply", "like", "article_published", "article_approved", "article_rejected", "system"]
    if notification.type not in valid_types:
        raise HTTPException(status_code=400, detail="无效的通知类型")
    
    # 验证用户是否存在
    user = db.query(models.User).filter(models.User.id == notification.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="用户不存在")
    
    db_notification = models.Notification(
        user_id=notification.user_id,
        type=notification.type,
        title=notification.title,
        content=notification.content,
        article_id=notification.article_id,
        comment_id=notification.comment_id
    )
    
    db.add(db_notification)
    db.commit()
    db.refresh(db_notification)
    
    log.info(f"管理员创建通知: {notification.title} for user {notification.user_id}")
    
    return db_notification

@router.put('/notifications/{notification_id}/read')
async def mark_notification_read(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """标记通知为已读"""
    notification = db.query(models.Notification).filter(
        models.Notification.id == notification_id,
        models.Notification.user_id == current_user_id
    ).first()
    
    if not notification:
        raise HTTPException(status_code=404, detail="通知不存在")
    
    notification.is_read = True
    db.commit()
    
    return {"message": "通知已标记为已读"}

@router.put('/notifications/mark-all-read')
async def mark_all_notifications_read(
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """标记所有通知为已读"""
    db.query(models.Notification).filter(
        models.Notification.user_id == current_user_id,
        models.Notification.is_read == False
    ).update({"is_read": True})
    
    db.commit()
    
    return {"message": "所有通知已标记为已读"}

@router.delete('/notifications/{notification_id}')
async def delete_notification(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """删除通知"""
    notification = db.query(models.Notification).filter(
        models.Notification.id == notification_id,
        models.Notification.user_id == current_user_id
    ).first()
    
    if not notification:
        raise HTTPException(status_code=404, detail="通知不存在")
    
    db.delete(notification)
    db.commit()
    
    return {"message": "通知已删除"}

@router.get('/notifications/unread-count')
async def get_unread_notifications_count(
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """获取未读通知数量"""
    count = db.query(models.Notification).filter(
        models.Notification.user_id == current_user_id,
        models.Notification.is_read == False
    ).count()
    
    return {"unread_count": count}