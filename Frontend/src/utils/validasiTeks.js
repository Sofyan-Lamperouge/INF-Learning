// Aturan input teks untuk form admin. Dibuat SAMA dengan backend (app/core/validators.py);
// backend tetap penentu akhir, sedangkan file ini memberi umpan balik cepat dan menyaring saat mengetik.

// ---- Nama orang (mahasiswa): huruf, spasi, dan tanda ini. Ingin lebih ketat (huruf + spasi saja)?
//      kosongkan menjadi: const TANDA_NAMA = '';  (lakukan juga di backend: TANDA_NAMA = "")
const TANDA_NAMA = ".'’-";

const POLA_EMOJI =
  /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{2300}-\u{23FF}\u{FE00}-\u{FE0F}‍⃣\u{E0020}-\u{E007F}]/u;
const POLA_EMOJI_SEMUA = new RegExp(POLA_EMOJI.source, 'gu'); // versi global untuk membuang emoji
const POLA_SCRIPT = /[<>]|javascript:|data:text\/html/i;
// karakter yang BUKAN huruf/tanda-gabung/spasi/tanda nama
const POLA_BUKAN_NAMA = new RegExp(`[^\\p{L}\\p{M} ${TANDA_NAMA.replace(/[-\\\]]/g, '\\$&')}]`, 'gu');

export const PESAN_FILTER_NAMA = TANDA_NAMA
  ? 'Nama hanya boleh berisi huruf, spasi, titik, apostrof, dan tanda hubung.'
  : 'Nama hanya boleh berisi huruf dan spasi.';
export const PESAN_FILTER_MATERI = 'Emoji dan tanda < > tidak diperbolehkan.';

// ---------- NAMA MAHASISWA ----------
/** Dipakai saat mengetik/paste: buang karakter terlarang dan spasi/tanda di awal. */
export function bersihkanNama(nilai) {
  return String(nilai ?? '')
    .replace(POLA_EMOJI_SEMUA, '') // emoji dibuang utuh (termasuk penyambung/variation selector)
    .replace(POLA_BUKAN_NAMA, '')
    .replace(/^[^\p{L}]+/u, ''); // harus diawali huruf (spasi di awal otomatis hilang)
}

/** Return pesan error (string), atau '' bila valid. */
export function validasiNama(nilai) {
  const nama = String(nilai ?? '').trim().replace(/\s+/g, ' ');
  if (!nama) return 'Nama tidak boleh kosong.';
  if (nama.length < 3) return 'Nama minimal 3 karakter.';
  if (nama.length > 100) return 'Nama maksimal 100 karakter.';
  if (POLA_EMOJI.test(nama)) return 'Nama tidak boleh mengandung emoji.';
  if (POLA_SCRIPT.test(nama)) return 'Nama tidak boleh mengandung script atau tag.';
  if (POLA_BUKAN_NAMA.test(nama)) {
    POLA_BUKAN_NAMA.lastIndex = 0;
    return PESAN_FILTER_NAMA;
  }
  POLA_BUKAN_NAMA.lastIndex = 0;
  if (!/^\p{L}/u.test(nama)) return 'Nama harus diawali huruf.';
  return '';
}

// ---------- MATERI (judul, mata kuliah, deskripsi): hanya emoji & script yang ditolak ----------
/** Dipakai saat mengetik/paste: buang emoji dan tanda < >. */
export function bersihkanTeksMateri(nilai) {
  return String(nilai ?? '')
    .replace(POLA_EMOJI_SEMUA, '')
    .replace(/[<>]/g, '');
}

/** Return pesan error, atau ''. `label` mis. 'Nama materi'; `min` = panjang minimal. */
export function validasiTeksMateri(nilai, label = 'Teks', min = 0) {
  const teks = String(nilai ?? '').trim();
  if (min && !teks) return `${label} tidak boleh kosong.`;
  if (min && teks.length < min) return `${label} minimal ${min} karakter.`;
  if (POLA_EMOJI.test(teks)) return `${label} tidak boleh mengandung emoji.`;
  if (POLA_SCRIPT.test(teks)) return `${label} tidak boleh mengandung script atau tag.`;
  return '';
}

// ---------- NAMA MATERI & MATA KULIAH: huruf, angka, spasi, dan tanda penghubung ----------
// Mau mengizinkan tanda lain (titik dua, kurung, &, koma)? Tambahkan ke string ini, mis. "-:&(),."
// (lakukan juga di backend: TANDA_MATERI)
const TANDA_MATERI = '-';
const POLA_BUKAN_MATERI = new RegExp(`[^\\p{L}\\p{M}\\p{N} ${TANDA_MATERI.replace(/[-\\\]]/g, '\\$&')}]`, 'gu');

export const PESAN_FILTER_NAMA_MATERI = 'Hanya boleh huruf, angka, spasi, dan tanda hubung (-).';

/** Dipakai saat mengetik/paste: buang emoji, simbol, dan karakter lain yang tidak diizinkan. */
export function bersihkanNamaMateri(nilai) {
  return String(nilai ?? '')
    .replace(POLA_EMOJI_SEMUA, '')
    .replace(POLA_BUKAN_MATERI, '')
    .replace(/^\s+/, '');
}

/** Return pesan error, atau '' bila valid. `label` mis. 'Nama materi'; `min` = panjang minimal. */
export function validasiNamaMateri(nilai, label = 'Teks', min = 0) {
  const teks = String(nilai ?? '').trim().replace(/\s+/g, ' ');
  if (min && !teks) return `${label} tidak boleh kosong.`;
  if (min && teks.length < min) return `${label} minimal ${min} karakter.`;
  if (POLA_EMOJI.test(teks)) return `${label} tidak boleh mengandung emoji.`;
  if (POLA_SCRIPT.test(teks)) return `${label} tidak boleh mengandung script atau tag.`;
  const salah = POLA_BUKAN_MATERI.test(teks);
  POLA_BUKAN_MATERI.lastIndex = 0;
  if (salah) return `${label} ${PESAN_FILTER_NAMA_MATERI.charAt(0).toLowerCase()}${PESAN_FILTER_NAMA_MATERI.slice(1)}`;
  return '';
}
