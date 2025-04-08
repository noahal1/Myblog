
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'xxxx'
down_revision = 'yyyy'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('articles', sa.Column('tags', sa.String(length=255), nullable=True))


def downgrade():
    op.drop_column('articles', 'tags') 