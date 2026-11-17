// src/services/bacaMateriService.js
import { api } from './api.js';

// Detail satu materi (termasuk url file & status_belajar untuk mahasiswa)
export function getMateriDetail(id) {
  return api.get(`/materi/${id}`);
}

// Daftar materi dalam satu mata kuliah (untuk sidebar "Materi lainnya")
export function getMateriLainnya(semester, mataKuliah) {
  const q = new URLSearchParams({
    semester: String(semester),
    mata_kuliah: mataKuliah,
    limit: '100',
  });
  return api.get(`/materi?${q.toString()}`);
}

export function catatDilihat(id) {
  return api.post(`/materi/${id}/progres`, { status: 'dilihat' });
}

// ------------------------------------------------------------
// Ambil file materi lewat GET /materi/{id}/unduh (butuh token, jadi memakai fetch + header).
// Dipakai untuk membaca PDF di halaman dan untuk tombol Unduh.
// Return { blob, namaFile } ; namaFile dari header Content-Disposition (bisa null).
// ------------------------------------------------------------
import { sesi } from '../utils/storage.js';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

function namaDariHeader(cd) {
  if (!cd) return null;
  const utf8 = /filename\*\s*=\s*UTF-8''([^;]+)/i.exec(cd);
  if (utf8) {
    try {
      return decodeURIComponent(utf8[1].trim());
    } catch {
      /* lanjut ke bentuk biasa */
    }
  }
  const biasa = /filename\s*=\s*"?([^";]+)"?/i.exec(cd);
  return biasa ? biasa[1].trim() : null;
}

export async function unduhBlob(id, signal) {
  const token = sesi.getItem('token');
  const res = await fetch(`${BASE_URL}/materi/${id}/unduh`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    signal,
  });
  if (!res.ok) {
    let pesan = `Server membalas HTTP ${res.status}`;
    try {
      const j = await res.json();
      if (typeof j?.detail === 'string') pesan = j.detail;
    } catch {
      /* body bukan JSON */
    }
    const err = new Error(pesan);
    err.status = res.status;
    throw err;
  }
  return {
    blob: await res.blob(),
    namaFile: namaDariHeader(res.headers.get('Content-Disposition')),
  };
}
