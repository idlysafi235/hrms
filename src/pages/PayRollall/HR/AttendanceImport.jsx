import React, { useState } from 'react';
import './HRPanel.css';

const AttendanceImport = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleImport = async () => {
    if (!file) return setMessage('Please upload a file.');
    setMessage('Importing...');
    // TODO: Implement actual import logic
    setTimeout(() => {
      setMessage('Attendance imported successfully!');
    }, 1000);
  };

  return (
    <div className="hr-panel-container">
      <h2>Attendance Import</h2>
      <div className="form-group">
        <label>Select CSV File</label>
        <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files[0])} />
      </div>
      <button className="primary-btn" onClick={handleImport}>Import Attendance</button>
      {message && <p className="status-msg">{message}</p>}
    </div>
  );
};

export default AttendanceImport;
