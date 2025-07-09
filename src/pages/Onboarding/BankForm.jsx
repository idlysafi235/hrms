import React, { useState } from 'react';
import './BankForm.css';

const BankForm = () => {
  const [bankDetails, setBankDetails] = useState({
    accountHolderName: '',
    accountNumber: '',
    bankName: '',
    ifscCode: '',
    branch: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBankDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    console.log('Bank Details:', bankDetails);
    alert('Next clicked! Check console for data.');
  };


  const isNextDisabled = Object.values(bankDetails).some((val) => val.trim() === '');

  return (
    <section className="form-section" aria-label="Bank Details Form">
      <h2 className="form-title">Bank Details</h2>

      <div className="form-row">
        <label htmlFor="accountHolderName">Account Holder Name</label>
        <input
          id="accountHolderName"
          name="accountHolderName"
          type="text"
          value={bankDetails.accountHolderName}
          onChange={handleChange}
          placeholder="Full Name"
          autoComplete="off"
        />
      </div>

      <div className="form-row">
        <label htmlFor="accountNumber">Account Number</label>
        <input
          id="accountNumber"
          name="accountNumber"
          type="text"
          value={bankDetails.accountNumber}
          onChange={handleChange}
          placeholder="Account Number"
          autoComplete="off"
        />
      </div>

      <div className="form-row">
        <label htmlFor="bankName">Bank Name</label>
        <input
          id="bankName"
          name="bankName"
          type="text"
          value={bankDetails.bankName}
          onChange={handleChange}
          placeholder="Bank Name"
          autoComplete="off"
        />
      </div>

      <div className="form-row">
        <label htmlFor="ifscCode">IFSC Code</label>
        <input
          id="ifscCode"
          name="ifscCode"
          type="text"
          value={bankDetails.ifscCode}
          onChange={handleChange}
          placeholder="IFSC Code"
          autoComplete="off"
        />
      </div>

      <div className="form-row">
        <label htmlFor="branch">Branch</label>
        <input
          id="branch"
          name="branch"
          type="text"
          value={bankDetails.branch}
          onChange={handleChange}
          placeholder="Branch Name"
          autoComplete="off"
        />
      </div>

      <div className="form-button-container">
        <button
          type="button"
          className={`next-button ${isNextDisabled ? 'disabled' : 'enabled'}`}
          onClick={handleNext}
          disabled={isNextDisabled}
          aria-disabled={isNextDisabled}
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default BankForm;
