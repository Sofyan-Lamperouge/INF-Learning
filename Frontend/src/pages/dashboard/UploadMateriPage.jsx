import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout.jsx";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_EXTENSIONS = ["pdf", "docx", "pptx", "xlsx"];

export default function UploadMateriPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [form, setForm] = useState(
    () =>
      state?.form ?? { semester: "", mataKuliah: "", judul: "", deskripsi: "" },
  );
  const [file, setFile] = useState(() => state?.file ?? null);
  const [error, setError] = useState("");

  const updateForm = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
    setError("");
  };

  const handleFileChange = (event) => {
    const selected = event.target.files?.[0] ?? null;
    setError("");
    if (!selected) {
      setFile(null);
      return;
    }
    const extension = selected.name.split(".").pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      setFile(null);
      event.target.value = "";
      setError("Format file harus PDF, DOCX, PPTX, atau XLSX.");
      return;
    }
    if (selected.size > MAX_FILE_SIZE) {
      setFile(null);
      event.target.value = "";
      setError("Ukuran file maksimal 10 MB.");
      return;
    }
    setFile(selected);
  };

  const handleContinue = (event) => {
    event.preventDefault();
    if (!file) {
      setError("Pilih file materi terlebih dahulu.");
      return;
    }
    navigate("/dashboard/materi/konfirmasi", { state: { form, file } });
  };

  return (
    <DashboardLayout>
      <div style={{ width: "100%" }}>
        <form onSubmit={handleContinue} className="upload-main-card">
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
              <div className="materi-title">
                <h2>Upload Materi</h2>
                <p>Tambahkan materi baru untuk setiap mata kuliah.</p>
              </div>
            </div>
          </div>

          <div className="upload-stepper" aria-label="Langkah 1 dari 3">
            <div className="step-item active">
              <div className="step-circle">1</div>
            </div>
            <div className="step-line" />
            <div className="step-item">
              <div className="step-circle">2</div>
            </div>
            <div className="step-line" />
            <div className="step-item">
              <div className="step-circle">3</div>
            </div>
          </div>

          <div className="upload-form-content">
            <section className="upload-section">
              <h3 className="upload-section-title">1. Informasi Materi</h3>
              <p className="upload-section-desc">
                Lengkapi detail materi yang akan diunggah.
              </p>
              <div className="upload-box">
                <div className="upload-grid-2">
                  <div className="form-group">
                    <label htmlFor="semester">
                      Semester <span className="required">*</span>
                    </label>
                    <div className="filter-item">
                      <select
                        id="semester"
                        name="semester"
                        value={form.semester}
                        onChange={updateForm}
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
                  </div>
                  <div className="form-group">
                    <label htmlFor="mataKuliah">
                      Mata Kuliah <span className="required">*</span>
                    </label>
                    <input
                      id="mataKuliah"
                      name="mataKuliah"
                      value={form.mataKuliah}
                      onChange={updateForm}
                      placeholder="Contoh: Struktur Data"
                      required
                      minLength={2}
                      maxLength={100}
                      className="input-text upload-input"
                    />
                  </div>
                </div>
                <div className="form-group" style={{ marginTop: "1.5rem" }}>
                  <label htmlFor="judul">
                    Nama Materi <span className="required">*</span>
                  </label>
                  <input
                    id="judul"
                    name="judul"
                    value={form.judul}
                    onChange={updateForm}
                    placeholder="Contoh: Pengantar Manajemen Proyek"
                    required
                    minLength={3}
                    maxLength={200}
                    className="input-text upload-input"
                  />
                </div>
                {/*
                <div className="form-group" style={{ marginTop: "1.5rem" }}>
                  <label htmlFor="deskripsi">Deskripsi</label>
                  <textarea
                    id="deskripsi"
                    name="deskripsi"
                    value={form.deskripsi}
                    onChange={updateForm}
                    placeholder="Keterangan singkat materi (opsional)"
                    maxLength={2000}
                    rows={4}
                    className="input-text upload-input"
                  />
                </div>
                */}
              </div>
            </section>

            <section className="upload-section" style={{ marginTop: "2rem" }}>
              <h3 className="upload-section-title">2. Upload File</h3>
              <p className="upload-section-desc">
                Pilih file materi yang akan diunggah.
              </p>
              <div className="upload-box">
                <div className="form-group">
                  <label htmlFor="file-upload">
                    File Materi <span className="required">*</span>
                  </label>
                  <div className="file-upload-wrapper">
                    <input
                      type="file"
                      id="file-upload"
                      name="file"
                      accept=".pdf,.docx,.pptx,.xlsx"
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />
                    <div className="file-input-display" aria-live="polite">
                      {file ? (
                        <span className="file-name">{file.name}</span>
                      ) : (
                        <span>Belum ada file yang dipilih...</span>
                      )}
                    </div>
                    <label htmlFor="file-upload" className="btn-pilih-file">
                      Pilih file
                    </label>
                  </div>
                  <p className="file-hint">
                    Format: PDF, DOCX, PPTX, XLSX | Maks. 10 MB
                  </p>
                </div>
              </div>
            </section>
            {error && (
              <p role="alert" className="confirm-alert confirm-alert-error">
                {error}
              </p>
            )}
          </div>

          <div className="upload-actions">
            <Link to="/dashboard/materi" className="btn-kembali">
              Batal
            </Link>
            <button type="submit" className="btn-lanjutkan">
              Lanjutkan
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
