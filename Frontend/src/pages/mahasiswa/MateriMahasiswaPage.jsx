// src/pages/mahasiswa/MateriMahasiswaPage.jsx
// Halaman Materi mahasiswa. URL: /materi  (?semester=5&mk=Manajemen%20Proyek)
//
// Alur:
//   1. Muat 8 semester                    -> GET /materi/kategori/semester
//   2. Pilih semester -> kartu mata kuliah -> GET /materi/kategori/mata-kuliah?semester=N
//   3. "Lihat Detail" -> tabel materi      -> GET /materi?semester=N&mata_kuliah=...
//   4. "Lihat" -> buka file + catat progres -> POST /materi/{id}/progres
//
// Pilihan disimpan di URL (query string) sehingga tombol Back browser & refresh tetap benar.

import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import StudentLayout from '../../components/student/StudentLayout.jsx';
import SemesterGrid from '../../components/student/materi/SemesterGrid.jsx';
import MataKuliahGrid from '../../components/student/materi/MataKuliahGrid.jsx';
import MateriTable from '../../components/student/materi/MateriTable.jsx';
import { ArrowLeftIcon } from '../../components/student/materi/MateriIcons.jsx';
import {
  getKategoriSemester,
  getKategoriMataKuliah,
  getMateriMataKuliah,
} from '../../services/materiMahasiswaService.js';
import { catatProgres } from '../../services/dashboardMahasiswaService.js';

export default function MateriMahasiswaPage() {
  const [params, setParams] = useSearchParams();
  const semesterParam = Number(params.get('semester'));
  const semester =
    Number.isInteger(semesterParam) && semesterParam >= 1 && semesterParam <= 8
      ? semesterParam
      : null;
  const mataKuliah = params.get('mk') || '';

  const [semesterList, setSemesterList] = useState([]);
  const [mkList, setMkList] = useState([]);
  const [materiList, setMateriList] = useState([]);

  const [loadingSemester, setLoadingSemester] = useState(true);
  const [loadingMk, setLoadingMk] = useState(false);
  const [loadingMateri, setLoadingMateri] = useState(false);
  const [error, setError] = useState('');

  // 1) Daftar semester (sekali)
  useEffect(() => {
    let active = true;

    getKategoriSemester()
      .then((data) => {
        if (!active) return;
        setSemesterList(data.items || []);

        // Tanpa pilihan di URL: buka semester pertama yang punya materi (atau semester 1).
        if (!semester) {
          const pertama =
            (data.items || []).find((s) => s.total_materi > 0)?.semester || 1;
          setParams({ semester: String(pertama) }, { replace: true });
        }
      })
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoadingSemester(false));

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2) Mata kuliah pada semester terpilih
  useEffect(() => {
    if (!semester) return undefined;
    let active = true;

    setLoadingMk(true);
    setError('');
    getKategoriMataKuliah(semester)
      .then((data) => active && setMkList(data.items || []))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoadingMk(false));

    return () => {
      active = false;
    };
  }, [semester]);

  // 3) Materi pada mata kuliah terpilih
  useEffect(() => {
    if (!semester || !mataKuliah) {
      setMateriList([]);
      return undefined;
    }
    let active = true;

    setLoadingMateri(true);
    setError('');
    getMateriMataKuliah(semester, mataKuliah)
      .then((data) => active && setMateriList(data.items || []))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoadingMateri(false));

    return () => {
      active = false;
    };
  }, [semester, mataKuliah]);

  function pilihSemester(nomor) {
    setParams({ semester: String(nomor) });
  }

  function bukaDetail(namaMk) {
    setParams({ semester: String(semester), mk: namaMk });
  }

  function kembaliKeMataKuliah() {
    setParams({ semester: String(semester) });
  }

  // 4) Buka file + catat progres (hanya jika belum pernah dilihat)
  function handleLihat(materi) {
    window.open(materi.url, '_blank', 'noopener,noreferrer');

    if (materi.status_belajar === 'belum') {
      catatProgres(materi.id, 'dilihat')
        .then(() =>
          setMateriList((daftar) =>
            daftar.map((m) =>
              m.id === materi.id ? { ...m, status_belajar: 'dilihat' } : m,
            ),
          ),
        )
        .catch(() => {}); // gagal mencatat progres tidak boleh menghalangi membuka file
    }
  }

  const modeDetail = Boolean(mataKuliah);

  return (
    <StudentLayout>
      {error && (
        <p className="sd-alert" role="alert">
          {error}
        </p>
      )}

      <SemesterGrid
        items={semesterList}
        aktif={semester}
        tampilkan={modeDetail ? 'materi' : 'mata_kuliah'}
        loading={loadingSemester}
        onPilih={pilihSemester}
      />

      <section className="sm-panel">
        <header className="sm-panel-header">
          {modeDetail && (
            <button
              type="button"
              className="sm-back"
              onClick={kembaliKeMataKuliah}
              aria-label="Kembali ke daftar mata kuliah"
            >
              <ArrowLeftIcon />
            </button>
          )}
          <h2 className="sm-panel-title">
            {modeDetail
              ? `${mataKuliah} - Semester ${semester}`
              : `Mata Kuliah - Semester ${semester ?? ''}`}
          </h2>
        </header>

        {modeDetail ? (
          <MateriTable
            items={materiList}
            loading={loadingMateri}
            onLihat={handleLihat}
          />
        ) : (
          <MataKuliahGrid
            semester={semester}
            items={mkList}
            loading={loadingSemester || loadingMk}
            onDetail={bukaDetail}
          />
        )}
      </section>
    </StudentLayout>
  );
}
