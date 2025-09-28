"""
评论相关API
"""

from fastapi import APIRouter, HTTPException, Depends, Request
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel

from src.model.database import get_db
from src.model import models
from src.utils.auth import get_current_user_id, get_current_user_id_optional
from src.utils.logger import log, api_log
from src.utils.ip_location import get_ip_location

router = APIRouter()

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
        from_attributes = True

@router.get('/articles/{article_id}/comments', response_model=list[CommentResponse])
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

@router.post('/comments', response_model=CommentResponse)
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
        
        # 为文章作者创建评论通知（如果评论者不是作者本人）
        if article.author_id != current_user_id:
            notification = models.Notification(
                user_id=article.author_id,
                type="comment",
                title="新评论通知",
                content=f"您的文章《{article.title}》收到了新评论",
                article_id=article.id,
                comment_id=db_comment.id
            )
            db.add(notification)
            log.info(f"为文章作者 {article.author_id} 创建新评论通知")
    
    # 如果是回复评论，为被回复的用户创建通知
    if comment.reply_to_id:
        parent_comment = db.query(models.Comment).filter(models.Comment.id == comment.reply_to_id).first()
        if parent_comment and parent_comment.user_id and parent_comment.user_id != current_user_id:
            notification = models.Notification(
                user_id=parent_comment.user_id,
                type="reply",
                title="新回复通知",
                content=f"您的评论收到了新回复",
                article_id=comment.article_id,
                comment_id=db_comment.id
            )
            db.add(notification)
            log.info(f"为被回复用户 {parent_comment.user_id} 创建回复通知")
        
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

@router.delete('/comments/{comment_id}')
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

@router.post('/comments/{comment_id}/like')
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