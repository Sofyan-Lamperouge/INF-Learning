// src/services/materiMahasiswaService.js
// [FILE BARU] Data halaman Materi mahasiswa. Semua endpoint SUDAH ada di backend.
//
// GET /materi/kategori/semester
//   -> { items: [{ semester, total_materi, total_mata_kuliah }] }   (semester 1-8 selalu ada)
// GET /materi/kategori/mata-kuliah?semester=5
//   -> { semester, items: [{ mata_kuliah, total_materi }] }
// GET /materi?semester=5&mata_kuliah=Manajemen%20Proyek&limit=100
//   -> { items: [{ id, judul, mata_kuliah, semester, jenis, url, dibuat_pada, status_belajar }], total, ... }
//
// Mahasiswa hanya menerima materi berstatus "terbit" (difilter backend).

import { api } from './api.js';
import { getMateriList } from './materiService.js';

export function getKategoriSemester() {
  return api.get('/materi/kategori/semester');
}

export function getKategoriMataKuliah(semester) {
  return api.get(`/materi/kategori/mata-kuliah?semester=${semester}`);
}

// Semua materi satu mata kuliah (backend membatasi limit maksimal 100)
export function getMateriMataKuliah(semester, mataKuliah) {
  return getMateriList({ semester, mataKuliah, limit: 100 });
}
