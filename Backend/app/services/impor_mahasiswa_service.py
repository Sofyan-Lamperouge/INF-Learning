"""Impor mahasiswa massal dari file CSV (admin).

Format CSV (baris 1 = header):
    nomor_induk,nama,angkatan          <- angkatan boleh dikosongkan / kolomnya dihilangkan

- Pemisah kolom (koma, titik koma, atau tab) dikenali otomatis, dan BOM UTF-8 dari Excel diterima.
- Nama kolom boleh memakai alias: nim, nomor induk, nama lengkap, tahun angkatan.
- Baris tidak valid atau NIM yang sudah terdaftar dilewati; baris lain tetap diproses.
- Mode simulasi hanya menghitung dan melaporkan, tanpa menyimpan apa pun.
"""

import csv
import io

from fastapi import HTTPException, UploadFile, status
from pydantic import ValidationError
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.crud import mahasiswa as crud_mhs
from app.schemas.mahasiswa import ANGKATAN_MAKS, ANGKATAN_MIN, MahasiswaCreateRequest

MAKS_BYTE = 1024 * 1024  # 1 MB
MAKS_BARIS = 2000

KOLOM_WAJIB = ("nomor_induk", "nama")

# nama kolom (huruf kecil) -> nama baku
ALIAS_KOLOM = {
    "nomor_induk": "nomor_induk",
    "nomor induk": "nomor_induk",
    "nim": "nomor_induk",
    "nama": "nama",
    "nama_lengkap": "nama",
    "nama lengkap": "nama",
    "angkatan": "angkatan",
    "tahun_angkatan": "angkatan",
    "tahun angkatan": "angkatan",
}


def _error(kode: int, detail: str) -> HTTPException:
    return HTTPException(status_code=kode, detail=detail)


def _baca_teks(file: UploadFile) -> str:
    if not (file.filename or "").lower().endswith(".csv"):
        raise _error(status.HTTP_400_BAD_REQUEST, "File harus berformat CSV (.csv)")

    mentah = file.file.read(MAKS_BYTE + 1)
    if len(mentah) > MAKS_BYTE:
        raise _error(status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, "Ukuran file maksimal 1 MB")
    if not mentah.strip():
        raise _error(status.HTTP_400_BAD_REQUEST, "File kosong")

    try:
        return mentah.decode("utf-8-sig")  # utf-8-sig membuang BOM dari Excel
    except UnicodeDecodeError:
        raise _error(
            status.HTTP_400_BAD_REQUEST,
            "File harus berenkode UTF-8 (di Excel: Save As > CSV UTF-8)",
        ) from None


def _deteksi_pemisah(teks: str) -> str:
    baris_pertama = next((b for b in teks.splitlines() if b.strip()), "")
    jumlah = {pemisah: baris_pertama.count(pemisah) for pemisah in (",", ";", "\t")}
    terbanyak = max(jumlah, key=jumlah.get)
    return terbanyak if jumlah[terbanyak] else ","


def _baca_baris(teks: str) -> list[tuple[int, dict[str, str]]]:
    """Return [(nomor baris di file, {kolom: nilai})] untuk semua baris data yang tidak kosong."""
    pembaca = csv.reader(io.StringIO(teks), delimiter=_deteksi_pemisah(teks))
    header: list[str] | None = None
    hasil: list[tuple[int, dict[str, str]]] = []

    for kolom in pembaca:
        if not any(sel.strip() for sel in kolom):
            continue  # baris kosong

        if header is None:
            header = [
                ALIAS_KOLOM.get(sel.strip().lower().replace("-", "_"), sel.strip().lower())
                for sel in kolom
            ]
            hilang = [k for k in KOLOM_WAJIB if k not in header]
            if hilang:
                raise _error(
                    status.HTTP_400_BAD_REQUEST,
                    f"Kolom wajib tidak ditemukan: {', '.join(hilang)}. "
                    f"Kolom yang terbaca: {', '.join(h for h in header if h)}",
                )
            continue

        hasil.append(
            (pembaca.line_num, dict(zip(header, (sel.strip() for sel in kolom), strict=False)))
        )

    return hasil


def _alasan(exc: ValidationError) -> str:
    """Pesan error validasi yang ramah untuk dibaca admin (Bahasa Indonesia)."""
    e = exc.errors(include_url=False, include_context=False, include_input=False)[0]
    kolom = e["loc"][0] if e["loc"] else ""
    tipe = e["type"]

    if kolom == "nomor_induk" and tipe in ("string_too_short", "string_too_long"):
        return "NIM harus 10 digit"
    if kolom == "nama" and tipe == "string_too_short":
        return "Nama minimal 3 karakter"
    if kolom == "nama" and tipe == "string_too_long":
        return "Nama maksimal 100 karakter"
    if kolom == "angkatan":
        return f"Angkatan harus antara {ANGKATAN_MIN} dan {ANGKATAN_MAKS}"
    return e["msg"].removeprefix("Value error, ")


def impor_csv(db: Session, file: UploadFile, *, simulasi: bool = False) -> dict:
    baris_data = _baca_baris(_baca_teks(file))

    if not baris_data:
        raise _error(status.HTTP_400_BAD_REQUEST, "Tidak ada baris data di file")
    if len(baris_data) > MAKS_BARIS:
        raise _error(status.HTTP_400_BAD_REQUEST, f"Maksimal {MAKS_BARIS} baris data per impor")

    masalah: list[dict] = []

    def catat(nomor: int, nim: str, status_baris: str, alasan: str) -> None:
        masalah.append(
            {"baris": nomor, "nomor_induk": nim or None, "status": status_baris, "alasan": alasan}
        )

    # 1) Validasi tiap baris + deteksi NIM dobel di dalam file
    valid: list[tuple[int, dict]] = []
    baris_pertama_nim: dict[str, int] = {}

    for nomor, row in baris_data:
        nim, nama, angkatan_teks = (
            row.get("nomor_induk", ""),
            row.get("nama", ""),
            row.get("angkatan", ""),
        )

        if not nim:
            catat(nomor, nim, "gagal", "NIM kosong")
            continue
        if not nama:
            catat(nomor, nim, "gagal", "Nama kosong")
            continue
        try:
            angkatan = int(angkatan_teks) if angkatan_teks else None
        except ValueError:
            catat(nomor, nim, "gagal", "Angkatan harus berupa angka")
            continue

        try:
            data = MahasiswaCreateRequest(nomor_induk=nim, nama=nama, angkatan=angkatan)
        except ValidationError as exc:
            catat(nomor, nim, "gagal", _alasan(exc))
            continue

        if data.nomor_induk in baris_pertama_nim:
            catat(
                nomor,
                nim,
                "dilewati",
                f"NIM dobel dengan baris {baris_pertama_nim[data.nomor_induk]}",
            )
            continue

        baris_pertama_nim[data.nomor_induk] = nomor
        valid.append((nomor, data.model_dump()))

    # 2) Lewati NIM yang sudah terdaftar di database
    sudah_ada = crud_mhs.nim_yang_sudah_ada(db, [data["nomor_induk"] for _, data in valid])
    calon: list[dict] = []
    for nomor, data in valid:
        if data["nomor_induk"] in sudah_ada:
            catat(nomor, data["nomor_induk"], "dilewati", "NIM sudah terdaftar")
        else:
            calon.append(data)

    # 3) Simpan (kecuali simulasi) dalam satu transaksi
    if calon and not simulasi:
        try:
            crud_mhs.create_banyak(db, calon)
        except IntegrityError:
            db.rollback()
            raise _error(
                status.HTTP_409_CONFLICT,
                "Ada NIM yang baru saja didaftarkan proses lain. Ulangi impor.",
            ) from None

    masalah.sort(key=lambda m: m["baris"])
    return {
        "simulasi": simulasi,
        "total_baris": len(baris_data),
        "ditambahkan": len(calon),
        "dilewati": sum(1 for m in masalah if m["status"] == "dilewati"),
        "gagal": sum(1 for m in masalah if m["status"] == "gagal"),
        "masalah": masalah,
    }
