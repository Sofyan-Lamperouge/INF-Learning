from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.crud import kuis as crud_kuis
from app.schemas.kuis import KuisCreateRequest, PertanyaanCreateRequest, PilihanJawabanCreateRequest

def buat_kuis_baru(db: Session, data: KuisCreateRequest, admin_id: int):
    return crud_kuis.create_kuis(
        db, 
        judul=data.judul, 
        deskripsi=data.deskripsi, 
        durasi_menit=data.durasi_menit, 
        dibuat_oleh=admin_id
    )

def tambah_pertanyaan_ke_kuis(db: Session, kuis_id: int, data: PertanyaanCreateRequest):
    # Cek dulu kuisnya ada atau tidak
    kuis = crud_kuis.get_kuis_by_id(db, kuis_id)
    if not kuis:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Kuis tidak ditemukan")
    
    return crud_kuis.create_pertanyaan(
        db,
        kuis_id=kuis_id,
        teks_pertanyaan=data.teks_pertanyaan,
        tipe=data.tipe,
        bobot=data.bobot,
        urutan=data.urutan
    )

def tambah_pilihan_jawaban(db: Session, pertanyaan_id: int, data: PilihanJawabanCreateRequest):
    # Cek dulu pertanyaannya ada atau tidak
    pertanyaan = crud_kuis.get_pertanyaan_by_id(db, pertanyaan_id)
    if not pertanyaan:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pertanyaan tidak ditemukan")
    
    return crud_kuis.create_pilihan(
        db,
        pertanyaan_id=pertanyaan_id,
        label=data.label,
        teks=data.teks,
        benar=data.benar
    )