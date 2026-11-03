import { useEffect, useRef } from 'react';
import MahasiswaModal from './MahasiswaModal.jsx';
import { CheckIcon } from './MahasiswaIcons.jsx';

/**
 * Pop up berhasil (tambah / ubah / hapus).
 * - withButton: tampilkan tombol "Tutup" (pop up tambah di Figma).
 * - autoCloseMs: tutup otomatis (pop up hapus di Figma tanpa tombol).
 */
export default function MahasiswaSuccessModal({
  title,
  children,
  withButton = true,
  autoCloseMs = 0,
  onClose,
}) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!autoCloseMs) return undefined;
    const timer = window.setTimeout(() => onCloseRef.current?.(), autoCloseMs);
    return () => window.clearTimeout(timer);
  }, [autoCloseMs]);

  return (
    <MahasiswaModal labelId="mahasiswa-success-title" size="success" role="alertdialog" onClose={onClose}>
      <div className="mahasiswa-modal-center mahasiswa-success">
        <div className="mahasiswa-success-icon">
          <CheckIcon />
        </div>
        <h2 id="mahasiswa-success-title">{title}</h2>
        <p>{children}</p>

        {withButton && (
          <button type="button" className="mahasiswa-btn mahasiswa-btn--primary mahasiswa-success-button" onClick={onClose}>
            Tutup
          </button>
        )}
      </div>
    </MahasiswaModal>
  );
}
