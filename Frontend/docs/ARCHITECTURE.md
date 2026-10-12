# 🏗️ Architecture — INF-orm Frontend

**Versi:** 1.0
**Terakhir Update:** 10 Oktober 2026

Dokumen ini menjelaskan struktur teknis & alur data aplikasi frontend.

---

## 🎯 Stack Teknologi

| Layer | Teknologi | Versi | Alasan |
|---|---|---|---|
| **Framework** | React | 18.3 | Populer, ekosistem besar |
| **Build Tool** | Vite | 5.4 | Cepat, modern |
| **Routing** | React Router | 6.26 | Standar industri |
| **Styling** | CSS Global | — | Simpel, tanpa build |
| **HTTP Client** | Fetch API | — | Built-in browser |
| **State Management** | React Context | — | Cukup untuk skala ini |
| **Font** | Poppins | — | Modern, mudah dibaca |

---

## 📁 Struktur Folder

# Struktur Folder Frontend

```text
src/
├── components/              # Komponen reusable
│   ├── common/              # Komponen umum (input, alert, dll)
│   ├── skeletons/           # Loading state
│   ├── wireframes/          # Wireframe dokumentasi
│   └── mockups/             # Mockup dokumentasi
│
├── context/                 # State global React Context
│   └── AuthContext.jsx      # Token & role user
│
├── hooks/                   # Custom React hooks
│   └── useAuth.js           # Akses AuthContext
│
├── mocks/                   # Data dummy (dev only)
│   ├── users.js             # Dummy user & materi
│   └── mockApi.js           # Handler mock API
│
├── pages/                   # Halaman per URL
│   ├── auth/                # Login & register
│   ├── materi/              # Halaman materi
│   ├── wireframe/           # Halaman wireframe
│   ├── mockup/              # Halaman mockup
│   └── *.jsx                # Index pages
│
├── services/                # Komunikasi backend
│   ├── api.js               # Fetch wrapper
│   └── authService.js       # Auth logic
│
├── styles/                  # CSS global
│   └── global.css           # Semua styling
│
├── utils/                   # Helper functions
│   └── validators.js        # Validasi form
│
├── App.jsx                  # Routing utama
└── main.jsx                 # Entry point
```

---

## 🏛️ Layer Architecture

Aplikasi ini menggunakan **layered architecture** dengan 4 layer:

## Arsitektur Layer Frontend

```
┌─────────────────────────────────────────────────┐
│                   UI LAYER                      │
│              pages/, components/                │
│                                                 │
│        Tampilan dan interaksi pengguna          │
└─────────────────────────────────────────────────┘
```
1. **UI Layer**
   - Berisi `pages/` dan `components/`.
   - Bertanggung jawab terhadap tampilan dan interaksi pengguna.

```
                         ↕
┌─────────────────────────────────────────────────┐
│                 STATE LAYER                     │
│                context/, hooks/                 │
│                                                 │
│             Data global (token, role)           │
└─────────────────────────────────────────────────┘
```
2. **State Layer**
   - Berisi `context/` dan `hooks/`.
   - Mengelola data global seperti token autentikasi dan role pengguna.

```
                         ↕
┌─────────────────────────────────────────────────┐
│                SERVICE LAYER                    │
│                   services/                     │
│                                                 │
│          Komunikasi HTTP ke backend             │
└─────────────────────────────────────────────────┘
```
3. **Service Layer**
   - Berisi `services/`.
   - Bertanggung jawab melakukan komunikasi HTTP dengan backend API.

```
                         ↕
┌─────────────────────────────────────────────────┐
│                  DATA LAYER                     │
│                    mocks/                       │
│                                                 │
│             Mock data (dev only)                │
└─────────────────────────────────────────────────┘
```
4. **Data Layer**
   - Berisi `mocks/`.
   - Digunakan untuk menyediakan data dummy selama proses development.
   - Tidak digunakan pada production.

```
                         ↕
                    BACKEND API
```
5. **Backend API**
   - Menyediakan endpoint yang digunakan oleh frontend.
   - Menangani autentikasi, data, dan proses bisnis aplikasi.

---

## 🔄 Alur Data End-to-End (Login)

## Alur Proses Login

Alur login frontend dimulai ketika pengguna membuka halaman `/login` dan berakhir dengan pengalihan ke halaman `/materi` apabila autentikasi berhasil.

```text
User
 │
 │  Buka /login
 ▼
LoginPage
 │
 │  Isi NIM + Password
 │
 │  Klik Login
 ▼
handleSubmit()
 │
 ├── Validasi
 │   └── utils/validators.js
 │
 ▼
authService.login()
 │
 ├── VITE_USE_MOCK = true
 │   └── mocks/mockApi.js
 │       └── mockLogin()
 │
 └── VITE_USE_MOCK = false
     └── services/api.js
         └── Backend API
              │
              │ POST /auth/login
              ▼
         Response
              │
       ┌──────┴──────┐
       │             │
    Sukses          Gagal
       │             │
       ▼             ▼
 loginSuccess()   ErrorMessage
       │
       ├── Simpan token
       ├── Simpan role
       │
       ├── Context
       └── localStorage
              │
              ▼
       navigate('/materi')
```

### Komponen yang Terlibat

| File | Fungsi |
|---|---|
| `pages/auth/LoginPage.jsx` | Menampilkan form dan menangani submit login |
| `utils/validators.js` | Melakukan validasi input |
| `services/authService.js` | Menangani proses autentikasi |
| `mocks/mockApi.js` | Menyediakan login dummy saat mode mock aktif |
| `services/api.js` | Mengirim HTTP request ke backend |
| `context/AuthContext.jsx` | Menyimpan state autentikasi |
| `localStorage` | Menyimpan token dan role secara lokal |

---

## 🔌 Routing Structure

## Routing Frontend

### Main Application

| Route | Page / Component | Keterangan |
|---|---|---|
| `/` | Redirect → `/login` | Halaman awal diarahkan ke login |
| `/login` | `LoginPage` | Halaman login pengguna |
| `/register` | `RegisterPage` | Halaman registrasi pengguna |
| `/materi` | `MateriListPage` | Halaman daftar materi, menggunakan `ProtectedRoute` |

### Dokumentasi

| Route | Page / Component | Keterangan |
|---|---|---|
| `/design-system` | `DesignSystemPage` | Dokumentasi design system |
| `/blueprint` | `BlueprintIndexPage` | Halaman utama blueprint |
| `/login/skeleton` | `LoginBlueprintPage` | Blueprint/skeleton halaman login |
| `/wireframe` | `WireframeIndexPage` | Halaman utama wireframe |
| `/login/wireframe` | `LoginWireframePage` | Wireframe halaman login |
| `/mockup` | `MockupIndexPage` | Halaman utama mockup |
| `/login/mockup` | `LoginMockupPage` | Mockup halaman login |

---

## 🎯 Keputusan Teknis

### 1. Kenapa Global CSS, bukan CSS-in-JS?

| Aspek | Global CSS | CSS-in-JS |
|---|---|---|
| Setup | Sederhana | Perlu library |
| Performance | Bagus | Sedikit overhead |
| DevTools | Mudah di-debug | Perlu extension |
| Skalabilitas | Cukup untuk proyek ini | Lebih baik untuk besar |

**Keputusan:** Global CSS — proyek skala kecil-menengah, tidak perlu kompleksitas.

### 2. Kenapa React Context, bukan Redux?

| Aspek | Context | Redux |
|---|---|---|
| Setup | Built-in | Perlu library |
| Boilerplate | Minimal | Banyak |
| Use case | State sederhana | State kompleks |

**Keputusan:** Context — state auth hanya 1 (token + role), tidak perlu Redux.

### 3. Kenapa Fetch, bukan Axios?

| Aspek | Fetch | Axios |
|---|---|---|
| Install | Built-in | Perlu install |
| Ukuran | 0 KB | ~14 KB |
| Fitur | Basic | Lengkap |

**Keputusan:** Fetch — cukup untuk kebutuhan, tanpa dependency tambahan.

### 4. Kenapa Mock API?

**Alasan:** Backend dikerjakan tim terpisah. Dengan mock:
- Frontend bisa jalan tanpa backend
- Bisa demo kapan saja
- Switch ke real backend cukup ubah `.env`

---

## 🔐 Authentication Flow

## Alur Autentikasi dan Token

```text
1. User melakukan login
          │
          ▼
2. Backend memproses login
          │
          ▼
3. Backend mengirim response
   {
     access_token,
     pengguna: {
       peran
     }
   }
          │
          ▼
4. Frontend menerima response
          │
          ├── Simpan access_token
          │   └── localStorage
          │
          ├── Simpan peran / role
          │   └── localStorage
          │
          └── Simpan state autentikasi
              └── AuthContext
          │
          ▼
5. Request berikutnya
          │
          ├── Ambil token dari localStorage
          │
          └── Tambahkan HTTP Header
              Authorization: Bearer <token>
          │
          ▼
6. Backend memvalidasi token
          │
          ├── Token valid
          │   └── Request diproses
          │
          └── Token expired / tidak valid
              └── Response HTTP 401
                      │
                      ▼
               Frontend redirect
                   ke /login
```

### Penyimpanan Data

| Data | Penyimpanan | Kegunaan |
|---|---|---|
| `access_token` | `localStorage` | Digunakan untuk autentikasi request |
| `role / peran` | `localStorage` | Menentukan hak akses pengguna |
| Auth state | `AuthContext` | Digunakan oleh komponen React |

---

## 🎨 Design Pattern

### 1. Container/Presentational Pattern

| Tipe | Contoh | Peran |
|---|---|---|
| **Container** | `LoginPage.jsx` | Logic, state, fetch |
| **Presentational** | `InputField.jsx` | Render UI, terima props |

### 2. Controlled Component

Semua input di aplikasi ini **controlled**:
- State di parent
- `value` dari state
- `onChange` update state
- Parent selalu tahu nilai saat ini

### 3. Custom Hooks

```jsx
const { token, role, loginSuccess, logout } = useAuth();