# 📋 Product Requirement Document (PRD)

**Proyek:** INF-orm — Learning Management System
**Versi:** 1.0
**Terakhir Update:** 10 Oktober 2026
**Status:** Aktif

---

## 1. Latar Belakang

Mahasiswa dan dosen di lingkungan informatika membutuhkan platform
untuk mengakses materi pembelajaran secara digital. Saat ini materi
dibagikan melalui grup chat yang tidak terstruktur, sulit dicari,
dan mudah hilang.

**INF-orm** hadir sebagai solusi — platform LMS (Learning Management
System) yang terstruktur untuk mengelola materi pembelajaran.

---

## 2. Tujuan Produk

| # | Tujuan | Metrik Keberhasilan |
|---|---|---|
| 1 | Menyediakan akses materi yang terstruktur | Mahasiswa bisa akses materi dalam < 30 detik |
| 2 | Memudahkan mahasiswa belajar mandiri | Mahasiswa bisa login & lihat daftar materi |
| 3 | Menyediakan sistem autentikasi yang aman | Password di-hash, token JWT |

---

## 3. Target User

### Persona 1 — Mahasiswa

| Aspek | Detail |
|---|---|
| **Nama** | Budi Santoso |
| **Usia** | 19 tahun |
| **Status** | Mahasiswa Informatika Semester 2 |
| **Kebutuhan** | Akses materi kapan saja, dari mana saja |
| **Pain Point** | Materi tersebar di grup chat, susah dicari |

### Scope User

| Role | Status |
|---|---|
| **Mahasiswa** | ✅ Aktif |
| **Dosen** | ❌ Dihapus dari scope |

---

## 4. Fitur

### 4.1 Fitur Utama (MVP)

| # | Fitur | Prioritas | Status |
|---|---|---|---|
| 1 | **Registrasi Akun** | Must Have | ✅ Selesai |
| 2 | **Login (NIM + Password)** | Must Have | ✅ Selesai |
| 3 | **Lihat Daftar Materi** | Must Have | 🟡 Placeholder |
| 4 | **Logout** | Must Have | ✅ Selesai |

### 4.2 Fitur Tambahan (Future)

| # | Fitur | Prioritas | Status |
|---|---|---|---|
| 5 | Detail Materi | Should Have | ⏳ Planned |
| 6 | Search Materi | Could Have | ⏳ Planned |
| 7 | Filter Kategori | Could Have | ⏳ Planned |
| 8 | Progress Belajar | Nice to Have | ⏳ Planned |
| 9 | Upload Materi (Dosen) | Out of Scope | ❌ Removed |

---

## 5. User Stories

### US-01 — Registrasi

> **Sebagai** mahasiswa baru,
> **saya ingin** mendaftar akun dengan NIM dan password,
> **agar** saya bisa login dan mengakses materi.

**Acceptance Criteria:**
- [x] Form register punya field: Nama Lengkap, NIM, Password, Konfirmasi Password
- [x] Validasi format NIM (format khusus)
- [x] Validasi password minimal 8 karakter
- [x] Validasi konfirmasi password harus sama
- [x] Setelah sukses, redirect ke halaman login

### US-02 — Login

> **Sebagai** mahasiswa terdaftar,
> **saya ingin** login dengan NIM dan password,
> **agar** saya bisa masuk ke halaman utama.

**Acceptance Criteria:**
- [x] Form login punya field: NIM, Password
- [x] Tidak ada dropdown role (role ditentukan backend)
- [x] Kalau salah, muncul pesan error
- [x] Kalau sukses, redirect ke /materi
- [x] Ada loading state saat submit

### US-03 — Lihat Daftar Materi

> **Sebagai** mahasiswa yang sudah login,
> **saya ingin** melihat daftar materi yang tersedia,
> **agar** saya tahu materi apa saja yang bisa dipelajari.

**Acceptance Criteria:**
- [ ] Hanya bisa diakses user login (ProtectedRoute)
- [ ] Menampilkan list materi: judul, deskripsi, pengajar
- [ ] Kalau kosong, tampil empty state
- [ ] Ada loading state saat fetch data

---

## 6. Kriteria Sukses

| # | Metrik | Target |
|---|---|---|
| 1 | Waktu login | < 3 detik |
| 2 | Error rate | < 1% |
| 3 | Responsive | Berfungsi di mobile & desktop |
| 4 | Accessibility | Kontras warna WCAG AA |
| 5 | Skeleton loading | Muncul saat fetch data |

---

## 7. Batasan (Out of Scope)

Fitur-fitur berikut **TIDAK** termasuk dalam scope:

- ❌ Role Dosen (dihapus dari awal)
- ❌ Field Email di register (tidak ada di kontrak API)
- ❌ Fitur Chat / Diskusi
- ❌ Upload file
- ❌ Sistem pembayaran
- ❌ Mobile app (hanya web)

---

## 8. Design Reference

Semua desain mengacu pada **Design System** internal:

- Warna primary: `#7ec8f5`
- Font: **Poppins**
- Layout: card 2 kolom untuk auth
- Background: gradient biru lembut

Detail: lihat [DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md)

---

## 9. Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend | React 18 + Vite |
| Routing | React Router 6 |
| Styling | CSS Global |
| HTTP Client | Fetch API |
| State | React Context |
| Backend | (dikelola tim terpisah) |

Detail: lihat [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## 10. Timeline

| Fase | Durasi | Status |
|---|---|---|
| Riset & PRD | 1 minggu | ✅ Selesai |
| Design (Blueprint → Mockup) | 2 minggu | ✅ Selesai |
| Implementasi Frontend | 3 minggu | 🟡 Berjalan |
| Integrasi Backend | 1 minggu | ⏳ Belum |
| Testing & Demo | 1 minggu | ⏳ Belum |

---

## 11. Stakeholder

| Nama | Peran |
|---|---|
| (Nama kamu) | Frontend Developer |
| (Nama temanmu) | Backend Developer |
| (Dosen pembimbing) | Supervisor |

---

**Terakhir Update:** 10 Oktober 2026