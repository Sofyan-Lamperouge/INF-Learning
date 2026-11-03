"""Tipe bersama untuk nilai yang dibatasi (dipakai oleh beberapa schema)."""

from typing import Literal

# Status akun pengguna
StatusAkun = Literal["belum_aktif", "aktif", "nonaktif"]

# Status belajar mahasiswa pada sebuah materi (yang dikirim ke klien)
StatusBelajar = Literal["belum", "dilihat", "selesai"]

# Status progres yang boleh dikirim klien saat mencatat progres
StatusProgres = Literal["dilihat", "selesai"]
