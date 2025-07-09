import React from 'react';


const PayrollSettings = () => {
  return (
    <div className="payroll-settings">
      <h2>Payroll Configuration</h2>
      <div className="settings-form">
        <label>Default Pay Cycle:</label>
        <select><option>Monthly</option><option>Hourly</option></select>

        <label>Tax Regime:</label>
        <select><option>Old</option><option>New</option></select>

        <label>Salary Disbursement Date:</label>
        <input type="date" value="2025-06-30" />

        <label>PF Enabled:</label>
        <input type="checkbox" defaultChecked />

        <label>Professional Tax:</label>
        <input type="checkbox" />
      </div>
    </div>
  );
};

export default PayrollSettings;
