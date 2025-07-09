import React from 'react';
const benefits = [
  { id: 1, name: 'Health Insurance', type: 'Pre-tax' },
  { id: 2, name: '401(k)', type: 'Pre-tax' }
];
export default function BenefitsMock() {
  return (
    <div>
      <h2>Deductions & Benefits</h2>
      <ul>
        {benefits.map(b => (
          <li key={b.id}>{b.name} - {b.type}</li>
        ))}
      </ul>
    </div>
  );
}