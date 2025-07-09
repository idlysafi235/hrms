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

  return (
    <div className="sidebar flex flex-col items-start">
      <div className="sidebar-scroll">
        <div className="p-[20px] mb-[20px]">
          <NavLink to="/home">
            <img src={siderbarlogo} className="w-[100%]" alt="sidebar logo" />
          </NavLink>
        </div>

        <NavLink to="/home" className={({ isActive }) => `icon-button ${isActive ? 'active' : ''}`}>
          <LayoutDashboard /> Dashboard
        </NavLink>

        <NavLink to="/profile/profile" className={`icon-button ${isActivePath('/profile') ? 'active' : ''}`}>
          <UserCog /> Self Service
        </NavLink>

        {(isAdmin || isHR) && (
          <NavLink to="/employeehub/dashboard" className={`icon-button ${isActivePath('/employeehub') ? 'active' : ''}`}>
            <UserCircle /> Employees Hub
          </NavLink>
        )}

        {(isAdmin || isHR) && (
          <NavLink to="/hrrequests" className={`icon-button ${isActivePath('/hrrequests') ? 'active' : ''}`}>
            <GitPullRequest /> HR Requests
          </NavLink>
        )}

        {(isAdmin || isIT) && (
          <NavLink to="/assets/dashboard" className={`icon-button ${isActivePath('/assets') ? 'active' : ''}`}>
            <Wrench /> Assets
          </NavLink>
        )}

        <NavLink to="/attendance/daily" className={`icon-button ${isActivePath('/attendance') ? 'active' : ''}`}>
          <Calendar /> Attendance
        </NavLink>

        <NavLink to="/pay/pay" className={`icon-button ${isActivePath('/pay') ? 'active' : ''}`}>
          <Wallet /> Payroll
        </NavLink>

        <NavLink to="/leaves/dashboard" className={`icon-button ${isActivePath('/leaves') ? 'active' : ''}`}>
          <Archive /> Leaves
        </NavLink>

          <NavLink to="/team/myteam" className={`icon-button ${isActivePath('/team') ? 'active' : ''}`}>
            <Users /> Team
          </NavLink>

        {isAdmin && (
          <NavLink to="/mgmt/announcements" className={`icon-button ${isActivePath('/mgmt') ? 'active' : ''}`}>
            <ShieldCheck /> Management
          </NavLink>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
