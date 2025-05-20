from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..schema.comment import Comment, CommentCreate
from ..model.models import Comment as CommentModel
from ..utils.auth import get_current_user_id_optional
from ..model.models import User
from ..utils.ip_location import get_ip_location

router = APIRouter()

@router.post("/comments/", response_model=Comment)
def create_comment(
    comment: CommentCreate,
    request: Request,
    db: Session = Depends(get_db),
    current_user_id: Optional[int] = Depends(get_current_user_id_optional)
):
    # 获取客户端IP地址
    ip_address = request.client.host
    
    # 如果有X-Forwarded-For头，使用它获取真实IP
    forwarded_for = request.headers.get("X-Forwarded-For")
    if forwarded_for:
        # 取第一个IP地址，即最原始的客户端IP
        ip_address = forwarded_for.split(",")[0].strip()
    
    # 查询IP地址对应的地理位置
    location_info = get_ip_location(ip_address)
    location = f"{location_info['province']}"  # 只显示省份
    
    db_comment = CommentModel(
        content=comment.content,
        article_id=comment.article_id,
        user_id=current_user_id,
        reply_to_id=comment.reply_to_id,
        ip_address=ip_address,
        location=location
    )
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment

@router.get("/comments/{article_id}", response_model=List[Comment])
def get_comments(article_id: int, db: Session = Depends(get_db)):
    comments = db.query(CommentModel).filter(
        CommentModel.article_id == article_id,
        CommentModel.reply_to_id == None
    ).all()
    return comments

@router.get("/comments/{comment_id}/replies", response_model=List[Comment])
def get_replies(comment_id: int, db: Session = Depends(get_db)):
    replies = db.query(CommentModel).filter(
        CommentModel.reply_to_id == comment_id
    ).all()
    return replies 