import React, { useState, useEffect } from 'react';
import './Address.css';
import { fetchProfile, updateProfile } from '../../api/profile';
import { getToken } from '../../utils/auth';
import { PencilLineIcon, SaveIcon, XIcon } from 'lucide-react';
import { notifySuccess, notifyError } from '../../components/Toast/ToastProvider';

const Address = () => {
  const [addressInfo, setAddressInfo] = useState({
    currentLine1: '',
    currentLine2: '',
    currentCity: '',
    currentState: '',
    currentCountry: '',
    currentPincode: '',
    permanentLine1: '',
    permanentLine2: '',
    permanentCity: '',
    permanentState: '',
    permanentCountry: '',
    permanentPincode: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const loadAddress = async () => {
      try {
        const token = getToken();
        if (!token) throw new Error('No auth token');

        const data = await fetchProfile(token);

        setAddressInfo({
          currentLine1: data.currentAddress?.addressLine1 || '',
          currentLine2: data.currentAddress?.addressLine2 || '',
          currentCity: data.currentAddress?.city || '',
          currentState: data.currentAddress?.state || '',
          currentCountry: data.currentAddress?.country || '',
          currentPincode: data.currentAddress?.pincode || '',

          permanentLine1: data.permanentAddress?.addressLine1 || '',
          permanentLine2: data.permanentAddress?.addressLine2 || '',
          permanentCity: data.permanentAddress?.city || '',
          permanentState: data.permanentAddress?.state || '',
          permanentCountry: data.permanentAddress?.country || '',
          permanentPincode: data.permanentAddress?.pincode || '',
        });

        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadAddress();
  }, []);

  const validateField = (name, value) => {
    let error = '';

    if (name.includes('Pincode')) {
      if (!/^\d*$/.test(value)) {
        error = 'Pincode must contain only numbers';
      } else if (value.length !== 6) {
        error = 'Pincode must be exactly 6 digits';
      }
    }
    if (
      (name.includes('City') || name.includes('State') || name.includes('Country')) &&
      value.trim() === ''
    ) {
      const label = name
        .replace(/current|permanent/, '')
        .replace(/([A-Z])/g, ' $1')
        .trim();
      error = `${label} cannot be empty`;
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);

    setValidationErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    setAddressInfo((prev) => ({ ...prev, [name]: value }));
  };

  const hasErrors = () => {
    return Object.values(validationErrors).some((err) => err);
  };

  const handleSave = async () => {
    if (hasErrors()) {
      notifyError('Fix  errors before saving.');
      return;
    }

    try {
      setSaving(true);
      const token = getToken();
      if (!token) throw new Error('No auth token');

      const payload = {
        currentAddress: {
          addressLine1: addressInfo.currentLine1,
          addressLine2: addressInfo.currentLine2,
          city: addressInfo.currentCity,
          state: addressInfo.currentState,
          country: addressInfo.currentCountry,
          pincode: addressInfo.currentPincode,
        },
        permanentAddress: {
          addressLine1: addressInfo.permanentLine1,
          addressLine2: addressInfo.permanentLine2,
          city: addressInfo.permanentCity,
          state: addressInfo.permanentState,
          country: addressInfo.permanentCountry,
          pincode: addressInfo.permanentPincode,
        },
      };

      await updateProfile(token, payload);

      const updated = await fetchProfile(token);
      setAddressInfo({
        currentLine1: updated.currentAddress?.addressLine1 || '',
        currentLine2: updated.currentAddress?.addressLine2 || '',
        currentCity: updated.currentAddress?.city || '',
        currentState: updated.currentAddress?.state || '',
        currentCountry: updated.currentAddress?.country || '',
        currentPincode: updated.currentAddress?.pincode || '',

        permanentLine1: updated.permanentAddress?.addressLine1 || '',
        permanentLine2: updated.permanentAddress?.addressLine2 || '',
        permanentCity: updated.permanentAddress?.city || '',
        permanentState: updated.permanentAddress?.state || '',
        permanentCountry: updated.permanentAddress?.country || '',
        permanentPincode: updated.permanentAddress?.pincode || '',
      });

      notifySuccess('Address updated successfully!');
      setEditing(false);
      setError(null);
      setValidationErrors({});
    } catch (err) {
      notifyError(`Failed to update address: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading address...</div>;
  if (error) return <div className="error-msg">Error: {error}</div>;
  const renderInput = (name, placeholder) => (
    <div className="input-wrapper" key={name}>
      <input
        name={name}
        value={addressInfo[name]}
        onChange={handleChange}
        placeholder={placeholder}
        readOnly={!editing}
        maxLength={name.includes('Pincode') ? 6 : undefined}
        inputMode={name.includes('Pincode') ? 'numeric' : undefined}
        pattern={name.includes('Pincode') ? '[0-9]*' : undefined}
        className={validationErrors[name] ? 'input-error-border' : ''}
      />
      {validationErrors[name] && (
        <div className="input-error">{validationErrors[name]}</div>
      )}
    </div>
  );

  return (
    <div className="address-group">
      <div className="address-header">
        <h2>Address Details</h2>
        <button className={`edit-btn `} onClick={() => setEditing(!editing)}>
          <PencilLineIcon className={editing ? 'hidden' : 'block'} size={16} />
          <XIcon className={editing ? 'block' : 'hidden'} size={16} />
          {editing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      <div className="address-group">
        <h3>Current Address</h3>
        <div className="address-grid">
          {[
            ['currentLine1', 'Address Line 1'],
            ['currentLine2', 'Address Line 2'],
            ['currentCity', 'City'],
            ['currentState', 'State'],
            ['currentCountry', 'Country'],
            ['currentPincode', 'Pincode'],
          ].map(([name, placeholder]) => renderInput(name, placeholder))}
        </div>
      </div>

      <div className="address-group">
        <h3>Permanent Address</h3>
        <div className="address-grid">
          {[
            ['permanentLine1', 'Address Line 1'],
            ['permanentLine2', 'Address Line 2'],
            ['permanentCity', 'City'],
            ['permanentState', 'State'],
            ['permanentCountry', 'Country'],
            ['permanentPincode', 'Pincode'],
          ].map(([name, placeholder]) => renderInput(name, placeholder))}
        </div>
      </div>

      {editing && (
        <div className="save-btn-container">
          <button
            className="save-btn"
            onClick={handleSave}
            disabled={saving || hasErrors()}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Address;
