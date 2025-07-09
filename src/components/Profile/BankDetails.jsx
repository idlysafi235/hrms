import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';  
import "./documents.css";
import ProfileNavbar from '../Layouts/SelfServiceNavbar';

const BankDetails = () => {
  const [bankDetails, setBankDetails] = useState({ bankName: '', accountNumber: '', ifscCode: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBankDetails({
      ...bankDetails,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted Bank Details:', bankDetails);
    navigate('/success');  
  };

  return (
    <div className="employee-profile">
      <ProfileNavbar />

      <h2>Bank Details</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Bank Name</label>
          <input
            type="text"
            name="bankName"
            value={bankDetails.bankName}
            onChange={handleChange}
            placeholder="Enter your bank name"
            required
          />
        </div>

        <div className="form-group">
          <label>Account Number</label>
          <input
            type="text"
            name="accountNumber"
            value={bankDetails.accountNumber}
            onChange={handleChange}
            placeholder="Enter your account number"
            required
          />
        </div>

        <div className="form-group">
          <label>IFSC Code</label>
          <input
            type="text"
            name="ifscCode"
            value={bankDetails.ifscCode}
            onChange={handleChange}
            placeholder="Enter IFSC code"
            required
          />
        </div>

        <div className="buttons">
          <button type="submit" className="submit-btn">
            Submit Bank Details
          </button>
        </div>
      </form>

      <div className="completion-message">
        <p style={{ color: "green" }}>🎉 You have completed the onboarding process!</p>
      </div>
    </div>
  );
};

export default BankDetails;
