// Frontend/src/components/dashboard/TabelMahasiswa.jsx
//
// [DIUBAH]
//  - DUMMY_MAHASISWA dihapus (sebelumnya sudah tidak terpakai).
//  - Field disesuaikan dengan backend: `nim` -> `nomor_induk`, key memakai `id`.
//  - <a href> diganti <Link> supaya navigasi tidak reload halaman penuh.
//  - Teks kosong dirapikan.

import { Link } from 'react-router-dom';

export default function TabelMahasiswa({ mahasiswaList = [] }) {
  return (
    <div className="rekap-card">

      {/* Header Judul & Link */}
      <div className="rekap-header">
        <h3 className="rekap-title">Mahasiswa</h3>
        <Link to="/dashboard/mahasiswa" className="rekap-link">
          Lihat semua
        </Link>
      </div>

      {/* Garis pemisah */}
      <div className="rekap-divider"></div>

      {/* Area isi tabel */}
      <div className="rekap-body">
        <table className="tabel-mahasiswa">
          <thead>
            <tr>
              <th>NIM</th>
              <th>Nama</th>
              <th>Angkatan</th>
            </tr>
          </thead>
          <tbody>
            {mahasiswaList.length === 0 ? (
              <tr>
                <td colSpan="3" className="tabel-kosong">
                  Belum ada data mahasiswa.
                </td>
              </tr>
            ) : (
              mahasiswaList.map((mhs) => (
                <tr key={mhs.id}>
                  <td>{mhs.nomor_induk}</td>
                  <td>{mhs.nama}</td>
                  <td>{mhs.angkatan ?? '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
