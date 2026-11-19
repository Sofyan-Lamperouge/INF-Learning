// src/components/student/bantuan/faqData.js
// Isi pertanyaan umum (FAQ). Tambah / ubah di sini saja.
export const FAQ = [
  {
    id: 'baca-unduh',
    tanya: 'Bagaimana cara membaca dan mengunduh materi?',
    jawab:
      'Buka menu Materi, pilih semester, lalu klik materinya. Pratinjau tampil langsung di halaman, dan tombol Unduh file menyimpan file aslinya.',
  },
  {
    id: 'data-salah',
    tanya: 'Data NIM atau angkatan saya salah, bagaimana mengubahnya?',
    jawab:
      'Data akademik hanya bisa diubah oleh admin. Kirim data yang benar lewat tombol Hubungi admin.',
  },
  {
    id: 'format-file',
    tanya: 'File apa saja yang didukung untuk materi?',
    jawab: 'Materi tersedia dalam format PDF, DOCX, dan PPTX.',
  },
];

// Kalimat awal pesan WhatsApp (mahasiswa tinggal melengkapi di WhatsApp)
export const PESAN_AWAL = 'Saya ingin bertanya tentang ...';

// Pilihan topik. `kunci` harus sama dengan yang diterima backend (akun | materi | lainnya).
// `label` = teks di tombol, `teks` = tulisan yang masuk ke pesan WhatsApp (samakan dengan TOPIK di kontak_service.py).
export const TOPIK = [
  { kunci: 'akun', label: 'Akun', teks: 'Masalah akun atau login' },
  { kunci: 'materi', label: 'Materi', teks: 'Kendala materi kuliah' },
  { kunci: 'lainnya', label: 'Lainnya', teks: 'Pertanyaan lainnya' },
];