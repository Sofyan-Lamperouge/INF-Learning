import { useMemo, useState } from 'react';
import MahasiswaModal, { ModalCloseButton, ModalHeader } from './MahasiswaModal.jsx';
import {
  getAngkatanOptions,
  hasChanges,
  normalizeNama,
  POLA_NIM,
} from '../../utils/mahasiswaStatus.js';

function validate(values, isEdit) {
  const errors = {};
  const nama = normalizeNama(values.nama);

  if (!isEdit && !POLA_NIM.test(values.nomor_induk.trim())) {
    errors.nomor_induk = 'Format NIM tidak sesuai. Gunakan 10 digit, contoh: 2488010001.';
  }
  if (nama.length < 3) errors.nama = 'Nama minimal 3 karakter.';
  else if (nama.length > 100) errors.nama = 'Nama maksimal 100 karakter.';
  if (!values.angkatan) errors.angkatan = 'Pilih angkatan terlebih dahulu.';

  return errors;
}

/**
 * Pop up tambah / edit mahasiswa.
 * - original: data awal mahasiswa (hanya mode edit) untuk mendeteksi perubahan.
 * - statusLocked: mahasiswa belum registrasi, statusnya tidak bisa diubah manual.
 * Form tidak menyimpan ke backend; onSubmit membawa ke pop up konfirmasi.
 */
export default function MahasiswaFormModal({
  mode,
  initialValues,
  original = null,
  statusLocked = false,
  error = '',
  onSubmit,
  onClose,
}) {
  const isEdit = mode === 'edit';
  const [values, setValues] = useState(initialValues);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const yearOptions = useMemo(
    () => getAngkatanOptions(initialValues.angkatan),
    [initialValues.angkatan],
  );

  function handleChange(event) {
    const { name } = event.target;
    let { value } = event.target;
    if (name === 'nomor_induk') value = value.replace(/\D/g, '').slice(0, 10);

    setValues((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => ({ ...current, [name]: undefined }));
    setFormError('');
  }

  function handleSubmit(event) {
    event.preventDefault();
    const errors = validate(values, isEdit);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const cleaned = {
      nomor_induk: values.nomor_induk.trim(),
      nama: normalizeNama(values.nama),
      angkatan: values.angkatan,
      status: values.status,
    };

    if (isEdit && original && !hasChanges(cleaned, original)) {
      setFormError('Belum ada perubahan data. Ubah salah satu data terlebih dahulu.');
      return;
    }

    onSubmit(cleaned);
  }

  return (
    <MahasiswaModal labelId="mahasiswa-form-title" onClose={onClose}>
      <ModalCloseButton onClick={onClose} />
      <ModalHeader
        id="mahasiswa-form-title"
        title={isEdit ? 'Edit Mahasiswa' : 'Tambah Mahasiswa'}
        subtitle={
          isEdit
            ? 'Perbarui data mahasiswa yang dipilih.'
            : 'Lengkapi data mahasiswa untuk menambahkannya ke daftar.'
        }
      />

      <form className="mahasiswa-form" onSubmit={handleSubmit} noValidate>
        <div className="mahasiswa-field">
          <label htmlFor="mhs-nim">
            NIM<span className="mahasiswa-required">*</span>
          </label>
          <input
            id="mhs-nim"
            name="nomor_induk"
            inputMode="numeric"
            autoComplete="off"
            value={values.nomor_induk}
            onChange={handleChange}
            placeholder="Masukkan NIM mahasiswa"
            disabled={isEdit}
            aria-invalid={Boolean(fieldErrors.nomor_induk)}
          />
          {fieldErrors.nomor_induk && (
            <p className="mahasiswa-field-error" role="alert">{fieldErrors.nomor_induk}</p>
          )}
        </div>

        <div className="mahasiswa-field">
          <label htmlFor="mhs-nama">
            Nama<span className="mahasiswa-required">*</span>
          </label>
          <input
            id="mhs-nama"
            name="nama"
            autoComplete="off"
            value={values.nama}
            onChange={handleChange}
            placeholder="Masukkan nama mahasiswa"
            maxLength={100}
            aria-invalid={Boolean(fieldErrors.nama)}
          />
          {fieldErrors.nama && (
            <p className="mahasiswa-field-error" role="alert">{fieldErrors.nama}</p>
          )}
        </div>

        <div className="mahasiswa-field">
          <label htmlFor="mhs-angkatan">
            Angkatan<span className="mahasiswa-required">*</span>
          </label>
          <select
            id="mhs-angkatan"
            name="angkatan"
            className={`mahasiswa-select${values.angkatan ? '' : ' is-placeholder'}`}
            value={values.angkatan}
            onChange={handleChange}
            aria-invalid={Boolean(fieldErrors.angkatan)}
          >
            <option value="">Pilih angkatan</option>
            {yearOptions.map((year) => (
              <option key={year} value={String(year)}>{year}</option>
            ))}
          </select>
          {fieldErrors.angkatan && (
            <p className="mahasiswa-field-error" role="alert">{fieldErrors.angkatan}</p>
          )}
        </div>

        {isEdit && (
          <div className="mahasiswa-field">
            <label htmlFor="mhs-status">Status</label>
            <select
              id="mhs-status"
              name="status"
              className="mahasiswa-select"
              value={values.status}
              onChange={handleChange}
              disabled={statusLocked}
            >
              <option value="aktif">Aktif</option>
              <option value="nonaktif">Non-aktif</option>
            </select>
            {statusLocked && (
              <p className="mahasiswa-field-hint">
                Status otomatis menjadi Aktif setelah mahasiswa melakukan registrasi.
              </p>
            )}
          </div>
        )}

        {(formError || error) && (
          <p className="mahasiswa-modal-error" role="alert">{formError || error}</p>
        )}

        <div className="mahasiswa-modal-actions">
          <button type="button" className="mahasiswa-btn mahasiswa-btn--ghost" onClick={onClose}>
            Batal
          </button>
          <button type="submit" className="mahasiswa-btn mahasiswa-btn--primary">
            Simpan
          </button>
        </div>
      </form>
    </MahasiswaModal>
  );
}
