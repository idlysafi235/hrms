import React, { useState, useEffect } from 'react';
import './PayPage.css';
import logo from '../../../asset/logo.svg';
import { fetchSelfPayroll } from '../../../api/selfpayroll';
import html2pdf from 'html2pdf.js';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const SalarySlip = () => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const pastYears = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const handleYearChange = (e) => setSelectedYear(Number(e.target.value));
  const handleMonthChange = (index) => setSelectedMonth(index);

  const formatCurrency = (val) =>
    val !== undefined && val !== null && val !== '' ? `₹${Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '';

  const formatDate = (isoDate) => {
    if (!isoDate) return '';
    const dateObj = new Date(isoDate);
    return dateObj.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleDownloadPDF = () => {
    const slipElement = document.querySelector('.slip-box');
    const options = {
      margin: 0.5,
      filename: `Payslip_${months[selectedMonth]}_${selectedYear}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().from(slipElement).set(options).save();
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const payroll = await fetchSelfPayroll(selectedMonth, selectedYear);
        setData(payroll);
      } catch (err) {
        console.error('Error fetching payroll:', err.message);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedMonth, selectedYear]);

  const earnings = data?.earnings || [];
  const deductions = data?.deductions || [];

  return (
    <div className="pay-page">
      <div className="pay-sub-header no-print">
        <div className="left">
          <h3>
            Payslip -
            <select value={selectedYear} onChange={handleYearChange}>
              {pastYears.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </h3>
        </div>
        <div className="right">
          {/* <button>Past Periods</button> */}
          <button onClick={() => window.print()}>Print</button>
          <button onClick={handleDownloadPDF}>Download</button>
        </div>
      </div>

      <div className="month-selector no-print">
        {months
          .slice(0, selectedYear === currentYear ? currentMonth + 1 : 12)
          .map((m, index) => (
            <button
              key={m}
              className={`month-btn ${index === selectedMonth ? 'selected' : ''}`}
              onClick={() => handleMonthChange(index)}
            >
              {m}
            </button>
          ))}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : data ? (
        <div className="slip-box">
          <div className="slip-header">
            <div className="company-info">
              <h2>Core Volt Matrix Pvt Ltd</h2>
              <p>Plot #7A, Hill No 2, APIIC IT Park</p>
              <p>Rushikonda, Madhurawada</p>
              <p>Visakhapatnam, Andhra Pradesh 530045</p>
            </div>
            <div>
              <img src={logo} alt="Company Logo" className="company-logo" />
            </div>
          </div>

          <h3 className="slip-title">
            Payslip for the Month of {months[selectedMonth]} {selectedYear}
          </h3>

          <div className="employee-info-grid">
            <div className="sainfo-row">
              <div><strong>Employee Name:</strong> {data.name}</div>
              <div><strong>Employee ID:</strong> {data.employeeId}</div>
              <div><strong>Designation:</strong> {data.designation}</div>

            </div>
            <div className="sainfo-row">

            </div>
            <div className="sainfo-row">
            <div><strong>Date of Joining:</strong> {formatDate(data.dateOfJoining)}</div>
            <div><strong>Pay Period:</strong> {data.payPeriod}</div>
              <div><strong>No of LOP's:</strong> {data.lop}</div>
            </div>
          </div>

          <table className="pay-table">
            <thead>
              <tr>
                <th colSpan="2">EARNINGS</th>
                <th colSpan="2">DEDUCTIONS</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: Math.max(earnings.length, deductions.length) }).map((_, i) => (
                <tr key={i}>
                  <td>{earnings[i]?.type || ''}</td>
                  <td className="text-right">{formatCurrency(earnings[i]?.amount)}</td>
                  <td>{deductions[i]?.type || ''}</td>
                  <td className="text-right">{formatCurrency(deductions[i]?.amount)}</td>
                </tr>
              ))}
              <tr className="highlight">
                <td><strong>Gross Earnings</strong></td>
                <td className="text-right"><strong>{formatCurrency(data.grossSalary)}</strong></td>
                <td><strong>Total Deductions</strong></td>
                <td className="text-right"><strong>{formatCurrency(data.grossSalary - data.netPay)}</strong></td>
              </tr>
              <tr className="highlight netpay-row">
                <td colSpan="4"><strong>Net Pay:</strong> {formatCurrency(data.netPay)}</td>
              </tr>
              <tr className="highlight in-words">
                <td colSpan="4">
                  <strong>Total Net Payable (Amount in Words):</strong> {data.amountInWords}
                </td>
              </tr>
            </tbody>
          </table>

          <p className="footer-note">* This is a system-generated payslip and does not require a signature.</p>
        </div>
      ) : (
        <p>
          No payslip found for the selected month: <strong>{months[selectedMonth]}</strong> and year: <strong>{selectedYear}</strong>.
        </p>
      )}
    </div>
  );
};

export default SalarySlip;
