// src/components/student/profil/UbahFotoModal.jsx
// Modal "Ubah Foto Profil": pratinjau, nama & ukuran file, Ganti File, Batal, Simpan.
// Saat menyimpan: file diganti spinner + "Menyimpan Perubahan...", tombol Simpan menampilkan spinner.
import { useEffect, useRef } from 'react';
import { CloseIcon, ImageIcon } from './ProfilIcons.jsx';
import { formatUkuran } from './helpers.js';

export default function UbahFotoModal({ file, previewUrl, menyimpan, onGanti, onBatal, onSimpan }) {
  const dialog = useRef(null);

  // Esc menutup (membatalkan), halaman di belakang tidak bisa digulir
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onBatal();
    document.addEventListener('keydown', onKey);
    const lama = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = lama;
    };
  }, [onBatal]);

  return (
    <div className="pf-overlay" onMouseDown={(e) => e.target === e.currentTarget && onBatal()}>
      <div
        ref={dialog}
        className="pf-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pf-modal-judul"
        tabIndex={-1}
      >
        <div className="pf-modal-kepala">
          <h2 id="pf-modal-judul">Ubah Foto Profil</h2>
          <button type="button" className="pf-modal-tutup" onClick={onBatal} aria-label="Tutup">
            <CloseIcon />
          </button>
        </div>

        <div className="pf-modal-preview">
          <img src={previewUrl} alt="Pratinjau foto profil baru" />
        </div>

        {menyimpan ? (
          <div className="pf-modal-proses" role="status" aria-live="polite">
            <span className="pf-spinner pf-spinner-besar" />
            <p>Menyimpan Perubahan...</p>
          </div>
        ) : (
          <div className="pf-modal-tengah">
            <div className="pf-modal-file">
              <span className="pf-modal-file-ikon"><ImageIcon /></span>
              <span className="pf-modal-file-info">
                <strong title={file.name}>{file.name}</strong>
                <small>{formatUkuran(file.size)}</small>
              </span>
              <button type="button" className="pf-btn-ganti" onClick={onGanti}>Ganti File</button>
            </div>
            <hr className="pf-modal-garis" />
          </div>
        )}

        <div className="pf-modal-aksi">
          <button type="button" className="pf-btn pf-btn-batal" onClick={onBatal}>Batal</button>
          <button
            type="button"
            className={`pf-btn pf-btn-simpan${menyimpan ? ' memuat' : ''}`}
            onClick={onSimpan}
            disabled={menyimpan}
            aria-busy={menyimpan}
          >
            {menyimpan && <span className="pf-spinner" />}
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
