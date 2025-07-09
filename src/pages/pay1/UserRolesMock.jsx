import React from 'react';
const roles = [
  { role: 'Admin', permissions: ['Run Payroll', 'Manage Users'] },
  { role: 'HR', permissions: ['View Payroll', 'Edit Employee Data'] },
  { role: 'Employee', permissions: ['View Payslip'] }
];
export default function UserRolesMock() {
  return (
    <div>
      <h2>User Roles</h2>
      <ul>
        {roles.map((r, i) => (
          <li key={i}>{r.role}: {r.permissions.join(', ')}</li>
        ))}
      </ul>
    </div>
  );
}
