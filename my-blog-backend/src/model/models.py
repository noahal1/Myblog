from sqlalchemy import Column, Integer, String, Boolean, Text, DateTime, ForeignKey, Table, Float
from sqlalchemy.orm import relationship, backref
from datetime import datetime

from .database import Base

class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    email = Column(String(100), unique=True, index=True)
    hashed_password = Column(String(255))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    articles = relationship("Article", back_populates="author")
    comments = relationship("Comment", back_populates="user")

class Article(Base):
    __tablename__ = 'articles'
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), index=True)
    content = Column(Text)
    summary = Column(String(500))
    author_id = Column(Integer, ForeignKey('users.id'))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    views = Column(Integer, default=0)
    likes = Column(Integer, default=0)
    comments_count = Column(Integer, default=0)
    tags = Column(String(255))
    
    author = relationship("User", back_populates="articles")
    comments = relationship("Comment", back_populates="article")
    tags_relationship = relationship('Tag', secondary='article_tags', back_populates='articles')

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
