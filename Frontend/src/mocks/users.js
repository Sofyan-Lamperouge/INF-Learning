// src/mocks/users.js
// Data dummy untuk development saat backend belum siap.
// Hapus atau abaikan file ini saat production.

export const MOCK_USERS = [
  {
    id: 1,
    namaLengkap: "Budi Santoso",
    nim: "20240101",
    password: "HidupCokowi2#",
    role: "mahasiswa",
  },
  // ❌ User dosen DIHAPUS
];

// Data dummy materi (untuk halaman /materi)
export const MOCK_MATERI = [
  {
    id: 1,
    judul: "Pengantar Algoritma",
    deskripsi: "Konsep dasar algoritma dan flowchart.",
    pengajar: "Dosen Pengampu",
  },
  {
    id: 2,
    judul: "Struktur Data Dasar",
    deskripsi: "Array, linked list, stack, dan queue.",
    pengajar: "Dosen Pengampu",
  },
  {
    id: 3,
    judul: "Pemrograman Berorientasi Objek",
    deskripsi: "Class, object, inheritance, polymorphism.",
    pengajar: "Dosen Pengampu",
  },
];