// src/services/profilService.js
import { request } from './api.js';
import { getDashboardMahasiswa } from './dashboardMahasiswaService.js';

// Data profil (nama, nomor_induk, angkatan, foto_url) diambil dari GET /mahasiswa/dashboard
export async function getProfilMahasiswa() {
  const data = await getDashboardMahasiswa();
  return data.profil;
}

// PUT /profil/foto  (multipart, field "file") -> { foto_url }
export function ubahFotoProfil(file, signal) {
  const form = new FormData();
  form.append('file', file);
  return request('/profil/foto', { method: 'PUT', body: form, signal });
}
