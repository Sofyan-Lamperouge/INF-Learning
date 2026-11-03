import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { CloseIcon, UsersIcon } from './MahasiswaIcons.jsx';

/**
 * Cangkang semua pop up Kelola Mahasiswa:
 * overlay + tutup dengan Esc / klik luar + kunci scroll halaman.
 * size: 'form' | 'delete' | 'success' (mengatur lebar via CSS).
 */
export default function MahasiswaModal({
  labelId,
  onClose,
  busy = false,
  size = 'form',
  role = 'dialog',
  children,
}) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    function handleKey(event) {
      if (event.key === 'Escape' && !busy) onCloseRef.current?.();
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKey);
    };
  }, [busy]);

  return createPortal(
    <div
      className="mahasiswa-modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !busy) onClose?.();
      }}
    >
      <section
        className={`mahasiswa-modal mahasiswa-modal--${size}`}
        role={role}
        aria-modal="true"
        aria-labelledby={labelId}
      >
        {children}
      </section>
    </div>,
    document.body,
  );
}

export function ModalCloseButton({ onClick, disabled }) {
  return (
    <button
      className="mahasiswa-modal-close"
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label="Tutup"
    >
      <CloseIcon />
    </button>
  );
}

export function ModalHeader({ id, title, subtitle }) {
  return (
    <header className="mahasiswa-modal-header">
      <div className="mahasiswa-modal-icon">
        <UsersIcon />
      </div>
      <div>
        <h2 id={id}>{title}</h2>
        <p>{subtitle}</p>
      </div>
    </header>
  );
}
