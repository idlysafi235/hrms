import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './PersonalInfoForm.css';

const PersonalInfoForm = () => {
  const navigate = useNavigate(); 

  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    gender: '',
    nationality: '',
    maritalStatus: '',
    bloodGroup: '',
    disabilityStatus: '',
    aadharNumber: '',
    panNumber: '',
    passportNumber: '',
    passportExpiry: '',
    religion: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('personalInfo');
    if (saved) {
      setFormData(JSON.parse(saved));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    localStorage.setItem('personalInfo', JSON.stringify(formData));
  }, [formData]);


  const isFormComplete = Object.values(formData).every((value) => value.trim() !== '');

  const handleNext = () => {
    if (isFormComplete) {
     
      navigate('/onboarding/contact-address'); 
    }
  };

  return (
    <div className="personal-info-container">
      <h2 className="form-title">Personal Information</h2>

      <div className="form-row">
        <label>Full Name</label>
        <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} />
      </div>
      <div className="form-row">
        <label>Date of Birth</label>
        <input type="date" name="dob" value={formData.dob} onChange={handleChange} />
      </div>
      <div className="form-row">
        <label>Gender</label>
        <select name="gender" value={formData.gender} onChange={handleChange}>
          <option value="">Select</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div className="form-row">
        <label>Nationality</label>
        <input type="text" name="nationality" value={formData.nationality} onChange={handleChange} />
      </div>
      <div className="form-row">
        <label>Marital Status</label>
        <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange}>
          <option value="">Select</option>
          <option value="Single">Single</option>
          <option value="Married">Married</option>
          <option value="Divorced">Divorced</option>
          <option value="Widowed">Widowed</option>
        </select>
      </div>
      <div className="form-row">
        <label>Blood Group</label>
        <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}>
          <option value="">Select</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
        </select>
      </div>
      <div className="form-row">
        <label>Disability Status</label>
        <select name="disabilityStatus" value={formData.disabilityStatus} onChange={handleChange}>
          <option value="">Select</option>
          <option value="None">None</option>
          <option value="Physically Disabled">Physically Disabled</option>
          <option value="Visually Impaired">Visually Impaired</option>
          <option value="Hearing Impaired">Hearing Impaired</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div className="form-row">
        <label>Aadhar Number</label>
        <input type="text" name="aadharNumber" maxLength="12" value={formData.aadharNumber} onChange={handleChange} />
      </div>
      <div className="form-row">
        <label>PAN Number</label>
        <input type="text" name="panNumber" maxLength="10" value={formData.panNumber} onChange={handleChange} />
      </div>
      <div className="form-row">
        <label>Passport Number</label>
        <input type="text" name="passportNumber" value={formData.passportNumber} onChange={handleChange} />
      </div>
      <div className="form-row">
        <label>Passport Expiry</label>
        <input type="date" name="passportExpiry" value={formData.passportExpiry} onChange={handleChange} />
      </div>
      <div className="form-row">
        <label>Religion</label>
        <input type="text" name="religion" value={formData.religion} onChange={handleChange} />
      </div>

      <div className="form-button-container">
        <button
          className={`next-button ${isFormComplete ? 'enabled' : 'disabled'}`}
          onClick={handleNext}
          disabled={!isFormComplete}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
