"""Aturan validasi yang dipakai di banyak tempat (satu sumber kebenaran)."""

import re

# NIM mahasiswa: 10 digit, diawali "2", digit ke-3 dan ke-4 adalah "88". Contoh: 2488010071.
POLA_NIM = re.compile(r"^2\d88\d{6}$")


def validasi_nim(nilai: str) -> str:
    """Buang spasi di tepi lalu pastikan formatnya NIM mahasiswa. Dipakai di validator pydantic."""
    nilai = nilai.strip()
    if not POLA_NIM.match(nilai):
        raise ValueError("Format NIM tidak dikenali")
    return nilai
