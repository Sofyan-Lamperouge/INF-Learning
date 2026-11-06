// src/components/common/OfflineBanner.jsx
import { useOnlineStatus } from '../../hooks/useOnlineStatus.js';

export default function OfflineBanner() {
  if (useOnlineStatus()) return null;
  return (
    <div className="offline-banner" role="alert">
      Koneksi internet terputus. Data mungkin gagal dimuat, periksa jaringan Anda.
    </div>
  );
}