from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel
from .user import User

class CommentBase(BaseModel):
    content: str
    article_id: int
    reply_to_id: Optional[int] = None

class CommentCreate(CommentBase):
    pass

class Comment(CommentBase):
    id: int
    user_id: Optional[int]
    created_at: datetime
    likes: int
    ip_address: Optional[str]
    location: Optional[str] = None
    user: Optional[User]
    replies: List["Comment"] = []

    class Config:
        from_attributes = True

class CommentInDB(Comment):
    pass 