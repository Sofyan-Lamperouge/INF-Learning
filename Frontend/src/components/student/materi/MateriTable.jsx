// src/components/student/materi/MateriTable.jsx
// Tabel materi satu mata kuliah: No | Nama Materi | File | Tanggal Upload | Aksi

import { CalendarIcon, DownloadIcon, EyeIcon } from './MateriIcons.jsx';
import { formatTanggal, namaFile } from './helpers.js';

export default function MateriTable({
  items = [],
  loading = false,
  onLihat,
}) {
  return (
    <div className="sm-table-box">
      <div className="sm-table-scroll">
        <table className="sm-table">
          <colgroup>
            <col className="sm-col-no" />
            <col className="sm-col-nama" />
            <col className="sm-col-file" />
            <col className="sm-col-tgl" />
            <col className="sm-col-aksi" />
          </colgroup>

          <thead>
            <tr>
              <th className="sm-th-no">No</th>
              <th>Nama Materi</th>
              <th className="sm-hide-sm">File</th>
              <th className="sm-hide-xs">Tanggal Upload</th>
              <th>Aksi</th>
            </tr>
          </thead>

          <tbody>
            {loading &&
              [1, 2, 3, 4].map((n) => (
                <tr key={n}>
                  <td colSpan={5}>
                    <div className="sm-skel sm-row-skel" />
                  </td>
                </tr>
              ))}

            {!loading && items.length === 0 && (
              <tr>
                <td colSpan={5} className="sm-table-empty">
                  Belum ada materi pada mata kuliah ini.
                </td>
              </tr>
            )}

            {!loading &&
              items.map((materi, index) => (
                <tr key={materi.id}>
                  <td className="sm-td-no">{index + 1}</td>
                  <td className="sm-td-nama" title={materi.judul}>
                    {materi.judul}
                  </td>
                  <td className="sm-td-file sm-hide-sm">
                    {namaFile(materi.url, materi.jenis)}
                  </td>
                  <td className="sm-td-tgl sm-hide-xs">
                    <CalendarIcon />
                    {formatTanggal(materi.dibuat_pada)}
                  </td>
                  <td className="sm-td-aksi">
                    <button
                      type="button"
                      className="sm-btn-lihat"
                      onClick={() => onLihat?.(materi)}
                    >
                      <EyeIcon />
                      Lihat
                    </button>
                    <a
                      className="sm-btn-unduh"
                      href={materi.url}
                      download
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Unduh ${materi.judul}`}
                    >
                      <DownloadIcon />
                    </a>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="sm-table-footer">{loading ? '' : `${items.length} Materi`}</div>
    </div>
  );
}
