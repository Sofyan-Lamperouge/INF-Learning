# Aturan Pola NIM/NIP — INF-Learning

Dokumen ini adalah **satu-satunya sumber kebenaran** untuk aturan pola NIM dan NIP yang dipakai di sistem INF-Learning.

## NIM (Nomor Induk Mahasiswa)

| Atribut | Nilai |
|---|---|
| Panjang | **10 digit** |
| Format | 2 digit angkatan + `88` (kode prodi Informatika) + 6 digit nomor urut |
| Regex | `^2\d88\d{6}$` |
| Peran otomatis | `mahasiswa` |

**Struktur NIM (contoh `2488010071`):**

| Digit ke- | Isi | Arti |
|---|---|---|
| 1–2 | `24` | Tahun angkatan (2024) |
| 3–4 | `88` | Kode prodi Informatika |
| 5–10 | `010071` | Nomor urut |

**Contoh valid:**
- `2488010071` (angkatan 2024)
- `2388010022` (angkatan 2023)
- `2588010099` (angkatan 2025)

**Contoh tidak valid:**
- `248801007` (9 digit)
- `24880100712` (11 digit)
- `2188010071` (bukan `88` di posisi 3–4)
- `24AB010071` (mengandung huruf)
- `2488-010071` (mengandung tanda hubung)

## NIP (Nomor Induk Pegawai)

| Atribut | Nilai |
|---|---|
| Panjang | **18 digit** |
| Format | Hanya angka (0-9) |
| Regex | `^\d{18}$` |
| Peran otomatis | `dosen` |

**Contoh valid:**
- `199008172020041001`
- `198501012010011001`

**Contoh tidak valid:**
- `19900817202004100` (17 digit)
- `1990081720200410001` (19 digit)
- `19900817-2020-041001` (ada tanda hubung)
- `ABCDEFGHIJKLMNOPQR` (huruf)

> Catatan: Validasi NIP hanya mengecek panjang dan tipe karakter (18 digit angka), tanpa memvalidasi apakah tanggal lahir / bulan pengangkatan logis. Ini untuk mengakomodasi dosen non-PNS atau NIP dengan format berbeda.

## Aturan Penentuan Peran saat Registrasi

Saat pengguna mendaftar lewat endpoint `POST /api/v1/auth/registrasi`, sistem menentukan peran secara otomatis berdasarkan pola `nomor_induk`:

1. Jika `nomor_induk` cocok dengan regex `^2\d88\d{6}$` → peran = **`mahasiswa`**
2. Jika `nomor_induk` cocok dengan regex `^\d{18}$` → peran = **`dosen`**
3. Selain itu → respons **`422 Unprocessable Entity`** dengan pesan: