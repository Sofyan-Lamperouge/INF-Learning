// src/components/student/dashboard/helpers.js

// Backend belum mengirim persen per materi, hanya status_belajar.
// Angka di bawah dipakai sementara untuk batang progres. Ubah sesuai kebutuhan.
export const PERSEN_STATUS = { belum: 0, dilihat: 50, selesai: 100 };

export function persenBelajar(status) {
  return PERSEN_STATUS[status] ?? 0;
}

// "HAIKAL AZKAL AZKIYA" -> "Haikal"
export function namaDepan(nama) {
  const kata = String(nama || '').trim().split(/\s+/)[0];
  if (!kata) return 'Mahasiswa';
  return kata.charAt(0).toUpperCase() + kata.slice(1).toLowerCase();
}

// Warna badge semester (1-5 sesuai desain, 6-8 tambahan)
const WARNA_SEMESTER = {
  1: '#FF383C',
  2: '#FF8D28',
  3: '#FFCC00',
  4: '#34C759',
  5: '#00C8B3',
  6: '#55B5EF',
  7: '#8B5CF6',
  8: '#EC4899',
};

export function warnaSemester(semester) {
  return WARNA_SEMESTER[semester] || '#94A3B8';
}