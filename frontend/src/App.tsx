import React, { useState } from "react";
import AddMember from "./pages/AddMember";
import Attendance from "./pages/Attendance";
import MembersSubscriptions from "./pages/MembersSubscriptions";
import Settings from "./pages/Settings";
import "./App.css";

type Page = "addMember" | "attendance" | "members" | "settings";

const App: React.FC = () => {
  const [page, setPage] = useState<Page>("addMember");

  return (
    <div className="app-root" dir="rtl">
      <header className="app-header">
        <h1>نظام إدارة الأكاديمية والجيم</h1>
        <div className="nav-buttons">
          <button
            className={page === "addMember" ? "active" : ""}
            onClick={() => setPage("addMember")}
          >
            إضافة عضو
          </button>
          <button
            className={page === "attendance" ? "active" : ""}
            onClick={() => setPage("attendance")}
          >
            تسجيل حضور
          </button>
          <button
            className={page === "members" ? "active" : ""}
            onClick={() => setPage("members")}
          >
            الأعضاء والاشتراكات
          </button>
          <button
            className={page === "settings" ? "active" : ""}
            onClick={() => setPage("settings")}
          >
            الإعدادات
          </button>
        </div>
      </header>

      <main className="page-container">
        {page === "addMember" && <AddMember />}
        {page === "attendance" && <Attendance />}
        {page === "members" && <MembersSubscriptions />}
        {page === "settings" && <Settings />}
      </main>
    </div>
  );
};

export default App;
