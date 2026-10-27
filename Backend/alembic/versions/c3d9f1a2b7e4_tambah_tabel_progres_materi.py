"""tambah tabel progres_materi

Revision ID: c3d9f1a2b7e4
Revises: ab127c07a6a7
Create Date: 2026-10-27 10:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = 'c3d9f1a2b7e4'
down_revision: Union[str, None] = 'ab127c07a6a7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'progres_materi',
        sa.Column('id', sa.BigInteger(), autoincrement=True, nullable=False),
        sa.Column('pengguna_id', sa.BigInteger(), nullable=False),
        sa.Column('materi_id', sa.BigInteger(), nullable=False),
        sa.Column('status', sa.String(length=20), nullable=False),
        sa.Column('dibuat_pada', sa.DateTime(), nullable=False),
        sa.Column('diubah_pada', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['pengguna_id'], ['pengguna.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['materi_id'], ['materi.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('pengguna_id', 'materi_id', name='uq_progres_pengguna_materi'),
    )
    op.create_index(op.f('ix_progres_materi_pengguna_id'), 'progres_materi', ['pengguna_id'], unique=False)
    op.create_index(op.f('ix_progres_materi_materi_id'), 'progres_materi', ['materi_id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_progres_materi_materi_id'), table_name='progres_materi')
    op.drop_index(op.f('ix_progres_materi_pengguna_id'), table_name='progres_materi')
    op.drop_table('progres_materi')
