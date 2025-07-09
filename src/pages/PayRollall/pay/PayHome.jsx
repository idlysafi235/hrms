import React, { useEffect, useState } from 'react';
import './PayHome.css';
import DashboardCard from '../../../components/PayHome/DashboardCard';
import PayslipSection from '../../../components/PayHome/PayslipSection';
import { getToken } from '../../../utils/auth';
import { fetchAvailableLeaves } from '../../../api/leave';
import { fetchPayregister } from '../../../api/payslips';

const PayHome = () => {
  const [lopDays, setLopDays] = useState(0);
  const [netSalary, setNetSalary] = useState(0);
  const [leaveBalance, setLeaveBalance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setError('Unauthorized. Please login again.');
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        const [leaveData, payRegisterData] = await Promise.all([
          fetchAvailableLeaves(token),
          fetchPayregister(token),
        ]);

        const currentYear = new Date().getFullYear();
        const currentYearPayslips = (payRegisterData || []).filter(p => p.year === currentYear);

        const totalNetSalary = currentYearPayslips.reduce((sum, p) => sum + (p.netPay || 0), 0);
        const totalLop = currentYearPayslips.reduce((sum, p) => sum + (p.lopDays || 0), 0);

        setNetSalary(totalNetSalary);
        setLopDays(totalLop);
        setLeaveBalance(leaveData || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <div className="dashboard-container">Loading...</div>;
  if (error) return <div className="dashboard-container error-message">{error}</div>;

  return (
    <div className="dashboard-container">
      <h2>Payroll Dashboard</h2>

      {/* KPI Cards */}
      <div className="dashboard-grid">
        <DashboardCard title="Net Salary (YTD)" value={`₹ ${netSalary.toLocaleString()}`} />
        <DashboardCard title="LOP Days (YTD)" value={lopDays} />
      </div>

      {/* Leave Summary */}
      {leaveBalance.length > 0 && (
        <div className="dashboard-section">
          <h3>Leave Balance</h3>
          <div className="dashboard-grid">
            {leaveBalance.map((leave, idx) => (
              <DashboardCard
                key={idx}
                title={leave.leaveType || 'Leave'}
                value={leave.balance ?? '—'}
              />
            ))}
          </div>
        </div>
      )}

      {/* Payslip Preview Section */}
      <div className="dashboard-section">
        <PayslipSection />
      </div>
    </div>
  );
};

export default PayHome;
