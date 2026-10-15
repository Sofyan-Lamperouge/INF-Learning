// src/components/dashboard/TabelMahasiswa.jsx

import { Link } from 'react-router-dom';

export default function TabelMahasiswa({ mahasiswaList = [] }) {
  return (
    <div className="rekap-card">

      {/* Header */}
      <div className="rekap-header">
        <h3 className="rekap-title">Mahasiswa</h3>
        <Link to="/dashboard/mahasiswa" className="rekap-link">
          Lihat semua
        </Link>
      </div>

      <div className="rekap-divider"></div>

      {/* Body: Tabel */}
      <div className="rekap-body">
        {mahasiswaList.length === 0 ? (
          <div className="rekap-empty">
            <p className="rekap-empty-text">Belum ada mahasiswa terdaftar</p>
          </div>
        ) : (
          <table className="tabel-mahasiswa">
            <thead>
              <tr>
                <th>NIM</th>
                <th>Nama</th>
                <th>Angkatan</th>
              </tr>
            </thead>
            <tbody>
              {mahasiswaList.map((mhs) => (
                <tr key={mhs.nomor_induk || mhs.id}>
                  <td>{mhs.nomor_induk}</td>
                  <td>{mhs.nama}</td>
                  <td>{mhs.angkatan || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}