import React from 'react';
const policies = [
  { id: 1, name: 'Bi-weekly', overtime: '1.5x after 40 hrs' }
];
export default function PayPoliciesMock() {
  return (
    <div>
      <h2>Pay Policies</h2>
      <ul>
        {policies.map(p => (
          <li key={p.id}>{p.name} – Overtime: {p.overtime}</li>
        ))}
      </ul>
    </div>
  );
}