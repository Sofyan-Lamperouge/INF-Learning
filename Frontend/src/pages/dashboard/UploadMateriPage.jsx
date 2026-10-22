// src/pages/dashboard/UploadMateriPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout.jsx";

export default function UploadMateriPage() {
  const navigate = useNavigate();
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Fitur upload akan dihubungkan ke backend!");
    navigate("/dashboard/materi");
  };

  return (
    <DashboardLayout>
      {/* Hapus materi-container agar tidak ada gap */}
      <div style={{ width: "100%" }}>
        {/* ✅ SATU KOTAK UTAMA UNTUK SEMUA */}
        <form onSubmit={handleSubmit} className="upload-main-card">
          {/* 1. HEADER (Menyatu dengan bawahnya) */}
          <div className="upload-header-inner">
            <div className="materi-header-left">
              <div className="materi-icon-bg">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 28 27"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14.4968 14.2758V25.5326M17.6236 16.7773L14.4968 14.2758L11.3699 16.7773M5.78404 10.6699C4.60109 10.9676 3.56756 11.687 2.87761 12.6929C2.18767 13.6989 1.88881 14.9222 2.03718 16.1329C2.18555 17.3437 2.77094 18.4586 3.68336 19.2682C4.59579 20.0778 5.77245 20.5264 6.99226 20.5296H8.24301"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M19.2872 8.19479C18.8597 6.50199 17.8045 5.03508 16.3355 4.0914C14.8666 3.14773 13.0938 2.79792 11.3765 3.11288C9.65918 3.42783 8.12589 4.38399 7.08742 5.78752C6.04895 7.19106 5.58301 8.93695 5.78406 10.6713C5.78406 10.6713 5.97542 11.7744 6.36691 12.3998"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M20.7504 20.5297C21.6335 20.5291 22.5064 20.3415 23.3118 19.9792C24.1171 19.6169 24.8366 19.0882 25.4229 18.4278C26.0091 17.7674 26.4489 16.9903 26.7132 16.1477C26.9775 15.3052 27.0604 14.4161 26.9563 13.5392C26.8523 12.6623 26.5637 11.8173 26.1096 11.06C25.6555 10.3026 25.0461 9.65 24.3216 9.14512C23.5971 8.64024 22.7739 8.29453 21.9061 8.13073C21.0383 7.96694 20.1457 7.98878 19.287 8.19482L17.6235 8.64759"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="materi-title">
                <h2>Upload Materi</h2>
                <p>Tambahkan materi baru untuk setiap mata kuliah!</p>
              </div>
            </div>
          </div>

          {/* 2. STEPPER (1 - 2 - 3) */}
          <div className="upload-stepper">
            <div className="step-item active">
              <div className="step-circle">1</div>
            </div>
            <div className="step-line"></div>
            <div className="step-item">
              <div className="step-circle">2</div>
            </div>
            <div className="step-line"></div>
            <div className="step-item">
              <div className="step-circle">3</div>
            </div>
          </div>

          {/* 3. KONTEN FORM */}
          <div className="upload-form-content">
            {/* SECTION 1: INFORMASI MATERI */}
            <div className="upload-section">
              <h3 className="upload-section-title">1. Informasi Materi</h3>
              <p className="upload-section-desc">
                Lengkapi detail materi yang akan diunggah.
              </p>

              <div className="upload-box">
                <div className="upload-grid-2">
                  <div className="form-group">
                    <label>
                      Semester <span className="required">*</span>
                    </label>
                    <div className="filter-item">
                      <select required>
                        <option value="">Pilih semester</option>
                        <option value="1">Semester 1</option>
                        <option value="2">Semester 2</option>
                        <option value="3">Semester 3</option>
                        <option value="4">Semester 4</option>
                        <option value="5">Semester 5</option>
                      </select>
                      <svg
                        className="icon-dropdown"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>
                      Mata Kuliah <span className="required">*</span>
                    </label>
                    <div className="filter-item">
                      <select required>
                        <option value="">Pilih mata kuliah</option>
                        <option value="struktur">Struktur Data</option>
                        <option value="algo">Algoritma dan Pemrograman</option>
                      </select>
                      <svg
                        className="icon-dropdown"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="form-group" style={{ marginTop: "1.5rem" }}>
                  <label>
                    Nama Materi <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Pengantar Manajemen Proyek"
                    required
                    className="input-text upload-input"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: UPLOAD FILE */}
            <div className="upload-section" style={{ marginTop: "2rem" }}>
              <h3 className="upload-section-title">2. Upload File</h3>
              <p className="upload-section-desc">
                Pilih file materi yang akan diunggah.
              </p>

              <div className="upload-box">
                <div className="form-group">
                  <label>
                    File Materi <span className="required">*</span>
                  </label>

                  {/* ✅ PEMBUNGKUS FLEXBOX UNTUK INPUT & TOMBOL */}
                  <div className="file-upload-wrapper">
                    {/* Input File Hidden (Disembunyikan asli) */}
                    <input
                      type="file"
                      id="file-upload"
                      accept=".pdf,.docx,.pptx"
                      onChange={handleFileChange}
                      required
                      style={{ display: "none" }}
                    />

                    {/* Kotak Input Palsu (Hanya menampilkan teks) */}
                    <div className="file-input-display">
                      {fileName ? (
                        <span className="file-name">{fileName}</span>
                      ) : (
                        <span>Belum ada file yang dipilih...</span>
                      )}
                    </div>

                    {/* Label Tombol "Pilih file" */}
                    <label htmlFor="file-upload" className="btn-pilih-file">
                      Pilih file
                    </label>
                  </div>

                  <p className="file-hint">
                    Format: PDF, DOCX, PPTX | Maks. 10 MB
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 4. TOMBOL AKSI (KEMBALI & LANJUTKAN) */}
          <div className="upload-actions">
            <Link to="/dashboard/materi/konfirmasi" className="btn-lanjutkan">
              Lanjutkan
            </Link>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
