# API Contract — INF-orm LMS

Dokumen kesepakatan antara Frontend & Backend.

## Base URL

- Development: `http://localhost:8000/api`
- Production: `https://api.inf-orm.com/api`

## Autentikasi

- Mekanisme: **Bearer Token** (JWT)
- Header: `Authorization: Bearer <token>`
- Token disimpan di `localStorage` frontend

## CORS

Backend harus mengizinkan origin:
- `http://localhost:5173` (dev)
- `https://inf-orm.com` (production)

---

## Endpoints

### 1. POST `/auth/registrasi`

**Request Body:**
```json
{
  "nomor_induk": "20240101",
  "kata_sandi": "HidupCokowi2#",
  "konfirmasi_kata_sandi": "HidupCokowi2#"
}