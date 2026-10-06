// src/mocks/users.js
// Data dummy untuk development saat backend belum siap.
// Hapus atau abaikan file ini saat production.

export const MOCK_USERS = [
  {
    id: 1,
    namaLengkap: "Budi Santoso",
    nimNip: "20240101",
    password: "HidupCokowi2#",
    role: "mahasiswa",
  },
  {
    id: 2,
    namaLengkap: "Dr. Siti Aminah",
    nimNip: "19850101",
    password: "Dosen2024!",
    role: "dosen",
  },
];

// Data dummy materi (untuk halaman /materi)
export const MOCK_MATERI = [
  {
    id: 1,
    judul: "Pengantar Algoritma",
    deskripsi: "Konsep dasar algoritma dan flowchart.",
    pengajar: "Dr. Siti Aminah",
  },
  {
    id: 2,
    judul: "Struktur Data Dasar",
    deskripsi: "Array, linked list, stack, dan queue.",
    pengajar: "Dr. Siti Aminah",
  },
  {
    id: 3,
    judul: "Pemrograman Berorientasi Objek",
    deskripsi: "Class, object, inheritance, polymorphism.",
    pengajar: "Dr. Siti Aminah",
  },
];