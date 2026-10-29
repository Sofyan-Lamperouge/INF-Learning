import { Link } from 'react-router-dom';

export default function RekapKuis({ kuisList = [] }) {
  const kuisTerbaru = kuisList.slice(0, 5);

  return (
    <section className="rekap-card rekap-table-card">
      <header className="rekap-header">
        <h3 className="rekap-title">Rekap Kuis</h3>

        <Link to="/dashboard/kuis" className="rekap-link">
          Lihat semua
        </Link>
      </header>

      <div className="rekap-divider" />

      <div className="rekap-body">
        <div className="rekap-dashboard-table-wrap">
          <table className="rekap-dashboard-table">
            <thead>
              <tr>
                <th scope="col">No</th>
                <th scope="col">Nama Kuis</th>
              </tr>
            </thead>

            <tbody>
              {kuisTerbaru.length === 0 ? (
                <tr>
                  <td colSpan={2} className="rekap-table-empty">
                    Belum ada data kuis.
                  </td>
                </tr>
              ) : (
                kuisTerbaru.map((item, index) => (
                  <tr key={item.id ?? `${item.judul}-${index}`}>
                    <td className="rekap-number-cell">{index + 1}</td>
                    <td className="rekap-table-name">
                      {item.judul || item.nama || '—'}
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