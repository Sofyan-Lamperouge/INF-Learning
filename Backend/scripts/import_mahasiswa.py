"""
Import data mahasiswa dari CSV ke database.

Format CSV (header wajib):
    nomor_induk,nama,angkatan

Jalankan dari folder Backend/:
    python -m scripts.import_mahasiswa
"""

import csv
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.db.session import SessionLocal
from app.models import Pengguna


CSV_PATH = Path(__file__).resolve().parents[1] / "data" / "mahasiswa.csv"
POLA_NIM = re.compile(r"^2\d88\d{6}$")


def import_csv():
    if not CSV_PATH.exists():
        print(f"[ERROR] File tidak ditemukan: {CSV_PATH}")
        return

    db = SessionLocal()
    dibuat = 0
    dilewati = 0
    gagal = 0

    try:
        with open(CSV_PATH, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)

            if not {"nomor_induk", "nama"}.issubset(reader.fieldnames or []):
                print("[ERROR] Header CSV harus ada 'nomor_induk' dan 'nama'")
                return

            for baris_ke, row in enumerate(reader, start=2):
                nomor_induk = (row.get("nomor_induk") or "").strip()
                nama = (row.get("nama") or "").strip()
                angkatan_str = (row.get("angkatan") or "").strip()

                if not nomor_induk or not nama:
                    print(f"[GAGAL] Baris {baris_ke}: nomor_induk atau nama kosong")
                    gagal += 1
                    continue

                if not POLA_NIM.match(nomor_induk):
                    print(f"[GAGAL] Baris {baris_ke}: NIM {nomor_induk} tidak cocok pola")
                    gagal += 1
                    continue

                existing = db.query(Pengguna).filter(
                    Pengguna.nomor_induk == nomor_induk
                ).first()

                if existing:
                    print(f"[SKIP]  Baris {baris_ke}: NIM {nomor_induk} sudah ada")
                    dilewati += 1
                    continue

                angkatan = int(angkatan_str) if angkatan_str.isdigit() else None

                pengguna = Pengguna(
                    peran="mahasiswa",
                    nomor_induk=nomor_induk,
                    nama=nama,
                    angkatan=angkatan,
                    kata_sandi=None,
                    status="belum_aktif",
                )
                db.add(pengguna)
                print(f"[OK]    {nomor_induk} - {nama}")
                dibuat += 1

        db.commit()
        print(f"\nSelesai: {dibuat} dibuat, {dilewati} dilewati, {gagal} gagal")

    except Exception as e:
        db.rollback()
        print(f"\nError: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    import_csv()