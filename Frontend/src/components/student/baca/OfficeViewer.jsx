// src/components/student/baca/OfficeViewer.jsx
// Pratinjau DOCX/PPTX lewat viewer Office Online. Alamat iframe datang dari backend (url_pratinjau).
import { useEffect, useState } from 'react';
import { DownloadIcon } from './BacaIcons.jsx';

export default function OfficeViewer({ src, namaFile, onUnduh, mengunduh }) {
  const [memuat, setMemuat] = useState(true);
  const [lama, setLama] = useState(false);

  // Dokumen berubah -> mulai lagi dari "memuat"
  useEffect(() => {
    setMemuat(true);
    setLama(false);
    const t = setTimeout(() => setLama(true), 15000); // 15 dtk belum tampil -> beri petunjuk
    return () => clearTimeout(t);
  }, [src]);

  return (
    <section className="bm-viewer">
      <div className="bm-area bm-area-office">
        {memuat && (
          <p className="bm-status bm-status-office">
            Memuat dokumen...
            {lama && (
              <>
                <br />
                <small>Terlalu lama? Dokumen mungkin tidak bisa ditampilkan, silakan unduh materi.</small>
              </>
            )}
          </p>
        )}
        <iframe
          key={src}
          title={namaFile}
          src={src}
          className="bm-iframe"
          onLoad={() => setMemuat(false)}
          allowFullScreen
        />
      </div>
      <div className="bm-footer bm-footer-office">
        <span>{namaFile}</span>
        <button type="button" className="bm-btn-unduh" onClick={onUnduh} disabled={mengunduh}>
          <DownloadIcon /> {mengunduh ? 'Mengunduh...' : 'Unduh materi'}
        </button>
      </div>
    </section>
  );
}