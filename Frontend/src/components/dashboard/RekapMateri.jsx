import { Link } from 'react-router-dom';

const SEMESTER_COLORS = {
  1: 'semester-1',
  2: 'semester-2',
  3: 'semester-3',
  4: 'semester-4',
  5: 'semester-5',
  6: 'semester-6',
  7: 'semester-7',
  8: 'semester-8',
};

function getFileName(fileUrl, fallbackType) {
  if (!fileUrl) return '';

  try {
    const pathname = new URL(fileUrl, window.location.origin).pathname;
    const encodedName = pathname.split('/').filter(Boolean).pop() || '';
    const storedName = decodeURIComponent(encodedName);

    // Hapus awalan UUID yang ditambahkan backend agar nama file tetap unik.
    return storedName.replace(/^[a-f0-9]{32}_/i, '') || storedName;
  } catch {
    return fallbackType
      ? `File ${fallbackType.toUpperCase()}`
      : 'File materi';
  }
}

function formatSemester(semester) {
  const value = Number(semester);

  return Number.isInteger(value) && value > 0
    ? `Semester ${value}`
    : '—';
}

export default function RekapMateri({ materiList = [] }) {
  return (
    <section className="rekap-card rekap-materi-card">
      <header className="rekap-header">
        <h3 className="rekap-title">Rekap Materi</h3>

        <Link to="/dashboard/materi" className="rekap-link">
          Lihat semua
        </Link>
      </header>

      <div className="rekap-divider" />

      {materiList.length === 0 ? (
        <div className="rekap-empty">
          <p className="rekap-empty-text">
            Belum ada materi yang ditambahkan
          </p>

          <Link to="/dashboard/materi" className="btn-tambah">
            + Tambahkan materi
          </Link>
        </div>
      ) : (
        <div className="rekap-materi-table-wrap">
          <table className="rekap-materi-table">
            <thead>
              <tr>
                <th scope="col">No</th>
                <th scope="col">Semester</th>
                <th scope="col">Mata Kuliah</th>
                <th scope="col">Nama Materi</th>
                <th scope="col">File</th>
              </tr>
            </thead>

            <tbody>
              {materiList.map((item, index) => {
                const filename = getFileName(item.url, item.jenis);
                const semester = Number(item.semester);

                return (
                  <tr key={item.id}>
                    <td data-label="No">{index + 1}</td>

                    <td data-label="Semester">
                      <span
                        className={`rekap-semester-badge ${
                          SEMESTER_COLORS[semester] || 'semester-default'
                        }`}
                      >
                        {formatSemester(item.semester)}
                      </span>
                    </td>

                    <td data-label="Mata Kuliah">
                      {item.mata_kuliah || '—'}
                    </td>

                    <td
                      data-label="Nama Materi"
                      className="rekap-materi-name"
                    >
                      {item.judul || '—'}
                    </td>

                    <td data-label="File">
                      {item.url && filename ? (
                        <a
                          className="rekap-file-link"
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          title={`Buka ${filename}`}
                        >
                          {filename}
                        </a>
                      ) : (
                        <span className="rekap-file-missing">
                          File tidak tersedia
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}