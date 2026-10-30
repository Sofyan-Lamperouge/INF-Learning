import { useEffect } from "react";

export default function DeleteMateriModal({
  materi,
  deleting = false,
  error = "",
  onCancel,
  onConfirm,
}) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !deleting) onCancel();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [deleting, onCancel]);

  return (
    <div
      className="hapus-materi-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !deleting) onCancel();
      }}
    >
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
            <path d="M10 14h28M19 14V9h10v5m5 0-1.8 25H15.8L14 14m6 6v13m8-13v13" />
          </svg>
        </div>

        <h2 id="hapus-materi-title">Hapus Data Materi</h2>
        <p id="hapus-materi-description" className="hapus-materi-question">
          Apakah anda yakin ingin menghapus data materi
        </p>
        <p className="hapus-materi-name">“{materi?.judul || "Materi ini"}”?</p>
        <p className="hapus-materi-warning">
          <span aria-hidden="true">*</span> Tindakan ini tidak dapat dibatalkan
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
    </div>
  );
}
