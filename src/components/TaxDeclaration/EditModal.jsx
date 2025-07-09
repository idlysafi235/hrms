import React, { useState } from 'react';

const EditModal = ({ declaration, onClose, onUpdate }) => {
  const [form, setForm] = useState({
    fiscalYear: declaration.financialYear || '2025-26',
    declarationType: declaration.declarationType || '',
    subType: declaration.subType || '',
    amount: declaration.amount || ''
  });

  const [file, setFile] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError('');

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (file) formData.append('proof', file);

      await onUpdate(declaration.id, formData); // parent handles API call
      onClose();
    } catch (err) {
      setError('Update failed. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="td-modal-backdrop">
      <div className="td-modal-content">
        <div className="td-modal-header">
          <h3>Edit Declaration</h3>
          <button onClick={onClose} className="td-close-btn">&times;</button>
        </div>

        <form onSubmit={handleUpdate} encType="multipart/form-data">
          <div className="td-grid">
            <div className="td-input-group">
              <label>Fiscal Year</label>
              <select name="fiscalYear" value={form.fiscalYear} onChange={handleChange}>
                <option value="2024-25">2024–25</option>
                <option value="2025-26">2025–26</option>
              </select>
            </div>

            <div className="td-input-group">
              <label>Type</label>
              <select name="declarationType" value={form.declarationType} onChange={handleChange}>
                <option value="">Select Type</option>
                <option value="HRA">HRA</option>
                <option value="80C">80C - Investment</option>
                <option value="80D">80D - Medical Insurance</option>
              </select>
            </div>

            <div className="td-input-group">
              <label>Sub-Type</label>
              <input
                type="text"
                name="subType"
                value={form.subType}
                onChange={handleChange}
                placeholder="e.g. LIC, Rent"
              />
            </div>

            <div className="td-input-group">
              <label>Amount (₹)</label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
              />
            </div>

            <div className="td-input-group full-width">
              <label>Upload New Proof (optional)</label>
              <input type="file" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
            </div>
          </div>

          {error && <p className="td-error">{error}</p>}

          <div className="td-submit-container">
            <button type="submit" className="td-btn" disabled={updating}>
              {updating ? 'Updating...' : 'Update'}
            </button>
            <button type="button" className="td-btn td-btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
