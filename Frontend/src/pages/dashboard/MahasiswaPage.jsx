import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout.jsx';
import MahasiswaConfirmModal from '../../components/mahasiswa/MahasiswaConfirmModal.jsx';
import MahasiswaDeleteModal from '../../components/mahasiswa/MahasiswaDeleteModal.jsx';
import MahasiswaFormModal from '../../components/mahasiswa/MahasiswaFormModal.jsx';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EditIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
  UsersIcon,
} from '../../components/mahasiswa/MahasiswaIcons.jsx';
import MahasiswaSuccessModal from '../../components/mahasiswa/MahasiswaSuccessModal.jsx';
import MahasiswaTooltip from '../../components/mahasiswa/MahasiswaTooltip.jsx';
import {
  createMahasiswa,
  deleteMahasiswa,
  getMahasiswaList,
  updateMahasiswa,
} from '../../services/mahasiswaService.js';
import {
  getAngkatanOptions,
  getAngkatanTone,
  getStatusKey,
  getStatusLabel,
  isAktif,
  STATUS_FILTER_OPTIONS,
  toFormValues,
} from '../../utils/mahasiswaStatus.js';

const PAGE_SIZE = 20;
const ANGKATAN_OPTIONS = getAngkatanOptions(null, 16);

// Sesuai Figma: ikon hapus abu-abu (nonaktif/tidak bisa diklik) pada mahasiswa Aktif,
// dan merah pada mahasiswa Non-aktif. Ubah ke false jika semua mahasiswa boleh dihapus.
const HANYA_NONAKTIF_BISA_DIHAPUS = true;

const EMPTY_FORM = { nomor_induk: '', nama: '', angkatan: '', status: 'nonaktif' };

function canDelete(mahasiswa) {
  return !HANYA_NONAKTIF_BISA_DIHAPUS || !isAktif(mahasiswa.status);
}

export default function MahasiswaPage() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [angkatan, setAngkatan] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);

  // Alur pop up: null | form | confirm | added | updated | delete | deleted
  const [modal, setModal] = useState(null);
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState(EMPTY_FORM);
  const [target, setTarget] = useState(null);
  const [deletedName, setDeletedName] = useState('');
  const [busy, setBusy] = useState(false);
  const [modalError, setModalError] = useState('');
  const [tip, setTip] = useState(null); // DOMRect ikon hapus yang di-hover

  // Debounce pencarian agar tidak request ke backend untuk setiap ketikan.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);

    return () => window.clearTimeout(timer);
  }, [searchInput]);

  // Ambil data mahasiswa dari backend setiap filter atau halaman berubah.
  useEffect(() => {
    let active = true;

    async function loadMahasiswa() {
      setLoading(true);
      setError('');

      try {
        const result = await getMahasiswaList({
          q: search,
          angkatan,
          status,
          page,
          limit: PAGE_SIZE,
        });

        if (!active) return;

        setItems(Array.isArray(result.items) ? result.items : []);
        setTotal(Number(result.total) || 0);
        setTotalPages(Math.max(Number(result.total_pages) || 1, 1));
      } catch (loadError) {
        if (active) {
          setError(
            loadError.message
            || 'Data mahasiswa gagal dimuat. Periksa koneksi ke backend.',
          );
          setItems([]);
          setTotal(0);
          setTotalPages(1);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadMahasiswa();

    return () => {
      active = false;
    };
  }, [search, angkatan, status, page, reloadKey]);

  // Sembunyikan tooltip saat halaman di-scroll / diubah ukurannya.
  useEffect(() => {
    if (!tip) return undefined;
    const hide = () => setTip(null);
    window.addEventListener('scroll', hide, true);
    window.addEventListener('resize', hide);
    return () => {
      window.removeEventListener('scroll', hide, true);
      window.removeEventListener('resize', hide);
    };
  }, [tip]);

  const reload = () => setReloadKey((current) => current + 1);

  function closeModal() {
    if (busy) return;
    setModal(null);
    setEditing(null);
    setTarget(null);
    setModalError('');
  }

  function openCreateModal() {
    setEditing(null);
    setDraft(EMPTY_FORM);
    setModalError('');
    setModal('form');
  }

  function openEditModal(mahasiswa) {
    setEditing(mahasiswa);
    setDraft(toFormValues(mahasiswa));
    setModalError('');
    setModal('form');
  }

  function openDeleteModal(mahasiswa) {
    if (!canDelete(mahasiswa)) return;
    setTarget(mahasiswa);
    setModalError('');
    setModal('delete');
  }

  // Submit form (tambah / edit) -> selalu ke pop up konfirmasi dulu.
  function handleFormSubmit(values) {
    setDraft(values);
    setModalError('');
    setModal('confirm');
  }

  async function handleUpdateConfirm() {
    if (!editing) return;

    const original = toFormValues(editing);
    const payload = { nama: draft.nama, angkatan: Number(draft.angkatan) };
    if (draft.status !== original.status) payload.status = draft.status;

    setBusy(true);
    setModalError('');

    try {
      await updateMahasiswa(editing.id, payload);
      setModal('updated');
      reload();
    } catch (saveError) {
      setModalError(saveError.message || 'Data mahasiswa gagal disimpan. Silakan coba lagi.');
    } finally {
      setBusy(false);
    }
  }

  async function handleCreateConfirm() {
    setBusy(true);
    setModalError('');

    try {
      await createMahasiswa({
        nomor_induk: draft.nomor_induk,
        nama: draft.nama,
        angkatan: Number(draft.angkatan),
      });
      setModal('added');
      setPage(1);
      reload();
    } catch (saveError) {
      setModalError(saveError.message || 'Data mahasiswa gagal disimpan. Silakan coba lagi.');
    } finally {
      setBusy(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!target || busy) return;

    setBusy(true);
    setModalError('');

    try {
      await deleteMahasiswa(target.id);
      setDeletedName(target.nama);
      setModal('deleted');
      setTarget(null);
      // Jika yang dihapus adalah item terakhir di halaman > 1, mundur satu halaman.
      if (items.length === 1 && page > 1) setPage((current) => current - 1);
      reload();
    } catch (deleteError) {
      setModalError(deleteError.message || 'Mahasiswa gagal dihapus. Silakan coba lagi.');
    } finally {
      setBusy(false);
    }
  }

  function changeFilter(setter, value) {
    setter(value);
    setPage(1);
  }

  function resetFilters() {
    setSearchInput('');
    setSearch('');
    setAngkatan('');
    setStatus('');
    setPage(1);
  }

  const hasFilter = Boolean(search || angkatan || status);

  function renderBody() {
    if (loading) {
      return (
        <tr>
          <td colSpan="6" className="mahasiswa-table-message">
            <div className="mahasiswa-empty">
              <p>Memuat data mahasiswa...</p>
            </div>
          </td>
        </tr>
      );
    }

    if (error) {
      return (
        <tr>
          <td colSpan="6" className="mahasiswa-table-message">
            <div className="mahasiswa-empty">
              <p>Data mahasiswa belum dapat ditampilkan.</p>
            </div>
          </td>
        </tr>
      );
    }

    if (items.length === 0) {
      return (
        <tr>
          <td colSpan="6" className="mahasiswa-table-message">
            <div className="mahasiswa-empty">
              <span className="mahasiswa-empty-icon"><SearchIcon /></span>
              {hasFilter ? (
                <>
                  <p>Tidak ada mahasiswa yang cocok dengan pencarian.</p>
                  <button type="button" className="mahasiswa-empty-button" onClick={resetFilters}>
                    Reset filter
                  </button>
                </>
              ) : (
                <>
                  <p>Belum ada mahasiswa yang ditambahkan</p>
                  <button type="button" className="mahasiswa-empty-button" onClick={openCreateModal}>
                    <PlusIcon />
                    Tambahkan Mahasiswa
                  </button>
                </>
              )}
            </div>
          </td>
        </tr>
      );
    }

    return items.map((mahasiswa, index) => {
      const deletable = canDelete(mahasiswa);

      return (
        <tr key={mahasiswa.id}>
          <td className="col-no">{(page - 1) * PAGE_SIZE + index + 1}</td>
          <td className="col-status">
            <span className={`mahasiswa-status mahasiswa-status--${getStatusKey(mahasiswa.status)}`}>
              {getStatusLabel(mahasiswa.status)}
            </span>
          </td>
          <td className="col-nim">{mahasiswa.nomor_induk}</td>
          <td className="mahasiswa-name" title={mahasiswa.nama}>{mahasiswa.nama}</td>
          <td className="col-angkatan">
            {mahasiswa.angkatan ? (
              <span className={`mahasiswa-year mahasiswa-year--tone-${getAngkatanTone(mahasiswa.angkatan)}`}>
                {mahasiswa.angkatan}
              </span>
            ) : '—'}
          </td>
          <td className="col-aksi">
            <div className="mahasiswa-row-actions">
              <button
                className="mahasiswa-action mahasiswa-action--edit"
                type="button"
                aria-label={`Edit ${mahasiswa.nama}`}
                onClick={() => openEditModal(mahasiswa)}
              >
                <EditIcon />
              </button>
              <button
                className={`mahasiswa-action mahasiswa-action--delete${deletable ? '' : ' is-disabled'}`}
                type="button"
                aria-label={`Hapus ${mahasiswa.nama}`}
                aria-disabled={!deletable}
                aria-describedby={!deletable && tip ? 'mahasiswa-tooltip' : undefined}
                onClick={() => openDeleteModal(mahasiswa)}
                onMouseEnter={deletable ? undefined : (event) => setTip(event.currentTarget.getBoundingClientRect())}
                onFocus={deletable ? undefined : (event) => setTip(event.currentTarget.getBoundingClientRect())}
                onMouseLeave={deletable ? undefined : () => setTip(null)}
                onBlur={deletable ? undefined : () => setTip(null)}
              >
                <TrashIcon />
              </button>
            </div>
          </td>
        </tr>
      );
    });
  }

  return (
    <DashboardLayout>
      <section className="mahasiswa-page">
        <header className="mahasiswa-header">
          <div className="mahasiswa-header-info">
            <div className="mahasiswa-header-icon">
              <UsersIcon />
            </div>

            <div>
              <h1>Daftar Mahasiswa</h1>
              <p>Pantau dan kelola data seluruh mahasiswa.</p>
            </div>
          </div>

          <button className="mahasiswa-add-button" type="button" onClick={openCreateModal}>
            <PlusIcon />
            Tambah mahasiswa
          </button>
        </header>

        <div className="mahasiswa-content">
          <div className="mahasiswa-filters">
            <label className="mahasiswa-filter">
              <span className="visually-hidden">Filter angkatan</span>
              <select
                className="mahasiswa-select"
                value={angkatan}
                onChange={(event) => changeFilter(setAngkatan, event.target.value)}
              >
                <option value="">Semua Angkatan</option>
                {ANGKATAN_OPTIONS.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </label>

            <label className="mahasiswa-filter">
              <span className="visually-hidden">Filter status</span>
              <select
                className="mahasiswa-select"
                value={status}
                onChange={(event) => changeFilter(setStatus, event.target.value)}
              >
                <option value="">Semua Status</option>
                {STATUS_FILTER_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>

            <label className="mahasiswa-search">
              <span className="mahasiswa-search-icon"><SearchIcon /></span>
              <span className="visually-hidden">Cari mahasiswa</span>
              <input
                type="search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Cari nama atau NIM..."
              />
            </label>
          </div>

          {error && (
            <div className="mahasiswa-error" role="alert">{error}</div>
          )}

          <div className="mahasiswa-table-wrap">
            <table className="mahasiswa-table">
              <thead>
                <tr>
                  <th scope="col" className="col-no">No</th>
                  <th scope="col" className="col-status">Status</th>
                  <th scope="col" className="col-nim">NIM</th>
                  <th scope="col">Nama</th>
                  <th scope="col" className="col-angkatan">Angkatan</th>
                  <th scope="col" className="col-aksi">Aksi</th>
                </tr>
              </thead>
              <tbody>{renderBody()}</tbody>
            </table>
          </div>
        </div>

        <footer className="mahasiswa-footer">
          <p>Menampilkan {items.length} dari {total} mahasiswa</p>

          <nav className="mahasiswa-pagination" aria-label="Paginasi mahasiswa">
            <button
              type="button"
              aria-label="Halaman sebelumnya"
              disabled={page <= 1 || loading}
              onClick={() => setPage((current) => Math.max(current - 1, 1))}
            >
              <ChevronLeftIcon />
            </button>
            <span>{page}</span>
            <button
              type="button"
              aria-label="Halaman berikutnya"
              disabled={page >= totalPages || loading}
              onClick={() => setPage((current) => Math.min(current + 1, totalPages))}
            >
              <ChevronRightIcon />
            </button>
          </nav>
        </footer>
      </section>

      {modal === 'form' && (
        <MahasiswaFormModal
          key={editing ? `edit-${editing.id}` : 'create'}
          mode={editing ? 'edit' : 'create'}
          initialValues={draft}
          original={editing ? toFormValues(editing) : null}
          statusLocked={editing?.status === 'belum_aktif'}
          error={modalError}
          onSubmit={handleFormSubmit}
          onClose={closeModal}
        />
      )}

      {modal === 'confirm' && (
        <MahasiswaConfirmModal
          mode={editing ? 'edit' : 'create'}
          values={draft}
          original={editing ? toFormValues(editing) : null}
          busy={busy}
          error={modalError}
          onBack={() => { setModalError(''); setModal('form'); }}
          onConfirm={editing ? handleUpdateConfirm : handleCreateConfirm}
          onClose={closeModal}
        />
      )}

      {modal === 'added' && (
        <MahasiswaSuccessModal title="Mahasiswa Berhasil Ditambahkan!" onClose={closeModal}>
          Data mahasiswa telah disimpan ke dalam sistem!
        </MahasiswaSuccessModal>
      )}

      {modal === 'updated' && (
        <MahasiswaSuccessModal title="Data Berhasil Diperbarui!" onClose={closeModal}>
          Perubahan data mahasiswa telah disimpan ke dalam sistem!
        </MahasiswaSuccessModal>
      )}

      {modal === 'delete' && target && (
        <MahasiswaDeleteModal
          mahasiswa={target}
          busy={busy}
          error={modalError}
          onCancel={closeModal}
          onConfirm={handleDeleteConfirm}
        />
      )}

      {modal === 'deleted' && (
        <MahasiswaSuccessModal
          title="Mahasiswa Berhasil Dihapus!"
          withButton={false}
          autoCloseMs={2200}
          onClose={closeModal}
        >
          Data <strong>&ldquo;{deletedName}&rdquo;</strong> telah dihapus dari sistem!
        </MahasiswaSuccessModal>
      )}
      {tip && (
        <MahasiswaTooltip anchor={tip}>
          Hapus mahasiswa harus
          <br />
          berstatus Non-aktif
        </MahasiswaTooltip>
      )}
    </DashboardLayout>
  );
}
