// src/components/student/bantuan/useKontakAdmin.js
// Mengambil tautan WhatsApp admin saat modal dibuka. status: memuat | siap | gagal
import { useEffect, useState } from 'react';
import { getKontakWhatsApp } from '../../../services/kontakService.js';
import { PESAN_AWAL } from './faqData.js';

export default function useKontakAdmin(aktif) {
  const [status, setStatus] = useState('memuat');
  const [kontak, setKontak] = useState(null);
  const [galat, setGalat] = useState('');
  const [ulang, setUlang] = useState(0);

  useEffect(() => {
    if (!aktif) return undefined;
    let batal = false;
    setStatus('memuat');
    getKontakWhatsApp({ topik: 'lainnya', pesan: PESAN_AWAL })
      .then((d) => {
        if (batal) return;
        setKontak(d);
        setStatus('siap');
      })
      .catch((e) => {
        if (batal) return;
        setGalat(e?.status === 503 ? 'Kontak WhatsApp admin belum tersedia.' : e?.message || 'Gagal memuat kontak admin.');
        setStatus('gagal');
      });
    return () => {
      batal = true;
    };
  }, [aktif, ulang]);

  return { status, kontak, galat, muatUlang: () => setUlang((n) => n + 1) };
}
