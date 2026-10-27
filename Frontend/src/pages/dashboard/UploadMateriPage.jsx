import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout.jsx';

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_EXTENSIONS = ['pdf', 'docx', 'pptx', 'xlsx'];

export default function UploadMateriPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [form, setForm] = useState(() => state?.form ?? { semester: '', mataKuliah: '', judul: '', deskripsi: '' });
  const [file, setFile] = useState(() => state?.file ?? null);
  const [error, setError] = useState('');

  const updateForm = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    setError('');
  };

  const handleFileChange = (event) => {
    const selected = event.target.files?.[0] ?? null;
    setError('');
    if (!selected) {
      setFile(null);
      return;
    }
    const extension = selected.name.split('.').pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      setFile(null);
      event.target.value = '';
      setError('Format file harus PDF, DOCX, PPTX, atau XLSX.');
      return;
    }
    if (selected.size > MAX_FILE_SIZE) {
      setFile(null);
      event.target.value = '';
      setError('Ukuran file maksimal 10 MB.');
      return;
    }
    setFile(selected);
  };

  const handleContinue = (event) => {
    event.preventDefault();
    if (!file) {
      setError('Pilih file materi terlebih dahulu.');
      return;
    }
    navigate('/dashboard/materi/konfirmasi', { state: { form, file } });
  };

  return (
    <DashboardLayout>
      <div style={{ width: '100%' }}>
        <form onSubmit={handleContinue} className="upload-main-card">
          <div className="upload-header-inner">
            <div className="materi-header-left">
              <div className="materi-icon-bg" aria-hidden="true">⇧</div>
              <div className="materi-title">
                <h2>Upload Materi</h2>
                <p>Tambahkan materi baru untuk setiap mata kuliah.</p>
              </div>
            </div>
          </div>

          <div className="upload-stepper" aria-label="Langkah 1 dari 3">
            <div className="step-item active"><div className="step-circle">1</div></div>
            <div className="step-line" />
            <div className="step-item"><div className="step-circle">2</div></div>
            <div className="step-line" />
            <div className="step-item"><div className="step-circle">3</div></div>
          </div>

          <div className="upload-form-content">
            <section className="upload-section">
              <h3 className="upload-section-title">1. Informasi Materi</h3>
              <p className="upload-section-desc">Lengkapi detail materi yang akan diunggah.</p>
              <div className="upload-box">
                <div className="upload-grid-2">
                  <div className="form-group">
                    <label htmlFor="semester">Semester <span className="required">*</span></label>
                    <div className="filter-item">
                      <select id="semester" name="semester" value={form.semester} onChange={updateForm} required>
                        <option value="">Pilih semester</option>
                        {Array.from({ length: 8 }, (_, index) => index + 1).map((semester) => (
                          <option key={semester} value={semester}>Semester {semester}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="mataKuliah">Mata Kuliah <span className="required">*</span></label>
                    <input id="mataKuliah" name="mataKuliah" value={form.mataKuliah} onChange={updateForm}
                      placeholder="Contoh: Struktur Data" required minLength={2} maxLength={100}
                      className="input-text upload-input" />
                  </div>
                </div>
                <div className="form-group" style={{ marginTop: '1.5rem' }}>
                  <label htmlFor="judul">Nama Materi <span className="required">*</span></label>
                  <input id="judul" name="judul" value={form.judul} onChange={updateForm}
                    placeholder="Contoh: Pengantar Manajemen Proyek" required minLength={3} maxLength={200}
                    className="input-text upload-input" />
                </div>
                <div className="form-group" style={{ marginTop: '1.5rem' }}>
                  <label htmlFor="deskripsi">Deskripsi</label>
                  <textarea id="deskripsi" name="deskripsi" value={form.deskripsi} onChange={updateForm}
                    placeholder="Keterangan singkat materi (opsional)" maxLength={2000} rows={4}
                    className="input-text upload-input" />
                </div>
              </div>
            </section>

            <section className="upload-section" style={{ marginTop: '2rem' }}>
              <h3 className="upload-section-title">2. Upload File</h3>
              <p className="upload-section-desc">Pilih file materi yang akan diunggah.</p>
              <div className="upload-box">
                <div className="form-group">
                  <label htmlFor="file-upload">File Materi <span className="required">*</span></label>
                  <div className="file-upload-wrapper">
                    <input type="file" id="file-upload" name="file" accept=".pdf,.docx,.pptx,.xlsx"
                      onChange={handleFileChange} style={{ display: 'none' }} />
                    <div className="file-input-display" aria-live="polite">
                      {file ? <span className="file-name">{file.name}</span> : <span>Belum ada file yang dipilih...</span>}
                    </div>
                    <label htmlFor="file-upload" className="btn-pilih-file">Pilih file</label>
                  </div>
                  <p className="file-hint">Format: PDF, DOCX, PPTX, XLSX | Maks. 10 MB</p>
                </div>
              </div>
            </section>
            {error && <p role="alert" className="confirm-alert">{error}</p>}
          </div>

          <div className="upload-actions">
            <Link to="/dashboard/materi" className="btn-kembali">Batal</Link>
            <button type="submit" className="btn-lanjutkan">Lanjutkan</button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}



