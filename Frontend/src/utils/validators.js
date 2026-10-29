// ============================================================
// POLA NIM
// ============================================================

// NIM Mahasiswa: 2xxxx88xxxxx — 10 digit, mulai "2", digit 3-4 = "88"
const NIM_MAHASISWA_REGEX = /^2\d88\d{6}$/;

// NIM Admin: ADM + 3 digit angka — contoh: ADM001, ADM042
const NIM_ADMIN_REGEX = /^ADM\d{3}$/;

// Gabungan — untuk validasi umum (login)
const NIM_ANY_REGEX = /^(2\d88\d{6}|ADM\d{3})$/;


/* ============================================================
   VALIDASI NIM — Untuk REGISTER (khusus mahasiswa)
   ============================================================ */
export function validateNim(value) {
  const nim = String(value ?? '').trim();

  if (!nim) {
    return 'NIM wajib diisi.';
  }

  if (!NIM_MAHASISWA_REGEX.test(nim)) {
    return 'Format Salah! Contoh: 24880100XX';
  }

  return '';
}


/* ============================================================
   VALIDASI NIM — Untuk LOGIN (mahasiswa & admin)
   ============================================================ */
export function validateNimLogin(value) {
  const nim = String(value ?? '').trim();

  if (!nim) {
    return 'NIM wajib diisi!';
  }

  if (!NIM_ANY_REGEX.test(nim)) {
    return 'Format Username salah!';
  }

  return '';
}


/* ============================================================
   VALIDASI NIM — Admin only 
   ============================================================ */
export function validateNimAdmin(value) {
  const nim = String(value ?? '').trim();

  if (!nim) {
    return 'NIM wajib diisi.';
  }

  if (!NIM_ADMIN_REGEX.test(nim)) {
    return 'Format NIM Admin tidak dikenali.';
  }

  return '';
}

/* ============================================================
   VALIDASI PASSWORD
   ============================================================ */
   
export function validatePassword(value) {
  const password = String(value ?? '');

  if (!password) {
    return 'Password wajib diisi.'; 
  }
  if (password.length < 8) {
    return 'Password minimal 8 karakter.';
  }
  if (password.length > 72) {
    return 'Password maksimal 72 karakter.';
  }
  return '';
}
