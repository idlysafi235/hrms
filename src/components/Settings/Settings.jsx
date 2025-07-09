
import React from 'react';
import './Settings.css';
import { useNavigate } from 'react-router-dom';

function Settings() {
  const navigate = useNavigate();

  const handleSignOut = () => {

    navigate('/login');
  };

  return (
    <div className="settings-container">
      <h3>Settings</h3>
      {/* <ul>
        <li>Account Settings</li>
        <li>Privacy</li>
        <li>Appearance</li>
        <li>System Preferences</li>
      </ul> */}
      <button className="signout-btn" onClick={handleSignOut}>
        Sign Out
      </button>
    </div>
  );
}

export default Settings;
