import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';
import { fetchPayrollruns, fetchAllPayrolls } from '../../../api/payrollService';
import { getToken } from '../../../utils/auth';
import formatDate from '../../../components/common/FormatDate';
import { useNavigate } from "react-router-dom";
import './DashboardMock.css';

const PayDashboard= () => {
  const [payrollRuns, setPayrollRuns] = useState([]);
  const navigate = useNavigate();
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = getToken();
        const runsData = await fetchPayrollruns(token);
        const payrollData = await fetchAllPayrolls(token);
        setPayrollRuns(runsData);
        setPayrolls(payrollData);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);


  const totalPayroll = payrollRuns.reduce((sum, r) => sum + (r.totalNetPay || 0), 0);
  const employeesPaid = [...new Set(payrolls.map(p => p.employeeId))].length;
  const totalTax = payrolls.reduce((sum, p) => sum + (p.tds || 0), 0);
  const nextPayDate = payrollRuns.length > 0
    ? new Date(Math.max(...payrollRuns.map(r => new Date(r.processedDate)))).toLocaleDateString()
    : '-';

  const trends = payrollRuns
    .sort((a, b) => new Date(a.processedDate) - new Date(b.processedDate))
    .map(r => ({
      date: `${r.month}/${r.year}`,
      total: r.totalNetPay || 0
    }));

  const recentRuns = payrollRuns
    .sort((a, b) => new Date(b.processedDate) - new Date(a.processedDate))
    .slice(0, 5)
    .map(r => ({
      id: r.id,
      date: new Date(r.processedDate).toLocaleDateString(),
      status: r.status || '-',
      totalNetPay: `₹${r.totalNetPay?.toLocaleString() || '0'}`,
      totalGrossSalary: `₹${r.totalGrossSalary?.toLocaleString() || '0'}`,
      totalDeductions: `₹${r.totalDeductions?.toLocaleString() || '0'}`
    }));

  if (loading) return <div className="pay-dashboard-container">Loading dashboard...</div>;

  return (
    <div className="pay-dashboard-container">
      <div className="pay-metrics">
        <div className="pay-card"><p>Total Payroll</p><h3>₹{totalPayroll.toLocaleString()}</h3></div>
        <div className="pay-card"><p>Employees Paid</p><h3>{employeesPaid}</h3></div>
        <div className="pay-card"><p>Last Pay Date</p><h3>{formatDate(nextPayDate)}</h3></div>
        <div className="pay-card"><p>Tax Liability</p><h3>₹{totalTax.toLocaleString()}</h3></div>
      </div>

      <div className="pay-section">
        <h2>Payroll Trends</h2>
        {trends.length === 0 ? (
          <p>No trend data available.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="pay-section">
        <h2>Recent Payroll Runs</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Status</th>
              <th>Total Gross</th>
              <th>Total Net Pay</th>
              <th>Deductions</th>
            </tr>
          </thead>
          <tbody>
            {recentRuns.map(run => (
              <tr key={run.id}>
                <td>{formatDate(run.date)}</td>
                <td>{run.status}</td>
                <td>{run.totalGrossSalary}</td>
                <td>{run.totalNetPay}</td>
                <td>{run.totalDeductions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pay-section">
        <h2>Quick Actions</h2>
        <div className="pay-actions">
          <button
          onClick={() => navigate("/pay/finance/payroll-run")}
          >Run Payroll
          </button
          >
          <button
          onClick={() => navigate("/pay/admin/tax-slab-setup")}
          >Update Tax Info</button>
          <button
          onClick={() => navigate("/pay/finance/tds-summary")}
          >TDS Summary</button>
        </div>
      </div>

      <div className="pay-section">
        <h2>Upcoming Dates</h2>
        <ul className="pay-calendar">
          <li>🗓 Jul 10: Deadline to submit tax forms</li>
          <li>🗓 Jul 15: Salary disbursement</li>
          <li>🗓 Jul 30: Compliance audit review</li>
        </ul>
      </div>
    </div>
  );
};

export default PayDashboard;
