import { useEffect, useState } from "react";
import { getMateriList, getCategories } from "../../services/materiService.js";
import ErrorMessage from "../../components/common/ErrorMessage.jsx";

// FE-03 | Halaman Daftar Topik Materi per Kategori
// AC: materi terkelompok per kategori, dapat difilter, dan menampilkan
// pesan yang jelas ("Belum ada materi untuk kategori ini") saat kosong --
// bukan halaman kosong tanpa keterangan.
function MateriListPage() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [materiList, setMateriList] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setError("Gagal memuat kategori, periksa koneksi Anda."));
  }, []);

  useEffect(() => {
    setLoading(true);
    setError("");
    getMateriList(selectedCategory)
      .then(setMateriList)
      .catch(() => setError("Gagal memuat materi, periksa koneksi Anda."))
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  return (
    <main className="materi-page">
      <h1>Daftar Materi</h1>

      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="">Semua Kategori</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      <ErrorMessage message={error} />

      {loading && <p>Memuat materi...</p>}

      {!loading && !error && materiList.length === 0 && (
        <p className="empty-state">Belum ada materi untuk kategori ini</p>
      )}

      {!loading && !error && materiList.length > 0 && (
        <ul className="materi-list">
          {materiList.map((materi) => (
            <li key={materi.id}>
              <h2>{materi.title}</h2>
              <p>{materi.summary}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

export default MateriListPage;
