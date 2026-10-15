export default function RegisterSkeleton() {
  return (
    <main
      className="sk-page"
      role="status"
      aria-label="Memuat halaman registrasi"
    >
      <div className="sk-card">
        {/* KIRI: kotak besar (ilustrasi) */}
        <div className="sk-box sk-illustration"></div>

        {/* KANAN: form skeleton */}
        <div className="sk-form-col">
          {/* Judul saja */}
          <div className="sk-box sk-title"></div>

          {/* Field 1 — NIM */}
          <div className="sk-box sk-label"></div>
          <div className="sk-box sk-field"></div>

          {/* Field 2 — Password */}
          <div className="sk-box sk-label"></div>
          <div className="sk-box sk-field"></div>

          {/* ✅ Field 3 — Konfirmasi Password (KEMBALI) */}
          <div className="sk-box sk-label"></div>
          <div className="sk-box sk-field"></div>

          {/* Tombol */}
          <div className="sk-box sk-button"></div>

          {/* Footer */}
          <div className="sk-box sk-footer"></div>
        </div>
      </div>
    </main>
  );
}