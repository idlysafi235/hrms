// src/components/Pay/SalaryProcessing.jsx
import React from 'react';
// import './SalaryProcessing.css';

const dummyData = [
  { empId: 'EMP001', name: 'Ravi Kumar', salary: '₹55,000', status: 'Processed' },
  { empId: 'EMP002', name: 'Anjali Verma', salary: '₹62,000', status: 'Pending' },
];

const SalaryProcessing = () => {
  return (
    <div className="salary-processing-container">
      <h2>Salary Processing - April 2025</h2>
      <table>
        <thead>
          <tr>
            <th>Emp ID</th>
            <th>Name</th>
            <th>Salary</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {dummyData.map((d, idx) => (
            <tr key={idx}>
              <td>{d.empId}</td>
              <td>{d.name}</td>
              <td>{d.salary}</td>
              <td>{d.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="lock-payroll-btn">Lock Payroll</button>
    </div>
  );
};

export default SalaryProcessing;
