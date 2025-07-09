import React, { useState } from 'react';
import './AdminPanel.css';

const ImportTools = () => {
  const [file, setFile] = useState(null);
  const [log, setLog] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setLog('');
  };

  const handleImport = () => {
    if (file) {
      // Simulate import log
      setTimeout(() => {
        setLog(`Imported: ${file.name} with 250 rows successfully.`);
      }, 1000);
    }
  };

  return (
    <div className="admin-panel-container">
      <h2>Import Tools</h2>

      <div className="org-form">
        <input type="file" onChange={handleFileChange} accept=".csv, .xlsx" />
        <button className="submit-btn" onClick={handleImport} disabled={!file}>
          Import File
        </button>
      </div>

      {log && <div className="summary-box"><strong>{log}</strong></div>}
    </div>
  );
};

export default ImportTools;
