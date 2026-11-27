# API Contract — INF-Learning

**Versi dokumen:** 1.5 | **Metode:** audit statis kode, 27 November 2026.

Dokumen ini adalah kontrak implementasi saat ini, bukan rancangan endpoint baru. Semua contoh JSON menggunakan data fiktif; token dan URL bertanda tangan hanya placeholder, tidak dapat digunakan. Pesan rekomendasi bukan response backend. Tidak dilakukan eksekusi server, build frontend, pengujian jaringan atau perubahan kode. Nilai environment produksi tidak tersedia; batas konfigurasi disebut sebagai default.

## 1. Cara membaca dan aturan global

Base URL contoh dari `app/core/config.py`: `https://inf-learning-production.up.railway.app/api/v1`. Frontend memakai `VITE_API_BASE_URL` atau `/api/v1` (relative URL); `.env.example` menetapkan `/api/v1` dan `VITE_USE_MOCK=false`. Pastikan proxy atau base URL mengarah ke backend. Semua path di bawah ditulis lengkap. `/uploads`, `/`, `/health` berada di luar prefix.

- JSON: `Content-Type: application/json`; multipart: gunakan FormData dengan boundary otomatis dari browser; jangan set Content-Type sendiri.
- Protected: `Authorization: Bearer <access_token>`. Role admin atau mahasiswa ditentukan server, bukan input frontend.
- `id` dan `materi_id` adalah integer path; tidak ada batas positif eksplisit di router. `nomor_induk` string, jangan ubah menjadi angka.
- Response JSON biasa tidak memakai envelope `success/data`. List memakai `items`; paginasi `total`, `page`, `limit`, `total_pages`. Jika kosong, `total_pages=0` untuk list berpaginasi. 204 tidak memiliki body. Timestamp adalah datetime ISO; jangan mengasumsikan timezone dari string tanpa offset.
- `null` berbeda dari field yang tidak dikirim. Jangan mengirim null ke kolom wajib; lihat masing-masing endpoint.

### Autentikasi global (berlaku pada semua endpoint protected)

| HTTP | Kondisi | Detail backend aktual | Tindakan frontend yang disarankan |
|---|---|---|---|
| 401 | Header bearer tidak ada/tidak sesuai | Token tidak ada | Hapus sesi lokal, arahkan login |
| 401 | JWT rusak, expired atau claim tidak valid | Token tidak valid atau sudah kedaluwarsa | Login ulang |
| 401 | Sesi tidak ditemukan atau tidak cocok | Sesi tidak ditemukan atau sudah berakhir. Silakan login kembali | Login ulang |
| 401 | Idle timeout | Sesi berakhir karena tidak ada aktivitas selama 20 menit. Silakan login kembali (default) | Warning sesi berakhir; login ulang |
| 401 | Pengguna tidak ditemukan | Pengguna tidak ditemukan | Login ulang |
| 403 | Akun bukan aktif | Akun Anda nonaktif | Tampilkan pesan akun; akhiri sesi lokal |
| 403 | Role salah | Anda tidak memiliki akses ke endpoint ini | Jangan ulangi; kembali ke halaman yang diizinkan |
| 422 | Body/query/path tidak valid | detail array | Tampilkan pesan field, jangan logout |
| 500 | Error tak tertangani | Tidak ada kontrak JSON khusus | Error umum; jangan bocorkan stack trace |

Logout memakai dependency sesi saja, bukan pemeriksaan role/status pengguna. Semua 401 dari dependency menyertakan `WWW-Authenticate: Bearer`. Default idle 20 menit, JWT maksimum 12 jam; request terautentikasi memperpanjang idle dengan optimasi penulisan DB >60 detik. Tidak ada refresh-token endpoint. URL file bertanda tangan tidak memperpanjang idle. `expires_in` adalah durasi idle, bukan waktu mutlak JWT.

Contoh error bisnis:
```json
{"detail":"Materi tidak ditemukan"}
```
Contoh struktur 422 (ilustratif; pesan bawaan Pydantic dapat berbeda):
```json
{"detail":[{"loc":["body","semester"],"msg":"Input should be less than or equal to 8","type":"less_than_equal"}]}
```

### Alert dan jaringan (frontend aktual vs rekomendasi)

`src/services/api.js` mengubah detail string menjadi pesan error; detail array digabung dari `msg` dan awalan `Value error,` dihapus. Pada 401 protected, token dan role di storage dihapus; state AuthContext belum otomatis disinkronkan. 204 menghasilkan null. Timeout request 15 detik, helper upload 60 detik; timer berhenti saat fetch menerima response, bukan setelah seluruh body dibaca.

| Jenis | Aktual | Rekomendasi |
|---|---|---|
| Success | Modal/toast/pesan sukses per halaman | Operasi tulis sukses; refresh data setelah response |
| Error | ErrorMessage, modal, banner atau toast sesuai halaman | Pertahankan form, tampilkan detail yang aman |
| Warning | Tidak ada standar global yang terpusat | Sesi berakhir, impor sebagian, hasil operasi belum pasti |
| Info | Empty state pada daftar | Belum ada data; bukan error |
| Confirmation | Modal hapus pada halaman admin | Konfirmasi hapus/reset; tombol batal tidak mengirim request |
| TIMEOUT | Koneksi terlalu lambat. Periksa jaringan Anda, lalu coba lagi. | Cek data server dahulu sebelum retry operasi tulis |
| OFFLINE | Koneksi internet terputus. Periksa jaringan Anda, lalu coba lagi. | Pertahankan input; retry saat online |
| NETWORK | Gagal terhubung ke server. Periksa koneksi jaringan Anda dan pastikan backend tersedia. | Cek koneksi dan konfigurasi; hasil tulis mungkin belum pasti |
| ABORTED | Permintaan dibatalkan. | Jangan tampilkan error bila komponen sengaja ditutup |

Untuk GET biasa: tampilkan loading, data, empty state atau error + retry; tidak perlu toast sukses setiap request. Untuk POST/PUT/DELETE: nonaktifkan tombol saat loading, jangan anggap berhasil sebelum response, refresh daftar setelah sukses. Gunakan aturan global di setiap endpoint berikut; tabel lokal hanya menambahkan kondisi spesifik.

## 2. Authentication

## AUTH-01 — Aktivasi akun

**POST `/api/v1/auth/registrasi`** · Akses: **Publik** · Sukses: **200**

### Request

```json
{
  "nomor_induk": "2488010001",
  "kata_sandi": "Contoh123!",
  "konfirmasi_kata_sandi": "Contoh123!"
}
```
NIM 10 digit pola `^2\d88\d{6}$`; password 8–72 karakter dan maksimal 72 byte UTF-8; konfirmasi opsional, harus sama jika dikirim. NIM harus sudah dibuat admin. Akun aktif tanpa password masih boleh aktivasi.

### Response sukses (200)

```json
{
  "id": 12,
  "peran": "mahasiswa",
  "nomor_induk": "2488010001",
  "nama": "Mahasiswa Contoh",
  "status": "aktif",
  "dibuat_pada": "2026-11-27T03:00:00"
}
```

### Kondisi dan alert

| HTTP | Kondisi | Detail backend aktual | Alert / tindakan rekomendasi |
|---|---|---|---|
| 200 | Berhasil | Lihat response sukses | Tampilkan sukses dan arahkan login |
| 404 | NIM belum ada | NIM tidak terdaftar. Hubungi admin. | Hubungi admin |
| 403 | Akun nonaktif | Akun Anda dinonaktifkan. Hubungi admin. | Hubungi admin |
| 409 | Aktif dan punya password | Akun sudah aktif. Silakan login. | Arahkan login |
| 422 | Input tidak memenuhi schema | detail berupa array validasi | Tampilkan kesalahan pada field; pertahankan input |

**Frontend aktual:** authService.register; RegisterPage menampilkan “Daftar Berhasil!” lalu login setelah 2,5 detik; error API ditampilkan sebagai server error.

**Sumber:** `app/api/v1/auth.py; app/services/auth_service.py; app/schemas/auth.py`.

## AUTH-02 — Login

**POST `/api/v1/auth/login`** · Akses: **Publik** · Sukses: **200**

### Request

```json
{
  "nomor_induk": "2488010001",
  "kata_sandi": "Contoh123!"
}
```
Nomor induk 3–50 karakter (login juga admin); password 8–72 karakter. Password >72 byte dianggap tidak cocok saat verifikasi.

### Response sukses (200)

```json
{
  "access_token": "<JWT>",
  "token_type": "bearer",
  "expires_in": 1200,
  "pengguna": {
    "id": 12,
    "peran": "mahasiswa",
    "nomor_induk": "2488010001",
    "nama": "Mahasiswa Contoh",
    "status": "aktif",
    "foto_url": null
  }
}
```

### Kondisi dan alert

| HTTP | Kondisi | Detail backend aktual | Alert / tindakan rekomendasi |
|---|---|---|---|
| 200 | Berhasil | Lihat response sukses | Simpan token dan role; admin /dashboard, mahasiswa /beranda |
| 404 | Nomor induk tidak ada | NIM tidak terdaftar | Error field NIM |
| 409 | Belum memiliki password | NIM belum teregistrasi | Arahkan registrasi |
| 401 | Password salah | NIM atau kata sandi salah | Error field password |
| 403 | Password benar tetapi akun bukan aktif | Akun Anda nonaktif. Silakan hubungi admin. | Hubungi admin |
| 422 | Input tidak memenuhi schema | detail berupa array validasi | Tampilkan kesalahan pada field; pertahankan input |

**Frontend aktual:** LoginPage: “Login Berhasil!”, “NIM Tidak Terdaftar!”, “NIM Belum Teregistrasi!”, “Password Salah!”; authService memetakan token, role, user, expiresIn.

**Sumber:** `app/api/v1/auth.py; app/services/auth_service.py; Frontend/src/pages/auth/LoginPage.jsx`.

## AUTH-03 — Pengguna saat ini

**GET `/api/v1/auth/me`** · Akses: **Admin / mahasiswa** · Sukses: **200**

### Request

Bearer; tanpa body.

### Response sukses (200)

```json
{
  "id": 12,
  "peran": "mahasiswa",
  "nomor_induk": "2488010001",
  "nama": "Mahasiswa Contoh",
  "status": "aktif",
  "foto_url": null
}
```

### Kondisi dan alert

| HTTP | Kondisi | Detail backend aktual | Alert / tindakan rekomendasi |
|---|---|---|---|
| 200 | Berhasil | Lihat response sukses | Perbarui state user dan role; tanpa toast |

| 401/403 | Autentikasi atau hak akses | Lihat aturan global | Tangani sesuai aturan global |

**Frontend aktual:** AuthContext memanggil getMe saat restore session; jika gagal, logout lokal.

**Sumber:** `app/api/v1/auth.py; Frontend/src/context/AuthContext.jsx`.

## AUTH-04 — Logout server

**POST `/api/v1/auth/logout`** · Akses: **Sesi valid** · Sukses: **200**

### Request

Bearer; tanpa body.

### Response sukses (200)

```json
{
  "detail": "Berhasil keluar"
}
```

### Kondisi dan alert

| HTTP | Kondisi | Detail backend aktual | Alert / tindakan rekomendasi |
|---|---|---|---|
| 200 | Berhasil | Lihat response sukses | Panggil server sebelum menghapus token; arahkan login |

| 401/403 | Autentikasi atau hak akses | Lihat aturan global | Tangani sesuai aturan global |

**Frontend aktual:** Logout AuthContext hanya menghapus token, role dan user lokal; belum memanggil endpoint.

**Sumber:** `app/api/v1/auth.py; Frontend/src/context/AuthContext.jsx`.

## 3. Dashboard admin

## ADM-01 — Ringkasan dashboard

**GET `/api/v1/admin/dashboard`** · Akses: **Admin** · Sukses: **200**

### Request

Bearer; tanpa body.

### Response sukses (200)

```json
{
  "total_mahasiswa": 1,
  "total_materi": 1,
  "mahasiswa_hari_ini": 1,
  "materi_hari_ini": 1,
  "materi_terbaru": [
    {
      "id": 25,
      "judul": "Pengantar Sistem Terdistribusi",
      "mata_kuliah": "Sistem Terdistribusi",
      "semester": 4,
      "jenis": "pdf",
      "url": "https://example.invalid/uploads/contoh.pdf?exp=CONTOH&sid=CONTOH&sig=CONTOH",
      "dibuat_pada": "2026-11-27T03:00:00"
    }
  ],
  "mahasiswa_terbaru": [
    {
      "id": 12,
      "nama": "Mahasiswa Contoh",
      "nomor_induk": "2488010001",
      "angkatan": 2024,
      "status": "belum_aktif",
      "dibuat_pada": "2026-11-27T03:00:00"
    }
  ]
}
```

### Kondisi dan alert

| HTTP | Kondisi | Detail backend aktual | Alert / tindakan rekomendasi |
|---|---|---|---|
| 200 | Berhasil | Lihat response sukses | Render statistik; terbaru maksimal 5 per jenis; hari ini kalender WIB; semua status materi dihitung |

| 401/403 | Autentikasi atau hak akses | Lihat aturan global | Tangani sesuai aturan global |

**Frontend aktual:** adminService.getDashboard; MainPanel menampilkan “Statistik gagal dimuat.” dan angka — jika gagal.

**Sumber:** `app/services/admin_service.py; app/schemas/admin.py`.

## 4. Kelola mahasiswa

Status akun: `belum_aktif`, `aktif`, `nonaktif`. Semua endpoint modul ini admin-only. Nama 3–100 karakter (spasi dirapikan), NIM pola registrasi, angkatan integer 2000–2100 atau null.

## MHS-01 — Daftar mahasiswa

**GET `/api/v1/mahasiswa`** · Akses: **Admin** · Sukses: **200**

### Request

Query opsional: `q` maks 100 karakter (nama/NIM), `status`, `angkatan`, `page` default 1 min 1, `limit` default 20 rentang 1–100. Contoh `?q=Contoh&status=belum_aktif&page=1&limit=20`.

### Response sukses (200)

```json
{
  "items": [
    {
      "id": 12,
      "nomor_induk": "2488010001",
      "nama": "Mahasiswa Contoh",
      "angkatan": 2024,
      "status": "belum_aktif",
      "foto_url": null,
      "dibuat_pada": "2026-11-27T03:00:00"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 20,
  "total_pages": 1
}
```

### Kondisi dan alert

| HTTP | Kondisi | Detail backend aktual | Alert / tindakan rekomendasi |
|---|---|---|---|
| 200 | Berhasil | Lihat response sukses | Render daftar urut NIM; kosong = info; reset page saat filter berubah |
| 422 | Input tidak memenuhi schema | detail berupa array validasi | Tampilkan kesalahan pada field; pertahankan input |
| 401/403 | Autentikasi atau hak akses | Lihat aturan global | Tangani sesuai aturan global |

**Frontend aktual:** mahasiswaService.get list; MahasiswaPage menggunakan filter/paginasi dan error banner.

**Sumber:** `app/api/v1/mahasiswa.py; app/crud/mahasiswa.py`.

## MHS-02 — Ringkasan status

**GET `/api/v1/mahasiswa/ringkasan`** · Akses: **Admin** · Sukses: **200**

### Request

Tanpa body.

### Response sukses (200)

```json
{
  "total": 1,
  "belum_aktif": 1,
  "aktif": 0,
  "nonaktif": 0
}
```

### Kondisi dan alert

| HTTP | Kondisi | Detail backend aktual | Alert / tindakan rekomendasi |
|---|---|---|---|
| 200 | Berhasil | Lihat response sukses | Gunakan untuk kartu statistik global, bukan total halaman |

| 401/403 | Autentikasi atau hak akses | Lihat aturan global | Tangani sesuai aturan global |

**Frontend aktual:** Tidak ditemukan pemanggilan endpoint di service frontend.

**Sumber:** `app/api/v1/mahasiswa.py; app/services/mahasiswa_service.py`.

## MHS-03 — Detail mahasiswa

**GET `/api/v1/mahasiswa/{id}`** · Akses: **Admin** · Sukses: **200**

### Request

Path id; tanpa body.

### Response sukses (200)

```json
{
  "id": 12,
  "nomor_induk": "2488010001",
  "nama": "Mahasiswa Contoh",
  "angkatan": 2024,
  "status": "belum_aktif",
  "foto_url": null,
  "dibuat_pada": "2026-11-27T03:00:00"
}
```

### Kondisi dan alert

| HTTP | Kondisi | Detail backend aktual | Alert / tindakan rekomendasi |
|---|---|---|---|
| 200 | Berhasil | Lihat response sukses | Isi form edit dari data terbaru bila perlu |
| 404 | ID tidak ditemukan | Mahasiswa tidak ditemukan | Data mahasiswa tidak ditemukan; muat ulang daftar |
| 422 | Input tidak memenuhi schema | detail berupa array validasi | Tampilkan kesalahan pada field; pertahankan input |
| 401/403 | Autentikasi atau hak akses | Lihat aturan global | Tangani sesuai aturan global |

**Frontend aktual:** Tidak ditemukan pemanggilan detail khusus; halaman memakai data list.

**Sumber:** `app/api/v1/mahasiswa.py`.

## MHS-04 — Tambah mahasiswa

**POST `/api/v1/mahasiswa`** · Akses: **Admin** · Sukses: **201**

### Request

```json
{
  "nomor_induk": "2488010001",
  "nama": "Mahasiswa Contoh",
  "angkatan": 2024
}
```
NIM dan nama wajib; angkatan opsional. Status awal belum_aktif; tidak ada password.

### Response sukses (201)

```json
{
  "id": 12,
  "nomor_induk": "2488010001",
  "nama": "Mahasiswa Contoh",
  "angkatan": 2024,
  "status": "belum_aktif",
  "foto_url": null,
  "dibuat_pada": "2026-11-27T03:00:00"
}
```

### Kondisi dan alert

| HTTP | Kondisi | Detail backend aktual | Alert / tindakan rekomendasi |
|---|---|---|---|
| 201 | Berhasil | Lihat response sukses | Tutup modal, refresh daftar dan ringkasan |
| 409 | NIM telah digunakan | NIM sudah terdaftar | Tampilkan error NIM; jangan simpan ulang |
| 422 | Input tidak memenuhi schema | detail berupa array validasi | Tampilkan kesalahan pada field; pertahankan input |
| 401/403 | Autentikasi atau hak akses | Lihat aturan global | Tangani sesuai aturan global |

**Frontend aktual:** MahasiswaPage: “Mahasiswa Berhasil Ditambahkan!”; error API atau “Data mahasiswa gagal disimpan. Silakan coba lagi.”

**Sumber:** `app/services/mahasiswa_service.py; app/crud/mahasiswa.py`.

## MHS-05 — Edit mahasiswa

**PUT `/api/v1/mahasiswa/{id}`** · Akses: **Admin** · Sukses: **200**

### Request

```json
{
  "nama": "Mahasiswa Contoh Baru",
  "angkatan": null
}
```
Semua opsional: nomor_induk, nama, angkatan, status. Null angkatan mengosongkan; null lainnya diabaikan. NIM baru hanya jika belum punya password; NIM sama diabaikan. Body kosong tidak ditolak eksplisit.

### Response sukses (200)

```json
{
  "id": 12,
  "nomor_induk": "2488010001",
  "nama": "Mahasiswa Contoh Baru",
  "angkatan": null,
  "status": "belum_aktif",
  "foto_url": null,
  "dibuat_pada": "2026-11-27T03:00:00"
}
```

### Kondisi dan alert

| HTTP | Kondisi | Detail backend aktual | Alert / tindakan rekomendasi |
|---|---|---|---|
| 200 | Berhasil | Lihat response sukses | Refresh data; jangan ubah status aktivasi tanpa aturan yang disepakati |
| 404 | ID tidak ditemukan | Mahasiswa tidak ditemukan | Data mahasiswa tidak ditemukan; muat ulang daftar |
| 409 | NIM telah digunakan | NIM sudah terdaftar | Tampilkan error NIM; jangan simpan ulang |
| 409 | NIM diubah setelah punya password | NIM tidak dapat diubah karena akun sudah diaktivasi | Kunci field NIM |
| 422 | Input tidak memenuhi schema | detail berupa array validasi | Tampilkan kesalahan pada field; pertahankan input |
| 401/403 | Autentikasi atau hak akses | Lihat aturan global | Tangani sesuai aturan global |

**Frontend aktual:** MahasiswaPage: “Mahasiswa Berhasil Diperbarui!”; status belum_aktif dikunci di UI.

**Sumber:** `app/services/mahasiswa_service.py; Frontend/src/pages/dashboard/MahasiswaPage.jsx`.

## MHS-06 — Reset akun

**POST `/api/v1/mahasiswa/{id}/reset-akun`** · Akses: **Admin** · Sukses: **200**

### Request

Path id; tanpa body. Password dihapus, status belum_aktif; data dan progres tetap.

### Response sukses (200)

```json
{
  "id": 12,
  "nomor_induk": "2488010001",
  "nama": "Mahasiswa Contoh",
  "angkatan": 2024,
  "status": "belum_aktif",
  "foto_url": null,
  "dibuat_pada": "2026-11-27T03:00:00"
}
```

### Kondisi dan alert

| HTTP | Kondisi | Detail backend aktual | Alert / tindakan rekomendasi |
|---|---|---|---|
| 200 | Berhasil | Lihat response sukses | Konfirmasi reset; beri tahu mahasiswa untuk registrasi ulang |
| 404 | ID tidak ditemukan | Mahasiswa tidak ditemukan | Data mahasiswa tidak ditemukan; muat ulang daftar |
| 422 | Input tidak memenuhi schema | detail berupa array validasi | Tampilkan kesalahan pada field; pertahankan input |
| 401/403 | Autentikasi atau hak akses | Lihat aturan global | Tangani sesuai aturan global |

**Frontend aktual:** Belum ditemukan service reset akun.

**Sumber:** `app/services/mahasiswa_service.py; app/crud/mahasiswa.py`.

## MHS-07 — Hapus mahasiswa

**DELETE `/api/v1/mahasiswa/{id}`** · Akses: **Admin** · Sukses: **204**

### Request

Path id; tanpa body. Backend tidak membatasi status akun.

### Response sukses (204)

Tidak ada body.

### Kondisi dan alert

| HTTP | Kondisi | Detail backend aktual | Alert / tindakan rekomendasi |
|---|---|---|---|
| 204 | Berhasil | Tanpa body | Konfirmasi penghapusan permanen, refresh daftar; sepakati aturan status |
| 404 | ID tidak ditemukan | Mahasiswa tidak ditemukan | Data mahasiswa tidak ditemukan; muat ulang daftar |
| 422 | Input tidak memenuhi schema | detail berupa array validasi | Tampilkan kesalahan pada field; pertahankan input |
| 401/403 | Autentikasi atau hak akses | Lihat aturan global | Tangani sesuai aturan global |

**Frontend aktual:** MahasiswaPage: “Mahasiswa Berhasil Dihapus!”; UI membatasi penghapusan akun aktif.

**Sumber:** `app/services/mahasiswa_service.py; Frontend/src/pages/dashboard/MahasiswaPage.jsx`.

## MHS-08 — Impor CSV

**POST `/api/v1/mahasiswa/import`** · Akses: **Admin** · Sukses: **200**

### Request

Multipart `file` wajib, query `simulasi` boolean default false. CSV UTF-8/BOM, maks 1 MB dan 2000 baris data nonkosong; delimiter koma/titik koma/tab. Header nomor_induk,nama wajib; angkatan opsional.
```csv
nomor_induk,nama,angkatan
2488010001,Mahasiswa Contoh,2024
2488010001,Duplikat,2024
```

### Response sukses (200)

```json
{
  "simulasi": true,
  "total_baris": 2,
  "ditambahkan": 1,
  "dilewati": 1,
  "gagal": 0,
  "masalah": [
    {
      "baris": 3,
      "nomor_induk": "2488010001",
      "status": "dilewati",
      "alasan": "NIM dobel dengan baris 2"
    }
  ]
}
```

### Kondisi dan alert

| HTTP | Kondisi | Detail backend aktual | Alert / tindakan rekomendasi |
|---|---|---|---|
| 200 | Berhasil | Lihat response sukses | Simulasi dahulu; tampilkan hasil per baris; konfirmasi impor nyata; warning jika sebagian gagal |
| 400 | Bukan CSV / kosong | File harus berformat CSV (.csv) / File kosong | Pilih CSV valid |
| 400 | Encoding salah | File harus berenkode UTF-8 (di Excel: Save As > CSV UTF-8) | Simpan ulang CSV UTF-8 |
| 400 | Header kurang | Kolom wajib tidak ditemukan: ... | Perbaiki header |
| 400 | Tidak ada data / terlalu banyak baris | Tidak ada baris data di file / Maksimal 2000 baris data per impor | Perbaiki isi |
| 413 | Ukuran >1 MB | Ukuran file maksimal 1 MB | Pecah CSV |
| 409 | Bentrok transaksi | Ada NIM yang baru saja didaftarkan proses lain. Ulangi impor. | Simulasikan ulang |
| 422 | Input tidak memenuhi schema | detail berupa array validasi | Tampilkan kesalahan pada field; pertahankan input |
| 401/403 | Autentikasi atau hak akses | Lihat aturan global | Tangani sesuai aturan global |

**Frontend aktual:** Belum ditemukan service impor.

**Sumber:** `app/services/impor_mahasiswa_service.py`.

Pada impor, HTTP 200 tidak berarti semua baris sukses. `ditambahkan` pada simulasi berarti calon, bukan tersimpan. NIM kosong, nama kosong, angkatan bukan angka atau validasi schema menghasilkan `gagal`; NIM dobel dalam CSV atau database menghasilkan `dilewati`. Baris valid disimpan dalam satu transaksi saat simulasi=false.

## 5. Materi (admin dan mahasiswa)

Admin melihat semua status; mahasiswa hanya `terbit`. Status materi `draft`, `terbit`, `arsip`; status belajar `belum`, `dilihat`, `selesai` (admin null). Upload menerima PDF/DOCX/PPTX saja; schema metadata juga mengenal ppt/doc/xls/xlsx untuk data lama/URL. Judul 3–200, mata kuliah 2–100, deskripsi maks 2000, semester 1–8. URL respons dapat bertanda tangan, jangan simpan permanen atau ubah query.

## MTR-01 — Daftar materi

**GET `/api/v1/materi`** · Akses: **Admin / mahasiswa** · Sukses: **200**

### Request

Query opsional `mata_kuliah`, `semester` 1–8, `jenis`, `q`, `page` default 1 min 1, `limit` default 20 (1–100). `jenis` berupa string, bukan enum query. Contoh `?semester=4&limit=20`.

### Response sukses (200)

```json
{
  "items": [
    {
      "id": 25,
      "judul": "Pengantar Sistem Terdistribusi",
      "deskripsi": null,
      "mata_kuliah": "Sistem Terdistribusi",
      "semester": 4,
      "jenis": "pdf",
      "url": "https://example.invalid/uploads/contoh.pdf?exp=CONTOH&sid=CONTOH&sig=CONTOH",
      "nama_file": "pengantar.pdf",
      "dibuat_oleh": 1,
      "status": "terbit",
      "dibuat_pada": "2026-11-27T03:00:00",
      "diubah_pada": "2026-11-27T03:00:00",
      "status_belajar": null,
      "url_pratinjau": "https://example.invalid/uploads/contoh.pdf?exp=CONTOH&sid=CONTOH&sig=CONTOH"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 20,
  "total_pages": 1
}
```

### Kondisi dan alert

| HTTP | Kondisi | Detail backend aktual | Alert / tindakan rekomendasi |
|---|---|---|---|
| 200 | Berhasil | Lihat response sukses | Render daftar; status_belajar mahasiswa diisi; empty state bila kosong |
| 422 | Input tidak memenuhi schema | detail berupa array validasi | Tampilkan kesalahan pada field; pertahankan input |
| 401/403 | Autentikasi atau hak akses | Lihat aturan global | Tangani sesuai aturan global |

**Frontend aktual:** materiService dan bacaMateriService; halaman admin/mahasiswa menampilkan error jika gagal.

**Sumber:** `app/api/v1/materi.py; app/services/materi_service.py`.

## MTR-02 — Kategori semester

**GET `/api/v1/materi/kategori/semester`** · Akses: **Admin / mahasiswa** · Sukses: **200**

### Request

Tanpa body.

### Response sukses (200)

```json
{
  "items": [
    {
      "semester": 1,
      "total_materi": 0,
      "total_mata_kuliah": 0
    },
    {
      "semester": 2,
      "total_materi": 0,
      "total_mata_kuliah": 0
    },
    {
      "semester": 3,
      "total_materi": 0,
      "total_mata_kuliah": 0
    },
    {
      "semester": 4,
      "total_materi": 1,
      "total_mata_kuliah": 1
    },
    {
      "semester": 5,
      "total_materi": 0,
      "total_mata_kuliah": 0
    },
    {
      "semester": 6,
      "total_materi": 0,
      "total_mata_kuliah": 0
    },
    {
      "semester": 7,
      "total_materi": 0,
      "total_mata_kuliah": 0
    },
    {
      "semester": 8,
      "total_materi": 0,
      "total_mata_kuliah": 0
    }
  ]
}
```

### Kondisi dan alert

| HTTP | Kondisi | Detail backend aktual | Alert / tindakan rekomendasi |
|---|---|---|---|
| 200 | Berhasil | Lihat response sukses | Render 8 semester termasuk yang kosong |

| 401/403 | Autentikasi atau hak akses | Lihat aturan global | Tangani sesuai aturan global |

**Frontend aktual:** materiMahasiswaService.get kategori; error halaman jika gagal.

**Sumber:** `app/services/materi_service.py`.

## MTR-03 — Kategori mata kuliah

**GET `/api/v1/materi/kategori/mata-kuliah`** · Akses: **Admin / mahasiswa** · Sukses: **200**

### Request

Query semester wajib integer 1–8. Contoh `?semester=4`.

### Response sukses (200)

```json
{
  "semester": 4,
  "items": [
    {
      "mata_kuliah": "Sistem Terdistribusi",
      "total_materi": 1
    }
  ]
}
```

### Kondisi dan alert

| HTTP | Kondisi | Detail backend aktual | Alert / tindakan rekomendasi |
|---|---|---|---|
| 200 | Berhasil | Lihat response sukses | Render mata kuliah; kosong = info |
| 422 | Input tidak memenuhi schema | detail berupa array validasi | Tampilkan kesalahan pada field; pertahankan input |
| 401/403 | Autentikasi atau hak akses | Lihat aturan global | Tangani sesuai aturan global |

**Frontend aktual:** materiMahasiswaService; error halaman jika gagal.

**Sumber:** `app/api/v1/materi.py`.

## MTR-04 — Detail materi

**GET `/api/v1/materi/{materi_id}`** · Akses: **Admin / mahasiswa** · Sukses: **200**

### Request

Path materi_id; tanpa body. GET tidak otomatis mencatat progres.

### Response sukses (200)

```json
{
  "id": 25,
  "judul": "Pengantar Sistem Terdistribusi",
  "deskripsi": null,
  "mata_kuliah": "Sistem Terdistribusi",
  "semester": 4,
  "jenis": "pdf",
  "url": "https://example.invalid/uploads/contoh.pdf?exp=CONTOH&sid=CONTOH&sig=CONTOH",
  "nama_file": "pengantar.pdf",
  "dibuat_oleh": 1,
  "status": "terbit",
  "dibuat_pada": "2026-11-27T03:00:00",
  "diubah_pada": "2026-11-27T03:00:00",
  "status_belajar": "belum",
  "url_pratinjau": "https://example.invalid/uploads/contoh.pdf?exp=CONTOH&sid=CONTOH&sig=CONTOH"
}
```

### Kondisi dan alert

| HTTP | Kondisi | Detail backend aktual | Alert / tindakan rekomendasi |
|---|---|---|---|
| 200 | Berhasil | Lihat response sukses | Tampilkan detail; PDF/Office sesuai jenis; fallback unduh bila preview null |
| 404 | Materi tidak ada atau tidak dapat dilihat mahasiswa | Materi tidak ditemukan | Materi tidak tersedia; kembali ke daftar |
| 422 | Input tidak memenuhi schema | detail berupa array validasi | Tampilkan kesalahan pada field; pertahankan input |
| 401/403 | Autentikasi atau hak akses | Lihat aturan global | Tangani sesuai aturan global |

**Frontend aktual:** bacaMateriService.getMateriDetail; BacaMateriPage memakai url_pratinjau untuk non-PDF dan mencatat dilihat bila belum.

**Sumber:** `app/api/v1/materi.py; app/schemas/materi.py`.

## MTR-05 — Upload materi

**POST `/api/v1/materi`** · Akses: **Admin** · Sukses: **201**

### Request

Multipart: `judul` string wajib, `mata_kuliah` string wajib, `semester` int wajib, `deskripsi` opsional, `file` wajib. Batas default 10 MB. Judul/mata kuliah dirapikan tepinya; deskripsi kosong menjadi null. File dicek ekstensi dan isi. Status otomatis terbit; jenis dari ekstensi, nama file unik.

### Response sukses (201)

```json
{
  "id": 25,
  "judul": "Pengantar Sistem Terdistribusi",
  "deskripsi": null,
  "mata_kuliah": "Sistem Terdistribusi",
  "semester": 4,
  "jenis": "pdf",
  "url": "https://example.invalid/uploads/contoh.pdf?exp=CONTOH&sid=CONTOH&sig=CONTOH",
  "nama_file": "pengantar.pdf",
  "dibuat_oleh": 1,
  "status": "terbit",
  "dibuat_pada": "2026-11-27T03:00:00",
  "diubah_pada": "2026-11-27T03:00:00",
  "status_belajar": null,
  "url_pratinjau": "https://example.invalid/uploads/contoh.pdf?exp=CONTOH&sid=CONTOH&sig=CONTOH"
}
```

### Kondisi dan alert

| HTTP | Kondisi | Detail backend aktual | Alert / tindakan rekomendasi |
|---|---|---|---|
| 201 | Berhasil | Lihat response sukses | Tampilkan sukses; refresh daftar; jangan kirim ulang tanpa cek setelah timeout |
| 400 | Ekstensi tidak didukung | Format file tidak diizinkan | Pilih PDF, DOCX atau PPTX |
| 400 | Isi file tidak sesuai ekstensi | Isi file tidak sesuai dengan ekstensinya. File ditolak karena kemungkinan telah dimanipulasi | Pilih file asli yang valid |
| 400 | File kosong | File kosong | Pilih file lain |
| 413 | Ukuran melebihi batas | Ukuran file maksimal 10 MB (default) | Pilih file lebih kecil |
| 409 | Judul duplikat dalam mata kuliah | Nama materi sudah digunakan pada mata kuliah ini. Gunakan nama lain. | Minta judul lain |
| 422 | Input tidak memenuhi schema | detail berupa array validasi | Tampilkan kesalahan pada field; pertahankan input |
| 401/403 | Autentikasi atau hak akses | Lihat aturan global | Tangani sesuai aturan global |

**Frontend aktual:** UploadMateriPage memvalidasi file; KonfirmasiMateriPage: “Materi Berhasil Diunggah!” atau detail error.

**Sumber:** `app/services/materi_service.py; app/services/file_service.py`.

## MTR-06 — Edit materi multipart

**PUT `/api/v1/materi/{materi_id}/edit`** · Akses: **Admin** · Sukses: **200**

### Request

Multipart: judul, mata_kuliah, semester, deskripsi, file semuanya opsional. Kirim field yang berubah. File tanpa nama dianggap tidak diganti; file baru divalidasi seperti upload. Service bermaksud deskripsi kosong menghapus deskripsi; perlu uji parsing form kosong.

### Response sukses (200)

```json
{
  "id": 25,
  "judul": "Pengantar Sistem Terdistribusi",
  "deskripsi": null,
  "mata_kuliah": "Sistem Terdistribusi",
  "semester": 4,
  "jenis": "pdf",
  "url": "https://example.invalid/uploads/contoh.pdf?exp=CONTOH&sid=CONTOH&sig=CONTOH",
  "nama_file": "pengantar.pdf",
  "dibuat_oleh": 1,
  "status": "terbit",
  "dibuat_pada": "2026-11-27T03:00:00",
  "diubah_pada": "2026-11-27T03:00:00",
  "status_belajar": null,
  "url_pratinjau": "https://example.invalid/uploads/contoh.pdf?exp=CONTOH&sid=CONTOH&sig=CONTOH"
}
```

### Kondisi dan alert

| HTTP | Kondisi | Detail backend aktual | Alert / tindakan rekomendasi |
|---|---|---|---|
| 200 | Berhasil | Lihat response sukses | Refresh detail/daftar; file lama dibuang setelah DB sukses jika tidak dipakai materi lain |
| 404 | Materi tidak ada atau tidak dapat dilihat mahasiswa | Materi tidak ditemukan | Materi tidak tersedia; kembali ke daftar |
| 400 | Tidak ada field atau file | Tidak ada field yang diubah | Ubah minimal satu field |
| 400 | Ekstensi tidak didukung | Format file tidak diizinkan | Pilih PDF, DOCX atau PPTX |
| 400 | Isi file tidak sesuai ekstensi | Isi file tidak sesuai dengan ekstensinya. File ditolak karena kemungkinan telah dimanipulasi | Pilih file asli yang valid |
| 400 | File kosong | File kosong | Pilih file lain |
| 413 | Ukuran melebihi batas | Ukuran file maksimal 10 MB (default) | Pilih file lebih kecil |
| 409 | Judul duplikat dalam mata kuliah | Nama materi sudah digunakan pada mata kuliah ini. Gunakan nama lain. | Minta judul lain |
| 422 | Input tidak memenuhi schema | detail berupa array validasi | Tampilkan kesalahan pada field; pertahankan input |
| 401/403 | Autentikasi atau hak akses | Lihat aturan global | Tangani sesuai aturan global |

**Frontend aktual:** materiService edit multipart; EditMateriModal: “Materi Berhasil Diperbarui!” / “Gagal Memperbarui Materi!”

**Sumber:** `app/services/materi_service.py`.

## MTR-07 — Edit metadata JSON

**PUT `/api/v1/materi/{materi_id}`** · Akses: **Admin** · Sukses: **200**

### Request

```json
{
  "status": "arsip"
}
```
Field opsional: judul, deskripsi, mata_kuliah, semester, jenis, url, status. URL 5–500 karakter http/https; signature dibuang sebelum simpan. Jenis pdf/ppt/pptx/doc/docx/xls/xlsx. Status draft/terbit/arsip. Tidak mengunggah file. Hindari null selain deskripsi karena kolom wajib dapat gagal DB.

### Response sukses (200)

```json
{
  "id": 25,
  "judul": "Pengantar Sistem Terdistribusi",
  "deskripsi": null,
  "mata_kuliah": "Sistem Terdistribusi",
  "semester": 4,
  "jenis": "pdf",
  "url": "https://example.invalid/uploads/contoh.pdf?exp=CONTOH&sid=CONTOH&sig=CONTOH",
  "nama_file": "pengantar.pdf",
  "dibuat_oleh": 1,
  "status": "arsip",
  "dibuat_pada": "2026-11-27T03:00:00",
  "diubah_pada": "2026-11-27T03:00:00",
  "status_belajar": null,
  "url_pratinjau": "https://example.invalid/uploads/contoh.pdf?exp=CONTOH&sid=CONTOH&sig=CONTOH"
}
```

### Kondisi dan alert

| HTTP | Kondisi | Detail backend aktual | Alert / tindakan rekomendasi |
|---|---|---|---|
| 200 | Berhasil | Lihat response sukses | Gunakan untuk status; konfirmasi arsip; refresh daftar |
| 404 | Materi tidak ada atau tidak dapat dilihat mahasiswa | Materi tidak ditemukan | Materi tidak tersedia; kembali ke daftar |
| 400 | Body tanpa field yang dikenali | Tidak ada field yang diubah | Kirim perubahan |
| 409 | Judul duplikat dalam mata kuliah | Nama materi sudah digunakan pada mata kuliah ini. Gunakan nama lain. | Minta judul lain |
| 422 | Input tidak memenuhi schema | detail berupa array validasi | Tampilkan kesalahan pada field; pertahankan input |
| 401/403 | Autentikasi atau hak akses | Lihat aturan global | Tangani sesuai aturan global |

**Frontend aktual:** Belum ditemukan service PUT JSON materi; UI edit memakai multipart.

**Sumber:** `app/services/materi_service.py; app/schemas/materi.py`.

## MTR-08 — Hapus materi

**DELETE `/api/v1/materi/{materi_id}`** · Akses: **Admin** · Sukses: **204**

### Request

Path materi_id; tanpa body. File fisik dihapus jika tidak dipakai materi lain.

### Response sukses (204)

Tidak ada body.

### Kondisi dan alert

| HTTP | Kondisi | Detail backend aktual | Alert / tindakan rekomendasi |
|---|---|---|---|
| 204 | Berhasil | Tanpa body | Konfirmasi; refresh daftar setelah 204 |
| 404 | Materi tidak ada atau tidak dapat dilihat mahasiswa | Materi tidak ditemukan | Materi tidak tersedia; kembali ke daftar |
| 422 | Input tidak memenuhi schema | detail berupa array validasi | Tampilkan kesalahan pada field; pertahankan input |
| 401/403 | Autentikasi atau hak akses | Lihat aturan global | Tangani sesuai aturan global |

**Frontend aktual:** DeleteMateriModal: “Materi Berhasil Dihapus!”; MateriPage menangani error dan refresh saat hasil tidak pasti.

**Sumber:** `app/services/materi_service.py`.

## MTR-09 — Unduh file

**GET `/api/v1/materi/{materi_id}/unduh`** · Akses: **Admin / mahasiswa** · Sukses: **200**

### Request

Bearer; tanpa body. Gunakan fetch blob, bukan helper JSON.

### Response sukses (200)

Binary file; `Content-Disposition: attachment; filename=...` (nama dari judul yang dibersihkan), Content-Type sesuai file. CORS mengekspos Content-Disposition.

### Kondisi dan alert

| HTTP | Kondisi | Detail backend aktual | Alert / tindakan rekomendasi |
|---|---|---|---|
| 200 | Berhasil | Lihat response sukses | Simpan blob dengan nama dari header; tampilkan error unduh; tangani sesi expired |
| 404 | Materi tidak ada atau tidak dapat dilihat mahasiswa | Materi tidak ditemukan | Materi tidak tersedia; kembali ke daftar |
| 400 | URL eksternal | Materi ini berupa tautan eksternal dan tidak dapat diunduh dari server | Tawarkan buka tautan jika diizinkan |
| 404 | File fisik hilang | File materi tidak ditemukan di server | Hubungi admin |
| 422 | Input tidak memenuhi schema | detail berupa array validasi | Tampilkan kesalahan pada field; pertahankan input |
| 401/403 | Autentikasi atau hak akses | Lihat aturan global | Tangani sesuai aturan global |

**Frontend aktual:** bacaMateriService.unduhBlob memakai fetch, membaca header filename/filename*, melempar error dengan status; tidak memakai handler 401 global.

**Sumber:** `app/api/v1/materi.py; Frontend/src/services/bacaMateriService.js`.

## 6. Dashboard dan progres mahasiswa

## DSH-01 — Dashboard mahasiswa

**GET `/api/v1/mahasiswa/dashboard`** · Akses: **Mahasiswa** · Sukses: **200**

### Request

Tanpa body.

### Response sukses (200)

```json
{
  "profil": {
    "id": 12,
    "nama": "Mahasiswa Contoh",
    "nomor_induk": "2488010001",
    "angkatan": 2024,
    "foto_url": null
  },
  "statistik": {
    "total_materi": 1,
    "materi_dilihat": 0,
    "materi_selesai": 0,
    "persen_selesai": 0.0
  },
  "lanjutkan_belajar": null,
  "materi_terbaru": [
    {
      "id": 25,
      "judul": "Pengantar Sistem Terdistribusi",
      "mata_kuliah": "Sistem Terdistribusi",
      "semester": 4,
      "jenis": "pdf",
      "url": "https://example.invalid/uploads/contoh.pdf?exp=CONTOH&sid=CONTOH&sig=CONTOH",
      "dibuat_pada": "2026-11-27T03:00:00",
      "status_belajar": "belum"
    }
  ],
  "progres_mata_kuliah": [
    {
      "mata_kuliah": "Sistem Terdistribusi",
      "total": 1,
      "selesai": 0,
      "persen": 0.0
    }
  ]
}
```

### Kondisi dan alert

| HTTP | Kondisi | Detail backend aktual | Alert / tindakan rekomendasi |
|---|---|---|---|
| 200 | Berhasil | Lihat response sukses | Render statistik dan profil; lanjutkan_belajar null = empty state |

| 401/403 | Autentikasi atau hak akses | Lihat aturan global | Tangani sesuai aturan global |

**Frontend aktual:** dashboardMahasiswaService; DashboardMahasiswaPage error “Data beranda gagal dimuat.” jika tidak ada pesan lain; profilService juga memakai endpoint ini.

**Sumber:** `app/services/dashboard_mahasiswa_service.py; app/crud/progres.py`.

Aturan statistik: total materi terbit; materi_dilihat mencakup dilihat dan selesai; persen selesai = selesai/total × 100 dibulatkan satu desimal (0 bila total 0). Materi terbaru maksimal 5; lanjutkan belajar adalah materi terbit terakhir berstatus dilihat; progres mata kuliah dikelompokkan berdasarkan nama mata kuliah, bukan semester.

## DSH-02 — Catat progres

**POST `/api/v1/materi/{materi_id}/progres`** · Akses: **Mahasiswa** · Sukses: **200**

### Request

```json
{
  "status": "dilihat"
}
```
Status request hanya dilihat/selesai. Progres per pengguna dan materi; upsert. Jika sudah selesai lalu dikirim dilihat, tetap selesai.

### Response sukses (200)

```json
{
  "materi_id": 25,
  "status": "dilihat",
  "diubah_pada": "2026-11-27T03:00:00"
}
```

### Kondisi dan alert

| HTTP | Kondisi | Detail backend aktual | Alert / tindakan rekomendasi |
|---|---|---|---|
| 200 | Berhasil | Lihat response sukses | Tidak perlu toast saat otomatis; untuk selesai tampilkan sukses dan refresh statistik; gunakan status respons |
| 404 | Materi tidak ada atau tidak dapat dilihat mahasiswa | Materi tidak ditemukan | Materi tidak tersedia; kembali ke daftar |
| 422 | Input tidak memenuhi schema | detail berupa array validasi | Tampilkan kesalahan pada field; pertahankan input |
| 401/403 | Autentikasi atau hak akses | Lihat aturan global | Tangani sesuai aturan global |

**Frontend aktual:** bacaMateriService.catatDilihat dan dashboard cards mencatat dilihat; beberapa catch kosong. Belum ditemukan tombol selesai pada BacaMateriPage.

**Sumber:** `app/services/dashboard_mahasiswa_service.py; app/crud/progres.py`.

## 7. Profil mahasiswa

Tidak ada GET /profil atau PUT nama/NIM. Profil dibaca dari DSH-01; foto juga tersedia pada AUTH-02/03.

## PRF-01 — Ganti foto

**PUT `/api/v1/profil/foto`** · Akses: **Mahasiswa** · Sukses: **200**

### Request

Multipart file wajib; JPG/PNG/WEBP dikenali dari magic bytes; default maks 2 MB. Ukuran diperiksa sebelum format; foto lama tetap jika validasi gagal.

### Response sukses (200)

```json
{
  "foto_url": "https://example.invalid/uploads/foto-contoh.jpg?exp=CONTOH&sid=CONTOH&sig=CONTOH"
}
```

### Kondisi dan alert

| HTTP | Kondisi | Detail backend aktual | Alert / tindakan rekomendasi |
|---|---|---|---|
| 200 | Berhasil | Lihat response sukses | Perbarui foto pada profil dan AuthContext; pertahankan foto lama saat gagal |
| 400 | File kosong | File kosong | Pilih foto |
| 400 | Format tidak sesuai | Format foto tidak diizinkan. Gunakan JPG, PNG, atau WEBP | Pilih format valid |
| 413 | Ukuran >2 MB | Ukuran foto maksimal 2 MB (default) | Kompres foto |
| 422 | Input tidak memenuhi schema | detail berupa array validasi | Tampilkan kesalahan pada field; pertahankan input |
| 401/403 | Autentikasi atau hak akses | Lihat aturan global | Tangani sesuai aturan global |

**Frontend aktual:** profilService.ubahFotoProfil memakai request langsung; ProfilToast: “Foto Profil Berhasil Diperbarui!” / “Foto Profil Gagal Diperbarui!” + detail.

**Sumber:** `app/services/profil_service.py; app/services/file_service.py`.

## PRF-02 — Hapus foto

**DELETE `/api/v1/profil/foto`** · Akses: **Mahasiswa** · Sukses: **200**

### Request

Tanpa body; aman diulang walaupun foto sudah null.

### Response sukses (200)

```json
{
  "foto_url": null
}
```

### Kondisi dan alert

| HTTP | Kondisi | Detail backend aktual | Alert / tindakan rekomendasi |
|---|---|---|---|
| 200 | Berhasil | Lihat response sukses | Konfirmasi; tampilkan avatar default; perbarui AuthContext |

| 401/403 | Autentikasi atau hak akses | Lihat aturan global | Tangani sesuai aturan global |

**Frontend aktual:** Belum ditemukan service hapus foto.

**Sumber:** `app/api/v1/profil.py; app/services/profil_service.py`.

## 8. Kontak admin

## KON-01 — Tautan WhatsApp

**GET `/api/v1/kontak-admin/whatsapp`** · Akses: **Mahasiswa** · Sukses: **200**

### Request

Query topik enum akun/materi/lainnya (default lainnya); pesan opsional maks 500 karakter. Identitas diambil dari akun login, bukan request.

### Response sukses (200)

```json
{
  "nomor": "6280000000000",
  "nomor_tampil": "+62 800-0000-0000",
  "pesan": "Halo Admin INF-Learning, saya Mahasiswa Contoh (NIM 2488010001, angkatan 2024).\nTopik: Kendala materi kuliah\n\nMohon bantuannya.",
  "tautan": "https://wa.me/6280000000000?text=CONTOH"
}
```

### Kondisi dan alert

| HTTP | Kondisi | Detail backend aktual | Alert / tindakan rekomendasi |
|---|---|---|---|
| 200 | Berhasil | Lihat response sukses | Buka tautan hasil API; jangan tampilkan “Pesan terkirim” karena server hanya membuat link |
| 503 | Nomor admin belum diatur atau tidak valid | Kontak WhatsApp admin belum tersedia | Tampilkan info kontak belum tersedia |
| 422 | Input tidak memenuhi schema | detail berupa array validasi | Tampilkan kesalahan pada field; pertahankan input |
| 401/403 | Autentikasi atau hak akses | Lihat aturan global | Tangani sesuai aturan global |

**Frontend aktual:** kontakService membangun query dan memanggil API.

**Sumber:** `app/services/kontak_service.py; app/api/v1/kontak_admin.py`.

## 9. Berkas dan kesehatan sistem

## FILE-01 — Akses file

**GET / HEAD `/uploads/{nama_berkas}`** · Akses: **URL bertanda tangan** · Sukses: **200**

### Request

Query exp, sid, sig dari URL yang diterbitkan server; tidak perlu bearer. Jangan membuat signature sendiri. Nama file sederhana. Default TTL 30–60 menit sesuai jendela waktu, tetapi sesi harus tetap aktif.

### Response sukses (200)

GET: binary file; HEAD: metadata tanpa body. Header `X-Content-Type-Options: nosniff`, `Cache-Control: private, max-age` maksimal 900 detik dan tidak melebihi sisa TTL.

### Kondisi dan alert

| HTTP | Kondisi | Detail backend aktual | Alert / tindakan rekomendasi |
|---|---|---|---|
| 200 | Berhasil | Lihat response sukses | Jangan log/share URL bertanda tangan; refresh URL setelah expired; fallback unduh |
| 403 | Signature hilang/salah/expired atau sesi/akun tidak aktif | Tautan file tidak valid atau sudah kedaluwarsa | Ambil URL baru dari API; jika sesi habis login ulang |
| 403 | Tidak berhak atas file | Anda tidak memiliki akses ke file ini | Jangan retry tanpa perubahan hak akses |
| 404 | Nama tidak valid, tidak terdaftar atau file hilang | File tidak ditemukan | Tampilkan fallback / hubungi admin |

**Frontend aktual:** URL foto dan preview dipakai oleh UI; PDF dibaca juga melalui unduhBlob.

**Sumber:** `app/api/v1/berkas.py; app/core/tautan_file.py; app/services/berkas_service.py`.

## SYS-01 — Root

**GET `/`** · Akses: **Publik** · Sukses: **200**

### Request

Tanpa body.

### Response sukses (200)

```json
{
  "app": "INF-Learning",
  "status": "ok"
}
```

### Kondisi dan alert

| HTTP | Kondisi | Detail backend aktual | Alert / tindakan rekomendasi |
|---|---|---|---|
| 200 | Berhasil | Lihat response sukses | Gunakan untuk cek aplikasi hidup |


**Frontend aktual:** Tidak ditemukan penggunaan service.

**Sumber:** `app/main.py`.

## SYS-02 — Health check

**GET `/health`** · Akses: **Publik** · Sukses: **200**

### Request

Tanpa body.

### Response sukses (200)

```json
{
  "status": "ok",
  "database": "connected"
}
```

### Kondisi dan alert

| HTTP | Kondisi | Detail backend aktual | Alert / tindakan rekomendasi |
|---|---|---|---|
| 200 | Berhasil | Lihat response sukses | Tampilkan status DB sesuai field database |
| 200 | Koneksi database gagal | database: error (status tetap ok) | Monitoring harus cek database, bukan hanya HTTP 200 |

**Frontend aktual:** Tidak ditemukan penggunaan service.

**Sumber:** `app/main.py`.

## 10. Audit kesesuaian dan rekomendasi

Prioritas berikut merupakan penilaian audit statis, bukan hasil uji runtime. P0 = blocker build/keamanan penting; P1 = integrasi atau aturan bisnis penting; P2 = penyempurnaan.

| Prioritas | Temuan aktual | Rekomendasi |
|---|---|---|
| P0 | `src/context/AuthContext.jsx` diawali `from fastapi import HTTPException, status`, sintaks Python di JSX. | Hapus baris tersebut; jalankan build frontend. Belum diuji build. |
| P1 | Logout lokal tidak memanggil AUTH-04. | Panggil endpoint dengan token sebelum clear storage; jika jaringan gagal, jelaskan sesi server mungkin masih hidup. |
| P1 | 401 pada api.js menghapus storage, tetapi tidak memperbarui AuthContext; unduhBlob memakai fetch terpisah. | Satu handler sesi global untuk JSON dan binary; redirect dan clear state. |
| P1 | Reset akun hanya menghapus password/status; tidak terlihat penghapusan sesi di CRUD reset. | Cabut seluruh sesi saat reset; uji token lama setelah aktivasi ulang. |
| P1 | Backend mengizinkan hapus mahasiswa aktif; UI membatasi. | Tentukan aturan bisnis bersama dan tegakkan di backend bila pembatasan memang wajib. |
| P1 | PUT mahasiswa mengizinkan perubahan status tanpa memeriksa keberadaan password; UI mengunci belum_aktif. | Batasi transisi status di service; gunakan registrasi/reset untuk aktivasi. |
| P1 | MHS-02/03/06/08, MTR-07, PRF-02 belum ditemukan pemanggilan di service frontend. | Integrasikan jika fitur masuk scope; jangan menganggap sudah berjalan. |
| P1 | Progres selesai tersedia di backend, tetapi alur baca yang diperiksa mencatat dilihat dan mengabaikan sebagian error. | Tambahkan aksi selesai bila dibutuhkan; tampilkan kegagalan yang relevan dan refresh statistik. |
| P1 | JSON update materi menerima null untuk field yang secara DB wajib; service meneruskan field. | Tolak null yang tidak sah dengan 422; uji constraint. |
| P1 | URL file terikat sesi; viewer Office pihak ketiga menerima URL bertanda tangan. | Evaluasi privasi materi; jangan bagikan URL; fallback unduh jika preview gagal. Cache privat dapat bertahan sampai TTL cache. |
| P2 | `profilService` upload memakai request biasa (15 detik), bukan helper 60 detik. | Samakan timeout upload sesuai kebutuhan. |
| P2 | Komentar adminService masih menyebut total_kuis; schema backend tidak punya field itu. | Perbarui komentar dan kontrak lama; jangan render statistik kuis sebagai data nyata. |
| P2 | Halaman kuis admin/mahasiswa tersedia sebagai placeholder, tidak ada router kuis aktif. | Tandai belum tersedia; jangan membuat endpoint fiktif. |
| P2 | Health check selalu 200 dan status ok walau database error. | Monitoring membaca database; pertimbangkan 503 jika DB tidak siap. |
| P2 | Upload hanya 3 format, schema metadata 7 format. | Bedakan jenis yang dapat diunggah dan jenis legacy/eksternal di UI. |
| P2 | `deskripsi` kosong pada multipart dimaksudkan menghapus, tetapi parsing FastAPI dapat mengubah string kosong menjadi None. | Uji kasus ini; gunakan PUT JSON dengan deskripsi null jika perlu. |
| P2 | CORS default wildcard; production hanya mencatat warning. | Batasi origin ke domain resmi dan cek konfigurasi deployment. |

### Catatan keamanan tambahan

Registrasi saat ini memeriksa NIM, status dan password, tetapi tidak ada OTP/verifikasi kepemilikan NIM pada endpoint. Login membedakan NIM tidak terdaftar dan belum registrasi. Pertimbangkan mekanisme aktivasi yang membuktikan kepemilikan serta rate limiting; tidak ada klaim bahwa mitigasi tersebut telah diterapkan. Foto hanya diperiksa magic bytes, bukan decode gambar penuh. Jangan menganggap semua file dengan header valid pasti gambar aman.

## 11. Checklist integrasi dan pengujian

- [ ] Build frontend setelah memperbaiki sintaks AuthContext.
- [ ] Registrasi NIM yang dibuat admin → login → GET me → logout server → token lama 401.
- [ ] Uji role admin/mahasiswa, token hilang, token rusak, idle timeout dan akun nonaktif.
- [ ] Tambah mahasiswa → detail → edit → ringkasan → reset → registrasi ulang; uji NIM duplikat dan status.
- [ ] Simulasi CSV → verifikasi DB tidak berubah → impor nyata → cek jumlah gagal/dilewati.
- [ ] Upload PDF/DOCX/PPTX → detail → edit metadata/file → arsip → cek mahasiswa tidak bisa melihat → hapus.
- [ ] Uji file palsu, kosong, terlalu besar, judul duplikat, semester invalid.
- [ ] Dashboard mahasiswa → buka materi → catat dilihat → selesai → kirim dilihat lagi → status tetap selesai.
- [ ] Unduh binary dan nama file; uji 401/404, URL signed tanpa signature, expired, akses role salah.
- [ ] Ganti foto valid → cek dashboard/me → gagal upload tetap foto lama → hapus foto.
- [ ] Kontak admin: semua topik, pesan panjang, nomor belum dikonfigurasi; cek hanya membuka WhatsApp.
- [ ] Uji timeout pada operasi tulis: refresh data sebelum retry.

## 12. Sumber dan batas audit

Backend: `app/main.py`, `app/api/v1/*.py`, `app/schemas/*.py`, `app/services/*.py`, `app/crud/*.py`, `app/core/{config,dependencies,security,tautan_file,pratinjau,validators}.py` dari app(8).zip. Frontend: `Frontend/src/services/*.js`, `context/AuthContext.jsx`, halaman auth/dashboard/mahasiswa dan komponen alert terkait dari Frontend.zip. `node_modules` dan bytecode cache tidak dijadikan sumber kontrak. Dokumentasi ini tidak membuktikan deployment memakai snapshot yang sama. Swagger `/docs`, `/redoc`, `/openapi.json` hanya aktif di non-production menurut main.py; route file disembunyikan dari schema. Endpoint otomatis dokumentasi bukan endpoint bisnis.
