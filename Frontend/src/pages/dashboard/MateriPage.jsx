// Frontend/src/pages/dashboard/MateriPage.jsx
//
// [DIUBAH]
//  - DUMMY_MATERI dihapus; data diambil dari GET /materi (materiService.getMateriList).
//  - Timer palsu 1500ms dihapus. Skeleton hanya tampil saat load pertama.
//  - Filter Semester / Mata Kuliah / pencarian kini berfungsi (dikirim ke backend, search di-debounce).
//  - Nama field mengikuti backend: matkul -> mata_kuliah, nama -> judul, file -> url + jenis,
//    semester berupa angka (bukan teks "Semester 1").
//  - Tombol hapus berfungsi (DELETE /materi/{id}).
//  - Paginasi memakai total dan total_pages dari backend.
//  - Bagian SVG/ikon tidak diubah.

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout.jsx";
import MateriSkeleton from "../../components/skeletons/MateriSkeleton.jsx";
import ErrorMessage from "../../components/common/ErrorMessage.jsx";
import EditMateriModal from "../../components/dashboard/EditMateriModal.jsx";
import { getMateriList, deleteMateri } from "../../services/materiService.js";

const PAGE_SIZE = 20;

export default function MateriPage() {
  const [loading, setLoading] = useState(true); // skeleton hanya untuk load pertama
  const [error, setError] = useState("");
  const [materiList, setMateriList] = useState([]);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1 });
  const [matkulOptions, setMatkulOptions] = useState([]);
  const [reloadKey, setReloadKey] = useState(0);
  const [editingMateri, setEditingMateri] = useState(null);

  const [search, setSearch] = useState("");
  const [semester, setSemester] = useState("");
  const [mataKuliah, setMataKuliah] = useState("");
  const [page, setPage] = useState(1);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    let active = true;

    const timer = setTimeout(async () => {
      try {
        setError("");
        const data = await getMateriList({
          semester,
          mataKuliah,
          q: search,
          page,
          limit: PAGE_SIZE,
        });

        if (!active) return;

        setMateriList(data.items);
        setMeta({ total: data.total, totalPages: data.total_pages || 1 });
        // Daftar pilihan mata kuliah dikumpulkan dari data yang pernah dimuat
        setMatkulOptions((prev) => [
          ...new Set([...prev, ...data.items.map((i) => i.mata_kuliah)]),
        ]);
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    }, search ? 400 : 0); // debounce hanya saat mengetik

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [semester, mataKuliah, search, page, reloadKey]);

  async function handleDelete(id) {
    if (!window.confirm("Hapus materi ini?")) return;

    try {
      await deleteMateri(id);
      setReloadKey((k) => k + 1);
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <MateriSkeleton />
      </DashboardLayout>
    );
  }

  // Semester kini berupa angka dari backend
  const getSemesterBadge = (s) => `badge-s${s >= 1 && s <= 5 ? s : 1}`;

  return (
    <DashboardLayout>
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
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
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
              width="30"
              height="25"
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
          <div className="filter-item">
            <select
              value={semester}
              onChange={(e) => {
                setSemester(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Semester</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <option key={n} value={n}>
                  Semester {n}
                </option>
              ))}
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

          <div className="filter-item">
            <select
              value={mataKuliah}
              onChange={(e) => {
                setMataKuliah(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Mata Kuliah</option>
              {matkulOptions.map((mk) => (
                <option key={mk} value={mk}>
                  {mk}
                </option>
              ))}
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
              placeholder={isSearchFocused ? "" : "Cari materi..."}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>

        {error && <ErrorMessage message={error} />}

        {/* === 3. TABEL DATA MATERI === */}
        <div className="materi-table-card">
          <table className="materi-table">
            <thead>
              <tr>
                <th width="5%">No</th>
                <th width="20%">Semester</th>
                <th width="25%">Mata Kuliah</th>
                <th width="40%">Nama Materi</th>
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
                  <tr key={materi.id}>
                    <td>{(page - 1) * PAGE_SIZE + index + 1}</td>
                    <td>
                      <span
                        className={`badge-semester ${getSemesterBadge(materi.semester)}`}
                      >
                        Semester {materi.semester}
                      </span>
                    </td>
                    <td style={{ color: "#6b7280" }}>{materi.mata_kuliah}</td>
                    <td style={{ color: "#4b5563" }}>{materi.judul}</td>
                    <td style={{ color: "#6b7280" }}>
                      <a href={materi.url} target="_blank" rel="noreferrer">
                        {materi.jenis.toUpperCase()}
                      </a>
                    </td>
                    <td>
                      {/*  3. Tombol Edit & Hapus dengan SVG */}
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                          type="button"
                          onClick={() => setEditingMateri(materi)}
                          aria-label={`Edit materi ${materi.judul}`}
                          style={{
                            background: "transparent",
                            border: "none",
                            padding: 0,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 30 26"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M20.9531 17.5183L22.6198 15.8933C22.8802 15.6394 23.3333 15.8171 23.3333 16.1827V23.5663C23.3333 24.912 22.2135 26.0038 20.8333 26.0038H2.5C1.11979 26.0038 0 24.912 0 23.5663V5.69131C0 4.34561 1.11979 3.25381 2.5 3.25381H16.7448C17.1146 3.25381 17.3021 3.69053 17.0417 3.94951L15.375 5.57451C15.2969 5.65068 15.1927 5.69131 15.0781 5.69131H2.5V23.5663H20.8333V17.8026C20.8333 17.696 20.875 17.5944 20.9531 17.5183ZM29.1094 7.27061L15.4323 20.6058L10.724 21.1136C9.35937 21.2608 8.19792 20.1386 8.34896 18.798L8.86979 14.2073L22.5469 0.872168C23.7396 -0.290723 25.6667 -0.290723 26.8542 0.872168L29.1042 3.06592C30.2969 4.22881 30.2969 6.11279 29.1094 7.27061ZM23.9635 8.83975L20.9375 5.88936L11.2604 15.3296L10.8802 18.6456L14.2812 18.2749L23.9635 8.83975ZM27.3385 4.79248L25.0885 2.59873C24.875 2.39053 24.526 2.39053 24.3177 2.59873L22.7083 4.16787L25.7344 7.11826L27.3438 5.54912C27.5521 5.33584 27.5521 5.00068 27.3385 4.79248Z"
                              fill="#55B5EF"
                            />
                          </svg>
                        </button>

                        <button
                          onClick={() => handleDelete(materi.id)}
                          style={{
                            background: "transparent",
                            border: "none",
                            padding: 0,
                            cursor: "pointer",
                            display: "flex",
                          }}
                        >
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 50 50"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect
                              width="50"
                              height="50"
                              rx="18"
                              fill="#FEE2E2"
                            />
                            <path
                              d="M16.5625 16.5625L17.7344 35.3125C17.79 36.3959 18.5781 37.1875 19.6094 37.1875H30.3906C31.426 37.1875 32.1994 36.3959 32.2656 35.3125L33.4375 16.5625"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              stroke="#DC2626"
                            />
                            <path
                              d="M14.6875 16.5625H35.3125Z"
                              fill="#DC2626"
                            />
                            <path
                              d="M14.6875 16.5625H35.3125"
                              strokeWidth="3"
                              strokeMiterlimit="10"
                              strokeLinecap="round"
                              stroke="#DC2626"
                            />
                            <path
                              d="M21.25 16.5625V14.2188C21.2495 14.0339 21.2855 13.8508 21.3559 13.68C21.4264 13.5091 21.53 13.3539 21.6607 13.2232C21.7914 13.0925 21.9466 12.9889 22.1175 12.9184C22.2883 12.848 22.4714 12.812 22.6562 12.8125H27.3438C27.5286 12.812 27.7117 12.848 27.8825 12.9184C28.0534 12.9889 28.2086 13.0925 28.3393 13.2232C28.47 13.3539 28.5736 13.5091 28.6441 13.68C28.7145 13.8508 28.7505 14.0339 28.75 14.2188V16.5625M25 20.3125V33.4375M20.7812 20.3125L21.25 33.4375M29.2188 20.3125L28.75 33.4375"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              stroke="#DC2626"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* === 4. FOOTER PAGINASI === */}
          <div className="materi-pagination">
            <span className="pagination-text">
              Menampilkan {materiList.length} dari {meta.total} materi
            </span>
            <div className="pagination-buttons">
              <button
                className="btn-page"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
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
              <button className="btn-page active">{page}</button>
              <button
                className="btn-page"
                disabled={page >= meta.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
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
      {editingMateri && (
        <EditMateriModal
          materi={editingMateri}
          mataKuliahOptions={matkulOptions}
          onClose={() => setEditingMateri(null)}
          onSaved={() => {
            setEditingMateri(null);
            setReloadKey((current) => current + 1);
          }}
        />
      )}
    </DashboardLayout>
  );
}
