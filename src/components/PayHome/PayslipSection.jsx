import React, { useEffect, useState } from 'react';
import { fetchPayslipMonths, downloadPayslipPDF } from '../../api/payslips';
import { getToken } from '../../utils/auth';

const PayslipSection = () => {
  const [payslips, setPayslips] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);

  const getMonthName = (month) =>
    new Date(2000, month - 1).toLocaleString('default', { month: 'long' });

  const handleDownload = async (month, year) => {
    try {
      const token = getToken();
      await downloadPayslipPDF(token, month, year);
    } catch {
      alert('Download failed.');
    }
  };

  useEffect(() => {
    const token = getToken();
    fetchPayslipMonths(token)
      .then((data) => {
        const sorted = data?.sort((a, b) =>
          b.year !== a.year ? b.year - a.year : b.month - a.month
        );
        setPayslips(sorted);
      })
      .finally(() => setLoading(false));
  }, []);

  const visiblePayslips = showAll ? payslips : payslips.slice(0, 3);

  return (
    <div className="payslip-section">
      <h3>Recent Payslips</h3>
      {loading ? (
        <p>Loading payslips...</p>
      ) : payslips.length === 0 ? (
        <p>No payslips available.</p>
      ) : (
        <>
          <ul className="payslip-list">
            {visiblePayslips.map((p, idx) => (
              <li key={idx} className="payslip-item">
                <span>{`${getMonthName(p.month)} ${p.year}`}</span>
                <button onClick={() => handleDownload(p.month, p.year)}>Download</button>
              </li>
            ))}
          </ul>
          {payslips.length > 3 && (
            <div className="view-more-toggle" onClick={() => setShowAll(!showAll)}>
              {showAll ? '− View Less' : '+ View More'}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PayslipSection;
