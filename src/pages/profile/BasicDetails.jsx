import React, { useState, useEffect } from 'react';
import './BasicDetails.css';
import { fetchProfile, updateProfile } from '../../api/profile';
import { getToken } from '../../utils/auth';
import { PencilLineIcon, SaveIcon, XIcon } from 'lucide-react';
import { notifySuccess, notifyError } from '../../components/Toast/ToastProvider';

const BasicDetails = () => {
  const [profileImage, setProfileImage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [personalInfo, setPersonalInfo] = useState({
    fullName: '',
    employeeId: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    phone: '',
    personalEmail: '',
    alternatePhone: '',
    bloodGroup: '',
  });
  const [initialInfo, setInitialInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [imageError, setImageError] = useState(false);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  const genders = ['Male', 'Female', 'Other'];

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = getToken();
        if (!token) throw new Error('No auth token');
        const data = await fetchProfile(token);

        const formattedData = {
          fullName: data.fullName || '',
          employeeId: data.employeeId || '',
          dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split('T')[0] : '',
          gender: data.gender || '',
          email: data.email || '',
          phone: data.phone || '',
          personalEmail: data.personalEmail || '',
          alternatePhone: data.alternatePhone || '',
          bloodGroup: data.bloodGroup || '',
        };

        setPersonalInfo(formattedData);
        setInitialInfo(formattedData);
        setProfileImage(data.profileImageUrl || '');
        setError(null);
        setValidationErrors({});
      } catch (err) {
        notifyError(err.message || 'Failed to load profile.');
        setError(err.message || 'Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const isValidPhone = (value) => /^\d{10}$/.test(value);
  const isValidPartialPhone = (value) => /^\d{0,10}$/.test(value);
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isFutureDate = (dateStr) => {
    if (!dateStr) return false;
    const selected = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selected > today;
  };

  const hasValidationErrors = Object.values(validationErrors).some((msg) => msg);

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'phone':
        if (!value) error = 'Phone number is required';
        else if (!isValidPhone(value)) error = 'Phone must be exactly 10 digits';
        break;
      case 'alternatePhone':
        if (value && !isValidPhone(value)) error = 'Alternate phone must be exactly 10 digits';
        break;
      case 'personalEmail':
        if (value && !isValidEmail(value)) error = 'Invalid email address';
        break;
      case 'dateOfBirth':
        if (!value) error = 'Date of Birth is required';
        else if (isFutureDate(value)) error = 'Invalid Date of Birth';
        break;
      case 'gender':
        if (!value) error = 'Gender is required';
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if ((name === 'phone' || name === 'alternatePhone') && !isValidPartialPhone(value)) return;

    const error = validateField(name, value);
    setValidationErrors((prev) => ({ ...prev, [name]: error }));
    setPersonalInfo((prev) => ({ ...prev, [name]: value }));
  };

  const validateAllFields = () => {
    const errors = {};
    for (const [key, value] of Object.entries(personalInfo)) {
      const error = validateField(key, value);
      if (error) errors[key] = error;
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateAllFields()) {
      notifyError('Please correct the highlighted errors.');
      return;
    }

    try {
      setSaving(true);
      const token = getToken();
      if (!token) throw new Error('No auth token');

      const formData = new FormData();
      if (selectedFile) formData.append('profileImage', selectedFile);

      Object.entries(personalInfo).forEach(([key, value]) => {
        const isEditable = !['fullName', 'employeeId', 'email'].includes(key);
        const hasChanged = value !== initialInfo[key];
        if (isEditable && hasChanged) formData.append(key, value);
      });

      await updateProfile(token, formData);

      const updatedData = await fetchProfile(token);
      const updatedInfo = {
        fullName: updatedData.fullName || '',
        employeeId: updatedData.employeeId || '',
        dateOfBirth: updatedData.dateOfBirth ? updatedData.dateOfBirth.split('T')[0] : '',
        gender: updatedData.gender || '',
        email: updatedData.email || '',
        phone: updatedData.phone || '',
        personalEmail: updatedData.personalEmail || '',
        alternatePhone: updatedData.alternatePhone || '',
        bloodGroup: updatedData.bloodGroup || '',
      };

      setPersonalInfo(updatedInfo);
      setInitialInfo(updatedInfo);
      setProfileImage(updatedData.profileImageUrl || '');
      notifySuccess('Profile updated successfully!');
      setEditing(false);
      setSelectedFile(null);
      setValidationErrors({});
    } catch (err) {
      notifyError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleUploadImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const renderAvatar = () => {
    const hasImage = profileImage && !imageError;
    if (hasImage) {
      return <img src={profileImage} alt="Profile" className="profile-image" onError={() => setImageError(true)} />;
    }

    const initials = (() => {
      const words = personalInfo.fullName.trim().split(/\s+/);
      if (words.length === 1) return words[0][0].toUpperCase();
      return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    })();

    return (
      <div className="profile-image initials">
        <div className="icon-placeholder">
          <h1>{initials}</h1>
        </div>
      </div>
    );
  };

  const fieldLabels = {
    fullName: 'Full Name',
    employeeId: 'Employee ID',
    dateOfBirth: 'Date of Birth',
    gender: 'Gender',
    email: 'Email',
    phone: 'Phone Number',
    personalEmail: 'Personal Email',
    alternatePhone: 'Alternate Phone',
    bloodGroup: 'Blood Group',
  };

  const readOnlyFields = ['fullName', 'employeeId', 'email'];

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div className="error-msg">Error: {error}</div>;

  return (
    <div className="employee-profile">
      <div className="profile-header">
        <div className="profile-info flex justify-between items-center w-full">
          <div className="name-and-upload">
            {renderAvatar()}
            <h2 className="employee-name">{personalInfo.fullName || 'No Name'}</h2>
            {editing && (
              <>
                <label htmlFor="upload-input" className="upload-btns">Upload New Picture</label>
                <input type="file" id="upload-input" style={{ display: 'none' }} accept="image/*" onChange={handleUploadImage} />
              </>
            )}
          </div>
          <button
            className={`edit-btn ${editing ? 'bg-red-500 hover:bg-red-700 text-white' : 'bg-gray-500 hover:bg-gray-700 text-gray-100'}`}
            onClick={() => {
              if (editing) setValidationErrors({});
              setEditing(!editing);
              if (editing) setPersonalInfo(initialInfo);
            }}
          >
            <PencilLineIcon size={20} className={editing ? 'hidden' : 'block'} />
            <XIcon size={20} className={editing ? 'block' : 'hidden'} />
            {editing ? 'Cancel' : 'Edit'}
          </button>
        </div>
      </div>

      <div className="profile-details">
        <div className="info-grid">
          {Object.entries(personalInfo).map(([key, value]) => (
            <div key={key} className="input-group">
              <label><strong>{fieldLabels[key]}</strong></label>
              {editing && key === 'bloodGroup' ? (
                <select name={key} value={value} onChange={handleChange} className={`styled-input ${validationErrors[key] ? 'error-border' : ''}`}
>
                  <option value="">Select</option>
                  {bloodGroups.map((group) => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
              ) : editing && key === 'gender' ? (
                <select name={key} value={value} onChange={handleChange} className={`styled-input ${validationErrors[key] ? 'error-border' : ''}`}
>
                  <option value="">Select</option>
                  {genders.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              ) : key === 'dateOfBirth' ? (
                editing ? (
                  <input
                    type="date"
                    name={key}
                    value={value}
                    onChange={handleChange}
                    max={new Date().toISOString().split('T')[0]}
                    className={`styled-input ${validationErrors[key] ? 'error-border' : ''}`}
                    required
                  />
                ) : (
                  <input
                    type="text"
                    value={new Date(value).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                    readOnly
                    className="readonly-input"
                  />
                )
              ) : (
                <input
                  type="text"
                  name={key}
                  value={value}
                  onChange={handleChange}
                  readOnly={!editing || readOnlyFields.includes(key)}
                  maxLength={key.includes('Phone') ? 10 : undefined}
                  className={`styled-input ${validationErrors[key] ? 'error-border' : ''}`}
                  required
                />
              )}
              {validationErrors[key] && editing && <div className="input-error">{validationErrors[key]}</div>}
            </div>
          ))}
        </div>

        {editing && (
          <div className="save-btn-container">
            <button
            className="save-btn"
            onClick={handleSave}
           disabled={saving || hasValidationErrors}
            >
           {saving ? 'Saving...' : 'Save Changes'}
          </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BasicDetails;
