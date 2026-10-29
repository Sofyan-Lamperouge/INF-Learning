
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

export function updateMateri(id, formData) {
  return api.putFormData(`/materi/${id}/edit`, formData);
}

