// src/components/student/bantuan/BantuanModal.jsx
// Pop up "Bantuan": FAQ (accordion) di kiri, kartu "Masih butuh bantuan?" + tombol WhatsApp di kanan.
import { useEffect, useId, useRef, useState } from 'react';
import { CloseIcon, ChevronIcon, InfoIcon, WhatsAppIcon } from './BantuanIcons.jsx';
import { FAQ } from './faqData.js';
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

export default function BantuanModal({ onTutup }) {
  const dialog = useRef(null);
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

  const siap = status === 'siap' && kontak?.tautan;

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
              {status === 'siap' && <p className="bt-pesan-isi">{kontak.pesan}</p>}
              {status === 'gagal' && (
                <p className="bt-pesan-isi galat" role="alert">
                  {galat} <button type="button" className="bt-ulang" onClick={muatUlang}>Coba lagi</button>
                </p>
              )}
            </div>

            {siap ? (
              <a className="bt-btn-wa" href={kontak.tautan} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon /> Hubungi admin
              </a>
            ) : (
              <button type="button" className="bt-btn-wa" disabled>
                <WhatsAppIcon /> Hubungi admin
              </button>
            )}
            <small className="bt-kontak-foot">Anda akan diarahkan ke aplikasi WhatsApp</small>
          </section>
        </div>
      </div>
    </div>
  );
}
