import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout.jsx";
import { uploadMateri } from "../../services/materiService.js";

function formatError(error) {
  if (error?.status === 401)
    return "Sesi login berakhir. Silakan login kembali sebagai admin.";
  if (error?.status === 403)
    return "Akun ini tidak memiliki izin untuk mengunggah materi.";
  return error?.message || "Materi gagal diunggah. Silakan coba lagi.";
}

export default function KonfirmasiMateriPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
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
            <Link to="/dashboard/materi/upload" className="btn-lanjutkan">
              Kembali ke Upload
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const handleSimpan = async () => {
    if (isSaving) return;
    setIsSaving(true);
    setError("");
    const payload = new FormData();
    payload.append("judul", form.judul.trim());
    payload.append("mata_kuliah", form.mataKuliah.trim());
    payload.append("semester", String(form.semester));
    if (form.deskripsi.trim())
      payload.append("deskripsi", form.deskripsi.trim());
    payload.append("file", file);

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
      <div style={{ width: "100%" }}>
        <div className="upload-main-card">
          <div className="upload-header-inner">
            <div className="materi-header-left">
              <div className="materi-icon-bg" aria-hidden="true">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 48 45"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M23.9943 22.517V42.7793M29.6227 27.0198L23.9943 22.517L18.3659 27.0198M8.31131 16.0264C6.182 16.5622 4.32162 17.8571 3.07971 19.6678C1.83781 21.4785 1.29985 23.6805 1.56692 25.8598C1.83399 28.0392 2.88769 30.0461 4.53007 31.5034C6.17245 32.9607 8.29044 33.7681 10.4861 33.7739H12.7375"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    stroke="#1E6F9E"
                  />
                  <path
                    d="M32.6166 11.5711C31.8472 8.52409 29.9478 5.88362 27.3037 4.185C24.6596 2.48638 21.4685 1.85671 18.3773 2.42364C15.2862 2.99056 12.5262 4.71165 10.657 7.23803C8.78773 9.76441 7.94903 12.907 8.31092 16.0288C8.31092 16.0288 8.65538 18.0145 9.36005 19.1402"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    stroke="#1E6F9E"
                  />
                  <path
                    d="M35.2505 33.7741C36.84 33.773 38.4113 33.4353 39.861 32.7832C41.3106 32.1311 42.6057 31.1794 43.661 29.9907C44.7163 28.802 45.5078 27.4032 45.9836 25.8865C46.4594 24.3699 46.6085 22.7696 46.4212 21.1911C46.234 19.6127 45.7145 18.0917 44.8971 16.7285C44.0797 15.3652 42.9828 14.1905 41.6787 13.2817C40.3745 12.3729 38.8927 11.7507 37.3307 11.4558C35.7688 11.161 34.1621 11.2003 32.6164 11.5712L29.6221 12.3862"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    stroke="#1E6F9E"
                  />
                </svg>
              </div>
              {error && (
                <p role="alert" className="confirm-alert confirm-alert-error">
                  {error}
                </p>
              )}
              <div className="materi-title">
                <h2>Upload Materi</h2>
                <p>Periksa informasi sebelum mengirim materi ke server.</p>
              </div>
            </div>
          </div>

          <div className="upload-stepper" aria-label="Langkah 3 dari 3">
            <div className="step-item active">
              <div className="step-circle">1</div>
            </div>
            <div className="step-line active" />
            <div className="step-item active">
              <div className="step-circle">2</div>
            </div>
            <div className="step-line active" />
            <div className="step-item active">
              <div className="step-circle">3</div>
            </div>
          </div>

          <div className="upload-form-content">
            <section className="upload-section">
              <h3 className="upload-section-title">3. Konfirmasi Materi</h3>
              <p className="upload-section-desc">
                Periksa kembali informasi sebelum materi diunggah.
              </p>
              <div className="confirm-card">
                <h4 className="confirm-card-title">Ringkasan Materi</h4>
                <div className="confirm-row">
                  <span className="confirm-label">Semester</span>
                  <span className="confirm-value">
                    Semester {form.semester}
                  </span>
                </div>
                <div className="confirm-row">
                  <span className="confirm-label">Mata Kuliah</span>
                  <span className="confirm-value">{form.mataKuliah}</span>
                </div>
                <div className="confirm-row">
                  <span className="confirm-label">Nama Materi</span>
                  <span className="confirm-value">{form.judul}</span>
                </div>
                {form.deskripsi && (
                  <div className="confirm-row">
                    <span className="confirm-label">Deskripsi</span>
                    <span className="confirm-value">{form.deskripsi}</span>
                  </div>
                )}
              </div>
              <div className="confirm-card" style={{ marginTop: "1.5rem" }}>
                <h4 className="confirm-card-title">File Materi</h4>
                <div className="confirm-file-row">
                  <div className="file-icon-box" aria-hidden="true">
                    ▤
                  </div>
                  <span className="confirm-file-name">{file.name}</span>
                  <span className="confirm-file-badge">
                    {file.name.split(".").pop()?.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="confirm-alert">
                Setelah disimpan, data dan file materi akan tersimpan
                dan tersedia di halaman Materi.
              </div>
              {error && (
                <p role="alert" className="confirm-alert">
                  {error}
                </p>
              )}
            </section>
          </div>

          <div className="upload-actions">
            <Link
              to="/dashboard/materi/upload"
              state={{ form, file }}
              className="btn-kembali"
            >
              Kembali
            </Link>
            <button
              type="button"
              onClick={handleSimpan}
              disabled={isSaving || Boolean(savedMateri)}
              className="btn-lanjutkan"
            >
              {isSaving ? "Mengunggah..." : "Simpan"}
            </button>
          </div>
        </div>
      </div>

      {savedMateri && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="upload-success-title"
        >
          <div className="modal-content">
            <div className="modal-success-icon" aria-hidden="true">
              ✓
            </div>
            <h2 id="upload-success-title" className="modal-title">
              Materi Berhasil Diunggah!
            </h2>
            <p className="modal-desc">
              Materi “{savedMateri.judul || form.judul}” telah tersimpan di
              backend.
            </p>
            <button
              type="button"
              onClick={() => navigate("/dashboard/materi", { replace: true })}
              className="modal-btn"
            >
              Kembali ke Halaman Materi
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
