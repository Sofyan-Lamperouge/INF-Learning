"""tambah foto_url pada pengguna

Revision ID: f4a8b2c6d9e1
Revises: c3d9f1a2b7e4
Create Date: 2026-11-12 10:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'f4a8b2c6d9e1'
down_revision: Union[str, None] = 'c3d9f1a2b7e4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Foto profil (URL file di UPLOAD_DIR). Boleh kosong, jadi baris lama tidak terpengaruh.
    op.add_column('pengguna', sa.Column('foto_url', sa.String(length=500), nullable=True))


def downgrade() -> None:
    op.drop_column('pengguna', 'foto_url')
