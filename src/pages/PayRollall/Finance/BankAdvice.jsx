import React, { useEffect, useState } from 'react';
import './FinancePanel.css';

const BankAdvice = () => {
  const [bankAdviceList, setBankAdviceList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setBankAdviceList([
        { id: 1, employeeName: 'saite', account: 'XXXX1234', netPay: 55000, ifsc: 'HDFC000123' },
        { id: 2, employeeName: 'h', account: 'XXXX5678', netPay: 62000, ifsc: 'ICIC000456' },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  return (
    <div className="finance-panel">
      <h2>Bank Advice</h2>
      {loading ? (
        <p className="loading-text">Loading bank advice data...</p>
      ) : (
        <table className="finance-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Employee Name</th>
              <th>Account Number</th>
              <th>Net Pay (₹)</th>
              <th>IFSC</th>
            </tr>
          </thead>
          <tbody>
            {bankAdviceList.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.employeeName}</td>
                <td>{item.account}</td>
                <td>{item.netPay}</td>
                <td>{item.ifsc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BankAdvice;
