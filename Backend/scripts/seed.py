"""
Seeder: bikin akun admin untuk testing.

Jalankan dari folder Backend/:
    python -m scripts.seed
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.core.security import hash_kata_sandi
from app.db.session import SessionLocal
from app.models import Pengguna


AKUN_AWAL = [
    {
        "peran": "admin",
        "nomor_induk": "ADM001",
        "nama": "Administrator",
        "kata_sandi": "admin123",
        "status": "aktif",
    },
]


def seed():
    db = SessionLocal()
    try:
        for akun in AKUN_AWAL:
            existing = db.query(Pengguna).filter(
                Pengguna.nomor_induk == akun["nomor_induk"]
            ).first()

            if existing:
                print(f"[SKIP] {akun['peran']:<10} {akun['nomor_induk']} sudah ada")
                continue

            pengguna = Pengguna(
                peran=akun["peran"],
                nomor_induk=akun["nomor_induk"],
                nama=akun["nama"],
                kata_sandi=hash_kata_sandi(akun["kata_sandi"]),
                status=akun["status"],
            )
            db.add(pengguna)
            print(f"[OK]   {akun['peran']:<10} {akun['nomor_induk']} berhasil dibuat")

        db.commit()
        print("\nSeeder selesai.")

    except Exception as e:
        db.rollback()
        print(f"\nError: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()