from sqlalchemy.orm import Session
from app.models.kuis import Kuis, Pertanyaan, PilihanJawaban

# --- CRUD KUIS ---
def create_kuis(db: Session, *, judul: str, deskripsi: str | None, durasi_menit: int, dibuat_oleh: int):
    kuis = Kuis(judul=judul, deskripsi=deskripsi, durasi_menit=durasi_menit, dibuat_oleh=dibuat_oleh)
    db.add(kuis)
    db.commit()
    db.refresh(kuis)
    return kuis

def get_kuis_by_id(db: Session, kuis_id: int):
    return db.query(Kuis).filter(Kuis.id == kuis_id).first()

def get_all_kuis(db: Session):
    return db.query(Kuis).order_by(Kuis.dibuat_pada.desc()).all()

# --- CRUD PERTANYAAN ---
def create_pertanyaan(db: Session, *, kuis_id: int, teks_pertanyaan: str, tipe: str, bobot: int, urutan: int):
    pertanyaan = Pertanyaan(
        kuis_id=kuis_id, teks_pertanyaan=teks_pertanyaan, tipe=tipe, bobot=bobot, urutan=urutan
    )
    db.add(pertanyaan)
    db.commit()
    db.refresh(pertanyaan)
    return pertanyaan

def get_pertanyaan_by_id(db: Session, pertanyaan_id: int):
    return db.query(Pertanyaan).filter(Pertanyaan.id == pertanyaan_id).first()

# --- CRUD PILIHAN JAWABAN ---
def create_pilihan(db: Session, *, pertanyaan_id: int, label: str, teks: str, benar: bool):
    pilihan = PilihanJawaban(
        pertanyaan_id=pertanyaan_id, label=label, teks=teks, benar=benar
    )
    db.add(pilihan)
    db.commit()
    db.refresh(pilihan)
    return pilihan