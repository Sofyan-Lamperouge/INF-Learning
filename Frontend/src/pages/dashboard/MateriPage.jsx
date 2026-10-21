// src/pages/dashboard/MateriPage.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout.jsx";
// import DashboardHeader from '../../components/dashboard/DashboardHeader.jsx'; // Jika butuh header atas

export default function MateriPage() {
  // State untuk data materi (Masih kosong)
  const [materiList] = useState([]);

  // State untuk filter
  const [search, setSearch] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <DashboardLayout>
      {/* <DashboardHeader 
        title="Dashboard Admin" 
        searchValue={search}
        onSearchChange={(e) => setSearch(e.target.value)}
      /> */}

      <div className="materi-container">
        {/* === 1. KARTU HEADER MATERI KULIAH === */}
        <div className="materi-header-card">
          <div className="materi-header-left">
            <div className="materi-icon-bg">
              <svg
                width="40"
                height="45"
                viewBox="0 0 50 50"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M25 41.6666C25 41.6666 28.125 39.5833 35.4166 39.5833C42.7083 39.5833 45.8333 41.6666 45.8333 41.6666V12.4999C45.8333 12.4999 42.7083 8.33325 35.4166 8.33325C28.125 8.33325 25 12.4999 25 12.4999C25 12.4999 21.875 8.33325 14.5833 8.33325C7.29163 8.33325 4.16663 12.4999 4.16663 12.4999V41.6666C4.16663 41.6666 7.29163 39.5833 14.5833 39.5833C21.875 39.5833 25 41.6666 25 41.6666ZM25 12.4999V41.6666"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke="#1E6F9E"
                />
              </svg>
            </div>
            <div className="materi-title">
              <h2>Materi Kuliah</h2>
              <p>Kelola materi pembelajaran untuk setiap mata kuliah.</p>
            </div>
          </div>

          <Link
            to="/dashboard/materi/upload"
            className="btn-upload-materi"
            style={{ textDecoration: "none" }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 28 27"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="btn-upload-icon"
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
            <span>Upload materi</span>
          </Link>
        </div>

        {/* === 2. FILTER & PENCARIAN === */}
        <div className="materi-filter-bar">
          {/* Filter Semester */}
          <div className="filter-item">
            <select>
              <option value="">Semester</option>
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
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>

          {/* Filter Mata Kuliah */}
          <div className="filter-item">
            <select>
              <option value="">Mata Kuliah</option>
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
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>

          {/* Pencarian */}
          <div className="filter-item">
            <svg
              className="icon-search"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder={isSearchFocused ? '' : 'Cari materi...'} 
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* === 3. TABEL DATA MATERI === */}
        <div className="materi-table-card">
          <table className="materi-table">
            <thead>
              <tr>
                <th width="5%">No</th>
                <th width="15%">Semester</th>
                <th width="20%">Mata Kuliah</th>
                <th width="30%">Nama Materi</th>
                <th width="20%">File</th>
                <th width="10%">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {materiList.length === 0 ? (
                <tr>
                  <td colSpan="6" className="materi-empty-state">
                    Belum ada materi yang diunggah.
                  </td>
                </tr>
              ) : (
                materiList.map((materi, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      {/* Contoh badge, sesuaikan dengan data asli nanti */}
                      <span className="badge-semester badge-s1">
                        {materi.semester}
                      </span>
                    </td>
                    <td>{materi.matkul}</td>
                    <td>{materi.nama}</td>
                    <td>{materi.file}</td>
                    <td>
                      {/* Tombol Aksi (Edit/Hapus) */}
                      <button className="btn-icon-edit">✏️</button>
                      <button className="btn-icon-delete">🗑️</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* === 4. FOOTER PAGINASI === */}
          <div className="materi-pagination">
            <span className="pagination-text">
              Menampilkan {materiList.length} dari {materiList.length} materi
            </span>
            <div className="pagination-buttons">
              <button className="btn-page" disabled>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <button className="btn-page active">1</button>
              <button className="btn-page" disabled>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
