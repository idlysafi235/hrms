import React from 'react';
import './Admin.css';

function SystemLogs() {
  return (
    <div className="admin-container">
      <h2>System Logs</h2>
      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Action</th>
              <th>Timestamp</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>admin@virtusa.com</td>
              <td>Updated Payroll Policies</td>
              <td>25-Jun-2025 11:45AM</td>
              <td className="status success">Success</td>
            </tr>
            <tr>
              <td>system</td>
              <td>Scheduled Payroll Run</td>
              <td>25-Jun-2025 12:00AM</td>
              <td className="status warning">Pending</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SystemLogs;
