// src/components/student/profil/ProfilToast.jsx
// Notifikasi di kanan-bawah: berhasil (hijau) / gagal (merah).
// `detail` (opsional) = alasan singkat di bawah judul; hilangkan jika tidak diperlukan.
import { CheckIcon, CrossIcon } from './ProfilIcons.jsx';

// Tertutup otomatis oleh halaman (4,5 detik); desain tidak memiliki tombol tutup.
export default function ProfilToast({ toast }) {
  if (!toast) return null;
  const ok = toast.jenis === 'sukses';
  return (
    <div className={`pf-toast ${ok ? 'pf-toast-ok' : 'pf-toast-gagal'}`} role={ok ? 'status' : 'alert'}>
      <span className="pf-toast-bar" />
      <span className="pf-toast-ikon">{ok ? <CheckIcon /> : <CrossIcon />}</span>
      <div className="pf-toast-teks">
        <strong>{ok ? 'Foto Profil Berhasil Diperbarui!' : 'Foto Profil Gagal Diperbarui!'}</strong>
        {toast.detail && <span>{toast.detail}</span>}
      </div>
    </div>
  );
}
