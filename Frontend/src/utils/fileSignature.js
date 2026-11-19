// src/utils/fileSignature.js
// Memeriksa isi asli file (magic bytes), bukan hanya ekstensi namanya.
// Ini hanya pemeriksaan cepat di browser untuk umpan balik lebih awal.
// Pemeriksaan yang menentukan tetap dilakukan backend saat Simpan.

const PDF_MARKER = [0x25, 0x50, 0x44, 0x46, 0x2d]; // "%PDF-"
const ZIP_MARKER = [0x50, 0x4b, 0x03, 0x04]; // "PK\x03\x04" (docx, pptx)

function mengandung(bytes, marker) {
  for (let i = 0; i <= bytes.length - marker.length; i += 1) {
    if (marker.every((b, j) => bytes[i + j] === b)) return true;
  }
  return false;
}

export async function isiFileSesuai(file, extension) {
  const buffer = await file.slice(0, 1024).arrayBuffer();
  const head = new Uint8Array(buffer);
  if (head.length === 0) return false;

  if (extension === "pdf") return mengandung(head, PDF_MARKER);

  // docx / pptx harus diawali signature ZIP
  return ZIP_MARKER.every((b, i) => head[i] === b);
}

export const PESAN_FILE_PALSU =
  "Isi file tidak sesuai dengan ekstensinya. File ditolak karena kemungkinan telah dimanipulasi.";