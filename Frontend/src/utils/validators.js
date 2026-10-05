/* ============================================================
   VALIDATORS — Form login & registrasi
   ============================================================ */

export function validateNimNip(v) {
  if (!v) return "Format Username Salah!";
  if (!/^[0-9]{8,20}$/.test(v)) return "Format Username Salah!";
  return "";
}

export function validateNamaLengkap(v) {
  if (!v) return "Nama lengkap wajib diisi";
  if (v.trim().length < 3) return "Nama lengkap minimal 3 karakter";
  return "";
}

export function validatePassword(pwd) {
  if (!pwd) return "Password Salah!";
  if (pwd.length < 8) return "Password minimal 8 karakter";
  if (!/[A-Z]/.test(pwd)) return "Password harus ada huruf besar";
  if (!/[a-z]/.test(pwd)) return "Password harus ada huruf kecil";
  if (!/[0-9]/.test(pwd)) return "Password harus ada angka";
  if (!/[^A-Za-z0-9]/.test(pwd)) return "Password harus ada simbol";
  return "";
}

export function validateKonfirmasiPassword(pwd, konfirmasi) {
  if (!konfirmasi) return "Konfirmasi password wajib diisi";
  if (pwd !== konfirmasi) return "Konfirmasi password tidak sama";
  return "";
}