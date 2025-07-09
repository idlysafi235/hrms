
import React from 'react';
import './Tax.css';

const taxData = {
  taxableSalary: '₹6,60,000',
  deductions: [
    { section: '80C', description: 'Investments', amount: '₹1,50,000' },
    { section: '80D', description: 'Medical Insurance', amount: '₹25,000' },
    { section: 'HRA', description: 'House Rent Allowance', amount: '₹60,000' },
  ],
  netTaxable: '₹4,25,000',
  taxPayable: '₹18,500',
  documents: [
    { name: 'Form 16', link: '#', type: 'pdf' },
    { name: 'Tax Calculation Sheet', link: '#', type: 'xls' },
  ],
};

const Tax = () => {
  return (
    <div className="tax-container">
      <div className="tax-section">
        <h4>Taxable Salary</h4>
        <p className="tax-value">{taxData.taxableSalary}</p>
      </div>

      <div className="tax-section">
        <h4>Deductions</h4>
        <table className="deductions-table">
          <thead>
            <tr>
              <th>Section</th>
              <th>Description</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {taxData.deductions.map((d, idx) => (
              <tr key={idx}>
                <td>{d.section}</td>
                <td>{d.description}</td>
                <td>{d.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="tax-section">
        <h4>Net Taxable Income</h4>
        <p className="tax-value">{taxData.netTaxable}</p>
      </div>

      <div className="tax-section">
        <h4>Tax Payable</h4>
        <p className="tax-value payable">{taxData.taxPayable}</p>
      </div>

      <div className="tax-section">
        <h4>Documents</h4>
        <ul className="tax-documents">
          {taxData.documents.map((doc, idx) => (
            <li key={idx}>
              <span>{doc.name}</span>
              <a href={doc.link} download>
                Download
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Tax;
