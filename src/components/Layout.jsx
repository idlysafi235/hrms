// Layout.jsx
import React from 'react';
import TopBar from './TopBar';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import logo from '../asset/logo.svg';
import './Layout.css';

function Layout() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const onboardingStatus = user?.onboardingStatus?.toLowerCase();
  const isOnboarding = onboardingStatus === 'pending' || onboardingStatus === 'inprogress';

  if (isOnboarding) return null;

  return (
    <div className="layout-container">
      <img
        src={logo}
        alt="Background Logo"
        className="absolute top-1/2 left-1/2 w-[500px] opacity-5 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0"
      />
      <div className="relative z-10 flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex flex-col h-screen w-full">
          <TopBar />
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;
