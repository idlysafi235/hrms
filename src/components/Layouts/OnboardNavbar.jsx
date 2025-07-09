import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './LayoutsStyle.css';
import { LayoutDashboard, StepForward, Users } from 'lucide-react';

const OnboardNavbar = () => {
  return (
    <div className="layouts-container">
      <nav className="layouts-navbar">
        {/* Dashboard with summaries, reports & charts */}
        <NavLink to="/employeehub/dashboard" className={({ isActive }) => `layouts-tab ${isActive ? 'active' : ''}`}>
        <LayoutDashboard size={16} /> Dashboard
        </NavLink>
        
        {/* Core Employee Actions */}
        {/* <NavLink to="/employeehub/new-employee" className={({ isActive }) => `layouts-tab ${isActive ? 'active' : ''}`}>
          ➕ Add Employee
        </NavLink> */}

        <NavLink to="/employeehub/progress" className={({ isActive }) => `layouts-tab ${isActive ? 'active' : ''}`}>
        <StepForward size={16} /> Onboarding Progress
        </NavLink>

        {/* Offer Letters Management */}
        {/* <NavLink to="/employeehub/offer-letters" className={({ isActive }) => `layouts-tab ${isActive ? 'active' : ''}`}>
          📄 Offer Letters
        </NavLink> */}

        {/* Communication Logs: Email/SMS & notes */}
        <NavLink to="/employeehub/employeesdata" className={({ isActive }) => `layouts-tab ${isActive ? 'active' : ''}`}>
        <Users size={16} /> Employees
        </NavLink>

        {/* Settings with nested configs */}
        {/* <NavLink to="/employeehub/settings" className={({ isActive }) => `layouts-tab ${isActive ? 'active' : ''}`}>
          ⚙️ Settings
        </NavLink> */}
      </nav>

      {/* Outlet for nested routing */}
      <div className="layouts-page-content">
        <Outlet />
      </div>
    </div>
  );
};

export default OnboardNavbar;
