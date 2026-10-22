// src/components/skeletons/MateriSkeleton.jsx

export default function MateriSkeleton() {
  return (
    <div className="ms-container">
      
      {/* 1. SKELETON HEADER (Ikon + Judul + Tombol Upload) */}
      <div className="ms-header-card">
        <div className="ms-header-left">
          <div className="ms-box ms-icon"></div>
          <div className="ms-title-group">
            <div className="ms-box ms-title"></div>
            <div className="ms-box ms-subtitle"></div>
          </div>
        </div>
        <div className="ms-box ms-btn-upload"></div>
      </div>

      {/* 2. SKELETON FILTER BAR (3 Kotak) */}
      <div className="ms-filter-bar">
        <div className="ms-box ms-filter"></div>
        <div className="ms-box ms-filter"></div>
        <div className="ms-box ms-filter"></div>
      </div>

      {/* 3. SKELETON TABEL */}
      <div className="ms-table-card">
        {/* Header Tabel */}
        <div className="ms-table-head">
          <div className="ms-box ms-th" style={{ width: '5%' }}></div>
          <div className="ms-box ms-th" style={{ width: '15%' }}></div>
          <div className="ms-box ms-th" style={{ width: '25%' }}></div>
          <div className="ms-box ms-th" style={{ width: '25%' }}></div>
          <div className="ms-box ms-th" style={{ width: '15%' }}></div>
          <div className="ms-box ms-th" style={{ width: '10%' }}></div>
        </div>

        {/* Baris Data (Ulangi 5 kali) */}
        {[1, 2, 3, 4, 5].map((row) => (
          <div key={row} className="ms-table-row">
            <div className="ms-box ms-td" style={{ width: '5%' }}></div>
            <div className="ms-box ms-td ms-badge" style={{ width: '15%' }}></div>
            <div className="ms-box ms-td" style={{ width: '25%' }}></div>
            <div className="ms-box ms-td" style={{ width: '25%' }}></div>
            <div className="ms-box ms-td" style={{ width: '15%' }}></div>
            <div className="ms-td-actions" style={{ width: '10%' }}>
              <div className="ms-box ms-action"></div>
              <div className="ms-box ms-action"></div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}