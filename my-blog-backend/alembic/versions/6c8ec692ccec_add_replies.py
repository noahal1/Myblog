"""add replies

Revision ID: 6c8ec692ccec
Revises: 
Create Date: 2025-04-15 00:05:51.620073

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision: str = '6c8ec692ccec'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('articles', sa.Column('comments_count', sa.Integer(), nullable=True))
    op.drop_constraint('tags_ibfk_1', 'articles', type_='foreignkey')
    op.add_column('comments', sa.Column('reply_to_id', sa.Integer(), nullable=True))
    op.create_foreign_key(None, 'comments', 'comments', ['reply_to_id'], ['id'])
    op.alter_column('tags', 'name',
               existing_type=mysql.VARCHAR(charset='utf8mb4', collation='utf8mb4_0900_ai_ci', length=50),
               nullable=False)
    op.drop_index('name', table_name='tags')
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_index('name', 'tags', ['name'], unique=True)
    op.alter_column('tags', 'name',
               existing_type=mysql.VARCHAR(charset='utf8mb4', collation='utf8mb4_0900_ai_ci', length=50),
               nullable=True)
    op.drop_constraint(None, 'comments', type_='foreignkey')
    op.drop_column('comments', 'reply_to_id')
    op.create_foreign_key('tags_ibfk_1', 'articles', 'tags', ['tags'], ['name'], onupdate='RESTRICT', ondelete='RESTRICT')
    op.drop_column('articles', 'comments_count')
    # ### end Alembic commands ###
