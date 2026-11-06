import Sidebar from "./Sidebar.jsx";
import OfflineBanner from "../common/OfflineBanner.jsx";

export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-content">
        <main className="dashboard-content">
          <OfflineBanner />
          <div className="dashboard-main">{children}</div>
        </main>
        ;<div className="dashboard-main">{children}</div>
      </main>
    </div>
  );
}
