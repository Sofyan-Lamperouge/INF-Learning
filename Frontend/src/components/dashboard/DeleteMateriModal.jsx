import { useEffect, useRef } from "react";

const SUCCESS_DURATION_MS = 2100;

export default function DeleteMateriModal({
  materi,
  deleting = false,
  error = "",
  success = false,
  onCancel,
  onConfirm,
  onDone,
}) {
  // Tutup dengan tombol Escape (dinonaktifkan saat proses hapus / popup sukses)
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !deleting && !success) onCancel();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [deleting, success, onCancel]);

  // Popup sukses tampil sebentar lalu menutup sendiri.
  // onDone disimpan di ref supaya timer tidak ter-reset saat halaman induk render ulang.
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    if (!success) return undefined;
    const timer = window.setTimeout(() => onDoneRef.current?.(), SUCCESS_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [success]);

  return (
    <div
      className="hapus-materi-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !deleting && !success) onCancel();
      }}
    >
      {success ? (
        <section
          className="edit-materi-result edit-materi-result--success"
          role="alertdialog"
          aria-modal="true"
          aria-live="assertive"
        >
          <div className="edit-materi-result-icon">
            <svg viewBox="0 0 100 100" fill="none" aria-hidden="true">
              <path
                d="m33 50 12 11 22-21"
                stroke="currentColor"
                strokeWidth="6.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2>Materi Berhasil Dihapus!</h2>
          <p>
            Data "<strong>{materi?.judul || "Materi"}</strong>" telah dihapus dari sistem!
          </p>
        </section>
      ) : (
        <section
          className="hapus-materi-dialog"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="hapus-materi-title"
          aria-describedby="hapus-materi-description"
        >
          <button
            className="hapus-materi-close"
            type="button"
            onClick={onCancel}
            disabled={deleting}
            aria-label="Tutup konfirmasi hapus"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>

          <div className="hapus-materi-icon" aria-hidden="true">
            <svg viewBox="0 0 48 48" fill="none">
              <path d="M8 13h32M18 13V8h12v5M13 13l1.6 27h18.8L35 13M20 20v14M28 20v14" />
            </svg>
          </div>

          <h2 id="hapus-materi-title">Hapus Data Materi</h2>
          <p id="hapus-materi-description" className="hapus-materi-question">
            Apakah anda yakin ingin menghapus data materi
          </p>
          <p className="hapus-materi-name">“{materi?.judul || "Materi ini"}”?</p>
          <p className="hapus-materi-warning">
            <span aria-hidden="true">*</span>Tindakan ini tidak dapat dibatalkan
          </p>

          {error && (
            <p className="hapus-materi-error" role="alert">
              {error}
            </p>
          )}

          <div className="hapus-materi-actions">
            <button
              className="hapus-materi-cancel"
              type="button"
              onClick={onCancel}
              disabled={deleting}
            >
              Batal
            </button>
            <button
              className="hapus-materi-confirm"
              type="button"
              onClick={onConfirm}
              disabled={deleting}
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 7h16M9 7V4h6v3m3 0-1 13H7L6 7m4 4v5m4-5v5" />
              </svg>
              {deleting ? "Menghapus..." : "Hapus"}
            </button>
          </div>
        </section>
      )}
    </div>
  );
}