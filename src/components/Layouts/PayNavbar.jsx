import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import './PayNavbar.css';
import { LayoutDashboard, MenuSquare, SendIcon, ChevronDown } from 'lucide-react';

function PayNavbar() {
  const [openSection, setOpenSection] = useState(null);
  const navbarRef = useRef(null);
  const location = useLocation();
  const storedRoles = localStorage.getItem('role');
  const roles = storedRoles ? JSON.parse(storedRoles) : [];

  const hasRole = (role) => roles.includes(role) || roles.includes('Admin'); 

  const toggleSection = (section) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  useEffect(() => {
    setOpenSection(null);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setOpenSection(null);
      }
    };

    document.addEventListener('pointerdown', handleClickOutside, true);
    return () => {
      document.removeEventListener('pointerdown', handleClickOutside, true);
    };
  }, []);

  const isActiveSection = (sectionKey) => {
    return location.pathname.startsWith(`/pay/${sectionKey}`);
  };
  const closeDropdown = () => setOpenSection(null);

  return (
    <div className="pay-navbar-container" ref={navbarRef}>
      <nav className="top-navbar">

        {/* PAY -  All roles */}
        <DropdownSection
          title="Pay"
          icon={<LayoutDashboard size={16} />}
          section="pay"
          isActive={isActiveSection('pay')}
          isOpen={openSection === 'pay'}
          toggle={toggleSection}
        >
          <NavLink to="/pay/pay" className="navbar-link" onClick={closeDropdown}>Dashboard</NavLink>
          <NavLink to="/pay/pay/pay-slip" className="navbar-link" onClick={closeDropdown}>Salary PaySlip</NavLink>
          <NavLink to="/pay/pay/offcycle-slip" className="navbar-link" onClick={closeDropdown}>Off-Cycle Payslip</NavLink>
          <NavLink to="/pay/pay/pay-register" className="navbar-link" onClick={closeDropdown}>Pay Register</NavLink>
          <NavLink to="/pay/pay/compensation-plan" className="navbar-link" onClick={closeDropdown}>Compensation Plan</NavLink>
          {/* <NavLink to="/pay/pay/vpf" className="navbar-link" onClick={closeDropdown}>VPF</NavLink> */}
        </DropdownSection>

        {/* REIMBURSEMENT -  All roles*/}
        {hasRole('Employee') && (
          <DropdownSection
            title="Reimbursement"
            icon={<SendIcon size={16} />}
            section="reimbursment"
            isActive={isActiveSection('reimbursment')}
            isOpen={openSection === 'reimbursment'}
            toggle={toggleSection}
          >
            <NavLink to="/pay/reimbursment/submission" className="navbar-link" onClick={closeDropdown}>Reimbursement Submission</NavLink>
            <NavLink to="/pay/reimbursment/slip" className="navbar-link" onClick={closeDropdown}>Reimbursement Slip</NavLink>
            <NavLink to="/pay/reimbursment/history" className="navbar-link" onClick={closeDropdown}>Reimbursement Claim History</NavLink>
          </DropdownSection>
        )}

        {/* TAX - All roles */}
        <DropdownSection
          title="Tax"
          icon={<MenuSquare size={16} />}
          section="tax"
          isActive={isActiveSection('tax')}
          isOpen={openSection === 'tax'}
          toggle={toggleSection}
        >
          <NavLink to="/pay/tax/computation" className="navbar-link" onClick={closeDropdown}>Tax Computation</NavLink>
          <NavLink to="/pay/tax/calculations" className="navbar-link" onClick={closeDropdown}>Tax Calculations</NavLink>
          <NavLink to="/pay/tax/declarations" className="navbar-link" onClick={closeDropdown}>Tax Declarations</NavLink>
          {/* <NavLink to="/pay/tax/proof-submission" className="navbar-link" onClick={closeDropdown}>Proof Submission</NavLink> */}
          {/* <NavLink to="/pay/tax/form16" className="navbar-link" onClick={closeDropdown}>Form 16</NavLink> */}
        </DropdownSection>

        {/* Utilities - All roles */}
        <DropdownSection
          title="Utilities"
          icon={<MenuSquare size={16} />}
          section="utilities"
          isActive={isActiveSection('utilities')}
          isOpen={openSection === 'utilities'}
          toggle={toggleSection}
        >
          <NavLink to="/pay/utilities/profile" className="navbar-link" onClick={closeDropdown}>Employee Profile</NavLink>
          {/* <NavLink to="/pay/utilities/aadharpan" className="navbar-link" onClick={closeDropdown}>Aadhar/PAN Link</NavLink> */}
          <NavLink to="/pay/utilities/esi" className="navbar-link" onClick={closeDropdown}>ESI</NavLink>
          {/* <NavLink to="/pay/utilities/form11" className="navbar-link" onClick={closeDropdown}>Form 11</NavLink>
          <NavLink to="/pay/utilities/fund" className="navbar-link" onClick={closeDropdown}>Contribution Fund</NavLink> */}
        </DropdownSection>
         {/* Help Desk - All roles */}
         <DropdownSection
          title="Help Desk"
          icon={<MenuSquare size={16} />}
          section="helpdesk"
          isActive={isActiveSection('helpdesk')}
          isOpen={openSection === 'helpdesk'}
          toggle={toggleSection}
        >
          <NavLink to="/pay/helpdesk/tickets" className="navbar-link" onClick={closeDropdown}>My Tickets</NavLink>
        </DropdownSection>

        {/* HR Section */}
        {hasRole('HR') && (
  <DropdownSection
    title="HR Panel"
    icon={<MenuSquare size={16} />}
    section="hr"
    isActive={isActiveSection('hr')}
    isOpen={openSection === 'hr'}
    toggle={toggleSection}
  >
    <NavLink to="/pay/dashboard" className="navbar-link" onClick={closeDropdown}>HR Dashboard</NavLink>
    <NavLink to="/pay/hr/salary-structure" className="navbar-link" onClick={closeDropdown}>Salary Structure</NavLink>
    <NavLink to="/pay/hr/employee-pay-settings" className="navbar-link" onClick={closeDropdown}>Employee Pay Settings</NavLink>
    <NavLink to="/pay/hr/attendance-import" className="navbar-link" onClick={closeDropdown}>Attendance Import</NavLink>
    <NavLink to="/pay/hr/leave-adjustments" className="navbar-link" onClick={closeDropdown}>Leave Adjustments</NavLink>
    <NavLink to="/pay/hr/offcycle-pay" className="navbar-link" onClick={closeDropdown}>Off-Cycle Processing</NavLink>
    <NavLink to="/pay/hr/payroll-remarks" className="navbar-link" onClick={closeDropdown}>Payroll Remarks</NavLink>
  </DropdownSection>
)}


        {/* Finance Section */}
        {hasRole('Finance') && (
  <DropdownSection
    title="Finance Panel"
    icon={<MenuSquare size={16} />}
    section="finance"
    isActive={isActiveSection('finance')}
    isOpen={openSection === 'finance'}
    toggle={toggleSection}
  >
    <NavLink to="/pay/finance/payroll-run" className="navbar-link" onClick={closeDropdown}>Run Payroll</NavLink>
    <NavLink to="/pay/finance/reports" className="navbar-link" onClick={closeDropdown}>Finance Reports</NavLink>
    <NavLink to="/pay/finance/bank-advice" className="navbar-link" onClick={closeDropdown}>Bank Advice</NavLink>
    <NavLink to="/pay/finance/final-settlement" className="navbar-link" onClick={closeDropdown}>Final Settlement</NavLink>
    <NavLink to="/pay/finance/declarations" className="navbar-link" onClick={closeDropdown}>Investment Declarations</NavLink>
    <NavLink to="/pay/finance/rmb" className="navbar-link" onClick={closeDropdown}>Reimbursment Approvals</NavLink>
    <NavLink to="/pay/finance/payout-approvals" className="navbar-link" onClick={closeDropdown}>Payout Approvals</NavLink>
    <NavLink to="/pay/finance/tds-summary" className="navbar-link" onClick={closeDropdown}>TDS Summary</NavLink>
    <NavLink to="/pay/finance/audit-log" className="navbar-link" onClick={closeDropdown}>Audit Log</NavLink>
  </DropdownSection>
)}


        {/* Admin Section */}
        {hasRole('Admin') && (
  <DropdownSection
    title="Admin Panel"
    icon={<MenuSquare size={16} />}
    section="admin"
    isActive={isActiveSection('admin')}
    isOpen={openSection === 'admin'}
    toggle={toggleSection}
  >
    <NavLink to="/pay/dashboard" className="navbar-link" onClick={closeDropdown}>Admin Dashboard</NavLink>
    <NavLink to="/pay/admin/organization-setup" className="navbar-link" onClick={closeDropdown}>Organization Setup</NavLink>
    <NavLink to="/pay/admin/pay-component-master" className="navbar-link" onClick={closeDropdown}>Pay Component Master</NavLink>
    <NavLink to="/pay/admin/salary-structure-templates" className="navbar-link" onClick={closeDropdown}>Salary Structure Templates</NavLink>
    <NavLink to="/pay/admin/payroll-config" className="navbar-link" onClick={closeDropdown}>Payroll Configuration</NavLink>
    <NavLink to="/pay/admin/tax-slab-setup" className="navbar-link" onClick={closeDropdown}>Tax Slab Setup</NavLink>
    <NavLink to="/pay/admin/import-tools" className="navbar-link" onClick={closeDropdown}>Import Tools</NavLink>
    <NavLink to="/pay/admin/document-management" className="navbar-link" onClick={closeDropdown}>Document Management</NavLink>
    <NavLink to="/pay/admin/audit-logs" className="navbar-link" onClick={closeDropdown}>Audit Logs</NavLink>
  </DropdownSection>
)}

      </nav>

      <div className="pay-navbar-content">
        <Outlet />
      </div>
    </div>
  );
}

function DropdownSection({ title, icon, section, isActive, isOpen, toggle, children }) {
  return (
    <div className="top-navbar-item">
      <div
        className={`top-navbar-header ${isActive ? 'active-tab' : ''}`}
        onClick={() => toggle(section)}
      >
        {icon}
        <span>{title}</span>
        <ChevronDown size={14} className={`chevron ${isOpen ? 'rotate' : ''}`} />
      </div>
      {isOpen && <div className="top-navbar-dropdown">{children}</div>}
    </div>
  );
}

export default PayNavbar;
