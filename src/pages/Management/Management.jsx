import React, { useState } from "react";
import Announcements from "./MgmtAnnouncements";
import Events from "./Events";
import Holidays from "./Holidays";
import "./Management.css";

function Management() {
  const [activeTab, setActiveTab] = useState("announcements");

  return (
    <div className="management-page">
      <header className="management-header">
        <h1>Management Panel</h1>
        <nav className="management-tabs">
          <button
            className={activeTab === "announcements" ? "active" : ""}
            onClick={() => setActiveTab("announcements")}
          >
            Announcements
          </button>
          <button
            className={activeTab === "events" ? "active" : ""}
            onClick={() => setActiveTab("events")}
          >
            Upcoming Events
          </button>
          <button
            className={activeTab === "holidays" ? "active" : ""}
            onClick={() => setActiveTab("holidays")}
          >
            Holidays
          </button>
        </nav>
      </header>

      <main className="management-content">
        {activeTab === "announcements" && <Announcements />}
        {activeTab === "events" && <Events />}
        {activeTab === "holidays" && <Holidays />}
      </main>
    </div>
  );
}

export default Management;
