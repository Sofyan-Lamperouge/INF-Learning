import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout.jsx';
import { uploadMateri } from '../../services/materiService.js';

function formatError(error) {
  if (error?.status === 401) return 'Sesi login berakhir. Silakan login kembali sebagai admin.';
  if (error?.status === 403) return 'Akun ini tidak memiliki izin untuk mengunggah materi.';
  return error?.message || 'Materi gagal diunggah. Silakan coba lagi.';
}

export default function KonfirmasiMateriPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [savedMateri, setSavedMateri] = useState(null);
  const form = state?.form;
  const file = state?.file;

  if (!form || !file) {
    return (
      <DashboardLayout>
        <div className="upload-main-card">
          <div className="upload-form-content">
            <h2>Data upload tidak ditemukan</h2>
            <p>Silakan isi informasi materi dan pilih file terlebih dahulu.</p>
            <Link to="/dashboard/materi/upload" className="btn-lanjutkan">Kembali ke Upload</Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const handleSimpan = async () => {
    if (isSaving) return;
    setIsSaving(true);
    setError('');
    const payload = new FormData();
    payload.append('judul', form.judul.trim());
    payload.append('mata_kuliah', form.mataKuliah.trim());
    payload.append('semester', String(form.semester));
    if (form.deskripsi.trim()) payload.append('deskripsi', form.deskripsi.trim());
    payload.append('file', file);

    try {
      const result = await uploadMateri(payload);
      setSavedMateri(result);
    } catch (uploadError) {
      setError(formatError(uploadError));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div style={{ width: '100%' }}>
        <div className="upload-main-card">
          <div className="upload-header-inner">
            <div className="materi-header-left">
              <div className="materi-icon-bg" aria-hidden="true">⇧</div>
              <div className="materi-title">
                <h2>Upload Materi</h2>
                <p>Periksa informasi sebelum mengirim materi ke server.</p>
              </div>
            </div>
          </div>

          <div className="upload-stepper" aria-label="Langkah 3 dari 3">
            <div className="step-item active"><div className="step-circle">1</div></div>
            <div className="step-line active" />
            <div className="step-item active"><div className="step-circle">2</div></div>
            <div className="step-line active" />
            <div className="step-item active"><div className="step-circle">3</div></div>
          </div>

          <div className="upload-form-content">
            <section className="upload-section">
              <h3 className="upload-section-title">3. Konfirmasi Materi</h3>
              <p className="upload-section-desc">Periksa kembali informasi sebelum materi diunggah.</p>
              <div className="confirm-card">
                <h4 className="confirm-card-title">Ringkasan Materi</h4>
                <div className="confirm-row"><span className="confirm-label">Semester</span><span className="confirm-value">Semester {form.semester}</span></div>
                <div className="confirm-row"><span className="confirm-label">Mata Kuliah</span><span className="confirm-value">{form.mataKuliah}</span></div>
                <div className="confirm-row"><span className="confirm-label">Nama Materi</span><span className="confirm-value">{form.judul}</span></div>
                {form.deskripsi && <div className="confirm-row"><span className="confirm-label">Deskripsi</span><span className="confirm-value">{form.deskripsi}</span></div>}
              </div>
              <div className="confirm-card" style={{ marginTop: '1.5rem' }}>
                <h4 className="confirm-card-title">File Materi</h4>
                <div className="confirm-file-row">
                  <div className="file-icon-box" aria-hidden="true">▤</div>
                  <span className="confirm-file-name">{file.name}</span>
                  <span className="confirm-file-badge">{file.name.split('.').pop()?.toUpperCase()}</span>
                </div>
              </div>
              <div className="confirm-alert">Setelah disimpan, data dan file materi akan dikirim ke backend dan tersedia di halaman Materi.</div>
              {error && <p role="alert" className="confirm-alert">{error}</p>}
            </section>
          </div>

          <div className="upload-actions">
            <Link to="/dashboard/materi/upload" state={{ form, file }} className="btn-kembali">Kembali</Link>
            <button type="button" onClick={handleSimpan} disabled={isSaving || Boolean(savedMateri)} className="btn-lanjutkan">
              {isSaving ? 'Mengunggah...' : 'Simpan'}
            </button>
          </div>
        </div>
      </div>

      {savedMateri && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="upload-success-title">
          <div className="modal-content">
            <div className="modal-success-icon" aria-hidden="true">✓</div>
            <h2 id="upload-success-title" className="modal-title">Materi Berhasil Diunggah!</h2>
            <p className="modal-desc">Materi “{savedMateri.judul || form.judul}” telah tersimpan di backend.</p>
            <button type="button" onClick={() => navigate('/dashboard/materi', { replace: true })} className="modal-btn">
              Kembali ke Halaman Materi
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
