import React, { useEffect, useState } from 'react';
import './FinancePanel.css';

const FinalSettlement = () => {
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setSettlements([
        { id: 1, employee: 'sdsgh', lastDay: '2025-05-30', payable: 33000 },
        { id: 2, employee: 'dsh', lastDay: '2025-06-10', payable: 28000 },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="finance-panel">
      <h2>Final Settlement</h2>
      {loading ? (
        <p className="loading-text">Loading final settlements...</p>
      ) : (
        <table className="finance-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Employee</th>
              <th>Last Working Day</th>
              <th>Final Payable (₹)</th>
            </tr>
          </thead>
          <tbody>
            {settlements.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.employee}</td>
                <td>{item.lastDay}</td>
                <td>{item.payable}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FinalSettlement;
