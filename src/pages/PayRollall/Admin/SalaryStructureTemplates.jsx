import React, { useState } from 'react';
import './AdminPanel.css';

const SalaryStructureTemplates = () => {
  const [templates, setTemplates] = useState([
    { name: 'Default Template', components: ['Basic Pay', 'HRA', 'Conveyance'] },
    { name: 'Contractor Template', components: ['Fixed Pay'] },
  ]);
  const [newTemplateName, setNewTemplateName] = useState('');

  const addTemplate = () => {
    if (newTemplateName.trim()) {
      setTemplates([...templates, { name: newTemplateName, components: [] }]);
      setNewTemplateName('');
    }
  };

  return (
    <div className="admin-panel-container">
      <h2>Salary Structure Templates</h2>

      <div className="org-form">
        <input
          type="text"
          placeholder="New Template Name"
          value={newTemplateName}
          onChange={(e) => setNewTemplateName(e.target.value)}
        />
        <button className="submit-btn" onClick={addTemplate}>Add Template</button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Template Name</th>
            <th>Components</th>
          </tr>
        </thead>
        <tbody>
          {templates.map((tpl, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{tpl.name}</td>
              <td>{tpl.components.join(', ') || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalaryStructureTemplates;
