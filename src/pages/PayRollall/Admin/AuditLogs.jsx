import React, { useEffect, useState } from 'react';
import './AdminPanel.css';

const mockLogs = [
  { id: 1, user: 'admin@acme.com', action: 'Updated Salary Structure', date: '2025-06-25 10:15 AM' },
  { id: 2, user: 'hr@acme.com', action: 'Added New Employee', date: '2025-06-24 03:40 PM' },
  { id: 3, user: 'admin@acme.com', action: 'Changed Tax Configuration', date: '2025-06-23 11:02 AM' }
];

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Replace this with real API call
    setLogs(mockLogs);
  }, []);

  return (
    <div className="admin-panel-container">
      <h2>Audit Logs</h2>

      <table className="admin-table">
        <thead>
          <tr>
            <th>#</th>
            <th>User</th>
            <th>Action</th>
            <th>Date & Time</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => (
            <tr key={log.id}>
              <td>{index + 1}</td>
              <td>{log.user}</td>
              <td>{log.action}</td>
              <td>{log.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuditLogs;
