const NIM_REGEX = /^2\d88\d{6}$/;

//  NIP_REGISTRASI TELAS DIHAPUS


export function validateNamaLengkap(value) {
  const nama = String(value ?? '').trim();

  if (!nama) {
    return 'Nama lengkap wajib diisi.';
  }

  if (nama.length < 3) {
    return 'Nama lengkap minimal 3 karakter.';
  }

  if (nama.length > 100) {
    return 'Nama lengkap maksimal 100 karakter.';
  }

  return '';
}


// ✅ Fungsi diganti nama & logika disederhanakan
export function validateNim(value) {
  const nim = String(value ?? '').trim();

  if (!nim) {
    return 'NIM wajib diisi.';
  }

  if (!NIM_REGEX.test(nim)) {
    return 'Format NIM tidak dikenali.';
  }

  return '';
}


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


export function validateKonfirmasiPassword(password, confirmation) {
  if (!confirmation) {
    return 'Konfirmasi password wajib diisi.';
  }

  if (password !== confirmation) {
    return 'Konfirmasi password tidak sama.';
  }

  return '';
}