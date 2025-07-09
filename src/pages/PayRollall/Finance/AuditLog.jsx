import React from 'react';
import './Finance.css';

function AuditLog() {
  return (
    <div className="finance-container">
      <h2>Audit Log</h2>
      <div className="finance-card">
        <table className="finance-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Action</th>
              <th>Timestamp</th>
              <th>Module</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>sai.teja</td>
              <td>Updated Tax Config</td>
              <td>25-Jun-2025 10:30AM</td>
              <td>Admin</td>
            </tr>
            <tr>
              <td>rahul.sharma</td>
              <td>Downloaded Payroll Report</td>
              <td>25-Jun-2025 11:05AM</td>
              <td>Finance</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AuditLog;
