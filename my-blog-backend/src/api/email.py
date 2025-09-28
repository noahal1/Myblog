"""
邮件模板相关API
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

class EmailTemplateCreate(BaseModel):
    name: str
    subject: str
    content: str

class EmailTemplateResponse(BaseModel):
    id: int
    name: str
    subject: str
    content: str
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class EmailLogResponse(BaseModel):
    id: int
    to_email: str
    subject: str
    template_name: Optional[str] = None
    status: str
    error_message: Optional[str] = None
    sent_at: Optional[datetime] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

@router.get('/email-templates', response_model=List[EmailTemplateResponse])
async def get_email_templates(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """获取邮件模板列表（仅管理员）"""
    if current_user_id != 1:
        raise HTTPException(status_code=403, detail="仅管理员可以查看邮件模板")
    
    templates = db.query(models.EmailTemplate).filter(
        models.EmailTemplate.is_active == True
    ).order_by(models.EmailTemplate.created_at.desc()).offset(skip).limit(limit).all()
    
    return templates

@router.post('/email-templates', response_model=EmailTemplateResponse)
async def create_email_template(
    template: EmailTemplateCreate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """创建邮件模板（仅管理员）"""
    if current_user_id != 1:
        raise HTTPException(status_code=403, detail="仅管理员可以创建邮件模板")
    
    # 检查模板名是否已存在
    existing = db.query(models.EmailTemplate).filter(models.EmailTemplate.name == template.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="模板名称已存在")
    
    db_template = models.EmailTemplate(
        name=template.name,
        subject=template.subject,
        content=template.content
    )
    
    db.add(db_template)
    db.commit()
    db.refresh(db_template)
    
    log.info(f"管理员创建邮件模板: {template.name}")
    
    return db_template

@router.put('/email-templates/{template_id}')
async def update_email_template(
    template_id: int,
    template_update: EmailTemplateCreate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """更新邮件模板（仅管理员）"""
    if current_user_id != 1:
        raise HTTPException(status_code=403, detail="仅管理员可以更新邮件模板")
    
    template = db.query(models.EmailTemplate).filter(models.EmailTemplate.id == template_id).first()
    if not template:
        raise HTTPException(status_code=404, detail="模板不存在")
    
    # 检查新名称是否与其他模板冲突
    if template_update.name != template.name:
        existing = db.query(models.EmailTemplate).filter(
            models.EmailTemplate.name == template_update.name,
            models.EmailTemplate.id != template_id
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="模板名称已存在")
    
    template.name = template_update.name
    template.subject = template_update.subject
    template.content = template_update.content
    template.updated_at = datetime.utcnow()
    
    db.commit()
    
    return {"message": "模板已更新"}

@router.delete('/email-templates/{template_id}')
async def delete_email_template(
    template_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """删除邮件模板（仅管理员）"""
    if current_user_id != 1:
        raise HTTPException(status_code=403, detail="仅管理员可以删除邮件模板")
    
    template = db.query(models.EmailTemplate).filter(models.EmailTemplate.id == template_id).first()
    if not template:
        raise HTTPException(status_code=404, detail="模板不存在")
    
    # 软删除：标记为非活跃状态
    template.is_active = False
    db.commit()
    
    return {"message": "模板已删除"}

@router.get('/email-logs', response_model=List[EmailLogResponse])
async def get_email_logs(
    skip: int = 0,
    limit: int = 50,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """获取邮件发送日志（仅管理员）"""
    if current_user_id != 1:
        raise HTTPException(status_code=403, detail="仅管理员可以查看邮件日志")
    
    query = db.query(models.EmailLog)
    
    if status:
        query = query.filter(models.EmailLog.status == status)
    
    logs = query.order_by(models.EmailLog.created_at.desc()).offset(skip).limit(limit).all()
    
    return logs