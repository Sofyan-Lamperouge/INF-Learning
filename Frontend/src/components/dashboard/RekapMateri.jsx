// src/components/dashboard/RekapMateri.jsx

import { Link } from 'react-router-dom';

export default function RekapMateri({ materiList = [] }) {
  return (
    <div className="rekap-card">

      {/* Header */}
      <div className="rekap-header">
        <h3 className="rekap-title">Rekap Materi</h3>
        <Link to="/dashboard/materi" className="rekap-link">
          Lihat semua
        </Link>
      </div>

      <div className="rekap-divider"></div>

      {/* Body */}
      <div className="rekap-body">
        {materiList.length === 0 ? (
          <div className="rekap-empty">
            <div className="rekap-empty-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
            <p className="rekap-empty-text">
              Belum ada materi yang ditambahkan
            </p>
            <Link to="/dashboard/materi" className="btn-tambah">
              + Tambahkan materi
            </Link>
          </div>
        ) : (
          <ul className="rekap-list">
            {materiList.map((item) => (
              <li key={item.id} className="rekap-list-item">
                {item.judul}
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  );
}