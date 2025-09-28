"""
标签相关API
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel

from src.model.database import get_db
from src.model import models
from src.utils.auth import get_current_user_id
from src.utils.cache import conditional_cache

router = APIRouter()

class TagCreate(BaseModel):
    name: str

class TagResponse(BaseModel):
    id: int
    name: str
    
    class Config:
        from_attributes = True

@router.get('/tags', response_model=list[TagResponse])
@conditional_cache(expire=300)  # 缓存5分钟
async def get_tags(db: Session = Depends(get_db)):
    """获取所有标签"""
    tags = db.query(models.Tag).all()
    return [{"id": tag.id, "name": tag.name} for tag in tags]

@router.post('/tags', response_model=TagResponse)
async def create_tag(
    tag: TagCreate, 
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """创建新标签（需要登录）"""
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