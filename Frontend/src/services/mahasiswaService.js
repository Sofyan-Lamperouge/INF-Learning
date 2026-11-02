import { api } from './api.js';

export function getMahasiswaList({
  q = '',
  angkatan = '',
  status = '',
  page = 1,
  limit = 20,
} = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (q.trim()) params.set('q', q.trim());
  if (angkatan) params.set('angkatan', String(angkatan));
  if (status) params.set('status', status);

  return api.get(`/mahasiswa?${params.toString()}`);
}

export function createMahasiswa(data) {
  return api.post('/mahasiswa', data);
}

export function updateMahasiswa(id, data) {
  return api.put(`/mahasiswa/${id}`, data);
}

export function deleteMahasiswa(id) {
  return api.delete(`/mahasiswa/${id}`);
}