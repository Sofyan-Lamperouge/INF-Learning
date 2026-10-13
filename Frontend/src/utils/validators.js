const NIM_REGEX = /^2\d88\d{6}$/;


// ❌ validateNamaLengkap DIHAPUS


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