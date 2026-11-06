import MahasiswaModal, { ModalCloseButton } from "./MahasiswaModal.jsx";
import { TrashIcon } from "./MahasiswaIcons.jsx";

/** Pop up konfirmasi hapus mahasiswa. */
export default function MahasiswaDeleteModal({
  mahasiswa,
  busy = false,
  error = "",
  onCancel,
  onConfirm,
}) {
  return (
    <MahasiswaModal
      labelId="mahasiswa-delete-title"
      size="delete"
      role="alertdialog"
      onClose={onCancel}
      busy={busy}
    >
      <ModalCloseButton onClick={onCancel} disabled={busy} />

      <div className="mahasiswa-modal-center">
        <div className="mahasiswa-delete-icon">
          <TrashIcon />
        </div>

        <h2 id="mahasiswa-delete-title">Hapus Data Mahasiswa</h2>
        <p>Apakah anda yakin ingin menghapus data mahasiswa</p>
        <p className="mahasiswa-delete-name" title={mahasiswa.nama}>
          <span>&ldquo;</span>
          <span className="mahasiswa-delete-name-text">{mahasiswa.nama}</span>
          <span>&rdquo;?</span>
        </p>
        <p className="mahasiswa-delete-note">
          <span aria-hidden="true">*</span>Tindakan ini tidak dapat dibatalkan
        </p>
      </div>

      {error && (
        <p className="mahasiswa-modal-error" role="alert">
          {error}
        </p>
      )}

      <div className="mahasiswa-modal-actions mahasiswa-modal-actions--split">
        <button
          type="button"
          className="mahasiswa-btn mahasiswa-btn--ghost"
          onClick={onCancel}
          disabled={busy}
        >
          Batal
        </button>
        <button
          type="button"
          className="mahasiswa-btn mahasiswa-btn--danger"
          onClick={onConfirm}
          disabled={busy}
        >
          <TrashIcon />
          {busy ? "Menghapus..." : "Hapus"}
        </button>
      </div>
    </MahasiswaModal>
  );
}
