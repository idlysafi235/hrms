import React, { useState } from 'react';
import './AdminPanel.css';

const DocumentManagement = () => {
  const [documents, setDocuments] = useState([
    { name: 'HR Policy.pdf', uploadedBy: 'Admin', date: '2025-05-10' },
    { name: 'Salary Format.xlsx', uploadedBy: 'Finance', date: '2025-06-01' }
  ]);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleUpload = () => {
    if (selectedFile) {
      const newDoc = {
        name: selectedFile.name,
        uploadedBy: 'You',
        date: new Date().toISOString().split('T')[0]
      };
      setDocuments([newDoc, ...documents]);
      setSelectedFile(null);
    }
  };

  return (
    <div className="admin-panel-container">
      <h2>Document Management</h2>

      <div className="org-form">
        <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
        <button className="submit-btn" onClick={handleUpload} disabled={!selectedFile}>
          Upload
        </button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Document Name</th>
            <th>Uploaded By</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{doc.name}</td>
              <td>{doc.uploadedBy}</td>
              <td>{doc.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DocumentManagement;
