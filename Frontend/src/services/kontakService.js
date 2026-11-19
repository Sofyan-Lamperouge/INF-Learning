// src/services/kontakService.js
import { api } from './api.js';

// GET /kontak-admin/whatsapp -> { nomor, nomor_tampil, pesan, tautan }
// Backend mengisi nama, NIM, angkatan dari akun yang login. 503 = nomor admin belum diatur.
export function getKontakWhatsApp({ topik = 'lainnya', pesan } = {}) {
  const q = new URLSearchParams({ topik });
  if (pesan) q.set('pesan', pesan);
  return api.get(`/kontak-admin/whatsapp?${q.toString()}`);
}
