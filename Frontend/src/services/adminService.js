// Frontend/src/services/adminService.js
// [FILE BARU] Mengambil ringkasan dashboard admin dari GET /admin/dashboard.
//
// Bentuk respons backend:
// {
//   total_mahasiswa, total_materi, total_kuis,
//   materi_terbaru:    [{ id, judul, mata_kuliah, semester, jenis, dibuat_pada }],
//   mahasiswa_terbaru: [{ id, nama, nomor_induk, angkatan, status, dibuat_pada }]
// }

import { api } from './api.js';

export function getDashboard() {
  return api.get('/admin/dashboard');
}
