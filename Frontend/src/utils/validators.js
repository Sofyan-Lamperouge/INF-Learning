// ============================================================
// POLA NIM
// ============================================================

// NIM mahasiswa: 10 digit, diawali 2, lalu digit ke-3 dan ke-4 adalah 88
// Contoh pola: 24880100XX — X berarti digit NIM sebenarnya.
const NIM_MAHASISWA_REGEX = /^2\d88\d{6}$/;

// NIM admin: ADM + 3 digit angka, contoh ADM001 atau ADM042
const NIM_ADMIN_REGEX = /^ADM\d{3}$/;

// Gabungan NIM mahasiswa dan admin untuk login
const NIM_ANY_REGEX = /^(2\d88\d{6}|ADM\d{3})$/;

// ============================================================
// VALIDASI NIM — REGISTER MAHASISWA
// ============================================================

export function validateNim(value) {
  const nim = String(value ?? '').trim();

  if (!nim) {
    return 'NIM wajib diisi.';
  }

  if (!NIM_MAHASISWA_REGEX.test(nim)) {
    return 'Format salah! Contoh: 24880100XX';
  }

  return '';
}

// ============================================================
// VALIDASI NIM — LOGIN MAHASISWA DAN ADMIN
// ============================================================

export function validateNimLogin(value) {
  const nim = String(value ?? '').trim();

  if (!nim) {
    return 'NIM wajib diisi!';
  }

  if (!NIM_ANY_REGEX.test(nim)) {
    return 'Format username salah!';
  }

  return '';
}

// ============================================================
// VALIDASI NIM — ADMIN SAJA
// ============================================================

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

// ============================================================
// VALIDASI PASSWORD — REGISTER
// ============================================================

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

// ============================================================
// VALIDASI PASSWORD — LOGIN
// Login hanya memeriksa apakah password kosong.
// Password salah atau terlalu pendek ditangani dari respons backend.
// ============================================================

export function validatePasswordLogin(value) {
  const password = String(value ?? '');

  if (!password) {
    return 'Password wajib diisi.';
  }

  return '';
}