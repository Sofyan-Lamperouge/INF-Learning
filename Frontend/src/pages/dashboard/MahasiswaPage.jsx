import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout.jsx';
import {
  createMahasiswa,
  deleteMahasiswa,
  getMahasiswaList,
  updateMahasiswa,
} from '../../services/mahasiswaService.js';

const PAGE_SIZE = 20;
const STATUS_OPTIONS = [
  { value: 'belum_aktif', label: 'Belum aktif' },
  { value: 'aktif', label: 'Aktif' },
  { value: 'nonaktif', label: 'Non-aktif' },
];

function getStatusLabel(status) {
  return STATUS_OPTIONS.find((option) => option.value === status)?.label
    || status
    || 'Tidak diketahui';
}

function UserIcon() {
  return (
    <svg viewBox="0 0 50 43" fill="none" aria-hidden="true">
      <path
        d="M22.87 26.97a11 11 0 1 0-13.22 0A18 18 0 0 0 1.4 34.5a1.8 1.8 0 0 0 3 2A14 14 0 0 1 16.26 29a14 14 0 0 1 11.6 7.5 1.8 1.8 0 0 0 3-2 18 18 0 0 0-8-7.53ZM7.52 17a8.74 8.74 0 1 1 17.48 0 8.74 8.74 0 0 1-17.48 0ZM49.28 34.5a21 21 0 0 0-8.92-7.53 12 12 0 0 0-8.07-21.1 1.8 1.8 0 0 0 .1 3.6 8.74 8.74 0 0 1 3.7 16.65 1.8 1.8 0 0 0 .8 3.4 17 17 0 0 1 9.36 7 1.8 1.8 0 0 0 3.03-2Z"
        fill="currentColor"
      />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9M16 3l5 5M10 14l8.5-8.5a2.12 2.12 0 0 1 3 3L13 17l-4 1 1-4Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 7h16M10 11v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function MahasiswaPage() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [angkatan, setAngkatan] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);

  const [editingMahasiswa, setEditingMahasiswa] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({
    nomor_induk: '',
    nama: '',
    angkatan: '',
    status: 'belum_aktif',
  });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const [deletingMahasiswa, setDeletingMahasiswa] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const [deleting, setDeleting] = useState(false);

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

  function openCreateModal() {
    setEditingMahasiswa(null);
    setForm({
      nomor_induk: '',
      nama: '',
      angkatan: '',
      status: 'belum_aktif',
    });
    setFormError('');
    setFormOpen(true);
  }

  function openEditModal(mahasiswa) {
    setEditingMahasiswa(mahasiswa);
    setForm({
      nomor_induk: mahasiswa.nomor_induk || '',
      nama: mahasiswa.nama || '',
      angkatan: mahasiswa.angkatan ? String(mahasiswa.angkatan) : '',
      status: mahasiswa.status || 'belum_aktif',
    });
    setFormError('');
    setFormOpen(true);
  }

  function closeFormModal() {
    if (saving) return;
    setFormOpen(false);
    setEditingMahasiswa(null);
    setFormError('');
  }

  function handleFormChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setFormError('');
  }

  async function handleSave(event) {
    event.preventDefault();
    setFormError('');
    setNotice('');

    const nim = form.nomor_induk.trim();
    const nama = form.nama.trim();
    const tahun = Number(form.angkatan);

    if (!editingMahasiswa && !/^2\d88\d{6}$/.test(nim)) {
      setFormError('Format NIM tidak sesuai. Pastikan NIM berisi 10 digit yang valid.');
      return;
    }

    if (nama.length < 3) {
      setFormError('Nama mahasiswa minimal 3 karakter.');
      return;
    }

    if (!form.angkatan || !Number.isInteger(tahun) || tahun < 1900) {
      setFormError('Angkatan harus diisi dengan tahun yang valid.');
      return;
    }

    const payload = {
      nama,
      angkatan: tahun,
    };

    if (editingMahasiswa) {
      payload.status = form.status;
    } else {
      payload.nomor_induk = nim;
    }

    setSaving(true);

    try {
      if (editingMahasiswa) {
        await updateMahasiswa(editingMahasiswa.id, payload);
        setNotice('Data mahasiswa berhasil diperbarui.');
      } else {
        await createMahasiswa(payload);
        setNotice('Mahasiswa berhasil ditambahkan.');
      }

      setFormOpen(false);
      setEditingMahasiswa(null);
      setPage(1);
      setReloadKey((current) => current + 1);
    } catch (saveError) {
      setFormError(
        saveError.message || 'Data mahasiswa gagal disimpan. Silakan coba lagi.',
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deletingMahasiswa || deleting) return;

    setDeleting(true);
    setDeleteError('');
    setNotice('');

    try {
      await deleteMahasiswa(deletingMahasiswa.id);
      setNotice(`Data ${deletingMahasiswa.nama} berhasil dihapus.`);
      setDeletingMahasiswa(null);
      setReloadKey((current) => current + 1);
    } catch (deleteRequestError) {
      setDeleteError(
        deleteRequestError.message || 'Mahasiswa gagal dihapus. Silakan coba lagi.',
      );
    } finally {
      setDeleting(false);
    }
  }

  function changeFilter(setter, value) {
    setter(value);
    setPage(1);
  }

  const firstItem = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const lastItem = Math.min(page * PAGE_SIZE, total);

  return (
    <DashboardLayout>
      <section className="mahasiswa-page">
        <header className="mahasiswa-header">
          <div className="mahasiswa-header-info">
            <div className="mahasiswa-header-icon">
              <UserIcon />
            </div>

            <div>
              <h1>Daftar Mahasiswa</h1>
              <p>Pantau dan kelola data seluruh mahasiswa.</p>
            </div>
          </div>

          <button
            className="mahasiswa-add-button"
            type="button"
            onClick={openCreateModal}
          >
            <span aria-hidden="true">＋</span>
            Tambah mahasiswa
          </button>
        </header>

        <div className="mahasiswa-content">
          <div className="mahasiswa-filters">
            <label className="mahasiswa-filter">
              <span className="visually-hidden">Filter angkatan</span>
              <select
                value={angkatan}
                onChange={(event) => changeFilter(setAngkatan, event.target.value)}
              >
                <option value="">Semua Angkatan</option>
                {Array.from({ length: 16 }, (_, index) => {
                  const year = new Date().getFullYear() - index;
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </label>

            <label className="mahasiswa-filter">
              <span className="visually-hidden">Filter status</span>
              <select
                value={status}
                onChange={(event) => changeFilter(setStatus, event.target.value)}
              >
                <option value="">Semua Status</option>
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="mahasiswa-search">
              <span className="mahasiswa-search-icon" aria-hidden="true">⌕</span>
              <span className="visually-hidden">Cari mahasiswa</span>
              <input
                type="search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Cari nama atau NIM..."
              />
            </label>
          </div>

          {notice && (
            <div className="mahasiswa-notice" role="status">
              {notice}
            </div>
          )}

          {error && (
            <div className="mahasiswa-error" role="alert">
              {error}
            </div>
          )}

          <div className="mahasiswa-table-wrap">
            <table className="mahasiswa-table">
              <thead>
                <tr>
                  <th scope="col">No</th>
                  <th scope="col">Status</th>
                  <th scope="col">NIM</th>
                  <th scope="col">Nama</th>
                  <th scope="col">Angkatan</th>
                  <th scope="col">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="mahasiswa-table-message">
                      Memuat data mahasiswa...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="6" className="mahasiswa-table-message">
                      Data mahasiswa belum dapat ditampilkan.
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="mahasiswa-table-message">
                      Tidak ada data mahasiswa yang cocok.
                    </td>
                  </tr>
                ) : (
                  items.map((mahasiswa, index) => (
                    <tr key={mahasiswa.id}>
                      <td>{(page - 1) * PAGE_SIZE + index + 1}</td>
                      <td>
                        <span
                          className={`mahasiswa-status mahasiswa-status--${mahasiswa.status}`}
                        >
                          {getStatusLabel(mahasiswa.status)}
                        </span>
                      </td>
                      <td>{mahasiswa.nomor_induk}</td>
                      <td className="mahasiswa-name">{mahasiswa.nama}</td>
                      <td>
                        <span className="mahasiswa-year">
                          {mahasiswa.angkatan || '—'}
                        </span>
                      </td>
                      <td>
                        <div className="mahasiswa-row-actions">
                          <button
                            className="mahasiswa-action mahasiswa-action--edit"
                            type="button"
                            aria-label={`Edit ${mahasiswa.nama}`}
                            title="Edit mahasiswa"
                            onClick={() => openEditModal(mahasiswa)}
                          >
                            <EditIcon />
                          </button>
                          <button
                            className="mahasiswa-action mahasiswa-action--delete"
                            type="button"
                            aria-label={`Hapus ${mahasiswa.nama}`}
                            title="Hapus mahasiswa"
                            onClick={() => {
                              setDeletingMahasiswa(mahasiswa);
                              setDeleteError('');
                            }}
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <footer className="mahasiswa-footer">
            <p>
              Menampilkan {firstItem}–{lastItem} dari {total} mahasiswa
            </p>

            <nav className="mahasiswa-pagination" aria-label="Paginasi mahasiswa">
              <button
                type="button"
                aria-label="Halaman sebelumnya"
                disabled={page <= 1 || loading}
                onClick={() => setPage((current) => Math.max(current - 1, 1))}
              >
                ‹
              </button>
              <span>{page}</span>
              <button
                type="button"
                aria-label="Halaman berikutnya"
                disabled={page >= totalPages || loading}
                onClick={() => setPage((current) => Math.min(current + 1, totalPages))}
              >
                ›
              </button>
            </nav>
          </footer>
        </div>
      </section>

      {formOpen && (
        <div
          className="mahasiswa-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeFormModal();
          }}
        >
          <section
            className="mahasiswa-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mahasiswa-modal-title"
          >
            <button
              className="mahasiswa-modal-close"
              type="button"
              onClick={closeFormModal}
              disabled={saving}
              aria-label="Tutup"
            >
              ×
            </button>

            <h2 id="mahasiswa-modal-title">
              {editingMahasiswa ? 'Edit Mahasiswa' : 'Tambah Mahasiswa'}
            </h2>

            <form onSubmit={handleSave}>
              <label>
                NIM
                <input
                  name="nomor_induk"
                  value={form.nomor_induk}
                  onChange={handleFormChange}
                  placeholder="Contoh: 2488010001"
                  disabled={Boolean(editingMahasiswa)}
                  required={!editingMahasiswa}
                />
              </label>

              <label>
                Nama mahasiswa
                <input
                  name="nama"
                  value={form.nama}
                  onChange={handleFormChange}
                  placeholder="Masukkan nama mahasiswa"
                  minLength={3}
                  maxLength={100}
                  required
                />
              </label>

              <label>
                Angkatan
                <input
                  name="angkatan"
                  type="number"
                  value={form.angkatan}
                  onChange={handleFormChange}
                  placeholder="Contoh: 2024"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  required
                />
              </label>

              {editingMahasiswa && (
                <label>
                  Status
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleFormChange}
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              {formError && (
                <p className="mahasiswa-modal-error" role="alert">
                  {formError}
                </p>
              )}

              <div className="mahasiswa-modal-actions">
                <button
                  type="button"
                  className="mahasiswa-modal-cancel"
                  onClick={closeFormModal}
                  disabled={saving}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="mahasiswa-modal-save"
                  disabled={saving}
                >
                  {saving ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {deletingMahasiswa && (
        <div className="mahasiswa-modal-overlay">
          <section
            className="mahasiswa-modal mahasiswa-delete-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="mahasiswa-delete-title"
          >
            <h2 id="mahasiswa-delete-title">Hapus Mahasiswa?</h2>
            <p>
              Data <strong>{deletingMahasiswa.nama}</strong> akan dihapus
              dari sistem.
            </p>

            {deleteError && (
              <p className="mahasiswa-modal-error" role="alert">
                {deleteError}
              </p>
            )}

            <div className="mahasiswa-modal-actions">
              <button
                type="button"
                className="mahasiswa-modal-cancel"
                onClick={() => setDeletingMahasiswa(null)}
                disabled={deleting}
              >
                Batal
              </button>
              <button
                type="button"
                className="mahasiswa-modal-delete"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </section>
        </div>
      )}
    </DashboardLayout>
  );
}