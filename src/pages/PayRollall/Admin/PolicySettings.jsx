import React from 'react';
import './Admin.css';

function PolicySettings() {
  return (
    <div className="admin-container">
      <h2>Policy Settings</h2>
      <div className="admin-card">
        <ul className="admin-policy-list">
          <li><strong>VPF Limit:</strong> 20% of Basic Salary</li>
          <li><strong>PF Employer Share:</strong> 12%</li>
          <li><strong>PT Cut-off:</strong> ₹15,000 monthly</li>
          <li><strong>Bonus Eligibility:</strong> After 1 Year</li>
          <li><strong>Gratuity Enabled:</strong> Yes</li>
        </ul>
      </div>
    </div>
  );
}

export default PolicySettings;
