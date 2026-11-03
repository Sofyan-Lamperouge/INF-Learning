import MahasiswaModal, { ModalCloseButton, ModalHeader } from './MahasiswaModal.jsx';
import { ArrowRightIcon, InfoIcon } from './MahasiswaIcons.jsx';
import { normalizeNama } from '../../utils/mahasiswaStatus.js';

function StatusPill({ value }) {
  return (
    <span className={`mahasiswa-status mahasiswa-status--${value}`}>
      {value === 'aktif' ? 'Aktif' : 'Non-aktif'}
    </span>
  );
}

// Nilai sebelum -> sesudah jika berubah, atau nilai biasa jika tidak.
function DiffValue({ changed, before, after }) {
  if (!changed) return after;

  return (
    <span className="mahasiswa-diff">
      <span className="mahasiswa-diff-old">{before}</span>
      <span className="mahasiswa-diff-arrow"><ArrowRightIcon /></span>
      <span className="mahasiswa-diff-new">{after}</span>
    </span>
  );
}

function getInfoText(isEdit, statusChanged, newStatus) {
  if (!isEdit) {
    return 'Data akan ditambahkan ke daftar mahasiswa dan dapat diubah kembali setelah disimpan.';
  }
  if (statusChanged && newStatus === 'nonaktif') {
    return 'Akun mahasiswa akan dinonaktifkan dan tidak dapat digunakan setelah disimpan.';
  }
  if (statusChanged && newStatus === 'aktif') {
    return 'Akun mahasiswa akan diaktifkan kembali dan dapat digunakan setelah disimpan.';
  }
  return 'Perubahan data mahasiswa akan diperbarui di daftar setelah disimpan.';
}

/**
 * Pop up konfirmasi sebelum data disimpan.
 * mode "create": menampilkan data baru (status selalu Non-aktif).
 * mode "edit"  : menampilkan perubahan "sebelum -> sesudah" untuk tiap data yang diubah.
 */
export default function MahasiswaConfirmModal({
  mode = 'create',
  values,
  original = null,
  busy = false,
  error = '',
  onBack,
  onConfirm,
  onClose,
}) {
  const isEdit = mode === 'edit' && original;
  const newStatus = isEdit ? values.status : 'nonaktif';

  const namaChanged = isEdit && normalizeNama(values.nama) !== normalizeNama(original.nama);
  const angkatanChanged = isEdit && String(values.angkatan) !== String(original.angkatan);
  const statusChanged = isEdit && values.status !== original.status;

  const rows = [
    { label: 'NIM', content: values.nomor_induk },
    {
      label: 'Nama',
      content: <DiffValue changed={namaChanged} before={original?.nama} after={values.nama} />,
    },
    {
      label: 'Angkatan',
      content: (
        <DiffValue changed={angkatanChanged} before={original?.angkatan} after={values.angkatan} />
      ),
    },
    {
      label: 'Status',
      content: (
        <DiffValue
          changed={statusChanged}
          before={<StatusPill value={original?.status} />}
          after={<StatusPill value={newStatus} />}
        />
      ),
    },
  ];

  return (
    <MahasiswaModal labelId="mahasiswa-confirm-title" onClose={onClose} busy={busy}>
      <ModalCloseButton onClick={onClose} disabled={busy} />
      <ModalHeader
        id="mahasiswa-confirm-title"
        title="Konfirmasi Data"
        subtitle={
          isEdit
            ? 'Periksa perubahan data berikut sebelum disimpan.'
            : 'Pastikan data berikut sudah benar sebelum data disimpan.'
        }
      />

      <dl className="mahasiswa-detail">
        {rows.map((row) => (
          <div className="mahasiswa-detail-row" key={row.label}>
            <dt>{row.label}</dt>
            <dd>{row.content}</dd>
          </div>
        ))}
      </dl>

      <div className="mahasiswa-info-box">
        <InfoIcon />
        <p>{getInfoText(isEdit, statusChanged, newStatus)}</p>
      </div>

      {error && <p className="mahasiswa-modal-error" role="alert">{error}</p>}

      <div className="mahasiswa-modal-actions">
        <button type="button" className="mahasiswa-btn mahasiswa-btn--ghost" onClick={onBack} disabled={busy}>
          Kembali
        </button>
        <button type="button" className="mahasiswa-btn mahasiswa-btn--primary" onClick={onConfirm} disabled={busy}>
          {busy ? 'Menyimpan...' : 'Simpan Data'}
        </button>
      </div>
    </MahasiswaModal>
  );
}
