import React, { useState } from 'react';


const OffCyclePay = () => {
  const [requests] = useState([
    { id: 1, emp: 'Ankit Mehra', amount: 12000, reason: 'Referral Bonus', status: 'Pending' },
    { id: 2, emp: 'Neha Kapoor', amount: 5000, reason: 'Correction', status: 'Approved' },
  ]);

  return (
    <div className="offcycle-pay">
      <h2>Off-Cycle Payment Requests</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Emp Name</th>
            <th>Amount</th>
            <th>Reason</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((r) => (
            <tr key={r.id}>
              <td>{r.emp}</td>
              <td>₹{r.amount}</td>
              <td>{r.reason}</td>
              <td>{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OffCyclePay;
