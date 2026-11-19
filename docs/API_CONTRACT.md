# Kontrak API INF-Learning (Backend)

| | |
|---|---|
| Versi API | 0.1.0 |
| Dibuat | 19-11-2026 |
| Base URL (production) | `https://inf-learning-production.up.railway.app` |
| Base URL (lokal) | `http://localhost:8000` |
| Prefix | `/api/v1` |
| Dokumentasi interaktif | `/docs` (Swagger UI) dan `/openapi.json` selalu mengikuti versi yang sedang berjalan |

> Dokumen ini dibuat otomatis dari kode backend terbaru: struktur dari OpenAPI, peran akses dan daftar error dari kode, dan contoh respons dari panggilan nyata ke aplikasi. Bila ada selisih dengan perilaku server, anggap server sebagai acuan dan laporkan ke tim backend.

## 1. Ketentuan umum

### 1.1 Format
- Data dikirim dan diterima sebagai **JSON UTF-8** (`Content-Type: application/json`). Endpoint upload memakai **`multipart/form-data`**.
- **Waktu** (`dibuat_pada`, `diubah_pada`, dan sejenisnya) dalam **UTC tanpa penanda zona**, contoh `2026-11-19T07:32:33.326606`. FE harus menganggapnya UTC lalu menampilkannya sesuai zona pengguna (WIB = UTC+7).
- **Paginasi** memakai query `page` (mulai 1) dan `limit`; respons daftar berbentuk `{ items, total, page, limit, total_pages }`.

### 1.2 Autentikasi dan sesi
1. Panggil `POST /api/v1/auth/login` dan simpan `access_token`.
2. Kirim di setiap request yang butuh login: header `Authorization: Bearer <access_token>`.
3. **Batas tidak aktif 20 menit.** Setiap request yang berhasil memperpanjang sesi. Bila tidak ada request selama 20 menit, request berikutnya ditolak **401** dan pengguna harus login ulang. Field `expires_in` pada respons login (detik) adalah lama tidak-aktif yang diizinkan (1200 detik), bisa dipakai FE untuk timer idle.
4. **Batas umur mutlak 12 jam** sejak login, tidak diperpanjang oleh aktivitas.
5. **Jangan** membuat polling otomatis ke API (mis. refresh data tiap menit): request itu dihitung sebagai aktivitas dan sesi tidak akan pernah habis.
6. Logout: `POST /api/v1/auth/logout` menghapus sesi di server; token yang sama langsung tidak berlaku lagi.
7. FE harus menangani **401** di semua endpoint dengan mengarahkan ke halaman login.

### 1.3 Peran akses
| Peran | Keterangan |
|---|---|
| Mahasiswa | Hanya melihat materi berstatus `terbit`; mengakses fitur khusus mahasiswa. |
| Admin | Mengelola materi dan mahasiswa; melihat semua status materi. |

Akun yang berstatus `nonaktif` ditolak **403** `Akun Anda nonaktif` pada setiap request, walau sesinya belum berakhir. Peran yang salah menghasilkan **403** `Anda tidak memiliki akses ke endpoint ini`.

### 1.4 Format error
Error biasa:
```json
{ "detail": "Pesan error dalam Bahasa Indonesia" }
```
Error validasi (**422**), `loc` menunjuk field yang salah:
```json
{ "detail": [ { "type": "string_too_short", "loc": ["body", "kata_sandi"], "msg": "String should have at least 8 characters", "input": "abc" } ] }
```

### 1.5 Aturan data
| Data | Aturan |
|---|---|
| NIM | 10 digit dengan pola `2?88??????` (contoh `2488010071`) |
| Angkatan | 2000 sampai 2100 |
| Kata sandi | 8 sampai 72 karakter |
| Semester | 1 sampai 8 |
| Jenis materi (`jenis`) | `pdf`, `ppt`, `pptx`, `doc`, `docx`, `xls`, `xlsx` (upload file hanya menerima `pdf`, `docx`, `pptx`, `xlsx`) |
| File materi | format `pdf`, `docx`, `pptx`, `xlsx`; maksimal 10 MB |
| Foto profil | `JPG`, `PNG`, `WEBP` (dikenali dari isi file); maksimal 2 MB |
| Impor CSV | `.csv` UTF-8; maksimal 1 MB dan 2000 baris |
| Status akun | `belum_aktif`, `aktif`, `nonaktif` |
| Status materi | `draft`, `terbit`, `arsip` |
| Status belajar | `belum`, `dilihat`, `selesai` |

## 2. Daftar endpoint

| No | Method | Path | Akses | Ringkasan |
|---|---|---|---|---|
| 1 | `POST` | `/api/v1/auth/registrasi` | Publik (tanpa token) | Aktivasi akun mahasiswa |
| 2 | `POST` | `/api/v1/auth/login` | Publik (tanpa token) | Login dan ambil access token |
| 3 | `POST` | `/api/v1/auth/logout` | Semua pengguna login | Logout (akhiri sesi di server) |
| 4 | `GET` | `/api/v1/auth/me` | Semua pengguna login | Data pengguna yang sedang login |
| 5 | `GET` | `/api/v1/materi` | Semua pengguna login | List materi (filter + paginasi) |
| 6 | `POST` | `/api/v1/materi` | Admin | Tambah materi via upload file (admin only) |
| 7 | `GET` | `/api/v1/materi/kategori/semester` | Semua pengguna login | Kategori semester beserta jumlah materi |
| 8 | `GET` | `/api/v1/materi/kategori/mata-kuliah` | Semua pengguna login | Kategori mata kuliah pada sebuah semester |
| 9 | `GET` | `/api/v1/materi/{materi_id}` | Semua pengguna login | Detail materi |
| 10 | `PUT` | `/api/v1/materi/{materi_id}` | Admin | Edit materi via JSON (admin only) |
| 11 | `DELETE` | `/api/v1/materi/{materi_id}` | Admin | Hapus materi beserta file fisiknya (admin only) |
| 12 | `GET` | `/api/v1/materi/{materi_id}/unduh` | Semua pengguna login | Unduh file materi |
| 13 | `PUT` | `/api/v1/materi/{materi_id}/edit` | Admin | Edit materi via form, file opsional (admin only) |
| 14 | `GET` | `/api/v1/mahasiswa/dashboard` | Mahasiswa | Ringkasan dashboard mahasiswa (mahasiswa only) |
| 15 | `POST` | `/api/v1/materi/{materi_id}/progres` | Mahasiswa | Catat progres belajar pada sebuah materi (mahasiswa only) |
| 16 | `PUT` | `/api/v1/profil/foto` | Mahasiswa | Unggah atau ganti foto profil (mahasiswa only) |
| 17 | `DELETE` | `/api/v1/profil/foto` | Mahasiswa | Hapus foto profil (mahasiswa only) |
| 18 | `GET` | `/api/v1/kontak-admin/whatsapp` | Mahasiswa | Tautan WhatsApp untuk menghubungi admin (mahasiswa only) |
| 19 | `GET` | `/api/v1/mahasiswa` | Admin | List mahasiswa + pencarian & filter (admin only) |
| 20 | `POST` | `/api/v1/mahasiswa` | Admin | Tambah mahasiswa manual (admin only) |
| 21 | `GET` | `/api/v1/mahasiswa/ringkasan` | Admin | Jumlah mahasiswa per status akun (admin only) |
| 22 | `POST` | `/api/v1/mahasiswa/import` | Admin | Impor mahasiswa dari file CSV (admin only) |
| 23 | `GET` | `/api/v1/mahasiswa/{id}` | Admin | Detail mahasiswa (admin only) |
| 24 | `PUT` | `/api/v1/mahasiswa/{id}` | Admin | Edit data/status mahasiswa (admin only) |
| 25 | `DELETE` | `/api/v1/mahasiswa/{id}` | Admin | Hapus mahasiswa (admin only) |
| 26 | `POST` | `/api/v1/mahasiswa/{id}/reset-akun` | Admin | Reset akun mahasiswa (admin only) |
| 27 | `GET` | `/api/v1/admin/dashboard` | Admin | Ambil data ringkasan untuk dashboard admin |
| 28 | `GET` | `/` | Publik (tanpa token) | root |
| 29 | `GET` | `/health` | Publik (tanpa token) | health |

## 3. Detail endpoint

### Autentikasi

#### `POST /api/v1/auth/registrasi`

**Aktivasi akun mahasiswa**

Aktivasi akun dengan NIM yang sudah diinput admin. Set password dan ubah status akun jadi aktif.

- **Akses:** Publik (tanpa token)

**Body** (`application/json`)

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `nomor_induk` | string | ya | min 10 karakter; maks 10 karakter |
| `kata_sandi` | string | ya | min 8 karakter; maks 72 karakter |
| `konfirmasi_kata_sandi` | string \| null | tidak | min 8 karakter; maks 72 karakter |

Contoh request:

```json
{
  "nomor_induk": "2388010001",
  "kata_sandi": "Rahasia123",
  "konfirmasi_kata_sandi": "Rahasia123"
}
```

**Respons sukses: `200`**

| Field | Tipe | Keterangan |
|---|---|---|
| `id` | integer |  |
| `peran` | string |  |
| `nomor_induk` | string |  |
| `nama` | string |  |
| `status` | string |  |
| `dibuat_pada` | string (date-time, UTC) |  |

Contoh respons:

```json
{
  "id": 2,
  "peran": "mahasiswa",
  "nomor_induk": "2388010001",
  "nama": "Budi Santoso",
  "status": "aktif",
  "dibuat_pada": "2026-11-19T07:33:39.836112"
}
```

**Kemungkinan error**

| Status | Kondisi (isi `detail`) |
|---|---|
| 403 | Akun Anda dinonaktifkan. Hubungi admin. |
| 404 | NIM tidak terdaftar. Hubungi admin. |
| 409 | Akun sudah aktif. Silakan login. |
| 422 | Data yang dikirim tidak valid (lihat format error validasi) |

#### `POST /api/v1/auth/login`

**Login dan ambil access token**

Sesi berakhir otomatis jika tidak ada aktivitas selama `expires_in` detik (default 20 menit). Setiap request ke API memperpanjang sesi.

- **Akses:** Publik (tanpa token)

**Body** (`application/json`)

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `nomor_induk` | string | ya | min 3 karakter; maks 50 karakter |
| `kata_sandi` | string | ya | min 8 karakter; maks 72 karakter |

Contoh request:

```json
{
  "nomor_induk": "2388010001",
  "kata_sandi": "Rahasia123"
}
```

**Respons sukses: `200`**

| Field | Tipe | Keterangan |
|---|---|---|
| `access_token` | string |  |
| `token_type` | string | default `bearer` |
| `expires_in` | integer |  |
| `pengguna` | [PenggunaRingkas](#skema-penggunaringkas) |  |

Contoh respons:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5…",
  "token_type": "bearer",
  "expires_in": 1200,
  "pengguna": {
    "id": 2,
    "peran": "mahasiswa",
    "nomor_induk": "2388010001",
    "nama": "Budi Santoso",
    "status": "aktif",
    "foto_url": null
  }
}
```

**Kemungkinan error**

| Status | Kondisi (isi `detail`) |
|---|---|
| 401 | NIM atau kata sandi salah |
| 403 | Akun Anda nonaktif. Silakan hubungi admin. |
| 404 | NIM tidak terdaftar |
| 409 | NIM belum teregistrasi |
| 422 | Data yang dikirim tidak valid (lihat format error validasi) |

#### `POST /api/v1/auth/logout`

**Logout (akhiri sesi di server)**

Menghapus sesi saat ini; token yang sama langsung tidak berlaku lagi.

- **Akses:** Semua pengguna login (header `Authorization: Bearer <token>`)

**Respons sukses: `200`**

Contoh respons:

```json
{
  "detail": "Berhasil keluar"
}
```

**Kemungkinan error**

| Status | Kondisi (isi `detail`) |
|---|---|
| 401 | Token tidak ada<br>Token tidak valid atau sudah kedaluwarsa<br>Sesi tidak ditemukan atau sudah berakhir. Silakan login kembali<br>Sesi berakhir karena tidak ada aktivitas selama 20 menit. Silakan login kembali |

#### `GET /api/v1/auth/me`

**Data pengguna yang sedang login**

- **Akses:** Semua pengguna login (header `Authorization: Bearer <token>`)

**Respons sukses: `200`**

| Field | Tipe | Keterangan |
|---|---|---|
| `id` | integer |  |
| `peran` | string |  |
| `nomor_induk` | string |  |
| `nama` | string |  |
| `status` | string |  |
| `foto_url` | string \| null |  |

Contoh respons:

```json
{
  "id": 2,
  "peran": "mahasiswa",
  "nomor_induk": "2388010001",
  "nama": "Budi Santoso",
  "status": "aktif",
  "foto_url": null
}
```

**Kemungkinan error**

| Status | Kondisi (isi `detail`) |
|---|---|
| 401 | Token tidak ada<br>Token tidak valid atau sudah kedaluwarsa<br>Sesi tidak ditemukan atau sudah berakhir. Silakan login kembali<br>Sesi berakhir karena tidak ada aktivitas selama 20 menit. Silakan login kembali |
| 403 | Akun Anda nonaktif |

### Materi

#### `GET /api/v1/materi`

**List materi (filter + paginasi)**

- **Akses:** Semua pengguna login (header `Authorization: Bearer <token>`)

**Parameter**

| Nama | Lokasi | Tipe | Wajib | Keterangan |
|---|---|---|---|---|
| `mata_kuliah` | query | string \| null | tidak |  |
| `semester` | query | integer \| null | tidak | min 1; maks 8 |
| `jenis` | query | string \| null | tidak |  |
| `q` | query | string \| null | tidak |  |
| `page` | query | integer | tidak | min 1; default `1` |
| `limit` | query | integer | tidak | min 1; maks 100; default `20` |

Contoh request:

Query: `semester=3&mata_kuliah=Basis Data&page=1&limit=20`

**Respons sukses: `200`**

| Field | Tipe | Keterangan |
|---|---|---|
| `items` | array&lt;[MateriResponse](#skema-materiresponse)&gt; |  |
| `total` | integer |  |
| `page` | integer |  |
| `limit` | integer |  |
| `total_pages` | integer |  |

Contoh respons:

```json
{
  "items": [
    {
      "id": 2,
      "judul": "Slide ERD Pertemuan 2",
      "deskripsi": null,
      "mata_kuliah": "Basis Data",
      "semester": 3,
      "jenis": "pptx",
      "url": "https://inf-learning-production.up.railway.app/uploads/1c04e63e21f142a1a3e7ac3a54a799a8.pptx",
      "dibuat_oleh": 1,
      "status": "terbit",
      "dibuat_pada": "2026-11-19T07:33:40.347731",
      "diubah_pada": "2026-11-19T07:33:40.347738",
      "status_belajar": "belum",
      "url_pratinjau": "https://view.officeapps.live.com/op/embed.aspx?src=https%3A%2F%2Finf-learning-production.up.railway.app%2Fuploads%2F1c04e63e21f142a1a3e7ac3a54a799a8.pptx"
    },
    {
      "id": 1,
      "judul": "Pengantar Basis Data",
      "deskripsi": "Konsep dasar basis data relasional",
      "mata_kuliah": "Basis Data",
      "semester": 3,
      "jenis": "pdf",
      "url": "https://inf-learning-production.up.railway.app/uploads/93936b50b75646d1aefaa9f5b079c06c.pdf",
      "dibuat_oleh": 1,
      "status": "terbit",
      "dibuat_pada": "2026-11-19T07:33:40.338127",
      "diubah_pada": "2026-11-19T07:33:40.338134",
      "status_belajar": "belum",
      "url_pratinjau": "https://inf-learning-production.up.railway.app/uploads/93936b50b75646d1aefaa9f5b079c06c.pdf"
    }
  ],
  "total": 2,
  "page": 1,
  "limit": 20,
  "total_pages": 1
}
```

**Kemungkinan error**

| Status | Kondisi (isi `detail`) |
|---|---|
| 401 | Token tidak ada<br>Token tidak valid atau sudah kedaluwarsa<br>Sesi tidak ditemukan atau sudah berakhir. Silakan login kembali<br>Sesi berakhir karena tidak ada aktivitas selama 20 menit. Silakan login kembali |
| 403 | Akun Anda nonaktif |
| 422 | Data yang dikirim tidak valid (lihat format error validasi) |

#### `POST /api/v1/materi`

**Tambah materi via upload file (admin only)**

- **Akses:** Admin (header `Authorization: Bearer <token>`)

**Body** (`multipart/form-data`)

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `judul` | string | ya |  |
| `mata_kuliah` | string | ya |  |
| `semester` | integer | ya |  |
| `deskripsi` | string \| null | tidak |  |
| `file` | file | ya | pdf, docx, pptx, atau xlsx; maks 10 MB |

Contoh request:

Form fields:
```json
{
  "judul": "Pengantar Basis Data",
  "mata_kuliah": "Basis Data",
  "semester": "3",
  "deskripsi": "Konsep dasar basis data relasional"
}
```
(+ file `file`)

**Respons sukses: `201`**

| Field | Tipe | Keterangan |
|---|---|---|
| `id` | integer |  |
| `judul` | string |  |
| `deskripsi` | string \| null |  |
| `mata_kuliah` | string |  |
| `semester` | integer |  |
| `jenis` | string |  |
| `url` | string |  |
| `dibuat_oleh` | integer \| null |  |
| `status` | string |  |
| `dibuat_pada` | string (date-time, UTC) |  |
| `diubah_pada` | string (date-time, UTC) |  |
| `status_belajar` | enum: `belum`, `dilihat`, `selesai` \| null |  |
| `url_pratinjau` | string \| null | Alamat yang bisa dipasang langsung di `<iframe>`: file PDF itu sendiri, atau viewer Office Online untuk PPT/Word/Excel. Null bila tidak ada pratinjau (tampilkan tombol unduh). |

Contoh respons:

```json
{
  "id": 1,
  "judul": "Pengantar Basis Data",
  "deskripsi": "Konsep dasar basis data relasional",
  "mata_kuliah": "Basis Data",
  "semester": 3,
  "jenis": "pdf",
  "url": "https://inf-learning-production.up.railway.app/uploads/93936b50b75646d1aefaa9f5b079c06c.pdf",
  "dibuat_oleh": 1,
  "status": "terbit",
  "dibuat_pada": "2026-11-19T07:33:40.338127",
  "diubah_pada": "2026-11-19T07:33:40.338134",
  "status_belajar": null,
  "url_pratinjau": "https://inf-learning-production.up.railway.app/uploads/93936b50b75646d1aefaa9f5b079c06c.pdf"
}
```

**Kemungkinan error**

| Status | Kondisi (isi `detail`) |
|---|---|
| 400 | Format file tidak diizinkan<br>File kosong |
| 401 | Token tidak ada<br>Token tidak valid atau sudah kedaluwarsa<br>Sesi tidak ditemukan atau sudah berakhir. Silakan login kembali<br>Sesi berakhir karena tidak ada aktivitas selama 20 menit. Silakan login kembali |
| 403 | Akun Anda nonaktif<br>Anda tidak memiliki akses ke endpoint ini |
| 413 | Ukuran file maksimal 10 MB |
| 422 | Data yang dikirim tidak valid (lihat format error validasi) |

#### `GET /api/v1/materi/kategori/semester`

**Kategori semester beserta jumlah materi**

- **Akses:** Semua pengguna login (header `Authorization: Bearer <token>`)

**Respons sukses: `200`**

| Field | Tipe | Keterangan |
|---|---|---|
| `items` | array&lt;[KategoriSemester](#skema-kategorisemester)&gt; |  |

Contoh respons:

```json
{
  "items": [
    {
      "semester": 1,
      "total_materi": 1,
      "total_mata_kuliah": 1
    },
    {
      "semester": 2,
      "total_materi": 0,
      "total_mata_kuliah": 0
    }
  ]
}
```

**Kemungkinan error**

| Status | Kondisi (isi `detail`) |
|---|---|
| 401 | Token tidak ada<br>Token tidak valid atau sudah kedaluwarsa<br>Sesi tidak ditemukan atau sudah berakhir. Silakan login kembali<br>Sesi berakhir karena tidak ada aktivitas selama 20 menit. Silakan login kembali |
| 403 | Akun Anda nonaktif |

#### `GET /api/v1/materi/kategori/mata-kuliah`

**Kategori mata kuliah pada sebuah semester**

- **Akses:** Semua pengguna login (header `Authorization: Bearer <token>`)

**Parameter**

| Nama | Lokasi | Tipe | Wajib | Keterangan |
|---|---|---|---|---|
| `semester` | query | integer | ya | min 1; maks 8 |

Contoh request:

Query: `semester=3`

**Respons sukses: `200`**

| Field | Tipe | Keterangan |
|---|---|---|
| `semester` | integer |  |
| `items` | array&lt;[KategoriMataKuliah](#skema-kategorimatakuliah)&gt; |  |

Contoh respons:

```json
{
  "semester": 3,
  "items": [
    {
      "mata_kuliah": "Basis Data",
      "total_materi": 2
    }
  ]
}
```

**Kemungkinan error**

| Status | Kondisi (isi `detail`) |
|---|---|
| 401 | Token tidak ada<br>Token tidak valid atau sudah kedaluwarsa<br>Sesi tidak ditemukan atau sudah berakhir. Silakan login kembali<br>Sesi berakhir karena tidak ada aktivitas selama 20 menit. Silakan login kembali |
| 403 | Akun Anda nonaktif |
| 422 | Data yang dikirim tidak valid (lihat format error validasi) |

#### `GET /api/v1/materi/{materi_id}`

**Detail materi**

- **Akses:** Semua pengguna login (header `Authorization: Bearer <token>`)

**Parameter**

| Nama | Lokasi | Tipe | Wajib | Keterangan |
|---|---|---|---|---|
| `materi_id` | path | integer | ya |  |

**Respons sukses: `200`**

| Field | Tipe | Keterangan |
|---|---|---|
| `id` | integer |  |
| `judul` | string |  |
| `deskripsi` | string \| null |  |
| `mata_kuliah` | string |  |
| `semester` | integer |  |
| `jenis` | string |  |
| `url` | string |  |
| `dibuat_oleh` | integer \| null |  |
| `status` | string |  |
| `dibuat_pada` | string (date-time, UTC) |  |
| `diubah_pada` | string (date-time, UTC) |  |
| `status_belajar` | enum: `belum`, `dilihat`, `selesai` \| null |  |
| `url_pratinjau` | string \| null | Alamat yang bisa dipasang langsung di `<iframe>`: file PDF itu sendiri, atau viewer Office Online untuk PPT/Word/Excel. Null bila tidak ada pratinjau (tampilkan tombol unduh). |

Contoh respons:

```json
{
  "id": 1,
  "judul": "Pengantar Basis Data",
  "deskripsi": "Konsep dasar basis data relasional",
  "mata_kuliah": "Basis Data",
  "semester": 3,
  "jenis": "pdf",
  "url": "https://inf-learning-production.up.railway.app/uploads/93936b50b75646d1aefaa9f5b079c06c.pdf",
  "dibuat_oleh": 1,
  "status": "terbit",
  "dibuat_pada": "2026-11-19T07:33:40.338127",
  "diubah_pada": "2026-11-19T07:33:40.338134",
  "status_belajar": "belum",
  "url_pratinjau": "https://inf-learning-production.up.railway.app/uploads/93936b50b75646d1aefaa9f5b079c06c.pdf"
}
```

**Kemungkinan error**

| Status | Kondisi (isi `detail`) |
|---|---|
| 401 | Token tidak ada<br>Token tidak valid atau sudah kedaluwarsa<br>Sesi tidak ditemukan atau sudah berakhir. Silakan login kembali<br>Sesi berakhir karena tidak ada aktivitas selama 20 menit. Silakan login kembali |
| 403 | Akun Anda nonaktif |
| 404 | Materi tidak ditemukan |
| 422 | Data yang dikirim tidak valid (lihat format error validasi) |

#### `PUT /api/v1/materi/{materi_id}`

**Edit materi via JSON (admin only)**

- **Akses:** Admin (header `Authorization: Bearer <token>`)

**Parameter**

| Nama | Lokasi | Tipe | Wajib | Keterangan |
|---|---|---|---|---|
| `materi_id` | path | integer | ya |  |

**Body** (`application/json`)

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `judul` | string \| null | tidak | min 3 karakter; maks 200 karakter |
| `deskripsi` | string \| null | tidak | maks 2000 karakter |
| `mata_kuliah` | string \| null | tidak | min 2 karakter; maks 100 karakter |
| `semester` | integer \| null | tidak | min 1.0; maks 8.0 |
| `jenis` | string \| null | tidak | min 3 karakter; maks 20 karakter |
| `url` | string \| null | tidak | min 5 karakter; maks 500 karakter |
| `status` | string \| null | tidak |  |

Contoh request:

```json
{
  "status": "terbit"
}
```

**Respons sukses: `200`**

| Field | Tipe | Keterangan |
|---|---|---|
| `id` | integer |  |
| `judul` | string |  |
| `deskripsi` | string \| null |  |
| `mata_kuliah` | string |  |
| `semester` | integer |  |
| `jenis` | string |  |
| `url` | string |  |
| `dibuat_oleh` | integer \| null |  |
| `status` | string |  |
| `dibuat_pada` | string (date-time, UTC) |  |
| `diubah_pada` | string (date-time, UTC) |  |
| `status_belajar` | enum: `belum`, `dilihat`, `selesai` \| null |  |
| `url_pratinjau` | string \| null | Alamat yang bisa dipasang langsung di `<iframe>`: file PDF itu sendiri, atau viewer Office Online untuk PPT/Word/Excel. Null bila tidak ada pratinjau (tampilkan tombol unduh). |

Contoh respons:

```json
{
  "id": 1,
  "judul": "Pengantar Basis Data",
  "deskripsi": "Konsep dasar basis data relasional",
  "mata_kuliah": "Basis Data",
  "semester": 3,
  "jenis": "pdf",
  "url": "https://inf-learning-production.up.railway.app/uploads/93936b50b75646d1aefaa9f5b079c06c.pdf",
  "dibuat_oleh": 1,
  "status": "terbit",
  "dibuat_pada": "2026-11-19T07:33:40.338127",
  "diubah_pada": "2026-11-19T07:33:40.338134",
  "status_belajar": null,
  "url_pratinjau": "https://inf-learning-production.up.railway.app/uploads/93936b50b75646d1aefaa9f5b079c06c.pdf"
}
```

**Kemungkinan error**

| Status | Kondisi (isi `detail`) |
|---|---|
| 400 | Tidak ada field yang diubah |
| 401 | Token tidak ada<br>Token tidak valid atau sudah kedaluwarsa<br>Sesi tidak ditemukan atau sudah berakhir. Silakan login kembali<br>Sesi berakhir karena tidak ada aktivitas selama 20 menit. Silakan login kembali |
| 403 | Akun Anda nonaktif<br>Anda tidak memiliki akses ke endpoint ini |
| 404 | Materi tidak ditemukan |
| 422 | Data yang dikirim tidak valid (lihat format error validasi) |

#### `DELETE /api/v1/materi/{materi_id}`

**Hapus materi beserta file fisiknya (admin only)**

- **Akses:** Admin (header `Authorization: Bearer <token>`)

**Parameter**

| Nama | Lokasi | Tipe | Wajib | Keterangan |
|---|---|---|---|---|
| `materi_id` | path | integer | ya |  |

**Respons sukses: `204`**

Tanpa isi (body kosong).

**Kemungkinan error**

| Status | Kondisi (isi `detail`) |
|---|---|
| 401 | Token tidak ada<br>Token tidak valid atau sudah kedaluwarsa<br>Sesi tidak ditemukan atau sudah berakhir. Silakan login kembali<br>Sesi berakhir karena tidak ada aktivitas selama 20 menit. Silakan login kembali |
| 403 | Akun Anda nonaktif<br>Anda tidak memiliki akses ke endpoint ini |
| 404 | Materi tidak ditemukan |
| 422 | Data yang dikirim tidak valid (lihat format error validasi) |

#### `GET /api/v1/materi/{materi_id}/unduh`

**Unduh file materi**

Mengirim file dengan header `Content-Disposition: attachment` dan nama file dari judul materi. Mahasiswa hanya bisa mengunduh materi berstatus terbit.

- **Akses:** Semua pengguna login (header `Authorization: Bearer <token>`)

**Parameter**

| Nama | Lokasi | Tipe | Wajib | Keterangan |
|---|---|---|---|---|
| `materi_id` | path | integer | ya |  |

**Respons sukses: `200`**

File dikirim sebagai unduhan. Header: `Content-Disposition: attachment; filename*=utf-8''Pengantar%20Basis%20Data.pdf`, `Content-Type` sesuai format file (mis. `application/pdf`). Nama file diambil dari judul materi. FE harus memakai `fetch` dengan header Authorization lalu menyimpan hasilnya sebagai blob.

**Kemungkinan error**

| Status | Kondisi (isi `detail`) |
|---|---|
| 400 | Materi ini berupa tautan eksternal dan tidak dapat diunduh dari server |
| 401 | Token tidak ada<br>Token tidak valid atau sudah kedaluwarsa<br>Sesi tidak ditemukan atau sudah berakhir. Silakan login kembali<br>Sesi berakhir karena tidak ada aktivitas selama 20 menit. Silakan login kembali |
| 403 | Akun Anda nonaktif |
| 404 | Materi tidak ditemukan<br>File materi tidak ditemukan di server |
| 422 | Data yang dikirim tidak valid (lihat format error validasi) |

#### `PUT /api/v1/materi/{materi_id}/edit`

**Edit materi via form, file opsional (admin only)**

Hanya field yang dikirim yang diubah. `deskripsi` kosong berarti dikosongkan. Jika `file` dikirim, file lama diganti dan dihapus dari server.

- **Akses:** Admin (header `Authorization: Bearer <token>`)

**Parameter**

| Nama | Lokasi | Tipe | Wajib | Keterangan |
|---|---|---|---|---|
| `materi_id` | path | integer | ya |  |

**Body** (`multipart/form-data`)

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `judul` | string \| null | tidak |  |
| `mata_kuliah` | string \| null | tidak |  |
| `semester` | integer \| null | tidak |  |
| `deskripsi` | string \| null | tidak |  |
| `file` | file \| null | tidak | pdf, docx, pptx, atau xlsx; maks 10 MB |

Contoh request:

Form fields:
```json
{
  "deskripsi": "Pengenalan algoritma dan pemrograman"
}
```

**Respons sukses: `200`**

| Field | Tipe | Keterangan |
|---|---|---|
| `id` | integer |  |
| `judul` | string |  |
| `deskripsi` | string \| null |  |
| `mata_kuliah` | string |  |
| `semester` | integer |  |
| `jenis` | string |  |
| `url` | string |  |
| `dibuat_oleh` | integer \| null |  |
| `status` | string |  |
| `dibuat_pada` | string (date-time, UTC) |  |
| `diubah_pada` | string (date-time, UTC) |  |
| `status_belajar` | enum: `belum`, `dilihat`, `selesai` \| null |  |
| `url_pratinjau` | string \| null | Alamat yang bisa dipasang langsung di `<iframe>`: file PDF itu sendiri, atau viewer Office Online untuk PPT/Word/Excel. Null bila tidak ada pratinjau (tampilkan tombol unduh). |

Contoh respons:

```json
{
  "id": 3,
  "judul": "Algoritma Dasar",
  "deskripsi": "Pengenalan algoritma dan pemrograman",
  "mata_kuliah": "Algoritma",
  "semester": 1,
  "jenis": "pdf",
  "url": "https://inf-learning-production.up.railway.app/uploads/39f2d8da668a44ca82773f54925c7a00.pdf",
  "dibuat_oleh": 1,
  "status": "terbit",
  "dibuat_pada": "2026-11-19T07:33:40.355440",
  "diubah_pada": "2026-11-19T07:33:40.390260",
  "status_belajar": null,
  "url_pratinjau": "https://inf-learning-production.up.railway.app/uploads/39f2d8da668a44ca82773f54925c7a00.pdf"
}
```

**Kemungkinan error**

| Status | Kondisi (isi `detail`) |
|---|---|
| 400 | Tidak ada field yang diubah<br>Format file tidak diizinkan<br>File kosong |
| 401 | Token tidak ada<br>Token tidak valid atau sudah kedaluwarsa<br>Sesi tidak ditemukan atau sudah berakhir. Silakan login kembali<br>Sesi berakhir karena tidak ada aktivitas selama 20 menit. Silakan login kembali |
| 403 | Akun Anda nonaktif<br>Anda tidak memiliki akses ke endpoint ini |
| 404 | Materi tidak ditemukan |
| 413 | Ukuran file maksimal 10 MB |
| 422 | Data yang dikirim tidak valid (lihat format error validasi) |

### Dashboard & Progres Mahasiswa

#### `GET /api/v1/mahasiswa/dashboard`

**Ringkasan dashboard mahasiswa (mahasiswa only)**

- **Akses:** Mahasiswa (header `Authorization: Bearer <token>`)

**Respons sukses: `200`**

| Field | Tipe | Keterangan |
|---|---|---|
| `profil` | [ProfilMahasiswa](#skema-profilmahasiswa) |  |
| `statistik` | [StatistikBelajar](#skema-statistikbelajar) |  |
| `lanjutkan_belajar` | [MateriDashboard](#skema-materidashboard) \| null |  |
| `materi_terbaru` | array&lt;[MateriDashboard](#skema-materidashboard)&gt; |  |
| `progres_mata_kuliah` | array&lt;[ProgresMataKuliah](#skema-progresmatakuliah)&gt; |  |

Contoh respons:

```json
{
  "profil": {
    "id": 2,
    "nama": "Budi Santoso",
    "nomor_induk": "2388010001",
    "angkatan": 2023,
    "foto_url": null
  },
  "statistik": {
    "total_materi": 3,
    "materi_dilihat": 1,
    "materi_selesai": 0,
    "persen_selesai": 0.0
  },
  "lanjutkan_belajar": {
    "id": 1,
    "judul": "Pengantar Basis Data",
    "mata_kuliah": "Basis Data",
    "semester": 3,
    "jenis": "pdf",
    "url": "https://inf-learning-production.up.railway.app/uploads/93936b50b75646d1aefaa9f5b079c06c.pdf",
    "dibuat_pada": "2026-11-19T07:33:40.338127",
    "status_belajar": "dilihat"
  },
  "materi_terbaru": [
    {
      "id": 3,
      "judul": "Algoritma Dasar",
      "mata_kuliah": "Algoritma",
      "semester": 1,
      "jenis": "pdf",
      "url": "https://inf-learning-production.up.railway.app/uploads/39f2d8da668a44ca82773f54925c7a00.pdf",
      "dibuat_pada": "2026-11-19T07:33:40.355440",
      "status_belajar": "belum"
    },
    {
      "id": 2,
      "judul": "Slide ERD Pertemuan 2",
      "mata_kuliah": "Basis Data",
      "semester": 3,
      "jenis": "pptx",
      "url": "https://inf-learning-production.up.railway.app/uploads/1c04e63e21f142a1a3e7ac3a54a799a8.pptx",
      "dibuat_pada": "2026-11-19T07:33:40.347731",
      "status_belajar": "belum"
    }
  ],
  "progres_mata_kuliah": [
    {
      "mata_kuliah": "Algoritma",
      "total": 1,
      "selesai": 0,
      "persen": 0.0
    },
    {
      "mata_kuliah": "Basis Data",
      "total": 2,
      "selesai": 0,
      "persen": 0.0
    }
  ]
}
```

**Kemungkinan error**

| Status | Kondisi (isi `detail`) |
|---|---|
| 401 | Token tidak ada<br>Token tidak valid atau sudah kedaluwarsa<br>Sesi tidak ditemukan atau sudah berakhir. Silakan login kembali<br>Sesi berakhir karena tidak ada aktivitas selama 20 menit. Silakan login kembali |
| 403 | Akun Anda nonaktif<br>Anda tidak memiliki akses ke endpoint ini |

#### `POST /api/v1/materi/{materi_id}/progres`

**Catat progres belajar pada sebuah materi (mahasiswa only)**

status 'dilihat' saat materi dibuka, 'selesai' saat ditandai selesai. Status 'selesai' tidak akan turun kembali menjadi 'dilihat'.

- **Akses:** Mahasiswa (header `Authorization: Bearer <token>`)

**Parameter**

| Nama | Lokasi | Tipe | Wajib | Keterangan |
|---|---|---|---|---|
| `materi_id` | path | integer | ya |  |

**Body** (`application/json`)

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `status` | enum: `dilihat`, `selesai` | ya |  |

Contoh request:

```json
{
  "status": "dilihat"
}
```

**Respons sukses: `200`**

| Field | Tipe | Keterangan |
|---|---|---|
| `materi_id` | integer |  |
| `status` | enum: `belum`, `dilihat`, `selesai` |  |
| `diubah_pada` | string (date-time, UTC) |  |

Contoh respons:

```json
{
  "materi_id": 1,
  "status": "dilihat",
  "diubah_pada": "2026-11-19T07:33:40.933357"
}
```

**Kemungkinan error**

| Status | Kondisi (isi `detail`) |
|---|---|
| 401 | Token tidak ada<br>Token tidak valid atau sudah kedaluwarsa<br>Sesi tidak ditemukan atau sudah berakhir. Silakan login kembali<br>Sesi berakhir karena tidak ada aktivitas selama 20 menit. Silakan login kembali |
| 403 | Akun Anda nonaktif<br>Anda tidak memiliki akses ke endpoint ini |
| 404 | Materi tidak ditemukan |
| 422 | Data yang dikirim tidak valid (lihat format error validasi) |

### Profil (Foto)

#### `PUT /api/v1/profil/foto`

**Unggah atau ganti foto profil (mahasiswa only)**

Format JPG, PNG, atau WEBP, maksimal 2 MB. Format dikenali dari isi file, bukan dari ekstensi. Foto lama otomatis dihapus.

- **Akses:** Mahasiswa (header `Authorization: Bearer <token>`)

**Body** (`multipart/form-data`)

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `file` | file | ya |  |

Contoh request:

Form: kirim file di field `file` (multipart/form-data).

**Respons sukses: `200`**

| Field | Tipe | Keterangan |
|---|---|---|
| `foto_url` | string \| null |  |

Contoh respons:

```json
{
  "foto_url": "https://inf-learning-production.up.railway.app/uploads/foto-9632cd67af56411ea00218f32e5cd451.png"
}
```

**Kemungkinan error**

| Status | Kondisi (isi `detail`) |
|---|---|
| 400 | File kosong<br>Format foto tidak diizinkan. Gunakan JPG, PNG, atau WEBP |
| 401 | Token tidak ada<br>Token tidak valid atau sudah kedaluwarsa<br>Sesi tidak ditemukan atau sudah berakhir. Silakan login kembali<br>Sesi berakhir karena tidak ada aktivitas selama 20 menit. Silakan login kembali |
| 403 | Akun Anda nonaktif<br>Anda tidak memiliki akses ke endpoint ini |
| 413 | Ukuran foto maksimal 2 MB |
| 422 | Data yang dikirim tidak valid (lihat format error validasi) |

#### `DELETE /api/v1/profil/foto`

**Hapus foto profil (mahasiswa only)**

- **Akses:** Mahasiswa (header `Authorization: Bearer <token>`)

**Respons sukses: `200`**

| Field | Tipe | Keterangan |
|---|---|---|
| `foto_url` | string \| null |  |

Contoh respons:

```json
{
  "foto_url": null
}
```

**Kemungkinan error**

| Status | Kondisi (isi `detail`) |
|---|---|
| 401 | Token tidak ada<br>Token tidak valid atau sudah kedaluwarsa<br>Sesi tidak ditemukan atau sudah berakhir. Silakan login kembali<br>Sesi berakhir karena tidak ada aktivitas selama 20 menit. Silakan login kembali |
| 403 | Akun Anda nonaktif<br>Anda tidak memiliki akses ke endpoint ini |

### Kontak Admin (WhatsApp)

#### `GET /api/v1/kontak-admin/whatsapp`

**Tautan WhatsApp untuk menghubungi admin (mahasiswa only)**

Mengembalikan tautan wa.me dengan pesan yang sudah terisi otomatis (nama, NIM, angkatan, topik, dan pesan opsional). Mengembalikan 503 bila nomor WhatsApp admin belum diatur.

- **Akses:** Mahasiswa (header `Authorization: Bearer <token>`)

**Parameter**

| Nama | Lokasi | Tipe | Wajib | Keterangan |
|---|---|---|---|---|
| `topik` | query | enum: `akun`, `materi`, `lainnya` | tidak | Topik: akun, materi, atau lainnya; default `lainnya` |
| `pesan` | query | string \| null | tidak | Pesan tambahan (opsional); maks 500 karakter |

Contoh request:

Query: `topik=materi&pesan=PDF Basis Data tidak bisa dibuka`

**Respons sukses: `200`**

| Field | Tipe | Keterangan |
|---|---|---|
| `nomor` | string |  |
| `nomor_tampil` | string |  |
| `pesan` | string |  |
| `tautan` | string |  |

Contoh respons:

```json
{
  "nomor": "6281234567890",
  "nomor_tampil": "+62 812-3456-7890",
  "pesan": "Halo Admin INF-Learning, saya Budi Santoso (NIM 2388010001, angkatan 2023).\nTopik: Kendala materi kuliah\n\nPDF Basis Data tidak bisa dibuka",
  "tautan": "https://wa.me/6281234567890?text=Halo%20Admin%20INF-Learning%2C%20saya%20Budi%20Santoso%20%28NIM%202388010001%2C%20angkatan%202023%29.%0ATopik%3A%20Kendala%20materi%20kuliah%0A%0APDF%20Basis%20Data%20tidak%20bisa%20dibuka"
}
```

**Kemungkinan error**

| Status | Kondisi (isi `detail`) |
|---|---|
| 401 | Token tidak ada<br>Token tidak valid atau sudah kedaluwarsa<br>Sesi tidak ditemukan atau sudah berakhir. Silakan login kembali<br>Sesi berakhir karena tidak ada aktivitas selama 20 menit. Silakan login kembali |
| 403 | Akun Anda nonaktif<br>Anda tidak memiliki akses ke endpoint ini |
| 422 | Data yang dikirim tidak valid (lihat format error validasi) |
| 503 | Kontak WhatsApp admin belum tersedia |

### Manajemen Mahasiswa (Admin)

#### `GET /api/v1/mahasiswa`

**List mahasiswa + pencarian & filter (admin only)**

- **Akses:** Admin (header `Authorization: Bearer <token>`)

**Parameter**

| Nama | Lokasi | Tipe | Wajib | Keterangan |
|---|---|---|---|---|
| `q` | query | string \| null | tidak | Cari di nama atau NIM; maks 100 karakter |
| `status` | query | enum: `belum_aktif`, `aktif`, `nonaktif` \| null | tidak | Filter status akun |
| `angkatan` | query | integer \| null | tidak | min 2000; maks 2100 |
| `page` | query | integer | tidak | min 1; default `1` |
| `limit` | query | integer | tidak | min 1; maks 100; default `20` |

Contoh request:

Query: `q=budi&status=aktif&page=1&limit=20`

**Respons sukses: `200`**

| Field | Tipe | Keterangan |
|---|---|---|
| `items` | array&lt;[MahasiswaResponse](#skema-mahasiswaresponse)&gt; |  |
| `total` | integer |  |
| `page` | integer |  |
| `limit` | integer |  |
| `total_pages` | integer |  |

Contoh respons:

```json
{
  "items": [
    {
      "id": 2,
      "nomor_induk": "2388010001",
      "nama": "Budi Santoso",
      "angkatan": 2023,
      "status": "aktif",
      "foto_url": null,
      "dibuat_pada": "2026-11-19T07:33:39.836112"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 20,
  "total_pages": 1
}
```

**Kemungkinan error**

| Status | Kondisi (isi `detail`) |
|---|---|
| 401 | Token tidak ada<br>Token tidak valid atau sudah kedaluwarsa<br>Sesi tidak ditemukan atau sudah berakhir. Silakan login kembali<br>Sesi berakhir karena tidak ada aktivitas selama 20 menit. Silakan login kembali |
| 403 | Akun Anda nonaktif<br>Anda tidak memiliki akses ke endpoint ini |
| 422 | Data yang dikirim tidak valid (lihat format error validasi) |

#### `POST /api/v1/mahasiswa`

**Tambah mahasiswa manual (admin only)**

- **Akses:** Admin (header `Authorization: Bearer <token>`)

**Body** (`application/json`)

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `nomor_induk` | string | ya | min 10 karakter; maks 10 karakter |
| `nama` | string | ya | min 3 karakter; maks 100 karakter |
| `angkatan` | integer \| null | tidak | min 2000.0; maks 2100.0 |

Contoh request:

```json
{
  "nomor_induk": "2388010001",
  "nama": "Budi Santoso",
  "angkatan": 2023
}
```

**Respons sukses: `201`**

| Field | Tipe | Keterangan |
|---|---|---|
| `id` | integer |  |
| `nomor_induk` | string |  |
| `nama` | string |  |
| `angkatan` | integer \| null |  |
| `status` | string |  |
| `foto_url` | string \| null |  |
| `dibuat_pada` | string (date-time, UTC) |  |

Contoh respons:

```json
{
  "id": 2,
  "nomor_induk": "2388010001",
  "nama": "Budi Santoso",
  "angkatan": 2023,
  "status": "belum_aktif",
  "foto_url": null,
  "dibuat_pada": "2026-11-19T07:33:39.836112"
}
```

**Kemungkinan error**

| Status | Kondisi (isi `detail`) |
|---|---|
| 401 | Token tidak ada<br>Token tidak valid atau sudah kedaluwarsa<br>Sesi tidak ditemukan atau sudah berakhir. Silakan login kembali<br>Sesi berakhir karena tidak ada aktivitas selama 20 menit. Silakan login kembali |
| 403 | Akun Anda nonaktif<br>Anda tidak memiliki akses ke endpoint ini |
| 409 | NIM sudah terdaftar |
| 422 | Data yang dikirim tidak valid (lihat format error validasi) |

#### `GET /api/v1/mahasiswa/ringkasan`

**Jumlah mahasiswa per status akun (admin only)**

- **Akses:** Admin (header `Authorization: Bearer <token>`)

**Respons sukses: `200`**

| Field | Tipe | Keterangan |
|---|---|---|
| `total` | integer |  |
| `belum_aktif` | integer |  |
| `aktif` | integer |  |
| `nonaktif` | integer |  |

Contoh respons:

```json
{
  "total": 2,
  "belum_aktif": 0,
  "aktif": 2,
  "nonaktif": 0
}
```

**Kemungkinan error**

| Status | Kondisi (isi `detail`) |
|---|---|
| 401 | Token tidak ada<br>Token tidak valid atau sudah kedaluwarsa<br>Sesi tidak ditemukan atau sudah berakhir. Silakan login kembali<br>Sesi berakhir karena tidak ada aktivitas selama 20 menit. Silakan login kembali |
| 403 | Akun Anda nonaktif<br>Anda tidak memiliki akses ke endpoint ini |

#### `POST /api/v1/mahasiswa/import`

**Impor mahasiswa dari file CSV (admin only)**

Kolom: `nomor_induk`, `nama`, `angkatan` (opsional). Pemisah koma/titik koma/tab dikenali otomatis. NIM yang sudah terdaftar dan baris tidak valid dilewati, baris lainnya tetap diproses. Dengan `simulasi=true` tidak ada data yang disimpan (untuk pratinjau).

- **Akses:** Admin (header `Authorization: Bearer <token>`)

**Parameter**

| Nama | Lokasi | Tipe | Wajib | Keterangan |
|---|---|---|---|---|
| `simulasi` | query | boolean | tidak | true = hanya hitung & laporkan, tanpa menyimpan; default `False` |

**Body** (`multipart/form-data`)

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `file` | file | ya | File .csv (UTF-8, maks 1 MB, maks 2000 baris) |

Contoh request:

Form: kirim file di field `file` (multipart/form-data).

Query: `simulasi=true`

**Respons sukses: `200`**

| Field | Tipe | Keterangan |
|---|---|---|
| `simulasi` | boolean |  |
| `total_baris` | integer |  |
| `ditambahkan` | integer |  |
| `dilewati` | integer |  |
| `gagal` | integer |  |
| `masalah` | array&lt;[BarisImportBermasalah](#skema-barisimportbermasalah)&gt; |  |

Contoh respons:

```json
{
  "simulasi": true,
  "total_baris": 4,
  "ditambahkan": 2,
  "dilewati": 1,
  "gagal": 1,
  "masalah": [
    {
      "baris": 4,
      "nomor_induk": "2388010001",
      "status": "dilewati",
      "alasan": "NIM sudah terdaftar"
    },
    {
      "baris": 5,
      "nomor_induk": "20241",
      "status": "gagal",
      "alasan": "NIM harus 10 digit"
    }
  ]
}
```

**Kemungkinan error**

| Status | Kondisi (isi `detail`) |
|---|---|
| 400 | Kolom wajib tidak ditemukan: &lt;…&gt;. Kolom yang terbaca: &lt;…&gt;<br>File harus berformat CSV (.csv)<br>File kosong<br>File harus berenkode UTF-8 (di Excel: Save As > CSV UTF-8)<br>Tidak ada baris data di file<br>Maksimal 2000 baris data per impor |
| 401 | Token tidak ada<br>Token tidak valid atau sudah kedaluwarsa<br>Sesi tidak ditemukan atau sudah berakhir. Silakan login kembali<br>Sesi berakhir karena tidak ada aktivitas selama 20 menit. Silakan login kembali |
| 403 | Akun Anda nonaktif<br>Anda tidak memiliki akses ke endpoint ini |
| 409 | Ada NIM yang baru saja didaftarkan proses lain. Ulangi impor. |
| 413 | Ukuran file maksimal 1 MB |
| 422 | Data yang dikirim tidak valid (lihat format error validasi) |

#### `GET /api/v1/mahasiswa/{id}`

**Detail mahasiswa (admin only)**

- **Akses:** Admin (header `Authorization: Bearer <token>`)

**Parameter**

| Nama | Lokasi | Tipe | Wajib | Keterangan |
|---|---|---|---|---|
| `id` | path | integer | ya |  |

**Respons sukses: `200`**

| Field | Tipe | Keterangan |
|---|---|---|
| `id` | integer |  |
| `nomor_induk` | string |  |
| `nama` | string |  |
| `angkatan` | integer \| null |  |
| `status` | string |  |
| `foto_url` | string \| null |  |
| `dibuat_pada` | string (date-time, UTC) |  |

Contoh respons:

```json
{
  "id": 4,
  "nomor_induk": "2488010001",
  "nama": "Andi Pratama",
  "angkatan": 2024,
  "status": "belum_aktif",
  "foto_url": null,
  "dibuat_pada": "2026-11-19T07:33:41.306308"
}
```

**Kemungkinan error**

| Status | Kondisi (isi `detail`) |
|---|---|
| 401 | Token tidak ada<br>Token tidak valid atau sudah kedaluwarsa<br>Sesi tidak ditemukan atau sudah berakhir. Silakan login kembali<br>Sesi berakhir karena tidak ada aktivitas selama 20 menit. Silakan login kembali |
| 403 | Akun Anda nonaktif<br>Anda tidak memiliki akses ke endpoint ini |
| 404 | Mahasiswa tidak ditemukan |
| 422 | Data yang dikirim tidak valid (lihat format error validasi) |

#### `PUT /api/v1/mahasiswa/{id}`

**Edit data/status mahasiswa (admin only)**

Kirim hanya field yang berubah. `angkatan: null` mengosongkan angkatan. `nomor_induk` hanya bisa diganti untuk akun yang belum diaktivasi.

- **Akses:** Admin (header `Authorization: Bearer <token>`)

**Parameter**

| Nama | Lokasi | Tipe | Wajib | Keterangan |
|---|---|---|---|---|
| `id` | path | integer | ya |  |

**Body** (`application/json`)

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `nomor_induk` | string \| null | tidak | min 10 karakter; maks 10 karakter |
| `nama` | string \| null | tidak | min 3 karakter; maks 100 karakter |
| `angkatan` | integer \| null | tidak | min 2000.0; maks 2100.0 |
| `status` | enum: `belum_aktif`, `aktif`, `nonaktif` \| null | tidak |  |

Contoh request:

```json
{
  "nama": "Andi Pratama Putra",
  "angkatan": 2024
}
```

**Respons sukses: `200`**

| Field | Tipe | Keterangan |
|---|---|---|
| `id` | integer |  |
| `nomor_induk` | string |  |
| `nama` | string |  |
| `angkatan` | integer \| null |  |
| `status` | string |  |
| `foto_url` | string \| null |  |
| `dibuat_pada` | string (date-time, UTC) |  |

Contoh respons:

```json
{
  "id": 4,
  "nomor_induk": "2488010001",
  "nama": "Andi Pratama Putra",
  "angkatan": 2024,
  "status": "belum_aktif",
  "foto_url": null,
  "dibuat_pada": "2026-11-19T07:33:41.306308"
}
```

**Kemungkinan error**

| Status | Kondisi (isi `detail`) |
|---|---|
| 401 | Token tidak ada<br>Token tidak valid atau sudah kedaluwarsa<br>Sesi tidak ditemukan atau sudah berakhir. Silakan login kembali<br>Sesi berakhir karena tidak ada aktivitas selama 20 menit. Silakan login kembali |
| 403 | Akun Anda nonaktif<br>Anda tidak memiliki akses ke endpoint ini |
| 404 | Mahasiswa tidak ditemukan |
| 409 | NIM sudah terdaftar<br>NIM tidak dapat diubah karena akun sudah diaktivasi |
| 422 | Data yang dikirim tidak valid (lihat format error validasi) |

#### `DELETE /api/v1/mahasiswa/{id}`

**Hapus mahasiswa (admin only)**

- **Akses:** Admin (header `Authorization: Bearer <token>`)

**Parameter**

| Nama | Lokasi | Tipe | Wajib | Keterangan |
|---|---|---|---|---|
| `id` | path | integer | ya |  |

**Respons sukses: `204`**

Tanpa isi (body kosong).

**Kemungkinan error**

| Status | Kondisi (isi `detail`) |
|---|---|
| 401 | Token tidak ada<br>Token tidak valid atau sudah kedaluwarsa<br>Sesi tidak ditemukan atau sudah berakhir. Silakan login kembali<br>Sesi berakhir karena tidak ada aktivitas selama 20 menit. Silakan login kembali |
| 403 | Akun Anda nonaktif<br>Anda tidak memiliki akses ke endpoint ini |
| 404 | Mahasiswa tidak ditemukan |
| 422 | Data yang dikirim tidak valid (lihat format error validasi) |

#### `POST /api/v1/mahasiswa/{id}/reset-akun`

**Reset akun mahasiswa (admin only)**

Menghapus kata sandi dan mengembalikan status ke belum_aktif, sehingga mahasiswa bisa registrasi ulang (mis. lupa kata sandi). Data dan progres belajar tetap.

- **Akses:** Admin (header `Authorization: Bearer <token>`)

**Parameter**

| Nama | Lokasi | Tipe | Wajib | Keterangan |
|---|---|---|---|---|
| `id` | path | integer | ya |  |

**Respons sukses: `200`**

| Field | Tipe | Keterangan |
|---|---|---|
| `id` | integer |  |
| `nomor_induk` | string |  |
| `nama` | string |  |
| `angkatan` | integer \| null |  |
| `status` | string |  |
| `foto_url` | string \| null |  |
| `dibuat_pada` | string (date-time, UTC) |  |

Contoh respons:

```json
{
  "id": 4,
  "nomor_induk": "2488010001",
  "nama": "Andi Pratama Putra",
  "angkatan": 2024,
  "status": "belum_aktif",
  "foto_url": null,
  "dibuat_pada": "2026-11-19T07:33:41.306308"
}
```

**Kemungkinan error**

| Status | Kondisi (isi `detail`) |
|---|---|
| 401 | Token tidak ada<br>Token tidak valid atau sudah kedaluwarsa<br>Sesi tidak ditemukan atau sudah berakhir. Silakan login kembali<br>Sesi berakhir karena tidak ada aktivitas selama 20 menit. Silakan login kembali |
| 403 | Akun Anda nonaktif<br>Anda tidak memiliki akses ke endpoint ini |
| 404 | Mahasiswa tidak ditemukan |
| 422 | Data yang dikirim tidak valid (lihat format error validasi) |

### Dashboard Admin

#### `GET /api/v1/admin/dashboard`

**Ambil data ringkasan untuk dashboard admin**

Endpoint ini hanya bisa diakses oleh user dengan role 'admin'.

- **Akses:** Admin (header `Authorization: Bearer <token>`)

**Respons sukses: `200`**

| Field | Tipe | Keterangan |
|---|---|---|
| `total_mahasiswa` | integer |  |
| `total_materi` | integer |  |
| `mahasiswa_hari_ini` | integer |  |
| `materi_hari_ini` | integer |  |
| `materi_terbaru` | array&lt;[MateriRingkas](#skema-materiringkas)&gt; |  |
| `mahasiswa_terbaru` | array&lt;[MahasiswaRingkas](#skema-mahasiswaringkas)&gt; |  |

Contoh respons:

```json
{
  "total_mahasiswa": 2,
  "total_materi": 3,
  "mahasiswa_hari_ini": 2,
  "materi_hari_ini": 3,
  "materi_terbaru": [
    {
      "id": 3,
      "judul": "Algoritma Dasar",
      "mata_kuliah": "Algoritma",
      "semester": 1,
      "jenis": "pdf",
      "url": "https://inf-learning-production.up.railway.app/uploads/39f2d8da668a44ca82773f54925c7a00.pdf",
      "dibuat_pada": "2026-11-19T07:33:40.355440"
    },
    {
      "id": 2,
      "judul": "Slide ERD Pertemuan 2",
      "mata_kuliah": "Basis Data",
      "semester": 3,
      "jenis": "pptx",
      "url": "https://inf-learning-production.up.railway.app/uploads/1c04e63e21f142a1a3e7ac3a54a799a8.pptx",
      "dibuat_pada": "2026-11-19T07:33:40.347731"
    }
  ],
  "mahasiswa_terbaru": [
    {
      "id": 3,
      "nama": "Siti Rahma",
      "nomor_induk": "2388010002",
      "angkatan": 2023,
      "status": "aktif",
      "dibuat_pada": "2026-11-19T07:33:39.846324"
    },
    {
      "id": 2,
      "nama": "Budi Santoso",
      "nomor_induk": "2388010001",
      "angkatan": 2023,
      "status": "aktif",
      "dibuat_pada": "2026-11-19T07:33:39.836112"
    }
  ]
}
```

**Kemungkinan error**

| Status | Kondisi (isi `detail`) |
|---|---|
| 401 | Token tidak ada<br>Token tidak valid atau sudah kedaluwarsa<br>Sesi tidak ditemukan atau sudah berakhir. Silakan login kembali<br>Sesi berakhir karena tidak ada aktivitas selama 20 menit. Silakan login kembali |
| 403 | Akun Anda nonaktif<br>Anda tidak memiliki akses ke endpoint ini |

### Sistem

#### `GET /`

**Root**

- **Akses:** Publik (tanpa token)

**Respons sukses: `200`**

Contoh respons:

```json
{
  "app": "INF-Learning",
  "status": "ok"
}
```

#### `GET /health`

**Health**

- **Akses:** Publik (tanpa token)

**Respons sukses: `200`**

Contoh respons:

```json
{
  "status": "ok",
  "database": "connected"
}
```

## 4. Skema data

<a id="skema-barisimportbermasalah"></a>
#### BarisImportBermasalah

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `baris` | integer | ya |  |
| `nomor_induk` | string \| null | ya |  |
| `status` | enum: `dilewati`, `gagal` | ya |  |
| `alasan` | string | ya |  |

<a id="skema-dashboardmahasiswaresponse"></a>
#### DashboardMahasiswaResponse

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `profil` | [ProfilMahasiswa](#skema-profilmahasiswa) | ya |  |
| `statistik` | [StatistikBelajar](#skema-statistikbelajar) | ya |  |
| `lanjutkan_belajar` | [MateriDashboard](#skema-materidashboard) \| null | ya |  |
| `materi_terbaru` | array&lt;[MateriDashboard](#skema-materidashboard)&gt; | ya |  |
| `progres_mata_kuliah` | array&lt;[ProgresMataKuliah](#skema-progresmatakuliah)&gt; | ya |  |

<a id="skema-dashboardstatsresponse"></a>
#### DashboardStatsResponse

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `total_mahasiswa` | integer | ya |  |
| `total_materi` | integer | ya |  |
| `mahasiswa_hari_ini` | integer | ya |  |
| `materi_hari_ini` | integer | ya |  |
| `materi_terbaru` | array&lt;[MateriRingkas](#skema-materiringkas)&gt; | ya |  |
| `mahasiswa_terbaru` | array&lt;[MahasiswaRingkas](#skema-mahasiswaringkas)&gt; | ya |  |

<a id="skema-fotoprofilresponse"></a>
#### FotoProfilResponse

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `foto_url` | string \| null | ya |  |

<a id="skema-importmahasiswaresponse"></a>
#### ImportMahasiswaResponse

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `simulasi` | boolean | ya |  |
| `total_baris` | integer | ya |  |
| `ditambahkan` | integer | ya |  |
| `dilewati` | integer | ya |  |
| `gagal` | integer | ya |  |
| `masalah` | array&lt;[BarisImportBermasalah](#skema-barisimportbermasalah)&gt; | ya |  |

<a id="skema-kategorimatakuliah"></a>
#### KategoriMataKuliah

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `mata_kuliah` | string | ya |  |
| `total_materi` | integer | ya |  |

<a id="skema-kategorimatakuliahresponse"></a>
#### KategoriMataKuliahResponse

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `semester` | integer | ya |  |
| `items` | array&lt;[KategoriMataKuliah](#skema-kategorimatakuliah)&gt; | ya |  |

<a id="skema-kategorisemester"></a>
#### KategoriSemester

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `semester` | integer | ya |  |
| `total_materi` | integer | ya |  |
| `total_mata_kuliah` | integer | ya |  |

<a id="skema-kategorisemesterresponse"></a>
#### KategoriSemesterResponse

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `items` | array&lt;[KategoriSemester](#skema-kategorisemester)&gt; | ya |  |

<a id="skema-kontakwhatsappresponse"></a>
#### KontakWhatsAppResponse

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `nomor` | string | ya |  |
| `nomor_tampil` | string | ya |  |
| `pesan` | string | ya |  |
| `tautan` | string | ya |  |

<a id="skema-loginrequest"></a>
#### LoginRequest

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `nomor_induk` | string | ya | min 3 karakter; maks 50 karakter |
| `kata_sandi` | string | ya | min 8 karakter; maks 72 karakter |

<a id="skema-loginresponse"></a>
#### LoginResponse

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `access_token` | string | ya |  |
| `token_type` | string | tidak | default `bearer` |
| `expires_in` | integer | ya |  |
| `pengguna` | [PenggunaRingkas](#skema-penggunaringkas) | ya |  |

<a id="skema-mahasiswacreaterequest"></a>
#### MahasiswaCreateRequest

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `nomor_induk` | string | ya | min 10 karakter; maks 10 karakter |
| `nama` | string | ya | min 3 karakter; maks 100 karakter |
| `angkatan` | integer \| null | tidak | min 2000.0; maks 2100.0 |

<a id="skema-mahasiswalistresponse"></a>
#### MahasiswaListResponse

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `items` | array&lt;[MahasiswaResponse](#skema-mahasiswaresponse)&gt; | ya |  |
| `total` | integer | ya |  |
| `page` | integer | ya |  |
| `limit` | integer | ya |  |
| `total_pages` | integer | ya |  |

<a id="skema-mahasiswaresponse"></a>
#### MahasiswaResponse

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `id` | integer | ya |  |
| `nomor_induk` | string | ya |  |
| `nama` | string | ya |  |
| `angkatan` | integer \| null | ya |  |
| `status` | string | ya |  |
| `foto_url` | string \| null | tidak |  |
| `dibuat_pada` | string (date-time, UTC) | ya |  |

<a id="skema-mahasiswaringkas"></a>
#### MahasiswaRingkas

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `id` | integer | ya |  |
| `nama` | string | ya |  |
| `nomor_induk` | string | ya |  |
| `angkatan` | integer \| null | ya |  |
| `status` | string | ya |  |
| `dibuat_pada` | string (date-time, UTC) | ya |  |

<a id="skema-mahasiswaupdaterequest"></a>
#### MahasiswaUpdateRequest

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `nomor_induk` | string \| null | tidak | min 10 karakter; maks 10 karakter |
| `nama` | string \| null | tidak | min 3 karakter; maks 100 karakter |
| `angkatan` | integer \| null | tidak | min 2000.0; maks 2100.0 |
| `status` | enum: `belum_aktif`, `aktif`, `nonaktif` \| null | tidak |  |

<a id="skema-materidashboard"></a>
#### MateriDashboard

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `id` | integer | ya |  |
| `judul` | string | ya |  |
| `mata_kuliah` | string | ya |  |
| `semester` | integer | ya |  |
| `jenis` | string | ya |  |
| `url` | string | ya |  |
| `dibuat_pada` | string (date-time, UTC) | ya |  |
| `status_belajar` | enum: `belum`, `dilihat`, `selesai` | ya |  |

<a id="skema-materilistresponse"></a>
#### MateriListResponse

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `items` | array&lt;[MateriResponse](#skema-materiresponse)&gt; | ya |  |
| `total` | integer | ya |  |
| `page` | integer | ya |  |
| `limit` | integer | ya |  |
| `total_pages` | integer | ya |  |

<a id="skema-materiresponse"></a>
#### MateriResponse

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `id` | integer | ya |  |
| `judul` | string | ya |  |
| `deskripsi` | string \| null | ya |  |
| `mata_kuliah` | string | ya |  |
| `semester` | integer | ya |  |
| `jenis` | string | ya |  |
| `url` | string | ya |  |
| `dibuat_oleh` | integer \| null | ya |  |
| `status` | string | ya |  |
| `dibuat_pada` | string (date-time, UTC) | ya |  |
| `diubah_pada` | string (date-time, UTC) | ya |  |
| `status_belajar` | enum: `belum`, `dilihat`, `selesai` \| null | tidak |  |
| `url_pratinjau` | string \| null | ya | Alamat yang bisa dipasang langsung di `<iframe>`: file PDF itu sendiri, atau viewer Office Online untuk PPT/Word/Excel. Null bila tidak ada pratinjau (tampilkan tombol unduh). |

<a id="skema-materiringkas"></a>
#### MateriRingkas

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `id` | integer | ya |  |
| `judul` | string | ya |  |
| `mata_kuliah` | string | ya |  |
| `semester` | integer | ya |  |
| `jenis` | string | ya |  |
| `url` | string | ya |  |
| `dibuat_pada` | string (date-time, UTC) | ya |  |

<a id="skema-materiupdaterequest"></a>
#### MateriUpdateRequest

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `judul` | string \| null | tidak | min 3 karakter; maks 200 karakter |
| `deskripsi` | string \| null | tidak | maks 2000 karakter |
| `mata_kuliah` | string \| null | tidak | min 2 karakter; maks 100 karakter |
| `semester` | integer \| null | tidak | min 1.0; maks 8.0 |
| `jenis` | string \| null | tidak | min 3 karakter; maks 20 karakter |
| `url` | string \| null | tidak | min 5 karakter; maks 500 karakter |
| `status` | string \| null | tidak |  |

<a id="skema-penggunaringkas"></a>
#### PenggunaRingkas

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `id` | integer | ya |  |
| `peran` | string | ya |  |
| `nomor_induk` | string | ya |  |
| `nama` | string | ya |  |
| `status` | string | ya |  |
| `foto_url` | string \| null | tidak |  |

<a id="skema-profilmahasiswa"></a>
#### ProfilMahasiswa

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `id` | integer | ya |  |
| `nama` | string | ya |  |
| `nomor_induk` | string | ya |  |
| `angkatan` | integer \| null | ya |  |
| `foto_url` | string \| null | tidak |  |

<a id="skema-progresmatakuliah"></a>
#### ProgresMataKuliah

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `mata_kuliah` | string | ya |  |
| `total` | integer | ya |  |
| `selesai` | integer | ya |  |
| `persen` | number | ya |  |

<a id="skema-progresrequest"></a>
#### ProgresRequest

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `status` | enum: `dilihat`, `selesai` | ya |  |

<a id="skema-progresresponse"></a>
#### ProgresResponse

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `materi_id` | integer | ya |  |
| `status` | enum: `belum`, `dilihat`, `selesai` | ya |  |
| `diubah_pada` | string (date-time, UTC) | ya |  |

<a id="skema-registrasirequest"></a>
#### RegistrasiRequest

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `nomor_induk` | string | ya | min 10 karakter; maks 10 karakter |
| `kata_sandi` | string | ya | min 8 karakter; maks 72 karakter |
| `konfirmasi_kata_sandi` | string \| null | tidak | min 8 karakter; maks 72 karakter |

<a id="skema-registrasiresponse"></a>
#### RegistrasiResponse

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `id` | integer | ya |  |
| `peran` | string | ya |  |
| `nomor_induk` | string | ya |  |
| `nama` | string | ya |  |
| `status` | string | ya |  |
| `dibuat_pada` | string (date-time, UTC) | ya |  |

<a id="skema-ringkasanmahasiswaresponse"></a>
#### RingkasanMahasiswaResponse

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `total` | integer | ya |  |
| `belum_aktif` | integer | ya |  |
| `aktif` | integer | ya |  |
| `nonaktif` | integer | ya |  |

<a id="skema-statistikbelajar"></a>
#### StatistikBelajar

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `total_materi` | integer | ya |  |
| `materi_dilihat` | integer | ya |  |
| `materi_selesai` | integer | ya |  |
| `persen_selesai` | number | ya |  |

## 5. Perubahan terbaru yang berdampak ke FE

| Area | Perubahan |
|---|---|
| Sesi | Sesi berakhir setelah **20 menit tanpa aktivitas** (bukan lagi token tetap 15 menit). `expires_in` pada login kini bernilai 1200 dan artinya batas tidak-aktif. Pengguna yang login sebelum deploy perlu login ulang sekali. |
| Logout | Endpoint baru `POST /api/v1/auth/logout` menghapus sesi di server. Panggil saat pengguna keluar atau saat timer idle FE habis. |
| Login | Kegagalan login dibedakan: **404** NIM tidak terdaftar, **409** NIM belum teregistrasi, **401** kata sandi salah, **403** akun nonaktif. |
| Foto profil | Field baru `foto_url` pada data pengguna (`/auth/me`, login, dashboard, daftar mahasiswa). Endpoint `PUT` dan `DELETE` `/api/v1/profil/foto`. URL foto berganti tiap foto diubah, sehingga tidak terkena cache. |
| Unduh materi | Endpoint `GET /api/v1/materi/{materi_id}/unduh`: butuh token, jadi gunakan `fetch` + blob, bukan `<a href>`. Nama file dibaca dari header `Content-Disposition` (`filename*=utf-8''...`). |
| Pratinjau materi | Field baru `url_pratinjau` pada materi: untuk PDF sama dengan `url`; untuk PPT/Word/Excel berupa alamat viewer Office Online yang bisa dipasang di `<iframe>`; `null` bila tidak ada pratinjau. |
| Kontak admin | `GET /api/v1/kontak-admin/whatsapp` mengembalikan `tautan` wa.me; FE cukup mengarahkan browser ke tautan itu (`window.location.href`). Respons **503** berarti nomor admin belum diatur: sembunyikan tombolnya. |
| Dashboard admin | Ditambah `mahasiswa_hari_ini` dan `materi_hari_ini` (hari kalender WIB). |