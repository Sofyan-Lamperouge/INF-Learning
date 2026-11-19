// src/components/student/bantuan/BantuanModal.jsx
// Pop up "Bantuan": FAQ (accordion) di kiri, kartu "Masih butuh bantuan?" + tombol WhatsApp di kanan.
import { useEffect, useId, useRef, useState } from 'react';
import { CloseIcon, ChevronIcon, InfoIcon, WhatsAppIcon } from './BantuanIcons.jsx';
import { FAQ, PESAN_AWAL, TOPIK } from './faqData.js';
import useKontakAdmin from './useKontakAdmin.js';

function FaqItem({ item, terbuka, onToggle }) {
  const idJawab = useId();
  return (
    <div className={`bt-faq-item${terbuka ? ' terbuka' : ''}`}>
      <button type="button" className="bt-faq-tanya" aria-expanded={terbuka} aria-controls={idJawab} onClick={onToggle}>
        <span>{item.tanya}</span>
        <ChevronIcon className="bt-faq-panah" />
      </button>
      <div id={idJawab} className="bt-faq-jawab" role="region" aria-hidden={!terbuka}>
        <div className="bt-faq-jawab-isi">
          <p>{item.jawab}</p>
        </div>
      </div>
    </div>
  );
}

const MAKS_PESAN = 500;
const ISI_AWAL = PESAN_AWAL.replace(/\s*\.\.\.$/, ' ');      // "Saya ingin bertanya tentang "

// Baris pertama pesan dari server (salam + nama + NIM + angkatan). Ini tetap, tidak bisa diedit.
function barisIdentitas(pesanServer) {
  return pesanServer.split('\n')[0].trim();
}

export default function BantuanModal({ onTutup }) {
  const dialog = useRef(null);
  const [isi, setIsi] = useState(ISI_AWAL);
  const [topik, setTopik] = useState('lainnya');
  const [terbuka, setTerbuka] = useState(null); // id FAQ yang terbuka (satu saja)
  const { status, kontak, galat, muatUlang } = useKontakAdmin(true);

  // Esc menutup; halaman di belakang tidak bisa digulir
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onTutup();
    document.addEventListener('keydown', onKey);
    const lama = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = lama;
    };
  }, [onTutup]);

  const teksIsi = isi.trim();
  const siap = status === 'siap' && kontak?.nomor && teksIsi.length > 0;
  const teksTopik = (TOPIK.find((t) => t.kunci === topik) || TOPIK[2]).teks;
  const identitas = siap || status === 'siap' ? barisIdentitas(kontak.pesan) : '';
  const pesanAkhir = `${identitas}\nTopik: ${teksTopik}\n\n${teksIsi}`;
  const tautan = siap ? `https://wa.me/${kontak.nomor}?text=${encodeURIComponent(pesanAkhir)}` : '';

  return (
    <div className="bt-overlay" onMouseDown={(e) => e.target === e.currentTarget && onTutup()}>
      <div ref={dialog} className="bt-modal" role="dialog" aria-modal="true" aria-labelledby="bt-judul" tabIndex={-1}>
        <button type="button" className="bt-tutup" onClick={onTutup} aria-label="Tutup">
          <CloseIcon />
        </button>

        <header className="bt-kepala">
          <span className="bt-kepala-ikon"><InfoIcon /></span>
          <div>
            <h2 id="bt-judul">Bantuan</h2>
            <p>Pertanyaan umum dan kontak admin</p>
          </div>
        </header>

        <div className="bt-isi">
          <section className="bt-faq" aria-label="Pertanyaan umum">
            <h3>Pertanyaan Umum (FAQ)</h3>
            {FAQ.map((item) => (
              <FaqItem
                key={item.id}
                item={item}
                terbuka={terbuka === item.id}
                onToggle={() => setTerbuka((t) => (t === item.id ? null : item.id))}
              />
            ))}
          </section>

          <section className="bt-kontak" aria-label="Hubungi admin">
            <h3>Masih butuh bantuan?</h3>
            <p className="bt-kontak-desc">Chat admin lewat WhatsApp. Admin membalas pada jam kerja.</p>

            <div className="bt-pesan" aria-live="polite">
              <strong>Pesan yang akan dikirim</strong>
              {status === 'memuat' && <p className="bt-pesan-isi redup">Memuat pesan...</p>}
              {status === 'siap' && (
                <>
                  <p className="bt-pesan-isi bt-pesan-tetap">{identitas}</p>
                  <div className="bt-topik" role="radiogroup" aria-label="Topik pesan">
                    <span className="bt-topik-judul">Topik:</span>
                    {TOPIK.map((t) => (
                      <button
                        key={t.kunci}
                        type="button"
                        role="radio"
                        aria-checked={topik === t.kunci}
                        className={`bt-topik-pil${topik === t.kunci ? ' aktif' : ''}`}
                        onClick={() => setTopik(t.kunci)}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                  <textarea
                    className="bt-pesan-edit"
                    value={isi}
                    onChange={(e) => setIsi(e.target.value)}
                    maxLength={MAKS_PESAN}
                    rows={3}
                    placeholder="Tulis pesan Anda untuk admin..."
                    aria-label="Isi pesan untuk admin"
                    autoFocus
                    onFocus={(e) => {
                      const n = e.target.value.length;
                      e.target.setSelectionRange(n, n);
                    }}
                  />
                  <small className="bt-pesan-hitung">{isi.length}/{MAKS_PESAN}</small>
                </>
              )}
              {status === 'gagal' && (
                <p className="bt-pesan-isi galat" role="alert">
                  {galat} <button type="button" className="bt-ulang" onClick={muatUlang}>Coba lagi</button>
                </p>
              )}
            </div>

            {siap ? (
              <a className="bt-btn-wa" href={tautan} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon /> Hubungi admin
              </a>
            ) : (
              <button type="button" className="bt-btn-wa" disabled>
                <WhatsAppIcon /> Hubungi admin
              </button>
            )}
            <small className="bt-kontak-foot">
              {status === 'siap' && teksIsi.length === 0 ? 'Tulis pesan dulu sebelum menghubungi admin' : 'Anda akan diarahkan ke aplikasi WhatsApp'}
            </small>
          </section>
        </div>
      </div>
    </div>
  );
}