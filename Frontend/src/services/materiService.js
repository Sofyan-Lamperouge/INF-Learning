// Frontend/src/services/materiService.js
//
// [DIUBAH TOTAL]
//  - getMateriList: sekarang mendukung filter semester, mata kuliah, pencarian (q) dan paginasi,
//    sesuai query param backend: semester, mata_kuliah, q, page, limit.
//  - getCategories DIHAPUS (endpoint /materi/categories tidak ada di backend).
//  - deleteMateri BARU.

import { api } from './api.js';

export function getMateriList({
  semester,
  mataKuliah,
  q,
  page = 1,
  limit = 20,
} = {}) {
  const params = new URLSearchParams({ page, limit });

  if (semester) params.set('semester', semester);
  if (mataKuliah) params.set('mata_kuliah', mataKuliah);
  if (q) params.set('q', q);

  return api.get(`/materi?${params.toString()}`);
}

export function deleteMateri(id) {
  return api.delete(`/materi/${id}`);
}

export function uploadMateri(formData) {
  return api.postFormData('/materi', formData);
}

