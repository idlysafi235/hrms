import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Users,
  LayoutDashboard,
  UserCog,
  UserCircle,
  GitPullRequest,
  Wrench,
  Calendar,
  Wallet,
  Archive,
  ShieldCheck,
  MenuIcon,
  SidebarClose,
  SidebarOpen,
} from 'lucide-react';
import './Sidebar.css';
import siderbarlogo from '../asset/primary-logo.svg';

import { useAuth } from '../components/context/AuthContext';

function Sidebar() {
  const location = useLocation();
  const rawRoles = localStorage.getItem('role');
  const userRoles = rawRoles ? JSON.parse(rawRoles) : [];

  const isAdmin = userRoles.includes('Admin');
  const isHR = userRoles.includes('HR');
  const isManager = userRoles.includes('Manager');
  const isIT = userRoles.includes('IT');

  const isActivePath = (prefix) => location.pathname.startsWith(prefix);

  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  React.useEffect(() => {
    const sidebar = document.querySelector('.sidebar');
    if (isSidebarOpen) {
      sidebar.classList.add('sidebar-open');
    } else {
      sidebar.classList.remove('sidebar-open');
    }
  }, [isSidebarOpen]);

  return (
    <div className="sidebar flex flex-col items-start">
      <div className="sidebar-scroll">
        <div className=" ">
          <NavLink to="/home">
            <img src={siderbarlogo} className="w-[100%]" alt="sidebar logo" />
            {/* <img src={siderbarlogo} className="w-[100%]" alt="sidebar logo" /> */}
          </NavLink>
        </div>

        <button
          type="button"
          onClick={() => setIsSidebarOpen((prev) => !prev)}
          className="menu-icon-button"
        >
          {isSidebarOpen ? <SidebarClose /> : <SidebarOpen />}
        </button>

        <NavLink to="/home" className={({ isActive }) => `icon-button ${isActive ? 'active' : ''}`}>
          <LayoutDashboard /> <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/profile/profile"
          className={`icon-button ${isActivePath('/profile') ? 'active' : ''}`}
        >
          <UserCog /> <span>Self Service</span>
        </NavLink>

        {(isAdmin || isHR) && (
          <NavLink
            to="/employeehub/dashboard"
            className={`icon-button ${isActivePath('/employeehub') ? 'active' : ''}`}
          >
            <UserCircle /> <span>Employees Hub</span>
          </NavLink>
        )}

        {(isAdmin || isHR) && (
          <NavLink
            to="/hrrequests"
            className={`icon-button ${isActivePath('/hrrequests') ? 'active' : ''}`}
          >
            <GitPullRequest /> <span>HR Requests</span>
          </NavLink>
        )}

        {(isAdmin || isIT) && (
          <NavLink
            to="/assets/dashboard"
            className={`icon-button ${isActivePath('/assets') ? 'active' : ''}`}
          >
            <Wrench /> <span>Assets</span>
          </NavLink>
        )}

        <NavLink
          to="/attendance/daily"
          className={`icon-button ${isActivePath('/attendance') ? 'active' : ''}`}
        >
          <Calendar /> <span>Attendance</span>
        </NavLink>

        <NavLink to="/pay/pay" className={`icon-button ${isActivePath('/pay') ? 'active' : ''}`}>
          <Wallet /> <span>Payroll</span>
        </NavLink>

        <NavLink
          to="/leaves/dashboard"
          className={`icon-button ${isActivePath('/leaves') ? 'active' : ''}`}
        >
          <Archive /> <span>Leaves</span>
        </NavLink>

        <NavLink
          to="/team/myteam"
          className={`icon-button ${isActivePath('/team') ? 'active' : ''}`}
        >
          <Users /> <span>Team</span>
        </NavLink>

        {isAdmin && (
          <NavLink
            to="/mgmt/announcements"
            className={`icon-button ${isActivePath('/mgmt') ? 'active' : ''}`}
          >
            <ShieldCheck /> <span>Management</span>
          </NavLink>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
