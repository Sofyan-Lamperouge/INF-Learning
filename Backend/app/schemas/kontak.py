"""Schema kontak admin (WhatsApp)."""

from pydantic import BaseModel


class KontakWhatsAppResponse(BaseModel):
    # Nomor admin dalam format internasional tanpa tanda + (mis. 6281234567890)
    nomor: str
    # Nomor untuk ditampilkan di layar (mis. +62 812-3456-7890)
    nomor_tampil: str
    # Isi pesan yang sudah terisi otomatis (nama, NIM, topik, pesan mahasiswa)
    pesan: str
    # Tautan wa.me siap dibuka oleh FE; WhatsApp akan terbuka dengan pesan di atas
    tautan: str
