import React, { useState, useEffect } from 'react';
import './EsiForm.css';
import { fetchProfile } from '../../../api/services';
import { getToken } from '../../../utils/auth';


const formatDate = (dateStr) => {
    if (!dateStr) return '–';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

const RequiredLabel = ({ children }) => (
  <label className="esi-label">
    {children} <span className="esi-required">*</span>
  </label>
);

const EsiForm = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = getToken(); 

  useEffect(() => {
      const loadData = async () => {
        try {
          const profileData = await fetchProfile(token);
          setProfile(profileData);
        } catch (err) {
          setError(err.message || 'Error loading profile');
        } finally {
          setLoading(false);
        }
      };
  
      loadData();
    }, [token]);

  return (
    <div className="esi-container">
      <h2 className="esi-heading">ESI Registration Form</h2>

      <table className="tax-table">
        <tbody>
          <tr>
            <td><strong>Employee ID</strong></td>
            <td>{profile?.employeeId}</td>
            <td><strong>Employee Name</strong></td>
            <td>{profile?.fullName}</td>
          </tr>
          <tr>
            <td><strong>Date of Joining</strong></td>
            <td>{formatDate(profile?.dateOfJoining)}</td>
            <td><strong>Position</strong></td>
            <td>{profile?.position}</td>
          </tr>
        </tbody>
      </table>

      <h3 className="esi-subheading">Personal Details</h3>
      <div className="esi-form-row"><RequiredLabel>Name (as per Aadhar)</RequiredLabel><input type="text" required /></div>
      <div className="esi-form-row"><RequiredLabel>Aadhar Number</RequiredLabel><input type="text" required /></div>
      <div className="esi-form-row"><RequiredLabel>Marital Status</RequiredLabel><input type="text" required /></div>
      <div className="esi-form-row"><RequiredLabel>Date of Birth (as per Aadhar)</RequiredLabel><input type="date" required /></div>
      <div className="esi-form-row"><RequiredLabel>Relationship</RequiredLabel><input type="text" required /></div>
      <div className="esi-grid-2">
        <div className="esi-form-row"><RequiredLabel>Permanent Address</RequiredLabel><input type="text" required /></div>
        <div className="esi-form-row"><RequiredLabel>City</RequiredLabel><input type="text" required /></div>
        <div className="esi-form-row"><RequiredLabel>State</RequiredLabel><input type="text" required /></div>
        <div className="esi-form-row"><RequiredLabel>Pincode</RequiredLabel><input type="text" required /></div>
      </div>

      <div className="esi-checkbox-row">
        <input type="checkbox" id="copyAddress" />
        <label htmlFor="copyAddress">Copy permanent address to current address</label>
      </div>

      <div className="esi-grid-2">
        <div className="esi-form-row"><RequiredLabel>Current Address</RequiredLabel><input type="text" required /></div>
        <div className="esi-form-row"><RequiredLabel>City</RequiredLabel><input type="text" required /></div>
        <div className="esi-form-row"><RequiredLabel>State</RequiredLabel><input type="text" required /></div>
        <div className="esi-form-row"><RequiredLabel>Pincode</RequiredLabel><input type="text" required /></div>
      </div>
      <div className="esi-form-row"><RequiredLabel>Personal Email</RequiredLabel><input type="email" required /></div>
      <div className="esi-form-row"><RequiredLabel>Mobile Number</RequiredLabel><input type="text" required /></div>
      <div className="esi-form-row"><RequiredLabel>PAN Number</RequiredLabel><input type="text" required /></div>
      <div className="esi-form-row"><RequiredLabel>Name as per PAN</RequiredLabel><input type="text" required /></div>

      <h3 className="esi-subheading">ESI Details</h3>
      <div className="esi-form-row"><RequiredLabel>Previous ESI (if any)</RequiredLabel><input type="text" required /></div>
      <div className="esi-form-row"><RequiredLabel>Preferred ESI Dispensary</RequiredLabel><input type="text" required /></div>
      <div className="esi-form-row"><RequiredLabel>Nominee Name(as per Aadhar)</RequiredLabel><input type="text" required /></div>
      <div className="esi-form-row"><RequiredLabel>Nominee Marital Status</RequiredLabel><input type="text" required /></div>
      <div className="esi-form-row"><RequiredLabel>Nominee DOB (as per Aadhar)</RequiredLabel><input type="date" required /></div>
      <div className="esi-form-row"><RequiredLabel>Nominee Relationship</RequiredLabel><input type="text" required /></div>
      <div className="esi-form-row"><RequiredLabel>Nominee Mobile Number</RequiredLabel><input type="text" required /></div>

      <h3 className="esi-subheading">Dependents</h3>
      <div className="esi-grid-2">
        <div className="esi-form-row"><RequiredLabel>Dependent Name</RequiredLabel><input type="text" required /></div>
        <div className="esi-form-row"><RequiredLabel>Relationship</RequiredLabel><input type="text" required /></div>
        <div className="esi-form-row"><RequiredLabel>Date of Birth</RequiredLabel><input type="date" required /></div>
        <div className="esi-form-row"><RequiredLabel>Aadhar Number</RequiredLabel><input type="text" required /></div>
        <div className="esi-form-row"><RequiredLabel>Mobile Number</RequiredLabel><input type="text" required /></div>
      </div>

      <h3 className="esi-subheading">Bank Details</h3>
      <div className="esi-grid-2">
        <div className="esi-form-row"><RequiredLabel>Bank Name</RequiredLabel><input type="text" required /></div>
        <div className="esi-form-row"><RequiredLabel>Name as per Bank</RequiredLabel><input type="text" required /></div>
        <div className="esi-form-row"><RequiredLabel>Bank A/C No.</RequiredLabel><input type="text" required /></div>
        <div className="esi-form-row"><RequiredLabel>IFSC / RGTS Code</RequiredLabel><input type="text" required /></div>
        <div className="esi-form-row"><RequiredLabel>MICR Code</RequiredLabel><input type="text" required /></div>
        <div className="esi-form-row"><RequiredLabel>Bank Branch</RequiredLabel><input type="text" required /></div>
      </div>

      <div className="esi-save-btn">
        <button type="submit">Save</button>
      </div>
    </div>
  );
};

export default EsiForm;
