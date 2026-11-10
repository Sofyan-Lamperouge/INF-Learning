// src/services/dashboardMahasiswaService.js
// [FILE BARU] Data beranda mahasiswa dari backend.
//
// GET /mahasiswa/dashboard ->
// {
//   profil: { id, nama, nomor_induk, angkatan },
//   statistik: { total_materi, materi_dilihat, materi_selesai, persen_selesai },
//   lanjutkan_belajar: { id, judul, mata_kuliah, semester, jenis, url, dibuat_pada, status_belajar } | null,
//   materi_terbaru: [ ...materi yang sama bentuknya... ],
//   progres_mata_kuliah: [{ mata_kuliah, total, selesai, persen }]
// }
//
// status_belajar: "belum" | "dilihat" | "selesai"

import { api } from './api.js';

export function getDashboardMahasiswa() {
  return api.get('/mahasiswa/dashboard');
}

// POST /materi/{id}/progres  body: { status: "dilihat" | "selesai" }
export function catatProgres(materiId, status = 'dilihat') {
  return api.post(`/materi/${materiId}/progres`, { status });
}