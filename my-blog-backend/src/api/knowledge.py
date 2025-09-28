"""
知识库分类相关API
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

class KnowledgeCategoryCreate(BaseModel):
    name: str
    description: Optional[str] = None
    parent_id: Optional[int] = None
    sort_order: Optional[int] = 0

class KnowledgeCategoryResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    parent_id: Optional[int] = None
    sort_order: int
    is_active: bool
    created_at: datetime
    article_count: Optional[int] = 0  # 添加文章数量
    children: Optional[List['KnowledgeCategoryResponse']] = []
    
    class Config:
        from_attributes = True

class KnowledgeCategoryUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    parent_id: Optional[int] = None
    sort_order: Optional[int] = None

@router.get('/knowledge-categories', response_model=List[KnowledgeCategoryResponse])
async def get_knowledge_categories(
    parent_id: Optional[int] = None,
    include_children: bool = True,
    include_count: bool = True,
    db: Session = Depends(get_db)
):
    """获取知识库分类列表"""
    query = db.query(models.KnowledgeCategory).filter(models.KnowledgeCategory.is_active == True)
    
    if parent_id is not None:
        query = query.filter(models.KnowledgeCategory.parent_id == parent_id)
    else:
        query = query.filter(models.KnowledgeCategory.parent_id.is_(None))
    
    categories = query.order_by(models.KnowledgeCategory.sort_order).all()
    
    # 构建响应数据
    result = []
    for category in categories:
        category_data = {
            "id": category.id,
            "name": category.name,
            "description": category.description,
            "parent_id": category.parent_id,
            "sort_order": category.sort_order,
            "is_active": category.is_active,
            "created_at": category.created_at,
            "children": [],
            "article_count": 0
        }
        
        # 获取文章数量
        if include_count:
            article_count = db.query(models.Article).filter(
                models.Article.knowledge_category_id == category.id,
                models.Article.status == "published"
            ).count()
            category_data["article_count"] = article_count
        
        # 获取子分类
        if include_children:
            children = db.query(models.KnowledgeCategory).filter(
                models.KnowledgeCategory.parent_id == category.id,
                models.KnowledgeCategory.is_active == True
            ).order_by(models.KnowledgeCategory.sort_order).all()
            
            for child in children:
                child_data = {
                    "id": child.id,
                    "name": child.name,
                    "description": child.description,
                    "parent_id": child.parent_id,
                    "sort_order": child.sort_order,
                    "is_active": child.is_active,
                    "created_at": child.created_at,
                    "children": [],
                    "article_count": 0
                }
                
                if include_count:
                    child_article_count = db.query(models.Article).filter(
                        models.Article.knowledge_category_id == child.id,
                        models.Article.status == "published"
                    ).count()
                    child_data["article_count"] = child_article_count
                
                category_data["children"].append(child_data)
        
        result.append(category_data)
    
    return result

@router.get('/knowledge-categories/all', response_model=List[KnowledgeCategoryResponse])
async def get_all_knowledge_categories(
    include_count: bool = True,
    db: Session = Depends(get_db)
):
    """获取所有知识库分类（扁平列表，用于下拉选择）"""
    categories = db.query(models.KnowledgeCategory).filter(
        models.KnowledgeCategory.is_active == True
    ).order_by(models.KnowledgeCategory.sort_order).all()
    
    result = []
    for category in categories:
        category_data = {
            "id": category.id,
            "name": category.name,
            "description": category.description,
            "parent_id": category.parent_id,
            "sort_order": category.sort_order,
            "is_active": category.is_active,
            "created_at": category.created_at,
            "children": [],
            "article_count": 0
        }
        
        # 获取文章数量
        if include_count:
            article_count = db.query(models.Article).filter(
                models.Article.knowledge_category_id == category.id,
                models.Article.status == "published"
            ).count()
            category_data["article_count"] = article_count
        
        result.append(category_data)
    
    return result

@router.post('/knowledge-categories', response_model=KnowledgeCategoryResponse)
async def create_knowledge_category(
    category: KnowledgeCategoryCreate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """创建知识库分类（登录用户可创建）"""
    # 检查分类名是否已存在
    existing = db.query(models.KnowledgeCategory).filter(
        models.KnowledgeCategory.name == category.name,
        models.KnowledgeCategory.is_active == True
    ).first()
    if existing:
        # 如果已存在，直接返回现有分类
        return {
            "id": existing.id,
            "name": existing.name,
            "description": existing.description,
            "parent_id": existing.parent_id,
            "sort_order": existing.sort_order,
            "is_active": existing.is_active,
            "created_at": existing.created_at,
            "article_count": 0,
            "children": []
        }
    
    # 如果指定了父分类，验证其是否存在
    if category.parent_id:
        parent = db.query(models.KnowledgeCategory).filter(
            models.KnowledgeCategory.id == category.parent_id,
            models.KnowledgeCategory.is_active == True
        ).first()
        if not parent:
            raise HTTPException(status_code=404, detail="父分类不存在")
    
    db_category = models.KnowledgeCategory(
        name=category.name,
        description=category.description,
        parent_id=category.parent_id,
        sort_order=category.sort_order
    )
    
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    
    log.info(f"用户 {current_user_id} 创建知识库分类: {category.name}")
    
    return {
        "id": db_category.id,
        "name": db_category.name,
        "description": db_category.description,
        "parent_id": db_category.parent_id,
        "sort_order": db_category.sort_order,
        "is_active": db_category.is_active,
        "created_at": db_category.created_at,
        "article_count": 0,
        "children": []
    }

@router.put('/knowledge-categories/{category_id}', response_model=KnowledgeCategoryResponse)
async def update_knowledge_category(
    category_id: int,
    category_update: KnowledgeCategoryUpdate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """更新知识库分类（仅管理员和编辑者）"""
    user = db.query(models.User).filter(models.User.id == current_user_id).first()
    if not user or user.role not in ["admin", "editor"]:
        raise HTTPException(status_code=403, detail="仅管理员和编辑者可以更新分类")
    
    category = db.query(models.KnowledgeCategory).filter(models.KnowledgeCategory.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="分类不存在")
    
    # 检查新名称是否与其他分类冲突
    if category_update.name and category_update.name != category.name:
        existing = db.query(models.KnowledgeCategory).filter(
            models.KnowledgeCategory.name == category_update.name,
            models.KnowledgeCategory.id != category_id,
            models.KnowledgeCategory.is_active == True
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="分类名称已存在")
    
    # 更新字段
    if category_update.name is not None:
        category.name = category_update.name
    if category_update.description is not None:
        category.description = category_update.description
    if category_update.parent_id is not None:
        category.parent_id = category_update.parent_id
    if category_update.sort_order is not None:
        category.sort_order = category_update.sort_order
    
    db.commit()
    db.refresh(category)
    
    return {
        "id": category.id,
        "name": category.name,
        "description": category.description,
        "parent_id": category.parent_id,
        "sort_order": category.sort_order,
        "is_active": category.is_active,
        "created_at": category.created_at,
        "article_count": 0,
        "children": []
    }

@router.delete('/knowledge-categories/{category_id}')
async def delete_knowledge_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """删除知识库分类（仅管理员）"""
    if current_user_id != 1:
        raise HTTPException(status_code=403, detail="仅管理员可以删除分类")
    
    category = db.query(models.KnowledgeCategory).filter(models.KnowledgeCategory.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="分类不存在")
    
    # 检查是否有子分类
    children = db.query(models.KnowledgeCategory).filter(
        models.KnowledgeCategory.parent_id == category_id,
        models.KnowledgeCategory.is_active == True
    ).count()
    if children > 0:
        raise HTTPException(status_code=400, detail="不能删除包含子分类的分类")
    
    # 检查是否有关联的文章
    articles = db.query(models.Article).filter(models.Article.knowledge_category_id == category_id).count()
    if articles > 0:
        raise HTTPException(status_code=400, detail="不能删除包含文章的分类")
    
    # 软删除：标记为非活跃状态
    category.is_active = False
    db.commit()
    
    return {"message": "分类已删除"}