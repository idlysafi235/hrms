import React from 'react';
const documents = [
  { id: 1, name: 'W-2 2024' },
  { id: 2, name: 'W-2 2023' }
];
export default function TaxDocumentsMock() {
  return (
    <div>
      <h2>Tax Documents</h2>
      <ul>
        {documents.map(doc => (
          <li key={doc.id}>{doc.name}</li>
        ))}
      </ul>
    </div>
  );
}