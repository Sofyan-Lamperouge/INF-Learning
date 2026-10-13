// src/mocks/users.js
// Data dummy untuk development saat backend belum siap.
// Hapus atau abaikan file ini saat production.

export const MOCK_USERS = [
  {
    id: 1,
    nama: 'Budi Santoso',
    nim: '2488010071',     // 10 digit, pola ^2\d88\d{6}$
    password: 'rahasia123',
    role: 'mahasiswa',
  },
  {
    id: 2,
    nama: 'Sari Wulandari',
    nim: '2488010072',
    password: 'rahasia123',
    role: 'mahasiswa',
  },
];

// Data dummy materi (untuk halaman /materi)
export const MOCK_MATERI = [
  {
    id: 1,
    judul: 'Pengantar Algoritma',
    deskripsi: 'Konsep dasar algoritma dan flowchart.',
    pengajar: 'Dosen Pengampu',
  },
  {
    id: 2,
    judul: 'Struktur Data Dasar',
    deskripsi: 'Array, linked list, stack, dan queue.',
    pengajar: 'Dosen Pengampu',
  },
  {
    id: 3,
    judul: 'Pemrograman Berorientasi Objek',
    deskripsi: 'Class, object, inheritance, polymorphism.',
    pengajar: 'Dosen Pengampu',
  },
];