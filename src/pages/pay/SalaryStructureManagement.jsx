// src/components/Pay/SalaryStructureManagement.jsx
import React, { useState } from 'react';
// import './SalaryStructureManagement.css';

const dummyStructures = [
  {
    id: 1,
    employee: 'Priya Nair',
    base: 30000,
    hra: 12000,
    allowance: 8000,
    total: 50000,
  },
  {
    id: 2,
    employee: 'Amit Joshi',
    base: 35000,
    hra: 14000,
    allowance: 10000,
    total: 59000,
  },
];

const SalaryStructureManagement = () => {
  const [structures, setStructures] = useState(dummyStructures);

  return (
    <div className="salary-structure-management">
      <h2>Salary Structure Management</h2>
      <table>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Base</th>
            <th>HRA</th>
            <th>Allowance</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {structures.map((s) => (
            <tr key={s.id}>
              <td>{s.employee}</td>
              <td>₹{s.base.toLocaleString()}</td>
              <td>₹{s.hra.toLocaleString()}</td>
              <td>₹{s.allowance.toLocaleString()}</td>
              <td>₹{s.total.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalaryStructureManagement;
