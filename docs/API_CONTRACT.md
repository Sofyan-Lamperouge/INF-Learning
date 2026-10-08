# INF-Learning API Contract

**Version:** 1.0.0
**Status:** Draft / Development
**Backend:** FastAPI
**Frontend:** React + Vite
**Database:** MySQL

---

# 1. Tujuan

Dokumen ini merupakan kontrak komunikasi antara **Frontend** dan **Backend** pada aplikasi INF-Learning.

API Contract digunakan sebagai acuan bersama mengenai:

* URL endpoint
* HTTP method
* request body
* response body
* HTTP status code
* authentication
* authorization
* format error
* nama field JSON
* tipe data
* aturan penggunaan token

Frontend dan Backend harus mengikuti kontrak ini agar perubahan pada salah satu bagian tidak menyebabkan ketidaksesuaian komunikasi.

---

# 2. Arsitektur Komunikasi

```text
┌─────────────────────────┐
│        FRONTEND         │
│                         │
│ React + Vite            │
│                         │
│ Pages                   │
│ Components              │
│ Context                 │
│ Services                │
└────────────┬────────────┘
             │
             │ HTTP / JSON
             │
             ▼
┌─────────────────────────┐
│         BACKEND         │
│                         │
│ FastAPI                 │
│                         │
│ Router                  │
│ Schema                  │
│ Service                 │
│ CRUD                    │
└────────────┬────────────┘
             │
             │ SQLAlchemy
             ▼
┌─────────────────────────┐
│          MYSQL          │
└─────────────────────────┘
```

Frontend **tidak diperbolehkan mengakses database secara langsung**.

Komunikasi hanya dilakukan melalui REST API Backend.

---

# 3. Base URL

## Development

```text
http://localhost:8000
```

API menggunakan prefix:

```text
/api/v1
```

Sehingga seluruh endpoint API memiliki format:

```text
http://localhost:8000/api/v1/{endpoint}
```

Contoh:

```text
http://localhost:8000/api/v1/auth/login
```

---

# 4. Frontend Development Proxy

Pada development, Frontend menggunakan Vite Proxy.

Frontend memanggil:

```text
/api/v1/auth/login
```

Vite meneruskannya ke:

```text
http://localhost:8000/api/v1/auth/login
```

Konfigurasi:

```javascript
server: {
    proxy: {
        "/api": {
            target: "http://localhost:8000",
            changeOrigin: true
        }
    }
}
```

Dengan konfigurasi ini Frontend tidak perlu menulis:

```text
http://localhost:8000
```

di setiap service.

---

# 5. Format Data

Request dan response API menggunakan:

```http
Content-Type: application/json
```

Format JSON menggunakan:

```text
snake_case
```

Contoh:

```json
{
    "nomor_induk": "2488010001",
    "kata_sandi": "Password123!"
}
```

Bukan:

```json
{
    "nomorInduk": "2488010001",
    "kataSandi": "Password123!"
}
```

---

# 6. Authentication

API menggunakan:

```text
JWT Bearer Token
```

Setelah login berhasil, Backend mengembalikan:

```json
{
    "access_token": "JWT_TOKEN",
    "token_type": "bearer",
    "expires_in": 900
}
```

Frontend harus menyimpan token tersebut dan menggunakannya untuk endpoint yang membutuhkan authentication.

Header:

```http
Authorization: Bearer JWT_TOKEN
```

Contoh:

```http
GET /api/v1/auth/me

Authorization: Bearer eyJhbGciOiJIUzI1Ni...
```

---

# 7. Token Expiration

Access token berlaku selama:

```text
15 menit
```

Nilai:

```text
ACCESS_TOKEN_EXPIRE_MINUTES=15
```

Frontend harus menangani:

```http
401 Unauthorized
```

Jika token sudah tidak valid:

1. Hapus token dari localStorage.
2. Hapus role.
3. Hapus user session.
4. Arahkan user ke halaman login.

---

# 8. Role Pengguna

Role yang digunakan:

```text
mahasiswa
dosen
```

Role ditentukan berdasarkan format nomor induk pada proses registrasi.

---

# 9. HTTP Status Code

API menggunakan status code berikut:

| Status | Arti                               |
| ------ | ---------------------------------- |
| `200`  | Request berhasil                   |
| `201`  | Data berhasil dibuat               |
| `400`  | Request tidak valid                |
| `401`  | Belum login / token tidak valid    |
| `403`  | Tidak memiliki hak akses           |
| `404`  | Data atau endpoint tidak ditemukan |
| `409`  | Data konflik / sudah tersedia      |
| `422`  | Validation error                   |
| `500`  | Internal server error              |

---

# 10. Authentication API

## 10.1 Register

### Endpoint

```http
POST /api/v1/auth/registrasi
```

### Authentication

Tidak diperlukan.

### Request

```json
{
    "nama": "Budi Santoso",
    "nomor_induk": "2488010001",
    "email": "budi@example.com",
    "kata_sandi": "Password123!",
    "konfirmasi_kata_sandi": "Password123!"
}
```

### Field

| Field                   | Type   | Required | Keterangan          |
| ----------------------- | ------ | -------- | ------------------- |
| `nama`                  | string | Ya       | Nama lengkap        |
| `nomor_induk`           | string | Ya       | NIM/NIP             |
| `email`                 | string | Ya       | Email pengguna      |
| `kata_sandi`            | string | Ya       | Minimal 8 karakter  |
| `konfirmasi_kata_sandi` | string | Ya       | Konfirmasi password |

### Success

Status:

```http
201 Created
```

Response:

```json
{
    "id": 1,
    "peran": "mahasiswa",
    "nomor_induk": "2488010001",
    "nama": "Budi Santoso",
    "email": "budi@example.com",
    "status": "aktif",
    "dibuat_pada": "2026-10-08T00:00:00"
}
```

### Error — Nomor induk sudah digunakan

Status:

```http
409 Conflict
```

Response:

```json
{
    "detail": "Nomor induk sudah terdaftar"
}
```

### Error — Email sudah digunakan

Status:

```http
409 Conflict
```

Response:

```json
{
    "detail": "Email sudah terdaftar"
}
```

### Error — Password tidak sama

Status:

```http
422 Unprocessable Entity
```

Response:

```json
{
    "detail": [
        {
            "type": "value_error",
            "loc": [
                "body"
            ],
            "msg": "Konfirmasi kata sandi tidak cocok"
        }
    ]
}
```

---

# 11. Login

## Endpoint

```http
POST /api/v1/auth/login
```

### Authentication

Tidak diperlukan.

### Request

```json
{
    "nomor_induk": "2488010001",
    "kata_sandi": "Password123!"
}
```

### Field

| Field         | Type   | Required |
| ------------- | ------ | -------- |
| `nomor_induk` | string | Ya       |
| `kata_sandi`  | string | Ya       |

### Success

Status:

```http
200 OK
```

Response:

```json
{
    "access_token": "JWT_TOKEN",
    "token_type": "bearer",
    "expires_in": 900,
    "pengguna": {
        "id": 1,
        "peran": "mahasiswa",
        "nomor_induk": "2488010001",
        "nama": "Budi Santoso",
        "email": "budi@example.com",
        "status": "aktif"
    }
}
```

### Error

Status:

```http
401 Unauthorized
```

Response:

```json
{
    "detail": "Nomor induk atau kata sandi salah"
}
```

---

# 12. Current User

Endpoint digunakan Frontend untuk memeriksa session ketika aplikasi dibuka atau browser di-refresh.

### Endpoint

```http
GET /api/v1/auth/me
```

### Authentication

Required.

Header:

```http
Authorization: Bearer JWT_TOKEN
```

### Success

Status:

```http
200 OK
```

Response:

```json
{
    "id": 1,
    "peran": "mahasiswa",
    "nomor_induk": "2488010001",
    "nama": "Budi Santoso",
    "email": "budi@example.com",
    "status": "aktif"
}
```

### Token tidak valid

Status:

```http
401 Unauthorized
```

Response:

```json
{
    "detail": "Token tidak valid atau sudah kedaluwarsa"
}
```

---

# 13. Logout

Untuk versi awal API, logout dilakukan oleh Frontend dengan menghapus JWT dari localStorage.

Frontend:

```javascript
localStorage.removeItem("token");
localStorage.removeItem("role");
```

Kemudian user diarahkan:

```text
/login
```

## Catatan

Pada versi 1.0 belum terdapat endpoint:

```http
POST /api/v1/auth/logout
```

karena access token bersifat stateless.

Jika sistem nantinya membutuhkan:

* revoke token
* refresh token
* logout semua perangkat
* manajemen sesi

maka endpoint logout dapat ditambahkan pada versi berikutnya.

---

# 14. Health Check

Endpoint digunakan untuk mengetahui apakah Backend dan Database dapat digunakan.

### Endpoint

```http
GET /health
```

Endpoint ini berada di luar `/api/v1`.

### Success

```json
{
    "status": "ok",
    "database": "connected"
}
```

---

# 15. Root API

### Endpoint

```http
GET /
```

Response:

```json
{
    "app": "INF-Learning",
    "status": "ok"
}
```

---

# 16. Error Response

Error sederhana menggunakan:

```json
{
    "detail": "Pesan error"
}
```

Contoh:

```json
{
    "detail": "Akun Anda nonaktif"
}
```

Frontend harus mengambil pesan dari:

```javascript
error.detail
```

---

# 17. Validation Error

FastAPI dapat menghasilkan validation error berbentuk:

```json
{
    "detail": [
        {
            "type": "string_too_short",
            "loc": [
                "body",
                "kata_sandi"
            ],
            "msg": "String should have at least 8 characters",
            "input": "123"
        }
    ]
}
```

Frontend harus mampu membaca:

```javascript
data.detail
```

dan jika `detail` berupa array, mengambil:

```javascript
item.msg
```

---

# 18. Data Model Pengguna

Object pengguna standar:

```json
{
    "id": 1,
    "peran": "mahasiswa",
    "nomor_induk": "2488010001",
    "nama": "Budi Santoso",
    "email": "budi@example.com",
    "status": "aktif"
}
```

Field:

| Field         | Type    | Keterangan            |
| ------------- | ------- | --------------------- |
| `id`          | integer | ID pengguna           |
| `peran`       | string  | `mahasiswa` / `dosen` |
| `nomor_induk` | string  | NIM/NIP               |
| `nama`        | string  | Nama lengkap          |
| `email`       | string  | Email                 |
| `status`      | string  | Status akun           |

---

# 19. Endpoint Materi

Endpoint berikut disiapkan sebagai kontrak untuk modul materi.

> Endpoint ini belum dianggap aktif sebelum Backend mengimplementasikannya.

## Get Materi

```http
GET /api/v1/materi
```

### Authentication

Required.

### Optional Query

```text
category
```

Contoh:

```http
GET /api/v1/materi?category=algoritma
```

### Rencana Response

```json
{
    "data": [
        {
            "id": 1,
            "judul": "Algoritma Dasar",
            "deskripsi": "Pengenalan algoritma",
            "kategori": "algoritma",
            "dibuat_pada": "2026-10-08T00:00:00"
        }
    ],
    "total": 1
}
```

---

# 20. Get Categories Materi

```http
GET /api/v1/materi/categories
```

### Authentication

Required.

### Rencana Response

```json
{
    "data": [
        "algoritma",
        "pemrograman",
        "database",
        "jaringan"
    ]
}
```

---

# 21. Aturan Frontend

Frontend wajib:

1. Menggunakan endpoint yang didefinisikan dalam API Contract.
2. Menggunakan nama field JSON yang sama.
3. Tidak mengubah nama field request secara sembarangan.
4. Tidak mengakses database secara langsung.
5. Mengirim JWT menggunakan `Authorization: Bearer`.
6. Menangani HTTP status `401`.
7. Menangani HTTP status `403`.
8. Menangani validation error `422`.
9. Menampilkan error dari Backend kepada pengguna dengan aman.
10. Tidak menyimpan password.
11. Tidak mengirim password ke endpoint selain login/register.

---

# 22. Aturan Backend

Backend wajib:

1. Mengikuti endpoint yang telah didefinisikan.
2. Menggunakan HTTP method yang telah ditentukan.
3. Menggunakan nama field JSON yang sama.
4. Mengembalikan response sesuai kontrak.
5. Menggunakan status code yang sesuai.
6. Memvalidasi semua input dari Frontend.
7. Tidak mengirim password dalam response.
8. Melindungi endpoint private dengan JWT.
9. Memvalidasi role jika endpoint membutuhkan role tertentu.
10. Tidak bergantung pada implementasi UI Frontend.

---

# 23. Mapping Frontend → Backend

| Frontend             | Backend                   |
| -------------------- | ------------------------- |
| `LoginPage.jsx`      | `/api/v1/auth/login`      |
| `RegisterPage.jsx`   | `/api/v1/auth/registrasi` |
| `AuthContext.jsx`    | `/api/v1/auth/me`         |
| `ProtectedRoute.jsx` | JWT authentication        |
| `authService.js`     | Auth API                  |
| `materiService.js`   | `/api/v1/materi`          |
| `api.js`             | HTTP client               |
| `useAuth.js`         | Authentication state      |

---

# 24. Mapping Backend

| Backend                    | Tanggung jawab            |
| -------------------------- | ------------------------- |
| `api/v1/auth.py`           | Endpoint                  |
| `schemas/auth.py`          | Validasi request/response |
| `services/auth_service.py` | Business logic            |
| `crud/pengguna.py`         | Database operation        |
| `models/pengguna.py`       | Database model            |
| `core/security.py`         | Password + JWT            |
| `core/dependencies.py`     | Authentication            |
| `db/session.py`            | Database connection       |
| `main.py`                  | Application + CORS        |

---

# 25. Flow Registrasi

```text
User
 │
 ▼
RegisterPage.jsx
 │
 ▼
authService.register()
 │
 ▼
POST /api/v1/auth/registrasi
 │
 ▼
FastAPI Router
 │
 ▼
RegistrasiRequest
 │
 ▼
auth_service.registrasi()
 │
 ├── cek nomor induk
 ├── cek email
 ├── tentukan role
 ├── hash password
 │
 ▼
CRUD Pengguna
 │
 ▼
MySQL
 │
 ▼
201 Created
 │
 ▼
Frontend
 │
 ▼
Redirect /login
```

---

# 26. Flow Login

```text
User
 │
 ▼
LoginPage.jsx
 │
 ▼
authService.login()
 │
 ▼
POST /api/v1/auth/login
 │
 ▼
FastAPI
 │
 ▼
auth_service.login()
 │
 ├── cari pengguna
 ├── verifikasi password
 ├── cek status
 └── generate JWT
 │
 ▼
Response
 │
 ├── access_token
 ├── token_type
 ├── expires_in
 └── pengguna
 │
 ▼
AuthContext
 │
 ├── token
 ├── role
 └── user
 │
 ▼
localStorage
 │
 ▼
/materi
```

---

# 27. Flow Refresh Browser

```text
User refresh browser
        │
        ▼
AuthProvider
        │
        ▼
Ambil token dari localStorage
        │
        ▼
GET /api/v1/auth/me
        │
        ▼
Backend validasi JWT
        │
        ├── valid
        │     │
        │     ▼
        │   user
        │
        └── invalid
              │
              ▼
           logout
              │
              ▼
          /login
```

---

# 28. Flow Unauthorized

Jika Backend mengembalikan:

```http
401 Unauthorized
```

Frontend harus:

```text
401
 │
 ▼
hapus token
 │
 ▼
hapus role
 │
 ▼
hapus user
 │
 ▼
redirect /login
```

---

# 29. Versi API

API menggunakan versioning:

```text
/api/v1
```

Jika terjadi perubahan besar yang tidak kompatibel dengan Frontend lama, gunakan:

```text
/api/v2
```

Jangan mengubah kontrak `/api/v1` secara sembarangan jika Frontend yang menggunakannya masih aktif.

---

# 30. Prinsip Perubahan API

Perubahan berikut dianggap **breaking change**:

* mengganti nama endpoint
* mengganti HTTP method
* menghapus field response
* mengganti nama field request
* mengganti tipe data
* mengubah struktur response
* mengubah aturan authentication
* mengubah aturan authorization

Contoh:

Sebelumnya:

```json
{
    "nomor_induk": "2488010001"
}
```

Menjadi:

```json
{
    "nim": "2488010001"
}
```

merupakan **breaking change**.

Frontend dan Backend harus diubah secara bersamaan atau API version baru dibuat.

---

# 31. Non-Breaking Change

Penambahan field response yang tidak wajib biasanya dianggap non-breaking.

Contoh response awal:

```json
{
    "id": 1,
    "nama": "Budi"
}
```

Kemudian:

```json
{
    "id": 1,
    "nama": "Budi",
    "foto": "/uploads/budi.jpg"
}
```

Frontend lama masih dapat berjalan selama field lama tetap tersedia.

---

# 32. Status Implementasi

| Modul         | Endpoint                 | Status             |
| ------------- | ------------------------ | ------------------ |
| Auth          | `POST /auth/registrasi`  | 🟢 Implementasi    |
| Auth          | `POST /auth/login`       | 🟢 Implementasi    |
| Auth          | `GET /auth/me`           | 🟢 Implementasi    |
| Auth          | `POST /auth/logout`      | ⚪ Belum diperlukan |
| Health        | `GET /health`            | 🟢 Implementasi    |
| Materi        | `GET /materi`            | 🟡 Contract        |
| Materi        | `GET /materi/categories` | 🟡 Contract        |
| Materi detail | `GET /materi/{id}`       | ⚪ Belum dibuat     |
| Materi create | `POST /materi`           | ⚪ Belum dibuat     |
| Materi update | `PUT /materi/{id}`       | ⚪ Belum dibuat     |
| Materi delete | `DELETE /materi/{id}`    | ⚪ Belum dibuat     |

---

# 33. Source of Truth

Dokumen ini menjadi **single source of truth** untuk komunikasi API antara Frontend dan Backend.

Jika terjadi perbedaan antara:

```text
Frontend implementation
Backend implementation
API Contract
```

maka implementasi harus disesuaikan dengan API Contract terlebih dahulu.

Setiap perubahan endpoint harus memperbarui:

```text
API_CONTRACT.md
```

sebelum perubahan kode Frontend dan Backend dilakukan.

---

# 34. Ringkasan Endpoint v1

```text
GET    /
GET    /health

POST   /api/v1/auth/registrasi
POST   /api/v1/auth/login
GET    /api/v1/auth/me

GET    /api/v1/materi
GET    /api/v1/materi/categories
```

Endpoint yang membutuhkan authentication:

```text
GET /api/v1/auth/me
GET /api/v1/materi
GET /api/v1/materi/categories
```

Endpoint public:

```text
GET  /
GET  /health
POST /api/v1/auth/registrasi
POST /api/v1/auth/login
```

---

**End of API Contract v1.0.0**
