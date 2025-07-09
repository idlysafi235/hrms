// src/pages/pay/tax/Form16Details.jsx
import React from 'react';
import './TaxStyles.css';

const Form16Details = () => {
  const form16 = {
    financialYear: '2024-25',
    downloaded: true,
    downloadLink: '#',
    tdsAmount: '₹42,000',
    issuedDate: '2025-06-01'
  };

  return (
    <div className="tax-container">
      <h2>Form 16 Details</h2>
      <div className="tax-box">
        <p><strong>Financial Year:</strong> {form16.financialYear}</p>
        <p><strong>TDS Deducted:</strong> {form16.tdsAmount}</p>
        <p><strong>Issued Date:</strong> {form16.issuedDate}</p>
        {form16.downloaded ? (
          <a href={form16.downloadLink} className="download-btn">Download Form 16</a>
        ) : (
          <p>Status: Not Available Yet</p>
        )}
      </div>
    </div>
  );
};

export default Form16Details;
