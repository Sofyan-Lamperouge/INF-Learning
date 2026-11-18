// src/pages/mahasiswa/ProfilMahasiswaPage.jsx  (rute: /profil)
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import StudentLayout from '../../components/student/StudentLayout.jsx';
import UbahFotoModal from '../../components/student/profil/UbahFotoModal.jsx';
import ProfilToast from '../../components/student/profil/ProfilToast.jsx';
import { BackIcon, CameraIcon } from '../../components/student/profil/ProfilIcons.jsx';
import { validasiFoto } from '../../components/student/profil/helpers.js';
import { useAuth } from '../../hooks/useAuth.js';
import { getProfilMahasiswa, ubahFotoProfil } from '../../services/profilService.js';

const TOAST_MS = 4500;

export default function ProfilMahasiswaPage() {
  const { user, perbaruiUser } = useAuth();

  // --- data profil (NIM & angkatan dari backend; nama & foto sudah ada di sesi) ---
  const [detail, setDetail] = useState(null);
  const [memuat, setMemuat] = useState(true);
  const [galatMuat, setGalatMuat] = useState(false);

  // --- ubah foto ---
  const inputRef = useRef(null);
  const abortRef = useRef(null);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [menyimpan, setMenyimpan] = useState(false);
  const [fotoRusak, setFotoRusak] = useState(false);

  // --- notifikasi ---
  const [toast, setToast] = useState(null);
  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), TOAST_MS);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    let batal = false;
    setMemuat(true);
    setGalatMuat(false);
    getProfilMahasiswa()
      .then((p) => !batal && setDetail(p))
      .catch(() => !batal && setGalatMuat(true))
      .finally(() => !batal && setMemuat(false));
    return () => {
      batal = true;
    };
  }, []);

  // Bersihkan URL pratinjau
  useEffect(() => () => previewUrl && URL.revokeObjectURL(previewUrl), [previewUrl]);

  function bukaPemilihFile() {
    inputRef.current?.click();
  }

  function handlePilih(e) {
    const dipilih = e.target.files?.[0];
    e.target.value = ''; // supaya file yang sama bisa dipilih lagi
    if (!dipilih) return;
    const pesan = validasiFoto(dipilih);
    if (pesan) {
      setToast({ jenis: 'gagal', detail: pesan, id: Date.now() });
      return;
    }
    setFile(dipilih);
    setPreviewUrl(URL.createObjectURL(dipilih));
  }

  const tutupModal = useCallback(() => {
    abortRef.current?.abort(); // membatalkan unggahan yang sedang berjalan
    setMenyimpan(false);
    setFile(null);
    setPreviewUrl('');
  }, []);

  async function handleSimpan() {
    if (!file || menyimpan) return;
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setMenyimpan(true);
    try {
      const hasil = await ubahFotoProfil(file, ctrl.signal);
      perbaruiUser({ foto_url: hasil.foto_url });
      setFotoRusak(false);
      setFile(null);
      setPreviewUrl('');
      setToast({ jenis: 'sukses', id: Date.now() });
    } catch (err) {
      if (ctrl.signal.aborted) return; // dibatalkan pengguna
      setFile(null);
      setPreviewUrl('');
      setToast({ jenis: 'gagal', detail: err?.message, id: Date.now() });
    } finally {
      setMenyimpan(false);
    }
  }

  const nama = user?.nama || detail?.nama || 'Mahasiswa';
  const foto = user?.foto_url || detail?.foto_url || null;
  const nim = detail?.nomor_induk ?? (galatMuat ? user?.nomor_induk : '') ?? '';
  const angkatan = detail ? detail.angkatan ?? '-' : galatMuat ? '-' : '';

  return (
    <StudentLayout>
      <section className="pf-wrap">
        <Link to="/beranda" className="pf-kembali">
          <BackIcon /> Kembali ke Beranda
        </Link>

        <header className="pf-judul">
          <h1>Profil Mahasiswa</h1>
          <p>Informasi dan identitas akun mahasiswa</p>
        </header>

        <div className={`pf-card${memuat ? ' memuat' : ''}`} aria-busy={memuat}>
          <div className="pf-foto">
            <div className="pf-avatar">
              {foto && !fotoRusak ? (
                <img src={foto} alt={`Foto profil ${nama}`} onError={() => setFotoRusak(true)} />
              ) : (
                <span aria-hidden="true">{nama.trim().charAt(0).toUpperCase()}</span>
              )}
            </div>
            <button type="button" className="pf-kamera" onClick={bukaPemilihFile} aria-label="Ubah foto profil">
              <CameraIcon />
            </button>
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              hidden
              onChange={handlePilih}
            />
          </div>

          <div className="pf-garis" aria-hidden="true" />

          <div className="pf-info">
            <h2>Informasi Mahasiswa</h2>
            <dl>
              <div className="pf-baris"><dt>Nama</dt><dd>{nama}</dd></div>
              <div className="pf-baris"><dt>NIM</dt><dd>{nim}</dd></div>
              <div className="pf-baris"><dt>Angkatan</dt><dd>{angkatan}</dd></div>
            </dl>
            {galatMuat && (
              <p className="pf-galat" role="alert">Sebagian data belum dapat dimuat. Muat ulang halaman untuk mencoba lagi.</p>
            )}
          </div>
        </div>
      </section>

      {file && (
        <UbahFotoModal
          file={file}
          previewUrl={previewUrl}
          menyimpan={menyimpan}
          onGanti={bukaPemilihFile}
          onBatal={tutupModal}
          onSimpan={handleSimpan}
        />
      )}

      <ProfilToast toast={toast} />
    </StudentLayout>
  );
}
