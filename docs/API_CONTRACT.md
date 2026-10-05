# API Contract — INF-Learning

**Base URL:** `http://localhost:8000/api/v1`
**Auth:** Bearer Token (JWT)
**Format:** JSON
**Dokumentasi interaktif:** `http://localhost:8000/docs`

## Konvensi

- Nama field: `snake_case`
- Tanggal: ISO 8601 UTC (contoh: `2026-10-05T10:30:00Z`)
- Format error: `{ "detail": "pesan error" }`

## Daftar Endpoint

| Method | Endpoint | Auth | Fungsi |
|---|---|---|---|
| POST | `/auth/registrasi` | ❌ | Daftar akun baru |
| POST | `/auth/login` | ❌ | Login (belum dibuat) |
| POST | `/auth/logout` | ✅ | Logout (belum dibuat) |
| GET | `/auth/me` | ✅ | Info user login (belum dibuat) |

---

## POST /auth/registrasi

Mendaftarkan akun baru. Peran (`dosen` / `mahasiswa`) ditentukan otomatis dari pola NIM/NIP.
Lihat aturan lengkap di: [ATURAN_POLA_NIM_NIP.md](./ATURAN_POLA_NIM_NIP.md)

### Request Body

**Contoh untuk mahasiswa (NIM 10 digit):**

```json
{
  "nama": "Sari Wulandari",
  "nomor_induk": "2488010071",
  "email": "sari@example.com",
  "kata_sandi": "rahasia123",
  "konfirmasi_kata_sandi": "rahasia123"
}

---

## POST /auth/login

Login dengan `nomor_induk` dan `kata_sandi`. Mengembalikan `access_token` (JWT) yang dipakai untuk endpoint terproteksi.

### Request Body

```json
{
  "nomor_induk": "2488010071",
  "kata_sandi": "rahasia123"
}