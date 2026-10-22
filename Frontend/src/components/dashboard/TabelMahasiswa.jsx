// src/components/dashboard/TabelMahasiswa.jsx

import { Link } from 'react-router-dom';

export default function TabelMahasiswa({ mahasiswaList = [] }) {
  return (
    //  Bungkus dengan class rekap-card (sama seperti Rekap Kuis)
    <div className="rekap-card">
      
      {/* Header Judul & Link */}
      <div className="rekap-header">
        <h3 className="rekap-title">Mahasiswa</h3>
        <a href="/dashboard/mahasiswa" className="rekap-link">Lihat semua</a>
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
            {/*
             JIKA DATA KOSONG */}
            {mahasiswaList.length === 0 ? (
              <tr>
                <td colSpan="3" className="tabel-kosong">
                  Belum ada data mahasiswa dari backend.
                </td>
              </tr>
            ) : (
              /* ✅ JIKA DATA ADA */
              mahasiswaList.map((mhs, index) => (
                <tr key={mhs.id || mhs.nomor_induk || index}>
                  <td>{mhs.nomor_induk || mhs.nim}</td>
                  <td>{mhs.nama}</td>
                  <td>{mhs.angkatan}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
