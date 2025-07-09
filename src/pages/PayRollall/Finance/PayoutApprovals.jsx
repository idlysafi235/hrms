import React, { useEffect, useState } from 'react';
import './FinancePanel.css';

const PayoutApprovals = () => {
  const [pendingPayouts, setPendingPayouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPendingPayouts([
        { id: 1, employee: 'Kshsd', month: 'May 2025', amount: 45000 },
        { id: 2, employee: 'dsgh', month: 'May 2025', amount: 50000 },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const approvePayout = (id) => {
    setPendingPayouts((prev) => prev.filter((p) => p.id !== id));
    alert('Payout approved successfully.');
  };

  return (
    <div className="finance-panel">
      <h2>Payout Approvals</h2>
      {loading ? (
        <p className="loading-text">Fetching payouts...</p>
      ) : (
        <table className="finance-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Employee</th>
              <th>Payroll Month</th>
              <th>Amount (₹)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {pendingPayouts.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.employee}</td>
                <td>{item.month}</td>
                <td>{item.amount}</td>
                <td>
                  <button className="approve-btn" onClick={() => approvePayout(item.id)}>
                    Approve
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PayoutApprovals;
