import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './LayoutsStyle.css';
import {
  Home,
  DollarSign,
  FileText,
  Banknote,
  Settings,
  FileDown,
  Briefcase,
  Building2,
  CalendarCheck2,
  ClipboardCheck,
  FolderCog,
  ShieldCheck,
  FileBarChart2,
  BadgePercent,
  UserCog,
} from 'lucide-react';

function PayNavbarMain() {
  const rawRoles = localStorage.getItem('role');
  const userRoles = rawRoles ? JSON.parse(rawRoles) : [];

  const isAdmin = userRoles.includes('Admin');
  const isHR = userRoles.includes('HR');
  const isPayroll = userRoles.includes('Payroll');
  const isEmployee = userRoles.includes('Employee');

  return (
    <div className="layouts-container">
      <nav className="layouts-navbar">

        {/* Admin/HR/Payroll Views */}
        {(isAdmin || isHR || isPayroll) && (
          <>
            <NavLink to="/pay/dashboard" className={({ isActive }) => `layouts-tab ${isActive ? 'active' : ''}`}>
              <Home size={16} /> Dashboard
            </NavLink>

            <NavLink to="/pay/run" className={({ isActive }) => `layouts-tab ${isActive ? 'active' : ''}`}>
              <DollarSign size={16} /> Run Payroll
            </NavLink>

            {/* <NavLink to="/pay/employees" className={({ isActive }) => `layouts-tab ${isActive ? 'active' : ''}`}>
              <Briefcase size={16} /> Employee Pay Data
            </NavLink> */}

            <NavLink to="/pay/summary" className={({ isActive }) => `layouts-tab ${isActive ? 'active' : ''}`}>
              <FileText size={16} /> Payroll Summary
            </NavLink>

            {/* <NavLink to="/pay/benefits" className={({ isActive }) => `layouts-tab ${isActive ? 'active' : ''}`}>
              <BadgePercent size={16} /> Deductions & Benefits
            </NavLink> */}

            <NavLink to="/pay/taxes" className={({ isActive }) => `layouts-tab ${isActive ? 'active' : ''}`}>
              <ShieldCheck size={16} /> Tax Setup
            </NavLink>

            {/* <NavLink to="/pay/policies" className={({ isActive }) => `layouts-tab ${isActive ? 'active' : ''}`}>
              <CalendarCheck2 size={16} /> Pay Policies
            </NavLink>

            <NavLink to="/pay/reports" className={({ isActive }) => `layouts-tab ${isActive ? 'active' : ''}`}>
              <FileBarChart2 size={16} /> Reports
            </NavLink> */}

            {/* <NavLink to="/pay/ledger" className={({ isActive }) => `layouts-tab ${isActive ? 'active' : ''}`}>
              <Building2 size={16} /> GL Export
            </NavLink> */}

            <NavLink to="/pay/settings" className={({ isActive }) => `layouts-tab ${isActive ? 'active' : ''}`}>
              <Settings size={16} /> Pay Settings
            </NavLink>

            {/* <NavLink to="/pay/userroles" className={({ isActive }) => `layouts-tab ${isActive ? 'active' : ''}`}>
              <UserCog size={16} /> User Roles
            </NavLink> */}
          </>
        )}

        {/* Employee Self-Service */}
        {isEmployee && (
          <>
            <NavLink to="/pay/mypayslips" className={({ isActive }) => `layouts-tab ${isActive ? 'active' : ''}`}>
              <FileDown size={16} /> My Payslips
            </NavLink>

            <NavLink to="/pay/bankinfo" className={({ isActive }) => `layouts-tab ${isActive ? 'active' : ''}`}>
              <Banknote size={16} /> Bank Info
            </NavLink>

            <NavLink to="/pay/w4" className={({ isActive }) => `layouts-tab ${isActive ? 'active' : ''}`}>
              <ClipboardCheck size={16} /> Tax Withholding
            </NavLink>

            <NavLink to="/pay/documents" className={({ isActive }) => `layouts-tab ${isActive ? 'active' : ''}`}>
              <FolderCog size={16} /> Tax Documents
            </NavLink>
          </>
        )}
      </nav>

      <div className="layouts-page-content">
        <Outlet />
      </div>
    </div>
  );
}

export default PayNavbarMain;
