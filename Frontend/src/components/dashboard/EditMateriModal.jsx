import { useEffect, useState } from 'react';
import { updateMateri } from '../../services/materiService.js';

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_EXTENSIONS = ['pdf', 'docx', 'pptx', 'xlsx'];

function getCurrentFileName(url) {
  if (!url) return 'File tidak tersedia';

  try {
    const pathname = new URL(url, window.location.origin).pathname;
    return decodeURIComponent(pathname.split('/').pop() || 'File materi');
  } catch {
    return 'File materi';
  }
}

export default function EditMateriModal({
  materi,
  mataKuliahOptions = [],
  onClose,
  onSaved,
}) {
  const [form, setForm] = useState({
    judul: materi.judul || '',
    semester: String(materi.semester || ''),
    mata_kuliah: materi.mata_kuliah || '',
    deskripsi: materi.deskripsi || '',
  });

  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape' && !saving) onClose();
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose, saving]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setError('');
  }

  function handleFileChange(event) {
    const selected = event.target.files?.[0] ?? null;
    setError('');

    if (!selected) {
      setFile(null);
      return;
    }

    const extension = selected.name.split('.').pop()?.toLowerCase();

    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      event.target.value = '';
      setFile(null);
      setError('Format file harus PDF, DOCX, PPTX, atau XLSX.');
      return;
    }

    if (selected.size > MAX_FILE_SIZE) {
      event.target.value = '';
      setFile(null);
      setError('Ukuran file maksimal 10 MB.');
      return;
    }

    setFile(selected);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (!form.judul.trim()) {
      setError('Nama materi wajib diisi.');
      return;
    }

    if (!form.semester || !form.mata_kuliah.trim()) {
      setError('Semester dan mata kuliah wajib diisi.');
      return;
    }

    const formData = new FormData();
    formData.append('judul', form.judul.trim());
    formData.append('semester', form.semester);
    formData.append('mata_kuliah', form.mata_kuliah.trim());
    formData.append('deskripsi', form.deskripsi);

    if (file) {
      formData.append('file', file);
    }

    try {
      setSaving(true);
      const updatedMateri = await updateMateri(materi.id, formData);
      onSaved(updatedMateri);
    } catch (err) {
      setError(err.message || 'Gagal menyimpan perubahan materi.');
    } finally {
      setSaving(false);
    }
  }

  const options = [...new Set([
    ...mataKuliahOptions,
    materi.mata_kuliah,
  ].filter(Boolean))];

  return (
    <div
      className="edit-materi-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) onClose();
      }}
    >
      <section
        className="edit-materi-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-materi-title"
      >
        <header className="edit-materi-header">
          <div className="edit-materi-title-wrap">
            <span className="edit-materi-title-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 20h9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="m16.5 3.5 4 4L8 20l-5 1 1-5L16.5 3.5Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <h2 id="edit-materi-title">Edit Materi</h2>
          </div>

          <button
            type="button"
            className="edit-materi-close"
            onClick={onClose}
            disabled={saving}
            aria-label="Tutup popup"
          >
            ×
          </button>
        </header>

        <form className="edit-materi-form" onSubmit={handleSubmit}>
          <section className="edit-materi-section">
            <h3>1. Informasi Materi</h3>

            <div className="edit-materi-grid">
              <div className="edit-materi-field">
                <label htmlFor="edit-semester">
                  Semester<span>*</span>
                </label>
                <select
                  id="edit-semester"
                  name="semester"
                  value={form.semester}
                  onChange={handleChange}
                  required
                >
                  <option value="">Pilih semester</option>
                  {Array.from({ length: 8 }, (_, index) => index + 1).map(
                    (semester) => (
                      <option key={semester} value={semester}>
                        Semester {semester}
                      </option>
                    ),
                  )}
                </select>
              </div>

              <div className="edit-materi-field">
                <label htmlFor="edit-mata-kuliah">
                  Mata Kuliah<span>*</span>
                </label>
                <select
                  id="edit-mata-kuliah"
                  name="mata_kuliah"
                  value={form.mata_kuliah}
                  onChange={handleChange}
                  required
                >
                  <option value="">Pilih mata kuliah</option>
                  {options.map((mataKuliah) => (
                    <option key={mataKuliah} value={mataKuliah}>
                      {mataKuliah}
                    </option>
                  ))}
                  {form.mata_kuliah &&
                    !options.includes(form.mata_kuliah) && (
                      <option value={form.mata_kuliah}>
                        {form.mata_kuliah}
                      </option>
                    )}
                </select>
              </div>
            </div>

            <div className="edit-materi-field">
              <label htmlFor="edit-judul">
                Nama Materi<span>*</span>
              </label>
              <input
                id="edit-judul"
                name="judul"
                value={form.judul}
                onChange={handleChange}
                minLength={3}
                maxLength={200}
                required
              />
            </div>

            <div className="edit-materi-field">
              <label htmlFor="edit-deskripsi">Deskripsi</label>
              <textarea
                id="edit-deskripsi"
                name="deskripsi"
                value={form.deskripsi}
                onChange={handleChange}
                maxLength={2000}
                rows={3}
              />
            </div>
          </section>

          <section className="edit-materi-section edit-materi-file-section">
            <h3>File Materi</h3>

            <div className="edit-materi-file-box">
              <div className="edit-materi-file-info">
                <span className="edit-materi-file-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M6 2h8l5 5v15H6a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3Z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M14 2v6h6"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>

                <div className="edit-materi-file-name">
                  <strong>{file?.name || getCurrentFileName(materi.url)}</strong>
                  <span>{file ? 'File baru dipilih' : 'File saat ini'}</span>
                </div>
              </div>

              <label className="edit-materi-change-file">
                Ganti File
                <input
                  type="file"
                  accept=".pdf,.docx,.pptx,.xlsx"
                  onChange={handleFileChange}
                  disabled={saving}
                />
              </label>
            </div>

            <p className="edit-materi-file-hint">
              Format: PDF, DOCX, PPTX, XLSX | Maks. 10 MB.
              Kosongkan pilihan file jika tidak ingin menggantinya.
            </p>
          </section>

          {error && (
            <p className="edit-materi-error" role="alert">
              {error}
            </p>
          )}

          <footer className="edit-materi-actions">
            <button
              type="button"
              className="edit-materi-cancel"
              onClick={onClose}
              disabled={saving}
            >
              Batal
            </button>

            <button
              type="submit"
              className="edit-materi-save"
              disabled={saving}
            >
              {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}