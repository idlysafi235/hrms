// src/components/Pay/ReimbursementApprovals.jsx
import React, { useState } from 'react';
// import './ReimbursementApprovals.css';

const initialRequests = [
  { id: 101, name: 'Suman Roy', type: 'Internet', amount: '₹800', status: 'Pending' },
  { id: 102, name: 'Ajay Dev', type: 'Travel', amount: '₹2,100', status: 'Pending' },
];

const ReimbursementApprovals = () => {
  const [requests, setRequests] = useState(initialRequests);

  const handleApprove = (id) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Approved' } : r))
    );
  };

  return (
    <div className="reimbursement-approvals-container">
      <h2>Reimbursement Approvals</h2>
      <table>
        <thead>
          <tr>
            <th>Request ID</th>
            <th>Employee</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.name}</td>
              <td>{r.type}</td>
              <td>{r.amount}</td>
              <td>{r.status}</td>
              <td>
                {r.status === 'Pending' && (
                  <button onClick={() => handleApprove(r.id)}>Approve</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReimbursementApprovals;
