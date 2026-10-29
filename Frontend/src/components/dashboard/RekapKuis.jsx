import { Link } from 'react-router-dom';

export default function RekapKuis({ kuisList = [] }) {
  return (
    <div className="rekap-card">
      <div className="rekap-header">
        <h3 className="rekap-title">Rekap Kuis</h3>

        <Link to="/dashboard/kuis" className="rekap-link">
          Lihat semua
        </Link>
      </div>

      <div className="rekap-divider"></div>

      <div className="rekap-body">
        {kuisList.length === 0 ? (
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
              Belum ada kuis yang ditambahkan
            </p>

            <Link to="/dashboard/kuis" className="btn-tambah">
              + Tambahkan kuis
            </Link>
          </div>
        ) : (
          <ul className="rekap-list">
            {kuisList.map((item) => (
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