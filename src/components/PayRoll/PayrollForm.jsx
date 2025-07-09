import React from 'react';
import './PayrollForm.css'; 

const PayrollForm = ({
  month,
  setMonth,
  year,
  setYear,
  handleGenerate,
  isLoading
}) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const getMonthOptions = () => {
    const limit = year === currentYear ? currentMonth : 12;
    return Array.from({ length: limit }, (_, i) => i + 1);
  };

  return (
    <div className="run-payroll-form">
      <div className="form-group">
        <label>Month</label>
        <select
          className="form-control"
          value={month}
          onChange={(e) => setMonth(parseInt(e.target.value))}
        >
          {getMonthOptions().map((m) => (
            <option key={m} value={m}>
              {new Date(0, m - 1).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Year</label>
        <input
          type="number"
          className="form-control"
          min="2020"
          value={year}
          onChange={(e) => {
            const newYear = parseInt(e.target.value);
            setYear(newYear);
            if (newYear === currentYear && month > currentMonth) {
              setMonth(currentMonth);
            }
          }}
        />
      </div>

      <div className="form-group">
        <label>&nbsp;</label>
        <button className="generate-button" onClick={handleGenerate} disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Run Payroll'}
        </button>
      </div>
    </div>
  );
};

export default PayrollForm;
