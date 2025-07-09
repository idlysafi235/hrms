import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './LayoutsStyle.css';
import { LayoutDashboard, MenuSquare, SendIcon } from 'lucide-react';

function LeaveNavbar() {
  const rawRoles = localStorage.getItem('role');
  const userRoles = rawRoles ? JSON.parse(rawRoles) : [];

  const isManagerOrAdmin = userRoles.some(role =>
    ['Manager', 'HR', 'Admin'].includes(role)
  );

  return (
    <div className="layouts-container">
      <nav className="layouts-navbar">

        <NavLink
          to="/leaves/dashboard"
          className={({ isActive }) => `layouts-tab ${isActive ? 'active' : ''}`}
        >
         <LayoutDashboard size={16} /> Leave Dashboard
        </NavLink>
        <NavLink
          to="/leaves/apply"
          className={({ isActive }) => `layouts-tab ${isActive ? 'active' : ''}`}
        >
         <SendIcon size={16} /> Apply Leave
        </NavLink>

        {isManagerOrAdmin && (
          <NavLink
            to="/leaves/management"
            className={({ isActive }) => `layouts-tab ${isActive ? 'active' : ''}`}
          >
           <MenuSquare size={16} /> Leave Management
          </NavLink>
        )}
      </nav>

      <div className="layouts-page-content">
        <Outlet />
      </div>
    </div>
  );
}

export default LeaveNavbar;
