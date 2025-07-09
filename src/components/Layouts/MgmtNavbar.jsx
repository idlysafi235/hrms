
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './LayoutsStyle.css';
import { CalendarCheck2, List, Megaphone, Wrench } from 'lucide-react';

const MgmtNavbar = () => {
  return (
    <div className="layouts-container">
      <nav className="layouts-navbar">
        <NavLink
          to="/mgmt/announcements"
          className={({ isActive }) => `layouts-tab ${isActive ? 'active' : ''}`}
        >
          <Megaphone size={16} /> Announcements
        </NavLink>
        <NavLink
          to="/mgmt/events"
          className={({ isActive }) => `layouts-tab ${isActive ? 'active' : ''}`}
        >
          <CalendarCheck2 size={16} /> Upcoming Events
        </NavLink>
        <NavLink
          to="/mgmt/holidays"
          className={({ isActive }) => `layouts-tab ${isActive ? 'active' : ''}`}
        >
          <List size={16} /> Holidays List
        </NavLink>
      </nav>
      <div className="layouts-page-content">
        <Outlet />
      </div>
    </div>
  );
};

export default MgmtNavbar;
