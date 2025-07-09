
import React from 'react';
import './EmployeeEditModal.css';

const EmployeeEditModal = ({ formData, onChange, onSave, onCancel, isSaving }) => {
  const today = new Date().toISOString().split('T')[0];

  const handleNumericInput = (e) => {
    const isValid = /^[0-9\b]+$/.test(e.target.value) || e.target.value === '';
    if (isValid) onChange(e);
  };

  return (
    <div className="employee-modal-overlay">
      <div className="employee-modal">
        <h3>Edit Employee</h3>
        <form className="employee-form" onSubmit={(e) => e.preventDefault()}>
          <div className="employee-form-grid">
            <div className="employee-form-group">
              <label>First Name</label>
              <input type="text" name="firstName" value={formData.firstName || ''} onChange={onChange} required minLength={2} />
            </div>
            <div className="employee-form-group">
              <label>Middle Name</label>
              <input type="text" name="middleName" value={formData.middleName || ''} onChange={onChange} />
            </div>
            <div className="employee-form-group">
              <label>Last Name</label>
              <input type="text" name="lastName" value={formData.lastName || ''} onChange={onChange} required minLength={2} />
            </div>

            <div className="employee-form-group">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone || ''}
                onChange={handleNumericInput}
                inputMode="numeric"
                pattern="[0-9]{10}"
                maxLength={10}
                required
              />
            </div>
            <div className="employee-form-group">
              <label>Alternate Phone</label>
              <input type="tel" name="alternatePhone" value={formData.alternatePhone || ''} readOnly className="employee-readonly" />
            </div>
            <div className="employee-form-group">
              <label>Personal Email</label>
              <input type="email" name="personalEmail" value={formData.personalEmail || ''} readOnly className="employee-readonly" />
            </div>

            <div className="employee-form-group">
              <label>Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth?.substring(0, 10) || ''}
                onChange={onChange}
                max={today}
                required
              />
            </div>
            <div className="employee-form-group">
              <label>Gender</label>
              <select name="gender" value={formData.gender || ''} onChange={onChange} required>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="employee-form-group">
              <label>Date of Joining</label>
              <input
                type="date"
                name="dateOfJoining"
                value={formData.dateOfJoining?.substring(0, 10) || ''}
                onChange={onChange}
                max={today}
                required
              />
            </div>

            <div className="employee-form-group">
              <label>Department</label>
              <input type="text" name="department" value={formData.department || ''} onChange={onChange} required />
            </div>
            <div className="employee-form-group">
              <label>Position</label>
              <input type="text" name="position" value={formData.position || ''} onChange={onChange} required />
            </div>
            <div className="employee-form-group">
              <label>Reporting Manager</label>
              <input type="text" name="reportingManagerName" value={formData.reportingManagerName || ''} onChange={onChange} required />
            </div>

            <div className="employee-form-group">
              <label>Employment Type</label>
              <input type="text" name="employmentType" value={formData.employmentType || ''} onChange={onChange} required />
            </div>
            <div className="employee-form-group">
              <label>Status</label>
              <select
                name="status"
                value={String(formData.status ?? '')}
                onChange={e => {
                  onChange({
                    target: {
                      name: 'status',
                      value: e.target.value === '' ? '' : Number(e.target.value),
                    }
                  });
                }}
                required
              >
                <option value="">Select</option>
                <option value="1">Active</option>
                <option value="0">In Active</option>
              </select>
            </div>
            <div className="employee-form-group">
              <label>Role</label>
              <select name="roleName" value={formData.roleName || ''} onChange={onChange} required>
                <option value="">Select Role</option>
                <option value="Admin">Admin</option>
                <option value="HR">HR</option>
                <option value="IT">IT</option>
                <option value="Manager">Manager</option>
                <option value="Employee">Employee</option>
              </select>
            </div>
          </div>

          <div className="employee-modal-actions">
            <button type="submit" className="employee-save-btn" onClick={onSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            <button type="button" className="employee-cancel-btn" onClick={onCancel} disabled={isSaving}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeEditModal;
