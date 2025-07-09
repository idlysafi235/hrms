import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './LayoutsStyle.css';
import { User, Wrench, GitPullRequest } from 'lucide-react';

const SelfServiceNavbar = () => {
  const rawRoles = localStorage.getItem('role');
  const userRoles = rawRoles ? JSON.parse(rawRoles) : [];

  const canViewHRRequests = !userRoles.includes('Admin') && !userRoles.includes('HR');

  return (
    <div className="layouts-container">
      <nav className="layouts-navbar">
        <NavLink
          to="/profile/profile"
          className={({ isActive }) => `layouts-tab ${isActive ? 'active' : ''}`}
        >
          <User size={16} /> Profile
        </NavLink>

        <NavLink
          to="/profile/assets"
          className={({ isActive }) => `layouts-tab ${isActive ? 'active' : ''}`}
        >
          <Wrench size={16} /> Assets
        </NavLink>

        {canViewHRRequests && (
          <NavLink
            to="/profile/hr-requests"
            className={({ isActive }) => `layouts-tab ${isActive ? 'active' : ''}`}
          >
            <GitPullRequest size={16} /> HR Requests
          </NavLink>
        )}

        {/* <NavLink
          to="/profile/tasks"
          className={({ isActive }) => `profile-tab ${isActive ? 'active' : ''}`}
        >
          Tasks
        </NavLink> */}
      </nav>

      <div className="layouts-page-content">
        <Outlet />
      </div>
    </div>
  );
};

export default SelfServiceNavbar;
