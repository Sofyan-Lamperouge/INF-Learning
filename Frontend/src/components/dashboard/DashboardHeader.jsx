// src/components/dashboard/DashboardHeader.jsx
// Header halaman dashboard — judul + search bar

export default function DashboardHeader({
  title = 'Dashboard Admin',
  searchPlaceholder = 'Cari materi, kuis...',
  searchValue = '',
  onSearchChange,
}) {
  return (
    <header className="dashboard-header">

      <h1 className="dashboard-header-title">
        {title}
      </h1>

      <div className="dashboard-search">
        <span className="dashboard-search-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </span>

        <input
          type="text"
          className="dashboard-search-input"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={onSearchChange}
        />
      </div>

    </header>
  );
}