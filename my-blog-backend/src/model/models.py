from sqlalchemy import Column, Integer, String, Boolean, Text, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

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
    tags = Column(String(255))
    
    author = relationship("User", back_populates="articles")
    comments = relationship("Comment", back_populates="article")
    tags_relationship = relationship('Tag', secondary='article_tags', back_populates='articles')

class Comment(Base):
    __tablename__ = 'comments'
    
    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text)
    user_id = Column(Integer, ForeignKey('users.id'))
    article_id = Column(Integer, ForeignKey('articles.id'))
    created_at = Column(DateTime, default=datetime.utcnow)
    likes = Column(Integer, default=0)
    
    user = relationship("User", back_populates="comments")
    article = relationship("Article", back_populates="comments")

class Tag(Base):
    __tablename__ = 'tags'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False)
    
    articles = relationship('Article', secondary='article_tags', back_populates='tags_relationship')
