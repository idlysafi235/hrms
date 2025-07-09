import React, { useState, useEffect } from 'react';
import './HRPanel.css';

const PayrollRemarks = () => {
  const [remarks, setRemarks] = useState([]);
  const [newRemark, setNewRemark] = useState('');

  const handleAddRemark = () => {
    if (newRemark.trim()) {
      setRemarks(prev => [...prev, { id: Date.now(), text: newRemark }]);
      setNewRemark('');
    }
  };

  return (
    <div className="hr-panel-container">
      <h2>Payroll Remarks</h2>
      <div className="form-group">
        <label>Add Remark</label>
        <textarea
          value={newRemark}
          onChange={(e) => setNewRemark(e.target.value)}
          rows={3}
          placeholder="Write your remark here..."
        />
        <button className="primary-btn" onClick={handleAddRemark}>Add Remark</button>
      </div>

      {remarks.length > 0 && (
        <div className="remarks-list">
          <h4>Previous Remarks</h4>
          <ul>
            {remarks.map((r) => (
              <li key={r.id}>{r.text}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PayrollRemarks;
