
import React from 'react';
import './EmployeeViewModal.css';

const EmployeeViewModal = ({ employee, onClose }) => {
  if (!employee) return null;

  return (
    <div className="employee-modal-overlay">
      <div className="employee-modal">
        <h2>Employee Details</h2>
        <div className="details-grid">
          <p><strong>Employee ID:</strong> {employee.employeeId}</p>
          <p><strong>Full Name:</strong> {employee.fullName}</p>
          <p><strong>Position:</strong> {employee.position}</p>
          <p><strong>Department:</strong> {employee.department}</p>
          <p><strong>Email:</strong> {employee.email}</p>
          <p><strong>Phone:</strong> {employee.phone}</p>
          <p><strong>Manager:</strong> {employee.reportingManagerName || 'Not Assigned'}</p>
          <p><strong>Address:</strong> {employee.address || 'N/A'}</p>
          {/* Add more fields as needed */}
        </div>
        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default EmployeeViewModal;
