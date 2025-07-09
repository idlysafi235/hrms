import React from 'react';
const employees = [
  { id: 1, name: 'Alice', basePay: 5000 },
  { id: 2, name: 'Bob', basePay: 6000 }
];
export default function EmployeePayDataMock() {
  return (
    <div>
      <h2>Employee Pay Data</h2>
      <ul>
        {employees.map(emp => (
          <li key={emp.id}>{emp.name} - ${emp.basePay}</li>
        ))}
      </ul>
    </div>
  );
}