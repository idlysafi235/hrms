import React, { useState, useEffect } from 'react';
import { addBankDetails } from '../../../api/pay';
import { getToken as getAuthToken } from '../../../utils/auth';
import './BankDetailsEdit.css';

const BankDetailsEdit = ({ onClose, bankInfo }) => {
  const [fullName, setfullName] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [branch, setBranch] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [accountType, setAccountType] = useState('Savings'); 
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (bankInfo) {
      setfullName(bankInfo.fullName || '');
      setBankName(bankInfo.bankName || '');
      setBranch(bankInfo.branch || '');
      setAccountNumber(bankInfo.accountNumber || '');
      setIfscCode(bankInfo.ifscCode || '');
      setAccountType(bankInfo.accountType || 'Savings');
    }
  }, [bankInfo]);

  const handleSave = async () => {
    const token = getAuthToken();
    setError('');
    setSuccess('');

    if (!fullName || !bankName || !accountNumber || !ifscCode || !branch || !accountType) {
      setError('All fields are required');
      return;
    }

    try {
      await addBankDetails(token, {
        fullName,
        bankName,
        accountNumber,
        ifscCode,
        branch,
        accountType,
      });
      setSuccess('Bank details saved successfully');
      setTimeout(() => {
        if (onClose) onClose();
      }, 1000);
    } catch (err) {
      console.error(err);
      setError('Failed to save bank details');
    }
  };

  return (
    <div className="bank-edit-form">
  <h2>{bankInfo ? 'Update Bank Details' : 'Enter Bank Details'}</h2>

  {error && <div className="error-message">{error}</div>}
  {success && <div className="success-message">{success}</div>}

  <div>
    <label>Full Name</label>
    <input
      type="text"
      value={fullName}
      onChange={(e) => setfullName(e.target.value)}
      placeholder="Enter Full name"
    />
  </div>

  <div>
    <label>Bank Name</label>
    <input
      type="text"
      value={bankName}
      onChange={(e) => setBankName(e.target.value)}
      placeholder="Enter bank name"
    />
  </div>

  <div>
    <label>Account Number</label>
    <input
      type="text"
      value={accountNumber}
      onChange={(e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
          setAccountNumber(value);
        }
      }}
      placeholder="Enter account number"
      inputMode="numeric"
      maxLength={18}
    />
  </div>

  <div>
    <label>IFSC Code</label>
    <input
      type="text"
      value={ifscCode}
      onChange={(e) => setIfscCode(e.target.value)}
      placeholder="Enter IFSC code"
      maxLength={18}
    />
  </div>

  <div>
    <label>Branch</label>
    <input
      type="text"
      value={branch}
      onChange={(e) => setBranch(e.target.value)}
      placeholder="Enter branch name"
    />
  </div>

  <div>
    <label>Account Type</label>
    <select
      value={accountType}
      onChange={(e) => setAccountType(e.target.value)}
    >
      <option value="Savings">Savings</option>
      <option value="Current">Current</option>
    </select>
  </div>

  <div className="bank-edit-buttons">
    <button className="save-button" onClick={handleSave}>Save</button>
    <button className="cancel-button" onClick={onClose}>Cancel</button>
  </div>
</div>

  );
};

export default BankDetailsEdit;
