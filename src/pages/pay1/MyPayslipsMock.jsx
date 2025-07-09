import React from 'react';
const payslips = [
  { id: 1, period: 'June 1-15', netPay: 2400 },
  { id: 2, period: 'June 16-30', netPay: 2500 }
];
export default function MyPayslipsMock() {
  return (
    <div>
      <h2>My Payslips</h2>
      <ul>
        {payslips.map(p => (
          <li key={p.id}>{p.period} - ${p.netPay}</li>
        ))}
      </ul>
    </div>
  );
}