
import React from 'react';
const ChecklistConfig = () => {
  const checklistItems = ['ID Verification', 'Document Submission', 'System Setup'];
  return (
    <div>
      <h2>Checklist Configuration</h2>
      <ul>
        {checklistItems.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
};
export default ChecklistConfig;
