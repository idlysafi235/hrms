import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './LayoutsStyle.css';
import { Calendar, CalendarClock, CalendarCog, Clock,ClockArrowUp } from 'lucide-react';


function AttendanceNavbar() {
  const rawRoles = localStorage.getItem('role');
  const allowedRoles = ['Admin', 'Manager', 'HR'];
  const userRoles = rawRoles ? JSON.parse(rawRoles) : [];

  const canViewHistory = userRoles.some(role => allowedRoles.includes(role));

  return (
    <div className="layouts-container">
      <nav className="layouts-navbar">
        <NavLink
          to="/attendance/daily"
          className={({ isActive }) => `layouts-tab ${isActive ? 'active' : ''}`}
        >
         <Clock size={16} /> Attendance
        </NavLink>
        
        <NavLink
          to="/attendance/timesheet"
          className={({ isActive }) => `layouts-tab ${isActive ? 'active' : ''}`}
        >
          <Calendar size={16} />  Timesheet
        </NavLink>

        {canViewHistory && (
          <NavLink
            to="/attendance/AttendanceHistory"
            className={({ isActive }) => `layouts-tab ${isActive ? 'active' : ''}`}
          >
           <ClockArrowUp size={16} />  Attendance History
          </NavLink>
        )}
        {canViewHistory && (
          <NavLink
            to="/attendance/timesheetdashboard"
            className={({ isActive }) => `layouts-tab ${isActive ? 'active' : ''}`}
          >
            <CalendarCog size={16} /> Timesheet Dashboard
          </NavLink>
        )}
      </nav>

      <div className="layouts-page-content">
        <Outlet />
      </div>
    </div>
  );
}

export default AttendanceNavbar;
