// src/components/skeletons/DashboardSkeleton.jsx

export default function DashboardSkeleton() {
  return (
    <div className="ds-skeleton-wrapper">
      
      {/* 1. SKELETON HEADER (Judul & Search Bar) */}
      <div className="ds-skeleton-header">
        <div className="ds-box ds-title"></div>
        <div className="ds-box ds-search"></div>
      </div>

      {/* 2. SKELETON MAIN PANEL (Kotak Biru) */}
      <div className="ds-skeleton-main-panel">
        <div className="ds-panel-top">
          <div>
            <div className="ds-box ds-text-lg" style={{ width: '250px', marginBottom: '0.5rem' }}></div>
            <div className="ds-box ds-text-sm" style={{ width: '350px' }}></div>
          </div>
          <div className="ds-box ds-btn-upload"></div>
        </div>

        {/* 3 Kotak Statistik di dalam Panel */}
        <div className="ds-panel-stats">
          {[1, 2, 3].map((item) => (
            <div key={item} className="ds-stat-card">
              <div className="ds-box ds-icon"></div>
              <div className="ds-stat-content">
                <div className="ds-box ds-text-xs" style={{ width: '80px' }}></div>
                <div className="ds-box ds-text-md" style={{ width: '40px' }}></div>
                <div className="ds-box ds-text-xs" style={{ width: '120px' }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. SKELETON REKAP MATERI (Full Width) */}
      <div className="ds-skeleton-card">
        <div className="ds-card-header">
          <div className="ds-box ds-text-md" style={{ width: '150px' }}></div>
          <div className="ds-box ds-text-sm" style={{ width: '80px' }}></div>
        </div>
        <div className="ds-box ds-divider"></div>
        <div className="ds-card-body-center">
          <div className="ds-box ds-empty-icon"></div>
          <div className="ds-box ds-text-sm" style={{ width: '200px' }}></div>
        </div>
      </div>

      {/* 4. SKELETON REKAP KUIS & MAHASISWA (2 Kolom) */}
      <div className="ds-bottom-grid">
        
        {/* Kiri: Rekap Kuis */}
        <div className="ds-skeleton-card">
          <div className="ds-card-header">
            <div className="ds-box ds-text-md" style={{ width: '100px' }}></div>
            <div className="ds-box ds-text-sm" style={{ width: '80px' }}></div>
          </div>
          <div className="ds-box ds-divider"></div>
          <div className="ds-card-body-center">
            <div className="ds-box ds-empty-icon"></div>
            <div className="ds-box ds-text-sm" style={{ width: '180px' }}></div>
          </div>
        </div>

        {/* Kanan: Tabel Mahasiswa */}
        <div className="ds-skeleton-card">
          <div className="ds-card-header">
            <div className="ds-box ds-text-md" style={{ width: '100px' }}></div>
            <div className="ds-box ds-text-sm" style={{ width: '80px' }}></div>
          </div>
          <div className="ds-box ds-divider"></div>
          
          {/* Skeleton Baris Tabel */}
          <div className="ds-table-skeleton">
            <div className="ds-table-head">
              <div className="ds-box ds-text-xs" style={{ width: '30%' }}></div>
              <div className="ds-box ds-text-xs" style={{ width: '40%' }}></div>
              <div className="ds-box ds-text-xs" style={{ width: '20%' }}></div>
            </div>
            {[1, 2, 3].map((row) => (
              <div key={row} className="ds-table-row">
                <div className="ds-box ds-text-xs" style={{ width: '30%' }}></div>
                <div className="ds-box ds-text-xs" style={{ width: '40%' }}></div>
                <div className="ds-box ds-text-xs" style={{ width: '20%' }}></div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}