import React from 'react';

const KPICards = ({ summary }) => {

  const safe = summary || {
    totalEmployeesConsidered: 0,
    totalProcessed: 0,
    totalSkipped: 0,
    totalGrossSalary: 0,
    totalNetPay: 0,
    totalTDS: 0,
    totalDeductions: 0
  };

  return (
    <div className="kpi-summary">
      <div className="kpi-card">
        <h4>Total Employees Considered</h4>
        <p>{safe.totalEmployeesConsidered}</p>
      </div>
      <div className="kpi-card">
        <h4>Total Processed</h4>
        <p>{safe.totalProcessed}</p>
      </div>
      <div className="kpi-card">
        <h4>Total Skipped</h4>
        <p>{safe.totalSkipped}</p>
      </div>
      <div className="kpi-card">
        <h4>Total Gross Salary</h4>
        <p>₹{safe.totalGrossSalary.toFixed(2)}</p>
      </div>
      <div className="kpi-card">
        <h4>Total Net Pay</h4>
        <p>₹{safe.totalNetPay.toFixed(2)}</p>
      </div>
      <div className="kpi-card">
        <h4>Total TDS</h4>
        <p>₹{safe.totalTDS.toFixed(2)}</p>
      </div>
      <div className="kpi-card">
        <h4>Total Deductions</h4>
        <p>₹{safe.totalDeductions.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default KPICards;
