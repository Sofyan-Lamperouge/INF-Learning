// Status mahasiswa di UI hanya ada 2: Aktif dan Non-aktif.
// Backend masih menyimpan 3 nilai (belum_aktif / aktif / nonaktif);
// "belum_aktif" (belum registrasi) ditampilkan sebagai Non-aktif.

export const STATUS_FILTER_OPTIONS = [
  { value: 'aktif', label: 'Aktif' },
  { value: 'nonaktif', label: 'Non-aktif' },
];

export function isAktif(status) {
  return status === 'aktif';
}

export function getStatusKey(status) {
  return isAktif(status) ? 'aktif' : 'nonaktif';
}

export function getStatusLabel(status) {
  return isAktif(status) ? 'Aktif' : 'Non-aktif';
}

// Warna badge angkatan: setiap angkatan punya warna berbeda (12 warna bergilir).
// 2024 = kuning dan 2023 = hijau (sesuai Figma); tahun lain mengikuti urutan palet
// yang ada di CSS (.mahasiswa-year--tone-0 ... tone-11).
export const JUMLAH_WARNA_ANGKATAN = 12;

export function getAngkatanTone(year) {
  const n = JUMLAH_WARNA_ANGKATAN;
  return (((2024 - Number(year)) % n) + n) % n;
}

// Daftar tahun untuk dropdown angkatan (tahun ini ke belakang).
// extraYear dipakai agar angkatan lama tetap muncul saat edit.
export function getAngkatanOptions(extraYear = null, span = 10) {
  const now = new Date().getFullYear();
  const years = Array.from({ length: span }, (_, i) => now - i);
  const extra = Number(extraYear);
  if (extra && !years.includes(extra)) years.push(extra);
  return years.sort((a, b) => b - a);
}

export const POLA_NIM = /^2\d88\d{6}$/;

export function toFormValues(mahasiswa) {
  return {
    nomor_induk: mahasiswa.nomor_induk || '',
    nama: mahasiswa.nama || '',
    angkatan: mahasiswa.angkatan ? String(mahasiswa.angkatan) : '',
    status: isAktif(mahasiswa.status) ? 'aktif' : 'nonaktif',
  };
}

export function normalizeNama(value) {
  return String(value ?? '').trim().replace(/\s+/g, ' ');
}

export function hasChanges(values, original) {
  return (
    normalizeNama(values.nama) !== normalizeNama(original.nama)
    || String(values.angkatan) !== String(original.angkatan)
    || values.status !== original.status
  );
}
