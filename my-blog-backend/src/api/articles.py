"""
文章相关API
"""

from fastapi import APIRouter, HTTPException, Depends, Response
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from datetime import datetime
import math
from pydantic import BaseModel

from src.model.database import get_db
from src.model import models
from src.utils.auth import get_current_user_id, get_current_user_id_optional
from src.utils.logger import log, api_log
from src.utils.cache import conditional_cache

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
    knowledge_category_id: Optional[int] = None
    knowledge_category_name: Optional[str] = None
    
    class Config:
        from_attributes = True

class ArticleCreate(BaseModel):
    title: str
    content: str
    summary: str
    tags: list[int]
    is_knowledge_base: Optional[bool] = False
    knowledge_category_id: Optional[int] = None
    knowledge_category_name: Optional[str] = None  # 如果提供新分类名称，会自动创建

@router.get('/articles', response_model=list[ArticleResponse])
@conditional_cache(expire=300)  # 缓存5分钟
async def get_articles(
    skip: int = 0, 
    limit: int = 10, 
    knowledge_base: Optional[bool] = None, 
    category_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """获取文章列表，仅返回已发布的文章

    参数:
    - skip: 分页起始位置
    - limit: 每页显示数量
    - knowledge_base: 是否只显示知识库文章，None代表不过滤
    - category_id: 知识库分类ID过滤
    """
    # 构建基础查询
    query = db.query(models.Article).filter(models.Article.status == "published")

    # 如果指定了知识库标志，则添加过滤条件
    if knowledge_base is not None:
        query = query.filter(models.Article.is_knowledge_base == knowledge_base)
    
    # 如果指定了分类ID，则添加过滤条件
    if category_id is not None:
        query = query.filter(models.Article.knowledge_category_id == category_id)
    
    # 查询文章总数
    total_count = query.count()
    
    # 查询文章列表
    articles = query.options(
        joinedload(models.Article.tags_relationship),
        joinedload(models.Article.author),
        joinedload(models.Article.knowledge_category)
    ).order_by(models.Article.created_at.desc()).offset(skip).limit(limit).all()

    articles_data = []
    for article in articles:
        tag_names = [tag.name for tag in article.tags_relationship] if article.tags_relationship else []
        
        articles_data.append({
            'id': article.id,
            'title': article.title,
            'content': article.content,
            'summary': article.summary,
            'author_id': article.author_id,
            'author_name': article.author.username if article.author else "未知作者",
            'created_at': article.created_at.isoformat(),
            'updated_at': article.updated_at.isoformat(),
            'views': article.views,
            'likes': article.likes,
            'tags': tag_names,
            'is_knowledge_base': article.is_knowledge_base,
            'knowledge_category_id': article.knowledge_category_id,
            'knowledge_category_name': article.knowledge_category.name if article.knowledge_category else None,
            'comments_count': article.comments_count if article.comments_count is not None else 0
        })
    # 在响应头中添加分页信息
    response = JSONResponse(content=articles_data)
    response.headers["X-Total-Count"] = str(total_count)
    response.headers["X-Total-Pages"] = str(math.ceil(total_count / limit))
    return response

@router.get('/articles/{article_id}', response_model=ArticleResponse)
async def get_article(article_id: int, db: Session = Depends(get_db), current_user_id: Optional[int] = Depends(get_current_user_id_optional)):
    """获取文章详情，普通用户只能查看已发布文章，作者和管理员可查看自己的未发布文章"""
    article = db.query(models.Article).options(
        joinedload(models.Article.tags_relationship),
        joinedload(models.Article.knowledge_category)
    ).filter(models.Article.id == article_id).first()
    if article is None:
        raise HTTPException(status_code=404, detail="文章不存在")
    
    # 检查文章状态和用户权限
    # 如果文章未发布，只有作者和管理员可以查看
    if article.status != "published":
        # 未登录用户不能查看未发布文章
        if not current_user_id:
            raise HTTPException(status_code=403, detail="该文章尚未发布")
        
        # 非文章作者且非管理员不能查看未发布文章
        if current_user_id != article.author_id and current_user_id != 1:
            raise HTTPException(status_code=403, detail="该文章尚未发布")
    
    # 增加访问量
    article.views += 1
    db.commit()
    
    tag_names = [tag.name for tag in article.tags_relationship] if article.tags_relationship else []
    
    # 获取作者信息
    author = db.query(models.User).filter(models.User.id == article.author_id).first()
    author_name = author.username if author else "未知作者"
    
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
        'is_knowledge_base': article.is_knowledge_base,
        'knowledge_category_id': article.knowledge_category_id,
        'knowledge_category_name': article.knowledge_category.name if article.knowledge_category else None
    }
    return article_data

@router.post('/articles', response_model=ArticleResponse)
async def create_article(
    article: ArticleCreate, 
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """创建新文章"""
    # 记录API访问日志
    api_log.info(f"用户 {current_user_id} 正在创建文章: {article.title}")
    
    # 处理知识库分类
    knowledge_category_id = None
    if article.is_knowledge_base:
        if article.knowledge_category_name and not article.knowledge_category_id:
            # 如果提供了新分类名称，先检查是否已存在
            existing_category = db.query(models.KnowledgeCategory).filter(
                models.KnowledgeCategory.name == article.knowledge_category_name
            ).first()
            
            if existing_category:
                knowledge_category_id = existing_category.id
            else:
                # 创建新分类
                new_category = models.KnowledgeCategory(
                    name=article.knowledge_category_name,
                    description=f"自动创建的分类: {article.knowledge_category_name}"
                )
                db.add(new_category)
                db.flush()  # 获取ID但不提交
                knowledge_category_id = new_category.id
                log.info(f"用户 {current_user_id} 创建了新的知识库分类: {article.knowledge_category_name}")
        
        elif article.knowledge_category_id:
            # 验证分类是否存在
            category = db.query(models.KnowledgeCategory).filter(
                models.KnowledgeCategory.id == article.knowledge_category_id
            ).first()
            if category:
                knowledge_category_id = article.knowledge_category_id
            else:
                raise HTTPException(status_code=400, detail="指定的知识库分类不存在")
    
    # 处理标签信息
    tag_objects = []

    if article.tags:
        # 获取所有标签
        tag_objects = db.query(models.Tag).filter(models.Tag.id.in_(article.tags)).all()

    # 创建新文章，使用当前登录用户的ID
    # 所有登录用户都可以直接发布文章
    status = "published"
    
    db_article = models.Article(
        title=article.title,
        content=article.content,
        summary=article.summary,
        author_id=current_user_id,
        status=status,
        is_knowledge_base=article.is_knowledge_base,
        knowledge_category_id=knowledge_category_id
    )

    db.add(db_article)
    
    # 处理标签关联
    if tag_objects:
        # 建立标签关联
        db_article.tags_relationship = tag_objects
    
    db.commit()
    db.refresh(db_article)
    
    # 转换标签为字符串列表
    tag_names = [tag.name for tag in db_article.tags_relationship] if db_article.tags_relationship else []
    
    # 获取分类信息
    category_name = None
    if db_article.knowledge_category:
        category_name = db_article.knowledge_category.name
    
    # 创建文章日志记录
    log.info(f"用户id: {current_user_id} 在 {datetime.now()} 创建了文章 {db_article.title}")

    return {
        'id': db_article.id,
        'title': db_article.title,
        'content': db_article.content,
        'summary': db_article.summary,
        'author_id': db_article.author_id,
        'created_at': db_article.created_at.isoformat(),
        'updated_at': db_article.updated_at.isoformat(),
        'views': db_article.views,
        'likes': db_article.likes,
        'tags': tag_names,
        'is_knowledge_base': db_article.is_knowledge_base,
        'knowledge_category_id': db_article.knowledge_category_id,
        'knowledge_category_name': category_name
    }

@router.post('/articles/{article_id}/like')
async def like_article(
    article_id: int, 
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """点赞文章"""
    article = db.query(models.Article).filter(models.Article.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="文章不存在")
    
    # 增加点赞数
    if article.likes is None:
        article.likes = 0
    article.likes += 1
    
    db.commit()
    
    # 记录点赞日志
    api_log.info(f"用户 {current_user_id} 点赞了文章 {article_id}")
    
    return {"likes": article.likes}