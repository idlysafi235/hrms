// src/pages/pay/tax/ProofSubmission.jsx
import React, { useState } from 'react';
import './TaxStyles.css';

const ProofSubmission = () => {
  const [files, setFiles] = useState([]);

  const handleUpload = (e) => {
    setFiles([...files, ...Array.from(e.target.files)]);
  };

  return (
    <div className="tax-container">
      <h2>Proof Document Upload</h2>
      <input type="file" multiple onChange={handleUpload} />
      <ul className="file-list">
        {files.map((file, idx) => (
          <li key={idx}>{file.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ProofSubmission;
