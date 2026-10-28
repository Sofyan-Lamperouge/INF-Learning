# API Contract — INF-Learning

Dokumen ini adalah acuan resmi antara **Backend (FastAPI)** dan **Frontend (React)**.
Semua contoh respons di bawah diambil dari pemanggilan nyata ke backend, bukan karangan.

| | |
|---|---|
| Versi API | `v1` |
| Terakhir diperbarui | 28 Oktober 2026 |
| Fitur yang tercakup | Autentikasi, Manajemen Mahasiswa (admin), Materi, Dashboard Admin, Dashboard Mahasiswa, Progres Belajar, Kategori Materi (menu Materi Kuliah) |
| Fitur yang **belum** ada | Kuis (dinonaktifkan sementara), refresh token, lupa/ubah password |
| Dokumentasi interaktif | `GET {HOST}/docs` (Swagger UI) dan `{HOST}/redoc` |

---

## Daftar Isi

1. [Konvensi Umum](#1-konvensi-umum)
2. [Ringkasan Endpoint](#2-ringkasan-endpoint)
3. [Autentikasi](#3-autentikasi)
4. [Manajemen Mahasiswa (Admin)](#4-manajemen-mahasiswa-admin)
5. [Materi](#5-materi)
6. [Dashboard Admin](#6-dashboard-admin)
7. [Dashboard Mahasiswa & Progres Belajar](#7-dashboard-mahasiswa--progres-belajar)
8. [Endpoint Utilitas](#8-endpoint-utilitas)
9. [Kamus Data (Enum & Aturan)](#9-kamus-data-enum--aturan)
10. [Panduan Integrasi Frontend](#10-panduan-integrasi-frontend)
11. [Catatan Penting & Masalah yang Diketahui](#11-catatan-penting--masalah-yang-diketahui)

---

## 1. Konvensi Umum

### 1.1 Base URL

| Lingkungan | Base URL |
|---|---|
| Lokal | `http://localhost:8000/api/v1` |
| Production (Railway) | `https://<domain-backend>.up.railway.app/api/v1` |

Di frontend, simpan di environment variable `VITE_API_BASE_URL` (sudah memuat `/api/v1`, tanpa garis miring di akhir).

Endpoint di luar `/api/v1` hanya `GET /` dan `GET /health` (lihat [bagian 8](#8-endpoint-utilitas)).

### 1.2 Autentikasi

Semua endpoint **kecuali** `POST /auth/registrasi`, `POST /auth/login`, `GET /`, dan `GET /health` wajib membawa header:

```
Authorization: Bearer <access_token>
```

- Token didapat dari `POST /auth/login`.
- Masa berlaku token default **15 menit** (`expires_in: 900` detik). **Belum ada refresh token**, jadi setelah kedaluwarsa pengguna harus login ulang.
- Token berupa JWT (HS256). Isinya hanya `sub` (id pengguna) dan `exp`. Frontend **tidak boleh** mengandalkan isi token untuk peran. Ambil peran dari `pengguna.peran` pada respons login atau `GET /auth/me`.
- Backend memeriksa status akun di database pada **setiap request**. Akun yang dinonaktifkan admin langsung ditolak (`403`) meski tokennya belum kedaluwarsa.
- Autentikasi memakai header, **bukan cookie**. CORS saat ini `allow_origins: *` tanpa credentials.

### 1.3 Format Request & Response

| Aturan | Nilai |
|---|---|
| Format body | JSON (`Content-Type: application/json`), kecuali upload materi yang memakai `multipart/form-data` |
| Nama field | `snake_case`, bahasa Indonesia (`nomor_induk`, `kata_sandi`, `dibuat_pada`) |
| Nilai kosong | `null` (field selalu ada di respons, tidak dihilangkan) |
| Tanggal & waktu | ISO 8601 **tanpa zona waktu**, contoh `2026-10-27T08:24:02.701333`. Nilainya **UTC**. Saat menampilkan, tambahkan `Z` sebelum diparse: `new Date(value + "Z")` |
| Bahasa pesan error | Indonesia (khusus pesan buatan backend). Pesan validasi 422 berbahasa Inggris |

### 1.4 Paginasi

Dipakai oleh `GET /mahasiswa` dan `GET /materi`.

**Query:**

| Param | Tipe | Default | Batas |
|---|---|---|---|
| `page` | integer | `1` | ≥ 1 |
| `limit` | integer | `20` | 1 – 100 |

**Bentuk respons:**

```json
{
  "items": [],
  "total": 42,
  "page": 1,
  "limit": 20,
  "total_pages": 3
}
```

`total_pages = ceil(total / limit)`. Jika `total = 0`, maka `total_pages = 0` dan `items = []`.
Nilai `page`/`limit` di luar batas menghasilkan `422`, bukan dikoreksi otomatis.

### 1.5 Format Error

Ada **tiga bentuk** error. Frontend harus menangani ketiganya (lihat helper di [bagian 10.2](#102-wrapper-fetch--penanganan-error)).

**A. Error bisnis (`detail` berupa string)** — `400`, `401`, `403`, `404`, `409`:

```json
{ "detail": "NIM atau kata sandi salah" }
```

**B. Error validasi (`detail` berupa array)** — `422`:

```json
{
  "detail": [
    {
      "type": "string_too_short",
      "loc": ["body", "nomor_induk"],
      "msg": "String should have at least 10 characters",
      "input": "abc",
      "ctx": { "min_length": 10 }
    }
  ]
}
```

- `loc[0]` = lokasi (`body`, `query`, `path`), `loc[1]` = nama field. Pakai ini untuk menandai input form yang salah.
- Pesan dari validator buatan sendiri diawali `Value error, ` (contoh: `Value error, Format NIM tidak dikenali`). Buang awalan ini saat ditampilkan.

**C. Error server (`500`)** — body **bukan JSON**, melainkan teks polos:

```
Internal Server Error
```

Jangan memanggil `response.json()` secara membabi buta. Bungkus dengan `try/catch`.

### 1.6 Kode Status

| Kode | Arti di API ini |
|---|---|
| `200` | Berhasil (termasuk registrasi, login, dan semua `PUT`/`POST` progres) |
| `201` | Data berhasil dibuat (`POST /mahasiswa`, `POST /materi`) |
| `204` | Berhasil tanpa body (`DELETE`). Jangan parse JSON |
| `400` | Permintaan tidak bisa diproses (format file ditolak, tidak ada field diubah) |
| `401` | Token tidak ada/tidak valid/kedaluwarsa, atau login gagal |
| `403` | Sudah login tetapi tidak berhak (peran salah atau akun tidak aktif) |
| `404` | Data tidak ditemukan |
| `409` | Konflik data (NIM sudah ada, akun sudah aktif) |
| `422` | Validasi input gagal |
| `500` | Kesalahan server (lihat [bagian 11](#11-catatan-penting--masalah-yang-diketahui)) |

---

## 2. Ringkasan Endpoint

Akses: 🌐 publik · 🔑 semua pengguna login · 🛡️ admin saja · 🎓 mahasiswa saja

| Method | Path | Akses | Fungsi |
|---|---|---|---|
| POST | `/auth/registrasi` | 🌐 | Aktivasi akun mahasiswa (set password) |
| POST | `/auth/login` | 🌐 | Login, mendapat token |
| GET | `/auth/me` | 🔑 | Data pengguna dari token |
| GET | `/mahasiswa` | 🛡️ | Daftar mahasiswa (paginasi) |
| POST | `/mahasiswa` | 🛡️ | Tambah mahasiswa (NIM + nama) |
| PUT | `/mahasiswa/{id}` | 🛡️ | Ubah nama/angkatan/status mahasiswa |
| DELETE | `/mahasiswa/{id}` | 🛡️ | Hapus mahasiswa |
| GET | `/materi` | 🔑 | Daftar materi (filter + paginasi) |
| GET | `/materi/kategori/semester` | 🔑 | Kategori semester 1–8 + jumlah materi |
| GET | `/materi/kategori/mata-kuliah` | 🔑 | Kategori mata kuliah pada satu semester |
| GET | `/materi/{id}` | 🔑 | Detail materi |
| POST | `/materi` | 🛡️ | Upload materi (multipart) |
| PUT | `/materi/{id}` | 🛡️ | Ubah materi / status |
| DELETE | `/materi/{id}` | 🛡️ | Hapus materi |
| GET | `/admin/dashboard` | 🛡️ | Ringkasan dashboard admin |
| GET | `/mahasiswa/dashboard` | 🎓 | Ringkasan dashboard mahasiswa |
| POST | `/materi/{id}/progres` | 🎓 | Catat progres belajar |

---

## 3. Autentikasi

### 3.1 Alur Akun (penting dipahami frontend)

```
Admin input NIM + nama   →   status: belum_aktif   (belum punya password)
        │
        ▼
Mahasiswa registrasi     →   set password, status: aktif
        │
        ▼
Mahasiswa login          →   dapat access_token
        │
        ▼
Admin bisa nonaktifkan   →   status: nonaktif  (login & token langsung ditolak)
```

Mahasiswa **tidak bisa mendaftar sendiri dengan NIM sembarang**. NIM harus sudah diinput admin (manual atau lewat import CSV).

### 3.2 `POST /auth/registrasi` — Aktivasi akun

**Akses:** 🌐 publik

**Body (JSON):**

| Field | Tipe | Wajib | Aturan |
|---|---|---|---|
| `nomor_induk` | string | ✅ | Tepat 10 karakter, format NIM `^2\d88\d{6}$` (contoh `2488010071`). Spasi di awal/akhir **tidak** dibuang sebelum cek panjang |
| `kata_sandi` | string | ✅ | 8–72 karakter dan maksimal 72 **byte** (huruf non-ASCII/emoji memakan lebih dari 1 byte) |
| `konfirmasi_kata_sandi` | string | ❌ | Opsional. Jika dikirim, harus sama persis dengan `kata_sandi` |

```json
{
  "nomor_induk": "2488010071",
  "kata_sandi": "Rahasia123",
  "konfirmasi_kata_sandi": "Rahasia123"
}
```

**Respons `200 OK`:**

```json
{
  "id": 2,
  "peran": "mahasiswa",
  "nomor_induk": "2488010071",
  "nama": "Budi Santoso",
  "status": "aktif",
  "dibuat_pada": "2026-10-27T08:23:43.143171"
}
```

> Registrasi **tidak** mengembalikan token. Setelah sukses, arahkan ke halaman login (atau panggil `POST /auth/login` otomatis dengan kredensial yang sama).

**Error:**

| Status | `detail` | Kapan |
|---|---|---|
| `404` | `NIM tidak terdaftar. Hubungi admin.` | NIM valid tetapi belum diinput admin |
| `403` | `Akun Anda dinonaktifkan. Hubungi admin.` | Status akun `nonaktif` |
| `409` | `Akun sudah aktif. Silakan login.` | Akun sudah punya password |
| `422` | array validasi | Format NIM salah, password < 8 / > 72, konfirmasi tidak cocok, field hilang |

Contoh pesan `422`: `Value error, Format NIM tidak dikenali` · `Value error, Konfirmasi kata sandi tidak cocok` · `String should have at least 8 characters`.

### 3.3 `POST /auth/login`

**Akses:** 🌐 publik. Dipakai admin maupun mahasiswa.

**Body (JSON):**

| Field | Tipe | Wajib | Aturan |
|---|---|---|---|
| `nomor_induk` | string | ✅ | 3–50 karakter (NIM mahasiswa, atau `ADM001` untuk admin) |
| `kata_sandi` | string | ✅ | 8–72 karakter |

```json
{
  "nomor_induk": "2488010071",
  "kata_sandi": "Rahasia123"
}
```

**Respons `200 OK`:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwiZXhwIjoxNzkzMDkwMzIzfQ.xxxxx",
  "token_type": "bearer",
  "expires_in": 900,
  "pengguna": {
    "id": 2,
    "peran": "mahasiswa",
    "nomor_induk": "2488010071",
    "nama": "Budi Santoso",
    "status": "aktif"
  }
}
```

| Field | Keterangan |
|---|---|
| `access_token` | Simpan dan kirim pada header `Authorization` |
| `token_type` | Selalu `bearer` |
| `expires_in` | Masa berlaku dalam **detik** (default 900) |
| `pengguna.peran` | `admin` atau `mahasiswa`. Dasar untuk mengarahkan ke dashboard yang tepat |

**Error:**

| Status | `detail` | Kapan |
|---|---|---|
| `401` | `NIM atau kata sandi salah` | Password salah, NIM tidak ada, **atau** akun belum registrasi (belum punya password). Pesan sengaja disamakan agar NIM tidak bisa ditebak |
| `403` | `Akun Anda belum aktif. Silakan registrasi terlebih dahulu.` | Password benar tetapi status akun bukan `aktif` (termasuk `nonaktif`) |
| `422` | array validasi | NIM < 3 karakter, password < 8 atau > 72 karakter, field hilang |

> ⚠️ Password yang **kurang dari 8 karakter** menghasilkan `422`, bukan `401`. Di form login, cukup tampilkan pesan umum seperti "NIM atau kata sandi salah" untuk kedua kasus.

### 3.4 `GET /auth/me`

**Akses:** 🔑. Dipakai untuk memulihkan sesi saat aplikasi dibuka ulang (token tersimpan di browser).

**Respons `200 OK`:**

```json
{
  "id": 2,
  "peran": "mahasiswa",
  "nomor_induk": "2488010071",
  "nama": "Budi Santoso",
  "status": "aktif"
}
```

**Error (berlaku untuk semua endpoint yang butuh token):**

| Status | `detail` | Kapan |
|---|---|---|
| `401` | `Token tidak ada` | Header `Authorization` tidak dikirim |
| `401` | `Token tidak valid atau sudah kedaluwarsa` | Token rusak atau lewat masa berlaku |
| `401` | `Pengguna tidak ditemukan` | Pengguna di dalam token sudah dihapus |
| `403` | `Akun Anda nonaktif` | Status akun bukan `aktif` |

Semua `401` menyertakan header `WWW-Authenticate: Bearer`.

**Error khusus peran (berlaku untuk endpoint 🛡️ dan 🎓):**

| Status | `detail` |
|---|---|
| `403` | `Anda tidak memiliki akses ke endpoint ini` |

---

## 4. Manajemen Mahasiswa (Admin)

Semua endpoint di bagian ini: **🛡️ admin saja**. Endpoint ini hanya menyentuh pengguna berperan `mahasiswa`. Akun admin tidak bisa diubah atau dihapus lewat sini (ID admin menghasilkan `404`).

Objek **Mahasiswa**:

| Field | Tipe | Keterangan |
|---|---|---|
| `id` | integer | ID pengguna |
| `nomor_induk` | string | NIM, unik |
| `nama` | string | |
| `angkatan` | integer atau `null` | Tahun angkatan |
| `status` | string | `belum_aktif`, `aktif`, atau `nonaktif` |
| `dibuat_pada` | string | Waktu dibuat (UTC) |

Hash password **tidak pernah** dikirim.

### 4.1 `GET /mahasiswa` — Daftar mahasiswa

**Query:** `page`, `limit` (lihat [1.4](#14-paginasi)). Belum ada pencarian/filter. Urutan: `nomor_induk` naik.

**Respons `200 OK`:**

```json
{
  "items": [
    {
      "id": 2,
      "nomor_induk": "2488010071",
      "nama": "Budi Santoso",
      "angkatan": 2024,
      "status": "belum_aktif",
      "dibuat_pada": "2026-10-27T08:23:43.143171"
    },
    {
      "id": 3,
      "nomor_induk": "2488010072",
      "nama": "Siti Aminah",
      "angkatan": null,
      "status": "belum_aktif",
      "dibuat_pada": "2026-10-27T08:23:43.151977"
    }
  ],
  "total": 2,
  "page": 1,
  "limit": 2,
  "total_pages": 1
}
```

### 4.2 `POST /mahasiswa` — Tambah mahasiswa

**Body (JSON):**

| Field | Tipe | Wajib | Aturan |
|---|---|---|---|
| `nomor_induk` | string | ✅ | Tepat 10 karakter, format `^2\d88\d{6}$` |
| `nama` | string | ✅ | 3–100 karakter |
| `angkatan` | integer | ❌ | Bebas (tidak divalidasi rentangnya) |

```json
{ "nomor_induk": "2488010071", "nama": "Budi Santoso", "angkatan": 2024 }
```

**Respons `201 Created`:** objek Mahasiswa, status awal selalu `belum_aktif`.

```json
{
  "id": 2,
  "nomor_induk": "2488010071",
  "nama": "Budi Santoso",
  "angkatan": 2024,
  "status": "belum_aktif",
  "dibuat_pada": "2026-10-27T08:23:43.143171"
}
```

**Error:** `409` `NIM sudah terdaftar` · `422` validasi.

### 4.3 `PUT /mahasiswa/{id}` — Ubah mahasiswa

**Path:** `id` (integer, ID pengguna).

**Body (JSON)**, semua opsional, kirim hanya yang berubah:

| Field | Tipe | Aturan |
|---|---|---|
| `nama` | string | 3–100 karakter |
| `angkatan` | integer | |
| `status` | string | Salah satu: `belum_aktif`, `aktif`, `nonaktif` |

```json
{ "status": "nonaktif" }
```

**Respons `200 OK`:** objek Mahasiswa terbaru.

Perilaku yang perlu diketahui:
- Field bernilai `null` atau tidak dikirim **diabaikan**. Angkatan tidak bisa dikosongkan lewat endpoint ini.
- Body `{}` tetap `200` tanpa perubahan (tidak ada error).
- Mengubah status ke `nonaktif` membuat login dan token yang masih berlaku langsung ditolak.
- Mengubah status ke `aktif` untuk akun yang belum punya password **tidak** menguncinya. Mahasiswa tetap bisa registrasi.

**Error:** `404` `Mahasiswa tidak ditemukan` · `422` (misalnya `Input should be 'belum_aktif', 'aktif' or 'nonaktif'`).

### 4.4 `DELETE /mahasiswa/{id}` — Hapus mahasiswa

**Respons:** `204 No Content` (tanpa body). Progres belajar mahasiswa tersebut ikut terhapus.

**Error:** `404` `Mahasiswa tidak ditemukan`.

---

## 5. Materi

Objek **Materi**:

| Field | Tipe | Keterangan |
|---|---|---|
| `id` | integer | |
| `judul` | string | 3–200 karakter |
| `deskripsi` | string atau `null` | Maks 2000 karakter |
| `mata_kuliah` | string | 2–100 karakter, teks bebas |
| `semester` | integer | 1–8 |
| `jenis` | string | `pdf`, `docx`, `pptx`, `xlsx` (diisi otomatis dari ekstensi file) |
| `url` | string | URL lengkap file (`https://…/uploads/<acak>.<ext>`). Bisa dibuka/diunduh langsung, **tanpa token** |
| `dibuat_oleh` | integer atau `null` | ID admin pengunggah |
| `status` | string | `draft`, `terbit`, atau `arsip` |
| `dibuat_pada` | string | UTC |
| `diubah_pada` | string | UTC |
| `status_belajar` | string atau `null` | `belum`, `dilihat`, atau `selesai`. **Hanya terisi untuk mahasiswa** (milik mahasiswa yang login). Untuk admin dan pada respons upload/ubah selalu `null` |

```json
{
  "id": 1,
  "judul": "Pengantar Algoritma",
  "deskripsi": "Bab 1",
  "mata_kuliah": "Algoritma",
  "semester": 1,
  "jenis": "pdf",
  "url": "https://api.contoh.app/uploads/eee70c8a991e412e8536447cda5194a8.pdf",
  "dibuat_oleh": 1,
  "status": "terbit",
  "dibuat_pada": "2026-10-27T08:24:02.701333",
  "diubah_pada": "2026-10-27T08:24:02.701336",
  "status_belajar": null
}
```

### 5.0 Aturan visibilitas (penting)

| Peran | Materi yang terlihat |
|---|---|
| 🎓 Mahasiswa | **Hanya** `status: "terbit"`. Materi `draft`/`arsip` tidak muncul di daftar dan detailnya menghasilkan `404` |
| 🛡️ Admin | Semua status |

Aturan yang sama berlaku untuk dua endpoint kategori (5.6 dan 5.7): mahasiswa hanya menghitung materi `terbit`, admin menghitung semua status.

### 5.1 `GET /materi` — Daftar materi

**Akses:** 🔑

**Query:**

| Param | Tipe | Keterangan |
|---|---|---|
| `mata_kuliah` | string | Cocok persis dengan nama mata kuliah |
| `semester` | integer | 1–8 (di luar itu `422`) |
| `jenis` | string | Cocok persis, huruf kecil (`pdf`, `docx`, `pptx`, `xlsx`) |
| `q` | string | Cari sebagian kata di `judul` atau `deskripsi` |
| `page`, `limit` | integer | Lihat [1.4](#14-paginasi) |

Semua filter bisa digabung. Urutan: terbaru lebih dulu (`dibuat_pada` turun).

**Contoh:** `GET /materi?mata_kuliah=Algoritma&semester=1&q=pengantar&page=1&limit=10`

**Respons `200 OK`:**

```json
{
  "items": [
    {
      "id": 2,
      "judul": "Basis Data Dasar",
      "deskripsi": null,
      "mata_kuliah": "Basis Data",
      "semester": 3,
      "jenis": "pptx",
      "url": "https://api.contoh.app/uploads/4e162b818dbb48a18a40257a49161802.pptx",
      "dibuat_oleh": 1,
      "status": "terbit",
      "dibuat_pada": "2026-10-27T08:24:02.709148",
      "diubah_pada": "2026-10-27T08:24:02.709151",
      "status_belajar": "belum"
    }
  ],
  "total": 3,
  "page": 1,
  "limit": 1,
  "total_pages": 3
}
```

> Untuk daftar semester dan mata kuliah (menu Materi Kuliah), gunakan endpoint kategori di 5.6 dan 5.7, bukan mengelompokkan sendiri hasil endpoint ini.

### 5.2 `GET /materi/{id}` — Detail materi

**Akses:** 🔑 · **Respons `200`:** objek Materi.

**Error:** `404` `Materi tidak ditemukan` (juga untuk materi non-`terbit` jika pemanggil mahasiswa) · `422` jika `id` bukan angka.

### 5.3 `POST /materi` — Upload materi

**Akses:** 🛡️ · **Content-Type:** `multipart/form-data` (diatur otomatis oleh browser saat memakai `FormData`).

**Field form:**

| Field | Tipe | Wajib | Aturan |
|---|---|---|---|
| `judul` | text | ✅ | 3–200 karakter |
| `mata_kuliah` | text | ✅ | 2–100 karakter |
| `semester` | text (angka) | ✅ | 1–8 |
| `deskripsi` | text | ❌ | Maks 2000 karakter |
| `file` | file | ✅ | Ekstensi `.pdf`, `.docx`, `.pptx`, atau `.xlsx` (tidak peka huruf besar/kecil). Ukuran tidak dibatasi oleh aplikasi |

Yang diisi otomatis oleh backend: `jenis` (dari ekstensi), `url`, `dibuat_oleh`, dan `status = "terbit"` (materi baru langsung tampil ke mahasiswa).

**Respons `201 Created`:** objek Materi.

**Error:**

| Status | `detail` | Kapan |
|---|---|---|
| `400` | `Format file tidak diizinkan` | Ekstensi di luar daftar |
| `422` | array validasi | Field `judul`/`mata_kuliah`/`semester`/`file` tidak ada atau bukan tipe yang benar |
| `401` / `403` | lihat bagian 3.4 | |
| `500` | *(teks polos)* | ⚠️ Nilai di luar aturan di atas (judul < 3 karakter, semester di luar 1–8, mata kuliah < 2 karakter, deskripsi > 2000). Lihat [masalah #1](#11-catatan-penting--masalah-yang-diketahui) |

> **Karena masalah #1, validasi ini wajib dilakukan juga di frontend** sebelum mengirim.

### 5.4 `PUT /materi/{id}` — Ubah materi

**Akses:** 🛡️

**Body (JSON)**, semua opsional, kirim hanya field yang berubah:

| Field | Tipe | Aturan |
|---|---|---|
| `judul` | string | 3–200 karakter |
| `deskripsi` | string | Maks 2000 karakter |
| `mata_kuliah` | string | 2–100 karakter |
| `semester` | integer | 1–8 |
| `jenis` | string | Salah satu: `pdf`, `ppt`, `pptx`, `doc`, `docx`, `xls`, `xlsx` |
| `url` | string | Harus diawali `http://` atau `https://` |
| `status` | string | Salah satu: `draft`, `terbit`, `arsip` |

Gunakan endpoint ini untuk **menerbitkan/menyembunyikan materi**:

```json
{ "status": "arsip" }
```

**Respons `200 OK`:** objek Materi terbaru (`diubah_pada` ikut diperbarui).

**Error:**

| Status | `detail` | Kapan |
|---|---|---|
| `400` | `Tidak ada field yang diubah` | Body `{}` |
| `404` | `Materi tidak ditemukan` | |
| `422` | `Value error, Status harus: draft, terbit, atau arsip` | Status tidak dikenal |
| `422` | `Value error, Jenis harus salah satu dari: doc, docx, pdf, ppt, pptx, xls, xlsx` | |
| `422` | `Value error, URL harus dimulai dengan http:// atau https://` | |

> Endpoint ini **tidak bisa mengganti file**. Untuk mengganti file, unggah materi baru lalu hapus yang lama.

### 5.5 `DELETE /materi/{id}` — Hapus materi

**Akses:** 🛡️ · **Respons:** `204 No Content`. Progres belajar mahasiswa pada materi itu ikut terhapus. File fisik di server **tidak** ikut dihapus.

**Error:** `404` `Materi tidak ditemukan`.

### 5.6 `GET /materi/kategori/semester` — Kategori semester

**Akses:** 🔑 · Tidak ada parameter. Dipakai untuk langkah 1 menu Materi Kuliah ("pilih semester").

**Respons `200 OK`:**

```json
{
  "items": [
    { "semester": 1, "total_materi": 3, "total_mata_kuliah": 2 },
    { "semester": 2, "total_materi": 0, "total_mata_kuliah": 0 },
    { "semester": 3, "total_materi": 1, "total_mata_kuliah": 1 },
    { "semester": 4, "total_materi": 0, "total_mata_kuliah": 0 },
    { "semester": 5, "total_materi": 1, "total_mata_kuliah": 1 },
    { "semester": 6, "total_materi": 0, "total_mata_kuliah": 0 },
    { "semester": 7, "total_materi": 0, "total_mata_kuliah": 0 },
    { "semester": 8, "total_materi": 0, "total_mata_kuliah": 0 }
  ]
}
```

| Field | Keterangan |
|---|---|
| `items` | **Selalu 8 entri**, semester 1 sampai 8 berurutan. Semester tanpa materi tetap tampil dengan nilai `0` |
| `total_materi` | Jumlah materi pada semester itu (mahasiswa: hanya `terbit`) |
| `total_mata_kuliah` | Jumlah nama mata kuliah berbeda pada semester itu |

Saran tampilan: semester dengan `total_materi = 0` diredupkan atau diberi keterangan "Belum ada materi".

**Error:** `401`, `403` (bagian 3.4).

### 5.7 `GET /materi/kategori/mata-kuliah` — Kategori mata kuliah

**Akses:** 🔑 · Dipakai untuk langkah 2 menu Materi Kuliah ("pilih mata kuliah").

**Query:**

| Param | Tipe | Wajib | Aturan |
|---|---|---|---|
| `semester` | integer | ✅ | 1–8 |

**Contoh:** `GET /materi/kategori/mata-kuliah?semester=1`

**Respons `200 OK`:**

```json
{
  "semester": 1,
  "items": [
    { "mata_kuliah": "Algoritma", "total_materi": 2 },
    { "mata_kuliah": "Pengantar TI", "total_materi": 1 }
  ]
}
```

- `items` diurutkan abjad berdasarkan `mata_kuliah`.
- Jika semester belum punya materi, `items` berupa `[]` (status tetap `200`).
- Nilai `mata_kuliah` bisa langsung dipakai sebagai filter `GET /materi?semester=1&mata_kuliah=Algoritma` (langkah 3). Encode dengan `URLSearchParams` karena bisa memuat spasi.

**Error:** `422` jika `semester` tidak dikirim, bukan angka, atau di luar 1–8 · `401`, `403` (bagian 3.4).

> Nama mata kuliah adalah teks bebas yang diketik admin saat upload. Ejaan yang berbeda ("Basis Data" dan "Basisdata") dianggap dua mata kuliah.

---

## 6. Dashboard Admin

### `GET /admin/dashboard`

**Akses:** 🛡️ · Tidak ada parameter.

**Respons `200 OK`:**

```json
{
  "total_mahasiswa": 1,
  "total_materi": 3,
  "materi_terbaru": [
    {
      "id": 4,
      "judul": "Materi Draft",
      "mata_kuliah": "Algoritma",
      "semester": 2,
      "jenis": "pdf",
      "dibuat_pada": "2026-10-27T08:24:02.739484"
    }
  ],
  "mahasiswa_terbaru": [
    {
      "id": 2,
      "nama": "Budi Santoso",
      "nomor_induk": "2488010071",
      "angkatan": 2024,
      "status": "aktif",
      "dibuat_pada": "2026-10-27T08:24:02.085005"
    }
  ]
}
```

| Field | Keterangan |
|---|---|
| `total_mahasiswa` | Jumlah semua mahasiswa (semua status) |
| `total_materi` | Jumlah semua materi (**termasuk** `draft` dan `arsip`) |
| `materi_terbaru` | Maksimal 5, terbaru dulu, semua status. Tidak memuat `url` dan `status` |
| `mahasiswa_terbaru` | Maksimal 5, terbaru dulu |

> Statistik kuis **sudah dihapus** dari respons ini. Frontend tidak boleh lagi membaca `total_kuis`.

**Error:** `401`, `403` (bagian 3.4).

---

## 7. Dashboard Mahasiswa & Progres Belajar

### 7.1 `GET /mahasiswa/dashboard`

**Akses:** 🎓 mahasiswa saja (admin mendapat `403`). Tidak ada parameter.

> Path ini berbeda dari `GET /mahasiswa` (daftar mahasiswa untuk admin). Jangan tertukar.

**Respons `200 OK`:**

```json
{
  "profil": {
    "id": 2,
    "nama": "Budi Santoso",
    "nomor_induk": "2488010071",
    "angkatan": 2024
  },
  "statistik": {
    "total_materi": 2,
    "materi_dilihat": 2,
    "materi_selesai": 1,
    "persen_selesai": 50.0
  },
  "lanjutkan_belajar": {
    "id": 2,
    "judul": "Basis Data Dasar",
    "mata_kuliah": "Basis Data",
    "semester": 3,
    "jenis": "pptx",
    "url": "https://api.contoh.app/uploads/4e162b818dbb48a18a40257a49161802.pptx",
    "dibuat_pada": "2026-10-27T08:24:02.709148",
    "status_belajar": "dilihat"
  },
  "materi_terbaru": [
    {
      "id": 1,
      "judul": "Pengantar Algoritma (Revisi)",
      "mata_kuliah": "Algoritma",
      "semester": 1,
      "jenis": "pdf",
      "url": "https://api.contoh.app/uploads/eee70c8a991e412e8536447cda5194a8.pdf",
      "dibuat_pada": "2026-10-27T08:24:02.701333",
      "status_belajar": "selesai"
    }
  ],
  "progres_mata_kuliah": [
    { "mata_kuliah": "Algoritma", "total": 1, "selesai": 1, "persen": 100.0 },
    { "mata_kuliah": "Basis Data", "total": 1, "selesai": 0, "persen": 0.0 }
  ]
}
```

| Field | Keterangan |
|---|---|
| `profil` | Identitas mahasiswa yang login |
| `statistik.total_materi` | Jumlah materi `terbit` |
| `statistik.materi_dilihat` | Materi terbit yang pernah dibuka (**sudah termasuk** yang selesai) |
| `statistik.materi_selesai` | Materi terbit yang ditandai selesai |
| `statistik.persen_selesai` | `materi_selesai / total_materi × 100`, 1 angka desimal. `0.0` jika belum ada materi |
| `lanjutkan_belajar` | Materi terakhir yang dibuka tetapi **belum selesai**. `null` jika tidak ada. Cocok untuk kartu "Lanjutkan belajar" |
| `materi_terbaru` | Maksimal 5 materi `terbit` terbaru, dilengkapi `status_belajar` milik mahasiswa ini |
| `progres_mata_kuliah` | Satu entri per mata kuliah yang punya materi terbit, urut abjad. Bisa kosong (`[]`) |

`status_belajar` bernilai `belum` (belum pernah dibuka), `dilihat`, atau `selesai`.

Kondisi awal (belum ada materi/progres): `total_materi: 0`, semua angka `0`/`0.0`, `lanjutkan_belajar: null`, `materi_terbaru: []`, `progres_mata_kuliah: []`. Siapkan tampilan *empty state*.

### 7.2 `POST /materi/{id}/progres` — Catat progres

**Akses:** 🎓 mahasiswa saja.

**Path:** `id` = ID materi.

**Body (JSON):**

| Field | Tipe | Wajib | Nilai |
|---|---|---|---|
| `status` | string | ✅ | `dilihat` atau `selesai` |

```json
{ "status": "selesai" }
```

**Respons `200 OK`:**

```json
{
  "materi_id": 1,
  "status": "selesai",
  "diubah_pada": "2026-10-27T08:24:02.912726"
}
```

Aturan:
- Panggil dengan `dilihat` saat mahasiswa **membuka** sebuah materi, dan `selesai` saat menekan "Tandai selesai".
- Aman dipanggil berulang (idempoten). Satu mahasiswa hanya punya satu catatan per materi.
- Status `selesai` **tidak bisa turun** ke `dilihat`. Jika dikirim `dilihat` setelah `selesai`, respons tetap `status: "selesai"`. Pakai nilai `status` dari **respons** untuk memperbarui tampilan, bukan nilai yang dikirim.

**Error:**

| Status | `detail` | Kapan |
|---|---|---|
| `404` | `Materi tidak ditemukan` | ID tidak ada **atau** materi belum `terbit` |
| `403` | `Anda tidak memiliki akses ke endpoint ini` | Dipanggil oleh admin |
| `422` | `Input should be 'dilihat' or 'selesai'` | Status tidak valid |

---

## 8. Endpoint Utilitas

| Method | Path | Respons |
|---|---|---|
| GET | `/` | `{"app": "INF-Learning", "status": "ok"}` |
| GET | `/health` | `{"status": "ok", "database": "connected"}`. Jika database bermasalah, `database` berisi `error: …` (status HTTP tetap `200`) |

Keduanya berada di **luar** `/api/v1` (root domain) dan tanpa token.

**File upload:** `GET {HOST}/uploads/<nama-file>` melayani file materi. URL lengkapnya sudah ada di field `url` pada objek Materi, jadi frontend cukup memakai nilai itu apa adanya (tautan unduh/buka di tab baru).

---

## 9. Kamus Data (Enum & Aturan)

| Nama | Nilai yang valid | Keterangan |
|---|---|---|
| `peran` | `admin`, `mahasiswa` | |
| Status akun | `belum_aktif`, `aktif`, `nonaktif` | `belum_aktif` = diinput admin tapi belum registrasi |
| Status materi | `draft`, `terbit`, `arsip` | Hanya `terbit` yang dilihat mahasiswa |
| `jenis` materi (saat upload) | `pdf`, `docx`, `pptx`, `xlsx` | |
| `jenis` materi (saat `PUT`) | `pdf`, `ppt`, `pptx`, `doc`, `docx`, `xls`, `xlsx` | |
| Status progres (kirim) | `dilihat`, `selesai` | |
| `status_belajar` (terima) | `belum`, `dilihat`, `selesai` | `belum` hanya muncul di respons dashboard |
| Semester | `1` – `8` | |

**Format NIM:** `^2\d88\d{6}$`, yaitu 10 digit, diawali `2`, digit ke-3 dan ke-4 adalah `88`. Contoh sah: `2488010071`. Contoh tidak sah: `1234567890`, `24880100`, `2488O10071` (huruf O).

Regex untuk frontend:

```js
export const POLA_NIM = /^2\d88\d{6}$/;
```

---

## 10. Panduan Integrasi Frontend

### 10.1 Alur Autentikasi

1. **Registrasi:** `POST /auth/registrasi` → sukses → arahkan ke login.
2. **Login:** `POST /auth/login` → simpan `access_token` dan `pengguna`.
3. **Arahkan berdasarkan peran:**
   - `pengguna.peran === "admin"` → dashboard admin (`GET /admin/dashboard`)
   - `pengguna.peran === "mahasiswa"` → dashboard mahasiswa (`GET /mahasiswa/dashboard`)
4. **Buka ulang aplikasi:** jika token tersimpan, panggil `GET /auth/me`. Sukses → pulihkan sesi. `401`/`403` → hapus token, ke halaman login.
5. **Logout:** cukup hapus token di sisi klien (tidak ada endpoint logout).

**Guard rute:** halaman admin hanya untuk `peran === "admin"` dan halaman mahasiswa hanya untuk `peran === "mahasiswa"`. Pengecekan di frontend hanya soal tampilan. Keamanan sebenarnya ada di backend (`403`).

### 10.2 Wrapper Fetch & Penanganan Error

```js
const BASE_URL = import.meta.env.VITE_API_BASE_URL; // contoh: https://xxx.up.railway.app/api/v1

export class ApiError extends Error {
  constructor(status, message, fields = {}) {
    super(message);
    this.status = status;
    this.fields = fields; // { nomor_induk: "Format NIM tidak dikenali", ... }
  }
}

// Ubah 3 bentuk error backend (string / array 422 / teks polos 500) menjadi satu bentuk
async function bacaError(res) {
  let body = null;
  try { body = await res.json(); } catch { /* 500 teks polos atau body kosong */ }

  if (!body) {
    return new ApiError(res.status,
      res.status >= 500 ? "Terjadi kesalahan pada server. Coba lagi nanti." : "Permintaan gagal.");
  }
  if (typeof body.detail === "string") {
    return new ApiError(res.status, body.detail);
  }
  if (Array.isArray(body.detail)) {
    const fields = {};
    const pesan = body.detail.map((e) => {
      const teks = String(e.msg).replace(/^Value error, /, "");
      const nama = e.loc?.[1];
      if (nama && !fields[nama]) fields[nama] = teks;
      return teks;
    });
    return new ApiError(res.status, pesan.join(". "), fields);
  }
  return new ApiError(res.status, "Terjadi kesalahan.");
}

export async function api(path, { method = "GET", body, formData, token } = {}) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers["Content-Type"] = "application/json";
  // Untuk FormData JANGAN set Content-Type sendiri, browser mengisi boundary otomatis.

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: formData ?? (body !== undefined ? JSON.stringify(body) : undefined),
  });

  if (res.status === 204) return null;   // DELETE sukses
  if (!res.ok) throw await bacaError(res);
  return res.json();
}
```

**Penanganan `401` global:** pada status `401` di endpoint selain `/auth/login` dan `/auth/registrasi`, hapus token lalu arahkan ke `/login` dengan pesan "Sesi berakhir, silakan login kembali". Ini penting karena token hanya berlaku 15 menit.

**Tabel penanganan cepat:**

| Status | Tindakan UI |
|---|---|
| `401` di endpoint terproteksi | Hapus token → ke halaman login |
| `401` di form login | Tampilkan "NIM atau kata sandi salah" |
| `403` | "Anda tidak memiliki akses", atau di login: tampilkan `detail` |
| `404` | "Data tidak ditemukan" (atau tampilkan `detail`) |
| `409` | Tampilkan `detail` di form (NIM sudah ada / akun sudah aktif) |
| `422` | Tandai input memakai `error.fields[namaField]` |
| `500` | Pesan umum, jangan tampilkan teks mentah |

### 10.3 Contoh Pemakaian per Fitur

```js
// Login
const hasil = await api("/auth/login", { method: "POST",
  body: { nomor_induk, kata_sandi } });
// hasil.access_token, hasil.pengguna.peran

// Registrasi
await api("/auth/registrasi", { method: "POST",
  body: { nomor_induk, kata_sandi, konfirmasi_kata_sandi } });

// Daftar materi dengan filter (buang parameter kosong)
const params = new URLSearchParams(
  Object.entries({ mata_kuliah, semester, q, page, limit })
    .filter(([, v]) => v !== "" && v != null)
);
const daftar = await api(`/materi?${params}`, { token });

// Upload materi (admin): pakai FormData
const fd = new FormData();
fd.append("judul", judul);
fd.append("mata_kuliah", mataKuliah);
fd.append("semester", String(semester));
if (deskripsi) fd.append("deskripsi", deskripsi);
fd.append("file", fileInput.files[0]);
const materi = await api("/materi", { method: "POST", formData: fd, token });

// Terbitkan / arsipkan materi (admin)
await api(`/materi/${id}`, { method: "PUT", body: { status: "arsip" }, token });

// Nonaktifkan mahasiswa (admin)
await api(`/mahasiswa/${id}`, { method: "PUT", body: { status: "nonaktif" }, token });

// Dashboard mahasiswa
const dash = await api("/mahasiswa/dashboard", { token });

// Mahasiswa membuka materi → catat "dilihat", lalu buka file
await api(`/materi/${m.id}/progres`, { method: "POST", body: { status: "dilihat" }, token });
window.open(m.url, "_blank", "noopener");

// Tandai selesai, lalu pakai status dari RESPONS
const p = await api(`/materi/${m.id}/progres`, { method: "POST", body: { status: "selesai" }, token });
// p.status === "selesai"
```

### 10.4 Validasi Sisi Klien yang Disarankan

Samakan dengan aturan backend agar pengguna mendapat pesan cepat dan agar bug upload (masalah #1) tidak terpicu:

| Form | Aturan |
|---|---|
| Registrasi | NIM cocok `POLA_NIM` · password 8–72 karakter · konfirmasi sama dengan password |
| Login | NIM tidak kosong · password tidak kosong (kirim apa adanya; < 8 karakter pasti ditolak) |
| Tambah mahasiswa | NIM cocok `POLA_NIM` · nama 3–100 karakter |
| Upload materi | judul 3–200 · mata kuliah 2–100 · semester 1–8 · deskripsi ≤ 2000 · ekstensi file `.pdf/.docx/.pptx/.xlsx` |

### 10.5 Menampilkan Tanggal

```js
// Backend mengirim UTC tanpa penanda zona. Tambahkan "Z" agar dibaca sebagai UTC.
export const formatTanggal = (s) =>
  new Date(s + "Z").toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Jakarta" });
```

### 10.6 Definisi Tipe (JSDoc)

```js
/** @typedef {"admin"|"mahasiswa"} Peran */
/** @typedef {"belum_aktif"|"aktif"|"nonaktif"} StatusAkun */
/** @typedef {"draft"|"terbit"|"arsip"} StatusMateri */
/** @typedef {"belum"|"dilihat"|"selesai"} StatusBelajar */

/** @typedef {{ id:number, peran:Peran, nomor_induk:string, nama:string, status:StatusAkun }} Pengguna */
/** @typedef {{ id:number, nomor_induk:string, nama:string, angkatan:number|null, status:StatusAkun, dibuat_pada:string }} Mahasiswa */
/** @typedef {{ id:number, judul:string, deskripsi:string|null, mata_kuliah:string, semester:number,
 *             jenis:string, url:string, dibuat_oleh:number|null, status:StatusMateri,
 *             dibuat_pada:string, diubah_pada:string, status_belajar:StatusBelajar|null }} Materi */
/** @typedef {{ semester:number, total_materi:number, total_mata_kuliah:number }} KategoriSemester */
/** @typedef {{ mata_kuliah:string, total_materi:number }} KategoriMataKuliah */
/** @template T @typedef {{ items:T[], total:number, page:number, limit:number, total_pages:number }} Halaman */
/** @typedef {{ access_token:string, token_type:"bearer", expires_in:number, pengguna:Pengguna }} LoginResponse */
/** @typedef {{ id:number, judul:string, mata_kuliah:string, semester:number, jenis:string,
 *             url:string, dibuat_pada:string, status_belajar:StatusBelajar }} MateriDashboard */
/** @typedef {{ profil:{id:number,nama:string,nomor_induk:string,angkatan:number|null},
 *             statistik:{total_materi:number,materi_dilihat:number,materi_selesai:number,persen_selesai:number},
 *             lanjutkan_belajar:MateriDashboard|null, materi_terbaru:MateriDashboard[],
 *             progres_mata_kuliah:{mata_kuliah:string,total:number,selesai:number,persen:number}[] }} DashboardMahasiswa */
```

### 10.7 Alur Menu Materi Kuliah (Mahasiswa)

Tiga langkah bertahap, masing-masing satu request:

```
Langkah 1: pilih semester         GET /materi/kategori/semester
Langkah 2: pilih mata kuliah      GET /materi/kategori/mata-kuliah?semester={n}
Langkah 3: lihat daftar materi    GET /materi?semester={n}&mata_kuliah={nama}
```

```js
// 1) Kartu semester 1-8 (selalu 8 entri)
const { items: semesterList } = await api("/materi/kategori/semester", { token });
// semesterList[i] = { semester, total_materi, total_mata_kuliah }

// 2) Setelah mahasiswa memilih semester
const kat = await api(`/materi/kategori/mata-kuliah?semester=${semester}`, { token });
// kat.items = [{ mata_kuliah, total_materi }, ...]  (bisa kosong)

// 3) Setelah memilih mata kuliah
const q = new URLSearchParams({ semester, mata_kuliah: mataKuliah, limit: 100 });
const daftar = await api(`/materi?${q}`, { token });
// daftar.items[i].status_belajar: "belum" | "dilihat" | "selesai"
```

Catatan:
- Tampilkan *empty state* bila `items` kosong, dan beri keterangan pada semester dengan `total_materi = 0`.
- Label `status_belajar` pada tiap materi bisa dipakai untuk ikon/badge (belum, sedang dibaca, selesai).
- Saat mahasiswa membuka materi, panggil `POST /materi/{id}/progres` (lihat 7.2), lalu perbarui label dari `status` pada **respons**.
- Jika `total` lebih dari `limit`, gunakan `page` untuk halaman berikutnya (lihat 1.4).

---

## 11. Catatan Penting & Masalah yang Diketahui

Bagian ini jujur soal perilaku backend saat ini. Frontend perlu mengantisipasinya sampai diperbaiki.

| # | Masalah | Dampak & cara menyiasati di frontend | Status |
|---|---|---|---|
| 1 | **Upload materi dengan nilai di luar aturan menghasilkan `500`**, bukan `422`. Berlaku untuk judul < 3 karakter, semester di luar 1–8, mata kuliah < 2 karakter, deskripsi > 2000. File juga sempat tersimpan di server sebelum gagal | Validasi semua field di frontend sebelum upload (lihat 10.4). Jangan tampilkan teks `500` mentah | ⏳ Perlu perbaikan backend |
| 2 | **Token hanya 15 menit, tanpa refresh token** | Pengguna terlempar ke login saat token habis. Tangani `401` secara global (10.2). Bisa memakai `expires_in` untuk menampilkan peringatan sesi | ⏳ Direncanakan |
| 3 | **File upload bisa hilang saat redeploy** jika Railway Volume belum dipasang | Tautan `url` bisa menjadi `404`. Tampilkan pesan "File tidak tersedia" bila gagal dibuka | ⏳ Infrastruktur |
| 4 | **Folder `/uploads` terbuka tanpa token.** Siapa pun yang tahu URL bisa mengunduh | Nama file acak (32 hex) sehingga sulit ditebak, tetapi bukan pengamanan sebenarnya. Jangan unggah materi rahasia | ⏳ Direncanakan |
| 5 | `DELETE /materi/{id}` tidak menghapus file fisiknya | Tidak berdampak ke frontend | ⏳ |
| 6 | Pesan login `403` bernada "belum aktif" juga muncul untuk akun yang **dinonaktifkan** | Tampilkan `detail` apa adanya | ℹ️ |
| 7 | `GET /mahasiswa` belum punya pencarian/filter | Lakukan pencarian di klien pada halaman yang termuat, atau minta backend menambahkan `q` | ⏳ |
| 8 | ~~Belum ada endpoint daftar mata kuliah unik~~ | Sudah ada: `GET /materi/kategori/mata-kuliah` (5.7) | ✅ Selesai |
| 9 | CORS terbuka untuk semua origin | Tidak berdampak ke frontend. Akan dibatasi ke domain frontend saat produksi | ⏳ |
| 10 | Fitur **Kuis dinonaktifkan** | Hapus/sembunyikan menu, halaman, dan statistik kuis di frontend. `total_kuis` tidak lagi dikirim | ✅ Selesai di backend |

### Riwayat Perubahan

| Tanggal | Perubahan |
|---|---|
| 28 Okt 2026 | Menambah `GET /materi/kategori/semester` dan `GET /materi/kategori/mata-kuliah` untuk menu Materi Kuliah. Menambah field `status_belajar` pada objek Materi (terisi untuk mahasiswa, `null` untuk admin) |
| 27 Okt 2026 | Dokumen dibuat. Menambah `GET /mahasiswa/dashboard` dan `POST /materi/{id}/progres`. `GET /materi` dan `GET /materi/{id}` kini memfilter materi `terbit` untuk mahasiswa. Menghapus `total_kuis` dari `GET /admin/dashboard`. Menghapus seluruh endpoint kuis |