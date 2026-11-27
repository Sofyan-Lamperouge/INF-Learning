// src/components/student/materi/useUnduhDaftar.js
// Unduh file dari daftar materi (tombol ikon di tabel). Satu unduhan pada satu waktu.
// status: idle -> downloading -> success | error ; aktifId = id materi yang sedang diunduh.
import { useCallback, useEffect, useRef, useState } from 'react';
import { unduhBlob } from '../../../services/bacaMateriService.js';
import { formatUkuran, namaBerkas } from '../baca/helpers.js';

export default function useUnduhDaftar() {
  const [status, setStatus] = useState('idle');
  const [aktifId, setAktifId] = useState(null);
  const [info, setInfo] = useState(null); // { nama, ukuran }
  const timer = useRef(null);
  const sedang = useRef(false);

  const tutup = useCallback(() => {
    clearTimeout(timer.current);
    setStatus((s) => (s === 'success' || s === 'error' ? 'idle' : s));
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  const unduh = useCallback(async (materi) => {
    if (!materi?.id || sedang.current) return;
    sedang.current = true;
    clearTimeout(timer.current);
    setAktifId(materi.id);
    setStatus('downloading');
    try {
      const mulai = Date.now();
      const { blob, namaFile } = await unduhBlob(materi.id);
      const sisa = 700 - (Date.now() - mulai); // animasi putar terlihat minimal sebentar
      if (sisa > 0) await new Promise((r) => setTimeout(r, sisa));
      const nama = namaFile || namaBerkas(materi);
      const href = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = href;
      a.download = nama;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(href), 1000);
      setInfo({ nama, ukuran: formatUkuran(blob.size) });
      setStatus('success');
    } catch {
      await new Promise((r) => setTimeout(r, 500));
      setStatus('error');
    } finally {
      sedang.current = false;
      setAktifId(null);
    }
    timer.current = setTimeout(() => setStatus('idle'), 4500);
  }, []);

  return { status, info, aktifId, unduh, tutup };
}