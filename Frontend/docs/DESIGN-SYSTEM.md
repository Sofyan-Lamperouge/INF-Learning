# 🎨 Design System — INF-orm LMS

**Versi:** 1.0
**Terakhir Update:** 10 Oktober 2026

Design System ini adalah **"buku aturan"** visual aplikasi INF-orm.
Semua halaman harus mengikuti aturan di dokumen ini agar konsisten.

**Live documentation:** Buka `/design-system` di aplikasi.

---

## 🎯 Prinsip Desain

| # | Prinsip | Penjelasan |
|---|---|---|
| 1 | **Konsisten** | Semua halaman pakai warna, font, spacing yang sama |
| 2 | **Jelas (Clear)** | Hierarki visual jelas — judul besar, subtitle kecil |
| 3 | **Cepat (Performance)** | Loading state muncul saat data dimuat |
| 4 | **Aksesibel** | Kontras warna memadai, mendukung ARIA |
| 5 | **Responsive** | Tampilan menyesuaikan ukuran layar |
| 6 | **Minimalis** | Tidak ada elemen berlebihan |

---

## 🎨 Colors

### Primary

| Nama | Hex | Penggunaan |
|---|---|---|
| **Primary** | `#7ec8f5` | Tombol utama, border input |
| **Primary Dark** | `#4ea8e0` | Hover state |
| **Primary Deep** | `#2f9fe0` | Focus state, link aktif |

### Background

| Nama | Hex | Penggunaan |
|---|---|---|
| **Background** | `#f5fbff` | Latar halaman umum |
| **Background Soft** | `#eaf5fc` | Latar halaman auth |
| **Card** | `#ffffff` | Latar card putih |

### Text

| Nama | Hex | Penggunaan |
|---|---|---|
| **Text Primary** | `#1a1a1a` | Judul, teks utama |
| **Text Secondary** | `#6b7280` | Subtitle, deskripsi |
| **Text Muted** | `#9ca3af` | Placeholder |

### Semantic

| Nama | Hex | Penggunaan |
|---|---|---|
| **Error** | `#dc2626` | Pesan error |
| **Success** | `#16a34a` | Pesan sukses |
| **Warning** | `#f59e0b` | Peringatan |
| **Info** | `#3b82f6` | Informasi |

### Neutral

| Nama | Hex | Penggunaan |
|---|---|---|
| **Border** | `#e5e7eb` | Border card, divider |
| **Border Light** | `#cbd5e1` | Border input default |
| **Disabled** | `#b7dff5` | Tombol disabled |
| **Skeleton** | `#ececec` | Placeholder loading |

---

## ✏️ Typography

**Font utama:** Poppins (dari Google Fonts)
**Fallback:** `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`

| Style | Size | Weight | Line-Height | Penggunaan |
|---|---|---|---|---|
| **H1** | 1.75rem | 700 | 1.25 | Judul halaman |
| **H2** | 1.25rem | 700 | 1.3 | Judul section |
| **H3** | 1rem | 700 | 1.4 | Judul list item |
| **Body** | 0.95rem | 400 | 1.5 | Paragraf umum |
| **Body Small** | 0.85rem | 400 | 1.5 | Footer, caption |
| **Label** | 0.85rem | 600 | 1.4 | Label form |
| **Button** | 0.95rem | 700 | 1 | Teks tombol |
| **Caption** | 0.75rem | 400 | 1.4 | Placeholder |

---

## 📏 Spacing Scale

| Nama | Value | Pixel | Penggunaan |
|---|---|---|---|
| `xs` | 0.25rem | 4px | Ikon ke teks |
| `sm` | 0.5rem | 8px | Label ke input |
| `md` | 0.75rem | 12px | Antar field form |
| `lg` | 1rem | 16px | Antar section kecil |
| `xl` | 1.5rem | 24px | Antar section besar |
| `2xl` | 2rem | 32px | Padding card |
| `3xl` | 3rem | 48px | Padding halaman |

---

## 🔘 Border Radius

| Nama | Value | Penggunaan |
|---|---|---|
| `sm` | 6px | Badge, tag |
| `md` | 10px | Input, tombol kecil |
| `lg` | 12px | Tombol besar |
| `xl` | 22px | Card utama |
| `full` | 9999px | Pill / circle |

---

## 🌑 Box Shadow

| Nama | Value | Penggunaan |
|---|---|---|
| `sm` | `0 1px 3px rgba(0,0,0,0.04)` | Card halus |
| `md` | `0 4px 12px rgba(30,90,140,0.08)` | Card standar |
| `lg` | `0 10px 30px rgba(30,90,140,0.10)` | Modal, dialog |
| `xl` | `0 20px 50px rgba(30,90,140,0.12)` | Card utama |

---

## 🔘 Components

### Button Primary

```jsx
<button className="btn-primary">Masuk</button>