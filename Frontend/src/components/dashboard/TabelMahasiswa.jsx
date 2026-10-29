import { Link } from 'react-router-dom';

export default function TabelMahasiswa({ mahasiswaList = [] }) {
  const mahasiswaTerbaru = mahasiswaList.slice(0, 5);

  return (
    <section className="rekap-card rekap-table-card">
      <header className="rekap-header">
        <h3 className="rekap-title">Mahasiswa</h3>

        <Link to="/dashboard/mahasiswa" className="rekap-link">
          Lihat semua
        </Link>
      </header>

      <div className="rekap-divider" />

      <div className="rekap-body">
        <div className="rekap-dashboard-table-wrap">
          <table className="rekap-dashboard-table">
            <thead>
              <tr>
                <th scope="col">NIM</th>
                <th scope="col">Nama</th>
                <th scope="col">Angkatan</th>
              </tr>
            </thead>

            <tbody>
              {mahasiswaTerbaru.length === 0 ? (
                <tr>
                  <td colSpan={3} className="rekap-table-empty">
                    Belum ada data mahasiswa.
                  </td>
                </tr>
              ) : (
                mahasiswaTerbaru.map((mahasiswa, index) => (
                  <tr key={mahasiswa.id ?? mahasiswa.nomor_induk ?? index}>
                    <td>{mahasiswa.nomor_induk || '—'}</td>
                    <td className="rekap-table-name">
                      {mahasiswa.nama || '—'}
                    </td>
                    <td>
                      {mahasiswa.angkatan ? (
                        <span className="rekap-angkatan-badge">
                          {mahasiswa.angkatan}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}