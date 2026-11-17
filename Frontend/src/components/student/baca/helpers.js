// src/components/student/baca/helpers.js
export { formatTanggal } from '../materi/helpers.js';

// 68608 -> "67 KB", 2_400_000 -> "2,3 MB"
export function formatUkuran(byte) {
  if (!byte && byte !== 0) return '';
  if (byte < 1024 * 1024) return `${Math.max(1, Math.round(byte / 1024))} KB`;
  return `${(byte / 1024 / 1024).toFixed(1).replace('.', ',')} MB`;
}

export const ADALAH_PDF = (jenis) => String(jenis || '').toLowerCase() === 'pdf';

// Warna kotak ikon file per jenis (sesuai desain)
export const WARNA_JENIS = {
  pdf: { bg: '#fde0e0', fg: '#e11d1d' },
  docx: { bg: '#e1f1fc', fg: '#2b8fd0' },
  doc: { bg: '#e1f1fc', fg: '#2b8fd0' },
  pptx: { bg: '#fff1cc', fg: '#e09400' },
  ppt: { bg: '#fff1cc', fg: '#e09400' },
  xlsx: { bg: '#dcf5e4', fg: '#1f9d55' },
  xls: { bg: '#dcf5e4', fg: '#1f9d55' },
};

// Nama berkas yang ditampilkan: "<judul>.<jenis>" (nama di server hanya kode acak).
export function namaBerkas(materi) {
  if (!materi) return '';
  const bersih = String(materi.judul || 'materi')
    .replace(/[\\/:*?"<>|\x00-\x1f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return `${bersih || 'materi'}.${String(materi.jenis || '').toLowerCase()}`;
}
