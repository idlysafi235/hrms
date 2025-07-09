import React, { useState, useEffect } from 'react';
import { fetchTds } from '../../../api/general';
import { getToken } from '../../../utils/auth';
import './Finance.css';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const TDSSummary = () => {
  const token = getToken();
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [tds, setTds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTds = async () => {
    try {
      setLoading(true);
      const data = await fetchTds(token);
      setTds(data);
    } catch (err) {
      setError(err.message || 'Failed to load TDS');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadTds();
    } else {
      setError('Unauthorized: No token found');
      setLoading(false);
    }
  }, [token]);

  
  const filteredTds = tds.filter(d => d.month === selectedMonth + 1 && d.year === selectedYear);

  const totalTds = filteredTds.reduce((sum, item) => sum + (item.tds || 0), 0);
  const uniqueEmployees = new Set(filteredTds.map(item => item.employeeId)).size;

  return (
    <div className="finance-container">
      <h2>TDS Summary</h2>

      {/* Filters */}
      <div className="filter-section">
        <select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))}>
          {months.map((month, index) => (
            <option key={month} value={index}>{month}</option>
          ))}
        </select>
        <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
          {Array.from({ length: 5 }, (_, i) => currentDate.getFullYear() - 2 + i).map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {/* KPI Summary Cards */}
      <div className="kpi-cards">
        <div className="kpi-card">
          <h4>Total TDS</h4>
          <p>₹ {totalTds.toLocaleString()}</p>
        </div>
        <div className="kpi-card">
          <h4>No. of Employees</h4>
          <p>{uniqueEmployees}</p>
        </div>
      </div>

      {/* Data Table */}
      <div className="table-container">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>PAN</th>
                <th>TDS</th>
                <th>Month-Year</th>
              </tr>
            </thead>
            <tbody>
              {filteredTds.length === 0 ? (
                <tr><td colSpan="4">No data available</td></tr>
              ) : (
                filteredTds.map((d) => (
                  <tr key={d.id}>
                    <td>{d.employeeId}</td>
                    <td>{d.panNumber}</td>
                    <td>₹ {d.tds}</td>
                    <td>{months[d.month - 1]}-{d.year}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TDSSummary;
