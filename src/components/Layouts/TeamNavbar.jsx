import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './LayoutsStyle.css';
import { User, Wrench, GitPullRequest, UserCog, Users } from 'lucide-react';

const TeamNavbar = () => {
  const rawRoles = localStorage.getItem('role');
  const userRoles = rawRoles ? JSON.parse(rawRoles) : [];

  const isRegularEmployee = !userRoles.includes('Admin') && !userRoles.includes('HR');

  return (
    <div className="layouts-container">
      <nav className="layouts-navbar">
      <NavLink
          to="/team/myteam"
          className={({ isActive }) => `layouts-tab ${isActive ? 'active' : ''}`}
        >
          <UserCog size={16} /> My Team
        </NavLink>
      {!isRegularEmployee && (
         <NavLink
         to="/team/allteams"
         className={({ isActive }) => `layouts-tab ${isActive ? 'active' : ''}`}
         >
         <Users size={16} /> All Teams
        </NavLink>
        )}
      </nav>

      <div className="layouts-page-content">
        <Outlet />
      </div>
    </div>
  );
};

export default TeamNavbar;
