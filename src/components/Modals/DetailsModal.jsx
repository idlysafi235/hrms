import React, { useState, useEffect, useRef, useCallback } from 'react';
import './DetailsModal.css';
import { updateHRRequestStatus, assignHRRequest } from '../../api/hrrequests';
import { fetchEmployeesByNameOrId, mapEmployeesToOptions, debounce } from '../../api/employeeSelector';
import { useUser } from '../../hooks/useUser';

function DetailsModal({ request, onClose, onUpdate, token }) {
  const { hasRole } = useUser();
  const readOnlyMode = !hasRole(['Admin', 'HR']);
  const [assignedTo, setAssignedTo] = useState(request.assignedToFullName || '');
  const [assignedToOptions, setAssignedToOptions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [remarks, setRemarks] = useState(request.resolution || '');
  const [status, setStatus] = useState(request.status || 'Pending');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const dropdownRef = useRef(null);
  const isAssignedToEditable = !readOnlyMode && request.status !== 'Resolved';
  const isRemarksEditable = !readOnlyMode && request.status !== 'Resolved';  

  const debouncedFetchEmployees = useCallback(
    debounce(async (query) => {
      if (!query) {
        setAssignedToOptions([]);
        setShowDropdown(false);
        return;
      }
      try {
        const employees = await fetchEmployeesByNameOrId(query, token);
        const options = mapEmployeesToOptions(employees);
        setAssignedToOptions(options);
        setShowDropdown(options.length > 0);
      } catch {
        setAssignedToOptions([]);
        setShowDropdown(false);
      }
    }, 300),
    [token]
  );

  useEffect(() => {
    if (isAssignedToEditable) {
      debouncedFetchEmployees(assignedTo.trim());
    }
  }, [assignedTo, debouncedFetchEmployees, isAssignedToEditable]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAssignInputChange = (e) => {
    if (isAssignedToEditable) {
      setAssignedTo(e.target.value);
      setFieldErrors((prev) => ({ ...prev, assignedTo: '' }));
    }
  };

  const handleOptionSelect = (option) => {
    setAssignedTo(option.value);
    setShowDropdown(false);
  };

  const handleSave = async () => {
    setError('');
    setFieldErrors({});

    const assignedToChanged = assignedTo !== request.assignedToFullName;
    const statusOrRemarksChanged = status !== request.status || remarks !== request.resolution;

    const errors = {};
    if ((status !== request.status || assignedToChanged) && !assignedTo.trim()) {
      errors.assignedTo = 'Please assign the request before updating status.';
    }

    if (status === 'Resolved' && !remarks.trim()) {
      errors.remarks = 'Remarks are required to mark this request as Resolved.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);

    try {
      if (statusOrRemarksChanged) {
        await updateHRRequestStatus(token, request.requestId, status, remarks);
      }

      if (isAssignedToEditable && assignedToChanged) {
        await assignHRRequest(token, request.requestId, assignedTo);
      }

      if (statusOrRemarksChanged || (isAssignedToEditable && assignedToChanged)) {
        const updatedRequest = {
          ...request,
          status,
          resolution: remarks,
          assignedToFullName: assignedTo,
          updatedAt: new Date().toISOString(),
        };

        onUpdate(updatedRequest);
      }

      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save changes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="details-modal__overlay">
      <div className="details-modal__container">
        <h2 className="details-modal__header">Request Details</h2>

        {error && <p className="error">{error}</p>}

        <div className="details-modal__section">
          <div className="details-modal__grid">
            <label>
              <span>Employee</span>
              <input
                type="text"
                value={request.requestedByFullName}
                readOnly
                className="input-readonly no-edit-cursor"
                style={{ cursor: 'not-allowed' }}
              />
            </label>

            <label>
              <span>Category</span>
              <input
                type="text"
                value={request.category}
                readOnly
                className="input-readonly no-edit-cursor"
                style={{ cursor: 'not-allowed' }}
              />
            </label>

            <label>
              <span>Status</span>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </label>

            <label>
              <span>Raised On</span>
              <input
                type="text"
                value={new Date(request.createdAt).toLocaleString('en-US', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })}
                readOnly
                className="input-readonly no-edit-cursor"
                style={{ cursor: 'not-allowed' }}
              />
            </label>

            <label>
              <span>Last Updated On</span>
              <input
                type="text"
                value={new Date(request.updatedAt || request.createdAt).toLocaleString('en-US', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })}
                readOnly
                className="input-readonly no-edit-cursor"
                style={{ cursor: 'not-allowed' }}
              />
            </label>
          </div>
        </div>

        {/* Assigned To */}
        <div className="details-modal__section" ref={dropdownRef} style={{ position: 'relative' }}>
          <div className="details-modal__grid">
            <label>
              <span>Assigned To</span>
              <input
                type="text"
                value={assignedTo}
                onChange={handleAssignInputChange}
                placeholder="Enter Employee ID or Name"
                autoComplete="off"
                onFocus={() => isAssignedToEditable && assignedToOptions.length > 0 && setShowDropdown(true)}
                readOnly={!isAssignedToEditable}
                className={!isAssignedToEditable ? 'input-readonly no-edit-cursor' : ''}
                style={{ cursor: !isAssignedToEditable ? 'not-allowed' : 'text' }}
              />
              {fieldErrors.assignedTo && <p className="field-error">{fieldErrors.assignedTo}</p>}
            </label>

            {isAssignedToEditable && showDropdown && assignedToOptions.length > 0 && (
              <ul className="autocomplete-dropdown" style={{
                position: 'absolute',
                background: 'white',
                border: '1px solid #ccc',
                width: '100%',
                maxHeight: '150px',
                overflowY: 'auto',
                marginTop: '4px',
                zIndex: 1000,
                listStyle: 'none',
                padding: 0,
              }}>
                {assignedToOptions.map((option) => (
                  <li
                    key={option.value}
                    onClick={() => handleOptionSelect(option)}
                    style={{ padding: '8px', cursor: 'pointer' }}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    {option.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="details-modal__section">
          <h4 className="details-modal__section-title">Description</h4>
          <textarea
            value={request.description || 'N/A'}
            readOnly
            className="input-readonly no-edit-cursor"
            style={{ cursor: 'not-allowed' }}
          />
        </div>
        <div className="details-modal__section">
          <h4 className="details-modal__section-title">Remarks</h4>
          <textarea
            value={remarks}
            onChange={(e) => {
              setRemarks(e.target.value);
              setFieldErrors((prev) => ({ ...prev, remarks: '' }));
            }}
            readOnly={!isRemarksEditable}
            className={!isRemarksEditable ? 'input-readonly no-edit-cursor' : ''}
            style={{ cursor: !isRemarksEditable ? 'not-allowed' : 'text' }}
          />
          {fieldErrors.remarks && <p className="field-error">{fieldErrors.remarks}</p>}
        </div>

        <div className="details-modal__actions">
        {!readOnlyMode && (
         <button
       className="details-modal__save-btn"
        onClick={handleSave}
       disabled={loading}
         >
        {loading ? 'Saving...' : 'Save'}
        </button>
          )}
          <button className="details-modal__cancel-btn" onClick={onClose} disabled={loading}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default DetailsModal;
