// src/components/Notifications.jsx
import React from 'react';
import './Notifications.css';

function Notifications() {
  return (
    <div className="notifications-container">
      <h3>Notifications</h3>
      <ul>
        <li>You have 3 new messages</li>
        <li>System update available</li>
        <li>Backup completed successfully</li>
      </ul>
    </div>
  );
}

export default Notifications;
