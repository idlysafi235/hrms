import React, { useState } from 'react';
import './AssignModal.css';

function AssignModal({ request, onClose }) {
  const [employeeId, setEmployeeId] = useState('');

  const handleAssign = () => {
    alert(`Assigning request ${request.id} to employee ID: ${employeeId}`);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Assign HR to Request</h3>
        <p><strong>Employee:</strong> {request.requestedByFullName}</p>
        <input
          type="text"
          placeholder="Enter HR Employee ID"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
        />
        <div className="modal-actions">
          <button onClick={handleAssign}>Assign</button>
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default AssignModal;
