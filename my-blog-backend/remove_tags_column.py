"""
移除文章表中冗余的tags字段

这个脚本将：
1. 从Article模型中移除tags字段
2. 创建数据库迁移来删除该字段
"""

from sqlalchemy import text
from src.model.database import engine, SessionLocal
from src.model.models import Article

def remove_tags_column():
    """移除文章表中的tags字段"""
    db = SessionLocal()
    try:
        # 首先检查字段是否存在
        result = db.execute(text("""
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME = 'articles' 
            AND COLUMN_NAME = 'tags'
            AND TABLE_SCHEMA = DATABASE()
        """))
        
        if result.fetchone():
            print("发现tags字段，正在删除...")
            
            # 删除tags字段
            db.execute(text("ALTER TABLE articles DROP COLUMN tags"))
            db.commit()
            
            print("✓ 成功删除articles表中的tags字段")
        else:
            print("tags字段不存在，无需删除")
            
    except Exception as e:
        print(f"删除tags字段时出错: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("开始清理冗余的tags字段...")
    remove_tags_column()
    print("清理完成！")