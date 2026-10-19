// src/components/skeletons/LoginSkeleton.jsx
//
// Skeleton halaman LOGIN — muncul saat loading.
// Layout: ilustrasi kiri, form kanan.
// Fit di viewport desktop 1440×1024.

export default function LoginSkeleton() {
  return (
    <main className="sk-page" role="status" aria-label="Memuat halaman login">
      <div className="sk-card">

        {/* KIRI: kotak besar (ilustrasi) */}
        <div className="sk-box sk-illustration"></div>

        {/* KANAN: form skeleton */}
        <div className="sk-form-col">

          {/* Judul + subtitle */}
          <div className="sk-box sk-title"></div>
          <div className="sk-box sk-subtitle"></div>

          {/* Field 1 */}
          <div className="sk-box sk-label"></div>
          <div className="sk-box sk-field"></div>

          {/* Field 2 */}
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