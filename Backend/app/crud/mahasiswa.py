from sqlalchemy.orm import Session
from app.models.pengguna import Pengguna

def get_all(db: Session, skip: int = 0, limit: int = 100):
    query = db.query(Pengguna).filter(Pengguna.peran == "mahasiswa")
    total = query.count()
    items = query.order_by(Pengguna.nomor_induk.asc()).offset(skip).limit(limit).all()
    return items, total

def get_by_id(db: Session, id: int):
    return db.query(Pengguna).filter(Pengguna.id == id, Pengguna.peran == "mahasiswa").first()

def create(db: Session, data: dict):
    mhs = Pengguna(
        peran="mahasiswa",
        nomor_induk=data["nomor_induk"],
        nama=data["nama"],
        angkatan=data.get("angkatan"),
        status="belum_aktif",
        kata_sandi=None
    )
    db.add(mhs)
    db.commit()
    db.refresh(mhs)
    return mhs

def update(db: Session, mhs: Pengguna, data: dict):
    for key, value in data.items():
        if value is not None:
            setattr(mhs, key, value)
    db.commit()
    db.refresh(mhs)
    return mhs

def delete(db: Session, mhs: Pengguna):
    db.delete(mhs)
    db.commit()