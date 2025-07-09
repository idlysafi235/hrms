import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './LayoutsStyle.css';

const OnboardingNavbar = () => {
  return (
    <div>
      <nav className="layouts-navbar">
        <NavLink
          to="/onboarding/personal-info"
          className={({ isActive }) => `layouts-tab ${isActive ? 'active' : ''}`}
        >
          Personal Info
        </NavLink>

        <NavLink
          to="/onboarding/contact-address"
          className={({ isActive }) => `layouts-tab ${isActive ? 'active' : ''}`}
        >
          Contact & Address
        </NavLink>

        <NavLink
          to="/onboarding/education"
          className={({ isActive }) => `layouts-tab ${isActive ? 'active' : ''}`}
        >
          Education
        </NavLink>

        <NavLink
          to="/onboarding/experience"
          className={({ isActive }) => `layouts-tab ${isActive ? 'active' : ''}`}
        >
          Experience
        </NavLink>

        <NavLink
          to="/onboarding/skills-certs"
          className={({ isActive }) => `layouts-tab ${isActive ? 'active' : ''}`}
        >
          Skills & Certs
        </NavLink>

        <NavLink
          to="/onboarding/bank-tax"
          className={({ isActive }) => `layouts-tab ${isActive ? 'active' : ''}`}
        >
          Bank & Tax
        </NavLink>

        {/* <NavLink
          to="/onboarding/documents"
          className={({ isActive }) => `onboarding-tab ${isActive ? 'active' : ''}`}
        >
          Documents
        </NavLink> */}

        <NavLink
          to="/onboarding/review"
          className={({ isActive }) => `layouts-tab ${isActive ? 'active' : ''}`}
        >
          Review & Submit
        </NavLink>
      </nav>

      <div className="onboarding-page-content">
        <Outlet />
      </div>
    </div>
  );
};

export default OnboardingNavbar;
