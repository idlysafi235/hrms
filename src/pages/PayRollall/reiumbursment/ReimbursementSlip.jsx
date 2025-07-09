import React, { useEffect, useState, useRef } from 'react';
import './Reimbursement.css';
import { getMyReimbursements } from '../../../api/reimbursementsApi';
import { getToken } from '../../../utils/auth';

const formatLabel = (key) => {
  const map = {
    claimId: 'Claim ID',
    name: 'Employee Name',
    employeeId: 'Employee ID',
    category: 'Category',
    amount: 'Amount (₹)',
    date: 'Date of Expense',
    description: 'Description',
    status: 'Status',
    approvedBy: 'Approved By',
    approvedDate: 'Approved Date',
  };
  return map[key] || key.replace(/([A-Z])/g, ' $1');
};

const ReimbursementSlip = () => {
  const [approvedSlips, setApprovedSlips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = getToken();
  const slipRef = useRef();

  useEffect(() => {
    const fetchSlips = async () => {
      try {
        const allClaims = await getMyReimbursements(token);
        const approvedOnly = allClaims.filter(c => c.Status === 'Approved');
        setApprovedSlips(approvedOnly);
      } catch (err) {
        setError('Failed to load slips');
      } finally {
        setLoading(false);
      }
    };
    fetchSlips();
  }, [token]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const content = slipRef.current.innerHTML;
    const newWindow = window.open('', '', 'width=800,height=700');
    newWindow.document.write(`<html><head><title>Reimbursement Slip</title>`);
    newWindow.document.write(`<style>
      body { font-family: Arial, sans-serif; padding: 20px; }
      .slip-card { border: 1px solid #ccc; padding: 16px; margin-bottom: 20px; border-radius: 8px; }
      .slip-card p { margin: 6px 0; }
    </style></head><body>`);
    newWindow.document.write(content);
    newWindow.document.write('</body></html>');
    newWindow.document.close();
    newWindow.print();
  };

  return (
    <div className="reimburse-container">
      <div className="reimburse-header">
        <h2>Approved Reimbursement Slips</h2>
        <div className="reimburse-actions">
          <button onClick={handleDownload}>Download PDF</button>
          <button onClick={handlePrint}>Print</button>
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error-msg">{error}</p>}
      {!loading && approvedSlips.length === 0 && <p>No approved slips found.</p>}

      <div ref={slipRef}>
        {approvedSlips.map((claim) => (
          <div className="slip-card" key={claim.ClaimID}>
            <p><strong>{formatLabel('claimId')}:</strong> {claim.ClaimID}</p>
            <p><strong>{formatLabel('name')}:</strong> {claim.EmployeeName || '-'}</p>
            <p><strong>{formatLabel('employeeId')}:</strong> {claim.EmployeeID || '-'}</p>
            <p><strong>{formatLabel('category')}:</strong> {claim.ReimbursementType}</p>
            <p><strong>{formatLabel('amount')}:</strong> ₹{claim.Amount}</p>
            <p><strong>{formatLabel('date')}:</strong> {new Date(claim.ClaimDate).toLocaleDateString('en-IN')}</p>
            <p><strong>{formatLabel('description')}:</strong> {claim.Description}</p>
            <p><strong>{formatLabel('status')}:</strong> {claim.Status}</p>
            <p><strong>{formatLabel('approvedBy')}:</strong> {claim.ApprovedBy || '-'}</p>
            <p><strong>{formatLabel('approvedDate')}:</strong> {claim.ApprovedDate ? new Date(claim.ApprovedDate).toLocaleDateString('en-IN') : '-'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReimbursementSlip;
