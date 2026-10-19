// src/components/skeletons/SkeletonLoading.jsx
//
// Skeleton Loading — versi yang TAMPIL LAMA dengan animasi shimmer.
// Untuk demo / preview / screenshot.
//
// Cara pakai:
//   <SkeletonLoading />
//   <SkeletonLoading onDismiss={handleDismiss} />  ← dengan tombol "Selesai"

export default function SkeletonLoading({ onDismiss }) {
  return (
    <main className="sl-page">
      <div className="sl-card">

        {/* KIRI: ilustrasi */}
        <div className="sl-skeleton sl-illustration"></div>

        {/* KANAN: form skeleton */}
        <div className="sl-form-col">
          {/* Judul + subtitle */}
          <div className="sl-skeleton sl-title-bar"></div>
          <div className="sl-skeleton sl-subtitle-bar"></div>

          {/* Field 1 */}
          <div className="sl-skeleton sl-label-bar"></div>
          <div className="sl-skeleton sl-field-bar"></div>

          {/* Field 2 */}
          <div className="sl-skeleton sl-label-bar"></div>
          <div className="sl-skeleton sl-field-bar"></div>

          {/* Tombol */}
          <div className="sl-skeleton sl-button-bar"></div>

          {/* Footer */}
          <div className="sl-skeleton sl-footer-bar"></div>
        </div>

      </div>

      {/* Tombol dismiss — opsional */}
      {onDismiss && (
        <button
          type="button"
          className="sl-dismiss-btn"
          onClick={onDismiss}
        >
          Selesai Preview
        </button>
      )}
    </main>
  );
}