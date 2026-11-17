// src/components/student/baca/useUnduh.js
// Status: idle -> downloading -> success | error
import { useCallback, useEffect, useRef, useState } from 'react';
import { formatUkuran } from './helpers.js';
import { unduhBlob } from '../../../services/bacaMateriService.js';

export default function useUnduh(materiId, namaUnduhan) {
  const [status, setStatus] = useState('idle');
  const [info, setInfo] = useState(null); // { nama, ukuran }
  const timer = useRef(null);

  const tutup = useCallback(() => {
    clearTimeout(timer.current);
    setStatus((s) => (s === 'success' || s === 'error' ? 'idle' : s));
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  const unduh = useCallback(async () => {
    if (!materiId || status === 'downloading') return;
    clearTimeout(timer.current);
    setStatus('downloading');
    try {
      const mulai = Date.now();
      const { blob, namaFile } = await unduhBlob(materiId);
      // Tampilkan "Mengunduh..." minimal sebentar agar terlihat
      const sisa = 700 - (Date.now() - mulai);
      if (sisa > 0) await new Promise((r) => setTimeout(r, sisa));
      const href = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = href;
      a.download = namaFile || namaUnduhan;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(href), 1000);
      setInfo({ nama: namaFile || namaUnduhan, ukuran: formatUkuran(blob.size) });
      setStatus('success');
    } catch {
      await new Promise((r) => setTimeout(r, 500));
      setStatus('error');
    }
    timer.current = setTimeout(() => setStatus('idle'), 4500);
  }, [materiId, namaUnduhan, status]);

  return { status, info, unduh, tutup };
}
