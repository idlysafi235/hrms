import React, { useEffect, useState } from 'react';
import './PayrollDashboard.css';
import { fetchPayrollSummary } from '../../api/pay';

const PayrollDashboard = () => {
  const [payrollData, setPayrollData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getToken = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.token || '';
  };

  const fetchSummary = async () => {
    setLoading(true);
    setError('');

    try {
      const token = getToken();
      const data = await fetchPayrollSummary(token); 
      setPayrollData(Array.isArray(data) ? data : []); 
    } catch (err) {
      setError('Failed to load payroll data.');
      setPayrollData([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

 
  const totalEmployees = new Set(payrollData.map((p) => p.employeeId)).size || 0;
  const totalPayout = payrollData.reduce((sum, p) => sum + (p.netSalary || 0), 0);
  const pendingApprovals = payrollData.filter((p) => p.status === 'Pending').length || 0;
  const lastPayrollRun = payrollData.length
    ? new Date(
        payrollData
          .map((p) => new Date(p.updatedAt))
          .sort((a, b) => b - a)[0]
      )
    : null;

  const formattedPayout = `₹${totalPayout.toLocaleString('en-IN')}`;
  const formattedDate = lastPayrollRun
    ? lastPayrollRun.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'N/A';

  return (
    <div className="payroll-dashboard-container">
      {/* <div className="dashboard-header">
        <button onClick={fetchSummary} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div> */}

      {loading ? (
        <div className="loading-indicator">Loading payroll summary...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h4>Total Employees</h4>
            <p>{totalEmployees}</p>
          </div>
          <div className="dashboard-card">
            <h4>Total Payout (This Month)</h4>
            <p>{formattedPayout}</p>
          </div>
          <div className="dashboard-card">
            <h4>Bonuses Processed</h4>
            <p>₹0</p>
          </div>
          <div className="dashboard-card warning">
            <h4>Pending Approvals</h4>
            <p>{pendingApprovals}</p>
          </div>
          <div className="dashboard-card">
            <h4>Reimbursement Claims</h4>
            <p>0</p> 
          </div>
          <div className="dashboard-card">
            <h4>Last Payroll Run</h4>
            <p>{formattedDate}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayrollDashboard;
