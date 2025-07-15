from sqlalchemy import Column, Integer, String, Boolean, Text, DateTime, ForeignKey, Table, Float, Enum as SQLEnum
from sqlalchemy.orm import relationship, backref
from datetime import datetime
from enum import Enum

from .database import Base

class UserRole(str, Enum):
    ADMIN = "admin"
    EDITOR = "editor"
    USER = "user"

class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(SQLEnum(UserRole), default=UserRole.USER, nullable=False)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    failed_login_attempts = Column(Integer, default=0)
    locked_until = Column(DateTime, nullable=True)
    last_login = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # 密码重置相关
    reset_token = Column(String(255), nullable=True)
    reset_token_expires = Column(DateTime, nullable=True)
    
    # 邮箱验证相关
    verification_token = Column(String(255), nullable=True)
    verification_token_expires = Column(DateTime, nullable=True)
    
    articles = relationship("Article", back_populates="author")
    comments = relationship("Comment", back_populates="user")
    notifications = relationship("Notification", back_populates="user")

class Article(Base):
    __tablename__ = 'articles'
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), index=True, nullable=False)
    content = Column(Text, nullable=False)
    summary = Column(String(500))
    author_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    views = Column(Integer, default=0)
    likes = Column(Integer, default=0)
    comments_count = Column(Integer, default=0)
    tags = Column(String(255))
    status = Column(String(20), default="pending")  
    is_knowledge_base = Column(Boolean, default=False)
    
    # 知识库增强字段
    knowledge_category = Column(String(100), nullable=True)  # 知识分类
    knowledge_difficulty = Column(String(20), default="beginner")  # 难度级别
    knowledge_tags = Column(Text, nullable=True)  # JSON格式的标签
    reading_time = Column(Integer, default=0)  # 预估阅读时间（分钟）
    
    # SEO优化字段
    seo_keywords = Column(String(255), nullable=True)
    seo_description = Column(String(160), nullable=True)
    slug = Column(String(200), unique=True, nullable=True)  # URL友好的标识符
    
    author = relationship("User", back_populates="articles")
    comments = relationship("Comment", back_populates="article")
    tags_relationship = relationship('Tag', secondary='article_tags', back_populates='articles')
    
    # 添加索引
    __table_args__ = (
        {'mysql_engine': 'InnoDB', 'mysql_charset': 'utf8mb4'},
    )

class Comment(Base):
    __tablename__ = 'comments'
    
    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    article_id = Column(Integer, ForeignKey("articles.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    likes = Column(Integer, default=0)
    reply_to_id = Column(Integer, ForeignKey("comments.id"), nullable=True)
    ip_address = Column(String(45), nullable=True)  # IPv6地址最长45个字符
    location = Column(String(50), nullable=True)  # 地理位置信息
    
    article = relationship("Article", back_populates="comments")
    user = relationship("User", back_populates="comments")
    parent = relationship("Comment", remote_side=[id], backref="replies")

class Tag(Base):
    __tablename__ = 'tags'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False)
    
    articles = relationship('Article', secondary='article_tags', back_populates='tags_relationship')

# 添加文章与标签的多对多关系表
article_tags = Table(
    'article_tags',
    Base.metadata,
    Column('article_id', Integer, ForeignKey('articles.id'), primary_key=True),
    Column('tag_id', Integer, ForeignKey('tags.id'), primary_key=True)
)

# 添加访问记录模型
class VisitorLog(Base):
    __tablename__ = 'visitor_logs'
    
    id = Column(Integer, primary_key=True, index=True)
    ip_address = Column(String(50), index=True)
    user_agent = Column(String(255))
    path = Column(String(255))
    method = Column(String(10))
    status_code = Column(Integer)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    request_time = Column(DateTime, default=datetime.utcnow)
    process_time = Column(Float)
    referer = Column(String(255), nullable=True)
    
    # 与用户表的关联关系
    user = relationship("User", backref="access_logs")

# 通知系统模型
class NotificationType(str, Enum):
    COMMENT = "comment"  # 评论通知
    REPLY = "reply"      # 回复通知
    LIKE = "like"        # 点赞通知
    ARTICLE_PUBLISHED = "article_published"  # 文章发布通知
    ARTICLE_APPROVED = "article_approved"    # 文章审核通过通知
    ARTICLE_REJECTED = "article_rejected"    # 文章审核拒绝通知
    SYSTEM = "system"    # 系统通知

class Notification(Base):
    __tablename__ = 'notifications'
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    type = Column(SQLEnum(NotificationType), nullable=False)
    title = Column(String(200), nullable=False)
    content = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # 关联对象ID（可选）
    article_id = Column(Integer, ForeignKey('articles.id'), nullable=True)
    comment_id = Column(Integer, ForeignKey('comments.id'), nullable=True)
    
    user = relationship("User", back_populates="notifications")
    article = relationship("Article", backref="notifications")
    comment = relationship("Comment", backref="notifications")

# 知识库分类模型
class KnowledgeCategory(Base):
    __tablename__ = 'knowledge_categories'
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    parent_id = Column(Integer, ForeignKey('knowledge_categories.id'), nullable=True)
    sort_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # 自引用关系
    parent = relationship("KnowledgeCategory", remote_side=[id], backref="children")

# 邮件模板模型
class EmailTemplate(Base):
    __tablename__ = 'email_templates'
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    subject = Column(String(200), nullable=False)
    content = Column(Text, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# 邮件发送记录
class EmailLog(Base):
    __tablename__ = 'email_logs'
    
    id = Column(Integer, primary_key=True, index=True)
    to_email = Column(String(100), nullable=False)
    subject = Column(String(200), nullable=False)
    template_name = Column(String(100), nullable=True)
    status = Column(String(20), default="pending")  # pending, sent, failed
    error_message = Column(Text, nullable=True)
    sent_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
