"""
数据库迁移脚本：为知识库功能添加新字段
运行此脚本来更新现有数据库结构
"""

from sqlalchemy import text
from src.model.database import engine

def migrate_knowledge_base_features():
    """迁移知识库功能"""
    
migration_queries = [
    # 为articles表添加knowledge_category_id字段
    """
    ALTER TABLE articles 
    ADD COLUMN knowledge_category_id INT NULL,
    ADD FOREIGN KEY (knowledge_category_id) REFERENCES knowledge_categories(id)
    """,
    
    # 创建索引提高查询性能
    """
    CREATE INDEX idx_articles_knowledge_category ON articles(knowledge_category_id)
    """,
    
    # 创建索引提高知识库文章查询性能
    """
    CREATE INDEX idx_articles_knowledge_base ON articles(is_knowledge_base, status)
    """
]

def run_migration():
    """执行迁移"""
    try:
        with engine.connect() as connection:
            for query in migration_queries:
                try:
                    connection.execute(text(query))
                    print(f"✅ 执行成功: {query[:50]}...")
                except Exception as e:
                    print(f"⚠️  跳过已存在的更改: {str(e)}")
            
            connection.commit()
            print("🎉 数据库迁移完成！")
            
    except Exception as e:
        print(f"❌ 迁移失败: {str(e)}")

if __name__ == "__main__":
    run_migration()