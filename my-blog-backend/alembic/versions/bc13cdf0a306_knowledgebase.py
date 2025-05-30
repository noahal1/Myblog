"""knowledgebase

Revision ID: bc13cdf0a306
Revises: 1ba18bfc43f5
Create Date: 2025-05-22 08:00:09.704088

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'bc13cdf0a306'
down_revision: Union[str, None] = '1ba18bfc43f5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('articles', sa.Column('is_knowledge_base', sa.Boolean(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('articles', 'is_knowledge_base')
    # ### end Alembic commands ###
