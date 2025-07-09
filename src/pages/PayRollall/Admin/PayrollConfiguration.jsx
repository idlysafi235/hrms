import React, { useState } from 'react';
import './AdminPanel.css';

const PayrollConfiguration = () => {
  const [config, setConfig] = useState({
    pfPercentage: 12,
    esiEnabled: true,
    esiThreshold: 21000,
    payrollCutoffDate: 25,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setConfig((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <div className="admin-panel-container">
      <h2>Payroll Configuration</h2>

      <div className="config-form">
        <label>PF Contribution (%)</label>
        <input
          type="number"
          name="pfPercentage"
          value={config.pfPercentage}
          onChange={handleChange}
        />

        <label>
          <input
            type="checkbox"
            name="esiEnabled"
            checked={config.esiEnabled}
            onChange={handleChange}
          />
          Enable ESI
        </label>

        <label>ESI Threshold (₹)</label>
        <input
          type="number"
          name="esiThreshold"
          value={config.esiThreshold}
          onChange={handleChange}
        />

        <label>Payroll Cut-off Date</label>
        <input
          type="number"
          name="payrollCutoffDate"
          value={config.payrollCutoffDate}
          onChange={handleChange}
        />
      </div>

      <div className="summary-box">
        <h4>Summary</h4>
        <p>PF: {config.pfPercentage}%</p>
        <p>ESI: {config.esiEnabled ? 'Enabled' : 'Disabled'} (Threshold ₹{config.esiThreshold})</p>
        <p>Payroll Cut-off: {config.payrollCutoffDate}th of every month</p>
      </div>
    </div>
  );
};

export default PayrollConfiguration;
