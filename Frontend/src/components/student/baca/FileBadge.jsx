// src/components/student/baca/FileBadge.jsx
import { WARNA_JENIS } from './helpers.js';

export default function FileBadge({ jenis, kecil = false }) {
  const kunci = String(jenis || '').toLowerCase();
  const w = WARNA_JENIS[kunci] || { bg: '#eceff1', fg: '#607d8b' };
  return (
    <span
      className={`bm-filebadge${kecil ? ' bm-filebadge-kecil' : ''}`}
      style={{ background: w.bg, color: w.fg }}
      aria-hidden="true"
    >
      {kunci.toUpperCase() || 'FILE'}
    </span>
  );
}
