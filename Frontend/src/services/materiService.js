import { api } from "./api.js";

// Kontrak untuk FE-03 (Halaman Daftar Topik Materi per Kategori).
// category bersifat opsional: kalau tidak diisi, Backend mengembalikan
// seluruh materi lintas semester (sesuai AC: "dapat diakses lintas
// semester tanpa batasan angkatan").

export function getMateriList(category) {
  const query = category ? `?category=${encodeURIComponent(category)}` : "";
  return api.get(`/materi${query}`);
}

export function getCategories() {
  return api.get("/materi/categories");
}
