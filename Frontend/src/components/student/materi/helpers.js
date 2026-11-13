// src/components/student/materi/helpers.js

// Warna ikon folder per semester (sesuai desain)
const WARNA_SEMESTER = [
  '#FF383C', // 1 merah
  '#FF8D28', // 2 oranye
  '#FFCC00', // 3 kuning
  '#34C759', // 4 hijau
  '#00C8B3', // 5 tosca
  '#00C0E8', // 6 biru muda
  '#0088FF', // 7 biru
  '#CB30E0', // 8 ungu
];

export function warnaFolder(semester) {
  return WARNA_SEMESTER[semester - 1] || '#94A3B8';
}

// "12 November 2026"
export function formatTanggal(iso) {
  if (!iso) return '-';
  const tanggal = new Date(iso);
  if (Number.isNaN(tanggal.getTime())) return '-';
  return tanggal.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// Backend menyimpan file dengan awalan uuid (32 hex + "_"); dibuang agar nama asli tampil.
export function namaFile(url, jenis) {
  if (!url) return jenis ? `File ${String(jenis).toUpperCase()}` : '-';
  try {
    const path = new URL(url, window.location.origin).pathname;
    const nama = decodeURIComponent(path.split('/').filter(Boolean).pop() || '');
    return nama.replace(/^[a-f0-9]{32}_/i, '') || nama;
  } catch {
    return jenis ? `File ${String(jenis).toUpperCase()}` : '-';
  }
}
