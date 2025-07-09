import React, { useState, useEffect } from 'react';
import { fetchProfile } from '../../../api/services';
import { fetchBankDetails } from '../../../api/pay';
import './EmployeeProfile.css';
import { getToken } from '../../../utils/auth';

const formatValue = (val) => (val ? val : '–');

const formatDate = (dateStr) => {
  if (!dateStr) return '–';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const EmployeeProfile = () => {
  const [activeTab, setActiveTab] = useState('basic');
  const [profile, setProfile] = useState(null);
  const [bankDetails, setBankDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = getToken(); 

  useEffect(() => {
    const loadData = async () => {
      try {
        const profileData = await fetchProfile(token);
        const bankData = await fetchBankDetails(token);
        setProfile(profileData);
        setBankDetails(bankData);
      } catch (err) {
        setError(err.message || 'Error loading profile');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [token]);

  const renderBasicInfo = () => (
    <div className="employee-info-grid">
      <div className="employee-input-group"><label>Employee ID</label><input type="text" value={formatValue(profile?.employeeId)} readOnly /></div>
      <div className="employee-input-group"><label>Employee Name</label><input type="text" value={formatValue(profile?.fullName)} readOnly /></div>
      <div className="employee-input-group"><label>Date of Birth</label><input type="text" value={formatDate(profile?.dateOfBirth)} readOnly /></div>
      <div className="employee-input-group"><label>Gender</label><input type="text" value={formatValue(profile?.gender)} readOnly /></div>
      <div className="employee-input-group"><label>Email ID</label><input type="email" value={formatValue(profile?.email)} readOnly /></div>
      <div className="employee-input-group"><label>Employee Status</label><input type="text" value={formatValue(profile?.status)} readOnly /></div>
      <div className="employee-input-group"><label>Date of Joining</label><input type="text" value={formatDate(profile?.dateOfJoining)} readOnly /></div>
      <div className="employee-input-group"><label>Last Working Day</label><input type="text" value="–" readOnly /></div>
      <div className="employee-input-group"><label>Personal Email ID</label><input type="email" value={formatValue(profile?.personalEmail)} readOnly /></div>
      <div className="employee-input-group"><label>Father's Name</label><input type="text" value="–" readOnly /></div>
      <div className="employee-input-group"><label>PAN</label><input type="text" value={formatValue(profile?.PANNumber)} readOnly /></div>
      <div className="employee-input-group"><label>Termination Reason</label><input type="text" value="–" readOnly /></div>
      <div className="employee-input-group"><label>Termination Action</label><input type="text" value="–" readOnly /></div>
      <div className="employee-input-group"><label>Nationality</label><input type="text" value="–" readOnly /></div>
      <div className="employee-input-group"><label>Aadhar Number</label><input type="text" value={formatValue(profile?.aadhaarNumber)} readOnly /></div>
      <div className="employee-input-group"><label>Actual Termination Date</label><input type="text" value="–" readOnly /></div>
      <div className="employee-input-group"><label>Date of Resignation</label><input type="text" value="–" readOnly /></div>
    </div>
  );

  const renderOrganizationInfo = () => (
    <div className="employee-info-grid">
      <div className="employee-input-group"><label>Entity</label><input type="text" value="–" readOnly /></div>
      <div className="employee-input-group"><label>Department</label><input type="text" value={formatValue(profile?.department)} readOnly /></div>
      <div className="employee-input-group"><label>Location</label><input type="text" value="–" readOnly /></div>
      <div className="employee-input-group"><label>Grade / Level</label><input type="text" value="–" readOnly /></div>
      <div className="employee-input-group"><label>Position</label><input type="text" value={formatValue(profile?.position)} readOnly /></div>
      <div className="employee-input-group"><label>Project Code</label><input type="text" value="–" readOnly /></div>
    </div>
  );

  const renderBankInfo = () => (
    <div className="employee-info-grid">
      <div className="employee-input-group"><label>Bank Name</label><input type="text" value={formatValue(bankDetails?.bankName)} readOnly /></div>
      <div className="employee-input-group"><label>Account Holder Name</label><input type="text" value={formatValue(bankDetails?.fullName)} readOnly /></div>
      <div className="employee-input-group"><label>Account Number</label><input type="text" value={formatValue(bankDetails?.accountNumber)} readOnly /></div>
      <div className="employee-input-group"><label>IFSC Code</label><input type="text" value={formatValue(bankDetails?.ifscCode)} readOnly /></div>
      <div className="employee-input-group"><label>Branch Name</label><input type="text" value={formatValue(bankDetails?.branch)} readOnly /></div>
      <div className="employee-input-group"><label>Account Type</label><input type="text" value={formatValue(bankDetails?.accountType)} readOnly /></div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return renderBasicInfo();
      case 'organization':
        return renderOrganizationInfo();
      case 'bank':
        return renderBankInfo();
      default:
        return null;
    }
  };

  if (loading) return <div className="loading">Loading profile...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="employee-profile-page">
      <h2>Employee Profile</h2>

      <div className="employee-tab-navigation">
        <button className={activeTab === 'basic' ? 'active' : ''} onClick={() => setActiveTab('basic')}>Basic Info</button>
        <button className={activeTab === 'organization' ? 'active' : ''} onClick={() => setActiveTab('organization')}>Organization Info</button>
        <button className={activeTab === 'bank' ? 'active' : ''} onClick={() => setActiveTab('bank')}>Bank Info</button>
      </div>
      {renderTabContent()}
    </div>
  );
};

export default EmployeeProfile;
