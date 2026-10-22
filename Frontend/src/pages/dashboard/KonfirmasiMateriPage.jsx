import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout.jsx';

export default function KonfirmasiMateriPage() {
  const navigate = useNavigate();
  
  // ✅ State untuk mengatur munculnya modal
  const [showModal, setShowModal] = useState(false);

  // Data dummy
  const [formData] = useState({
    semester: 'Semester 5',
    matkul: 'Manajemen Proyek',
    namaMateri: 'Kerangka Kerja Manajemen Proyek',
    fileName: 'mppl_ptmn1.pdf'
  });

  // ✅ Fungsi saat tombol "Simpan" di klik
  const handleSimpan = () => {
    setShowModal(true); // Munculkan modal
  };

  return (
    <DashboardLayout>
      <div style={{ width: '100%' }}>
        <div className="upload-main-card">
          
          {/* 1. HEADER (Kode tetap sama) */}
          <div className="upload-header-inner">
            <div className="materi-header-left">
              <div className="materi-icon-bg">
                <svg width="32" height="32" viewBox="0 0 28 27" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.4968 14.2758V25.5326M17.6236 16.7773L14.4968 14.2758L11.3699 16.7773M5.78404 10.6699C4.60109 10.9676 3.56756 11.687 2.87761 12.6929C2.18767 13.6989 1.88881 14.9222 2.03718 16.1329C2.18555 17.3437 2.77094 18.4586 3.68336 19.2682C4.59579 20.0778 5.77245 20.5264 6.99226 20.5296H8.24301"/>
                  <path d="M19.2872 8.19479C18.8597 6.50199 17.8045 5.03508 16.3355 4.0914C14.8666 3.14773 13.0938 2.79792 11.3765 3.11288C9.65918 3.42783 8.12589 4.38399 7.08742 5.78752C6.04895 7.19106 5.58301 8.93695 5.78406 10.6713C5.78406 10.6713 5.97542 11.7744 6.36691 12.3998"/>
                  <path d="M20.7504 20.5297C21.6335 20.5291 22.5064 20.3415 23.3118 19.9792C24.1171 19.6169 24.8366 19.0882 25.4229 18.4278C26.0091 17.7674 26.4489 16.9903 26.7132 16.1477C26.9775 15.3052 27.0604 14.4161 26.9563 13.5392C26.8523 12.6623 26.5637 11.8173 26.1096 11.06C25.6555 10.3026 25.0461 9.65 24.3216 9.14512C23.5971 8.64024 22.7739 8.29453 21.9061 8.13073C21.0383 7.96694 20.1457 7.98878 19.287 8.19482L17.6235 8.64759"/>
                </svg>
              </div>
              <div className="materi-title">
                <h2>Upload Materi</h2>
                <p>Tambahkan materi baru untuk setiap mata kuliah!</p>
              </div>
            </div>
          </div>

          {/* 2. STEPPER */}
          <div className="upload-stepper">
            <div className="step-item active"><div className="step-circle">1</div></div>
            <div className="step-line active"></div>
            <div className="step-item active"><div className="step-circle">2</div></div>
            <div className="step-line active"></div>
            <div className="step-item active"><div className="step-circle">3</div></div>
          </div>

          {/* 3. KONTEN KONFIRMASI */}
          <div className="upload-form-content">
            <div className="upload-section">
              <h3 className="upload-section-title">3. Konfirmasi Materi</h3>
              <p className="upload-section-desc">Periksa kembali informasi sebelum materi diunggah.</p>

              <div className="confirm-card">
                <h4 className="confirm-card-title">Ringkasan Materi</h4>
                <div className="confirm-row">
                  <span className="confirm-label">Semester</span>
                  <span className="confirm-value">{formData.semester}</span>
                </div>
                <div className="confirm-row">
                  <span className="confirm-label">Mata Kuliah</span>
                  <span className="confirm-value">{formData.matkul}</span>
                </div>
                <div className="confirm-row">
                  <span className="confirm-label">Nama Materi</span>
                  <span className="confirm-value">{formData.namaMateri}</span>
                </div>
              </div>

              <div className="confirm-card" style={{ marginTop: '1.5rem' }}>
                <h4 className="confirm-card-title">File Materi</h4>
                <div className="confirm-file-row">
                  <div className="file-icon-box">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                  </div>
                  <span className="confirm-file-name">{formData.fileName}</span>
                  <span className="confirm-file-badge">PDF</span>
                </div>
              </div>

              <div className="confirm-alert">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                Pastikan semua informasi sudah benar. Setelah disimpan, materi akan langsung tersedia di halaman Materi Kuliah.
              </div>
            </div>
          </div>

          {/* 4. TOMBOL AKSI */}
          <div className="upload-actions">
            <Link to="/dashboard/materi/upload" className="btn-kembali">Kembali</Link>
            {/* ✅ Tombol memanggil handleSimpan */}
            <button onClick={handleSimpan} className="btn-lanjutkan">Simpan</button>
          </div>

        </div>
      </div>

      {/* ✅ MODAL POP-UP SUKSES */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            
            {/* Ikon Centang Hijau */}
            <div className="modal-success-icon">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>

            <h2 className="modal-title">Materi Berhasil Diunggah!</h2>
            <p className="modal-desc">
              Materi "{formData.namaMateri}" telah berhasil ditambahkan!
            </p>

            <button onClick={() => navigate('/dashboard/materi')} className="modal-btn">
              Kembali ke Halaman Materi
            </button>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}