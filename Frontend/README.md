# Frontend — Platform Belajar Informatika

Skeleton React + Vite. Dibuat sebagai kerangka awal untuk memudahkan kerja
Frontend sekaligus jadi acuan kontrak API bagi Backend.

## Cara menjalankan

```bash
cd frontend
npm install
npm run dev
```

Buka `http://localhost:5173`. Panggilan ke `/api/...` otomatis diteruskan
ke server Backend lewat proxy di `vite.config.js` — ubah `target` di sana
sesuai port Backend kalian.

## Peta folder ke Product Backlog

| Folder / File | Story |
|---|---|
| `src/pages/auth/RegisterPage.jsx` | FE-01 — Tampilan Role Otomatis di Registrasi |
| `src/pages/auth/LoginPage.jsx` | FE-02 — Login Tanpa Pemilihan Role |
| `src/pages/materi/MateriListPage.jsx` | FE-03 — Halaman Daftar Topik Materi per Kategori |
| `src/services/authService.js` | Kontrak endpoint `/register` dan `/login` ke Backend |
| `src/services/materiService.js` | Kontrak endpoint `/materi` ke Backend |

## Kontrak API yang diasumsikan (untuk didiskusikan dengan Backend)

- `POST /api/register` — body: `{ nimNip, nama, password }` — TIDAK ADA field role.
  Respons sukses (201): `{ role: "Mahasiswa" | "Dosen" }`
  Respons gagal (422): `{ message: "Format NIM/NIP tidak dikenali" }`

- `POST /api/login` — body: `{ nimNip, password }`
  Respons sukses (200): `{ token, role }`
  Respons gagal (401): `{ message: "NIM/NIP atau kata sandi salah" }`

- `GET /api/materi?category=<id>` — respons: array `{ id, title, summary }`
- `GET /api/materi/categories` — respons: array `{ id, name }`

## Yang masih perlu dilengkapi tim

- Styling nyata mengikuti desain UX-01 dari UI/UX Designer (saat ini masih
  styling dasar/placeholder di `src/styles/globals.css`)
- Validasi format input di sisi Frontend (mis. pola NIM/NIP) sebelum submit
- Halaman detail materi (WBS 2.3) dan dashboard progres (WBS 4.2) untuk
  sprint-sprint berikutnya — belum dibuat di skeleton ini
