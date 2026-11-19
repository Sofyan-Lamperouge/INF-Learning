"""tambah nama_file pada materi

Revision ID: a7c1d5e9b3f2
Revises: f4a8b2c6d9e1
Create Date: 2026-11-19 16:30:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'a7c1d5e9b3f2'
down_revision: Union[str, None] = 'f4a8b2c6d9e1'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Nama file asli saat diupload (unik, duplikat diberi akhiran (1), (2), ...).
    # Boleh kosong, jadi materi lama dan tautan eksternal tidak terpengaruh.
    op.add_column('materi', sa.Column('nama_file', sa.String(length=255), nullable=True))
    op.create_index(op.f('ix_materi_nama_file'), 'materi', ['nama_file'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_materi_nama_file'), table_name='materi')
    op.drop_column('materi', 'nama_file')
