// src/components/student/profil/helpers.js
export const MAKS_FOTO_MB = 2; // sama dengan MAX_FOTO_MB di backend
const TIPE_BOLEH = ['image/jpeg', 'image/png', 'image/webp'];
const EKSTENSI_BOLEH = /\.(jpe?g|png|webp)$/i;

// Return pesan kesalahan (string) atau null bila file boleh dipakai.
export function validasiFoto(file) {
  if (!file) return 'Tidak ada file yang dipilih.';
  const tipeOk = TIPE_BOLEH.includes(file.type) || (!file.type && EKSTENSI_BOLEH.test(file.name));
  if (!tipeOk) return 'Format foto harus JPG, PNG, atau WEBP.';
  if (file.size === 0) return 'File foto kosong.';
  if (file.size > MAKS_FOTO_MB * 1024 * 1024) return `Ukuran foto maksimal ${MAKS_FOTO_MB} MB.`;
  return null;
}

// 4096 -> "4 KB", 1_500_000 -> "1,4 MB"
export function formatUkuran(byte) {
  if (byte < 1024 * 1024) return `${Math.max(1, Math.round(byte / 1024))} KB`;
  return `${(byte / 1024 / 1024).toFixed(1).replace('.', ',')} MB`;
}
