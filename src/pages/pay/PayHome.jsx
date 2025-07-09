import React, { useEffect, useState } from 'react';
import './PayHome.css';
import {
  fetchRecentPayslips,
  fetchPayrollSummary,
  fetchBankDetails,
} from '../../api/pay';
import { getToken  } from '../../utils/auth';
import BankDetailsEdit from '../PayRollall/pay/BankDetailsEdit'; 

const PayHome = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [payslips, setPayslips] = useState([]);
  const [payrollRecord, setPayrollRecord] = useState(null);
  const [bankInfo, setBankInfo] = useState(null);
  const [showBankModal, setShowBankModal] = useState(false); 

  const getUser = () => JSON.parse(localStorage.getItem('user')) || {};
  const getEmployeeId = () => getUser().employeeId || '';

  useEffect(() => {
    const token = getToken();
    const employeeId = getEmployeeId();

    if (!employeeId || !token) {
      setError('Missing employee ID or token. Please login again.');
      setLoading(false);
      return;
    }

    const loadData = async () => {
      setLoading(true);
      try {
        const [fetchedPayslips, fetchedPayrollArray] = await Promise.all([
          fetchRecentPayslips(token),
          fetchPayrollSummary(token, employeeId),
        ]);

        setPayslips(fetchedPayslips || []);

        if (Array.isArray(fetchedPayrollArray) && fetchedPayrollArray.length > 0) {
          fetchedPayrollArray.sort((a, b) =>
            b.year !== a.year ? b.year - a.year : b.month - a.month
          );
          setPayrollRecord(fetchedPayrollArray[0]);
        }

        const fetchedBankInfo = await fetchBankDetails(token);
        setBankInfo(Array.isArray(fetchedBankInfo) ? fetchedBankInfo[0] : fetchedBankInfo);
      } catch (err) {
        if (err?.response?.status === 404) {
          setBankInfo(null);
        } else {
          console.error(err);
          setError('Error loading payroll or bank data.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <div className="pay-home-container">Loading...</div>;
  if (error) return <div className="pay-home-container error-message">{error}</div>;

  return (
    <div className="pay-home-container">
      <div className="pay-home-grid">


        <div className="pay-home-card">
          <h3>Recent Payslips</h3>
          {payslips.length === 0 ? (
            <p>No payslips generated yet.</p>
          ) : (
            <>
              <ul className="payslip-list">
                {payslips.map((p, idx) => (
                  <li key={idx}>
                    <span>{p.month || 'Unknown'}</span>
                    <span>
                      ₹{typeof p.amount === 'number' ? p.amount.toLocaleString() : 'N/A'}
                    </span>
                  </li>
                ))}
              </ul>
              <button onClick={() => window.location.href = '/pay/payslips'}>
                View All Payslips
              </button>
            </>
          )}
        </div>

        {/* Bank Info Card */}
        <div className="pay-home-card">
          <h3>Bank Information</h3>
          {bankInfo && bankInfo.bankName ? (
            <>
              <p><strong>Bank:</strong> {bankInfo.bankName}</p>
              <p><strong>Account No:</strong> ****{bankInfo.accountNumber?.slice(-4)}</p>
              <p><strong>IFSC:</strong> {bankInfo.ifscCode}</p>
            </>
          ) : (
            <p>No bank information available.</p>
          )}
          <button
            onClick={() => {
              if (bankInfo && bankInfo.bankName) {
                alert('Please raise an HR request to update your bank details.');
              } else {
                setShowBankModal(true);
              }
            }}
          >
            Update Info
          </button>
        </div>
      </div>

      {showBankModal && (
        <div className="paymodal-overlay">
          <div className="paymodal-content">
            <BankDetailsEdit bankInfo={bankInfo} onClose={() => setShowBankModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PayHome;
