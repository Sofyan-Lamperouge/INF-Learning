// src/components/student/baca/DownloadToast.jsx
import { CheckIcon, CrossIcon, CloseIcon } from './BacaIcons.jsx';

export default function DownloadToast({ status, info, onTutup }) {
  if (status !== 'success' && status !== 'error') return null;
  const ok = status === 'success';
  return (
    <div
      className={`bm-toast ${ok ? 'bm-toast-ok' : 'bm-toast-gagal'}`}
      role={ok ? 'status' : 'alert'}
    >
      <span className="bm-toast-bar" />
      <span className="bm-toast-ikon">{ok ? <CheckIcon /> : <CrossIcon />}</span>
      <div className="bm-toast-teks">
        <strong>{ok ? 'File Berhasil Diunduh!' : 'Gagal Mengunduh File'}</strong>
        <span>
          {ok
            ? `${info?.nama || ''}${info?.ukuran ? ` (${info.ukuran})` : ''}`
            : 'Terjadi kesalahan. Silakan coba lagi.'}
        </span>
      </div>
      <button type="button" className="bm-toast-tutup" onClick={onTutup} aria-label="Tutup">
        <CloseIcon />
      </button>
    </div>
  );
}
