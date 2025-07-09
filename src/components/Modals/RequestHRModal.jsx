import React, { useState } from 'react';
import './RequestHRModal.css';
import { raiseHRRequest } from '../../api/hrrequests';

const defaultCategories = [
  'Clockin/Out Change', 'Payslip', 
  'Salary Slip', 'Leave Request', 
  'Work From Home', 'Other',
];

const RequestHRModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    category: '',
    subject: '',
    description: '',
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
  
    try {
      await onSubmit(formData);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Failed to submit HR request');
    }
  };
  
  return (
    <div className="requesthr-backdrop">
      <div className="requesthr-box">
        <h3 className="requesthr-title">Raise HR Request</h3>

        <form onSubmit={handleSubmit} className="requesthr-form">
          <label className="requesthr-label">
            Category
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="requesthr-select"
            >
              <option value="" disabled>Select a category</option>
              {defaultCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </label>

          <label className="requesthr-label">
            Subject
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Brief title of your request"
              required
              className="requesthr-input"
            />
          </label>

          <label className="requesthr-label">
            Description
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed description"
              rows="3"
              required
              className="requesthr-textarea"
            />
          </label>

          {error && <p className="requesthr-error">{error}</p>}

          <div className="requesthr-actions">
            <button type="submit" className="requesthr-submit-btn" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit'}
            </button>
            <button type="button" className="requesthr-cancel-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestHRModal;
