import React, { useState } from "react";
import "./TaxStyles.css";

const EmployeeTaxCalculator = () => {
  const [inputs, setInputs] = useState({
    basic: "",
    hraReceived: "",
    ltaReceived: "",
    specialAllowance: "",
    otherIncome: "",
    hraExemption: "",
    ltaExemption: "",
    deductions80C: "",
    deductions80D: "",
    deductions80E: "",
    deductions80G: "",
    deductionsNPS: "",
    regime: "old",
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const calculateTax = () => {
    const {
      basic,
      hraReceived,
      ltaReceived,
      specialAllowance,
      otherIncome,
      hraExemption,
      ltaExemption,
      deductions80C,
      deductions80D,
      deductions80E,
      deductions80G,
      deductionsNPS,
      regime,
    } = inputs;

    // Total Gross
    const grossIncome =
      Number(basic) +
      Number(hraReceived) +
      Number(ltaReceived) +
      Number(specialAllowance) +
      Number(otherIncome);

    // Section 10 exemptions
    const totalExemptions =
      Number(hraExemption) + Number(ltaExemption);

    // Net Salary after exemptions
    const afterSection10 = grossIncome - totalExemptions;

    // Section 16 Standard Deduction
    const standardDeduction = 50000;

    const afterSection16 = afterSection10 - standardDeduction;

    // Total deductions (80C, etc.)
    const deductionsTotal = 
      Number(deductions80C) +
      Number(deductions80D) +
      Number(deductions80E) +
      Number(deductions80G) +
      Number(deductionsNPS);

    // Taxable Income
    const taxableIncome = afterSection16 - deductionsTotal;

    // Tax Computation
    let tax = 0;

    if (regime === "old") {
      if (taxableIncome <= 250000) tax = 0;
      else if (taxableIncome <= 500000) tax = (taxableIncome - 250000) * 0.05;
      else if (taxableIncome <= 1000000)
        tax = 12500 + (taxableIncome - 500000) * 0.2;
      else
        tax = 112500 + (taxableIncome - 1000000) * 0.3;

      if (taxableIncome <= 500000) tax = 0; // 87A rebate
    } else {
      const slabs = [
        { upTo: 300000, rate: 0 },
        { upTo: 600000, rate: 0.05 },
        { upTo: 900000, rate: 0.10 },
        { upTo: 1200000, rate: 0.15 },
        { upTo: 1500000, rate: 0.20 },
        { upTo: Infinity, rate: 0.30 },
      ];

      let previous = 0;
      for (let slab of slabs) {
        if (taxableIncome > slab.upTo) {
          tax += (slab.upTo - previous) * slab.rate;
          previous = slab.upTo;
        } else {
          tax += (taxableIncome - previous) * slab.rate;
          break;
        }
      }

      if (taxableIncome <= 700000) tax = 0; 
    }

    const cess = tax * 0.04;
    const totalTax = tax + cess;

    setResult({
      grossIncome,
      totalExemptions,
      afterSection10,
      standardDeduction,
      afterSection16,
      deductionsTotal,
      taxableIncome,
      tax: tax.toFixed(2),
      cess: cess.toFixed(2),
      totalTax: totalTax.toFixed(2),
      regimeLabel: regime === "old" ? "Old Regime" : "New Regime",
    });
  };

  return (
    <div className="tax-page-container">
      <h1>Tax Calculator</h1>

      <div className="inputs-grid">
        <label>
          Basic Salary:
          <input type="text" name="basic" value={inputs.basic} onChange={handleChange} />
        </label>
        <label>
          HRA Received:
          <input type="text" name="hraReceived" value={inputs.hraReceived} onChange={handleChange} />
        </label>
        <label>
          LTA Received:
          <input type="text" name="ltaReceived" value={inputs.ltaReceived} onChange={handleChange} />
        </label>
        <label>
          Special Allowance:
          <input type="text" name="specialAllowance" value={inputs.specialAllowance} onChange={handleChange} />
        </label>
        <label>
          Other Income:
          <input type="text" name="otherIncome" value={inputs.otherIncome} onChange={handleChange} />
        </label>

        <label>
          HRA Exemption:
          <input type="text" name="hraExemption" value={inputs.hraExemption} onChange={handleChange} />
        </label>
        <label>
          LTA Exemption:
          <input type="text" name="ltaExemption" value={inputs.ltaExemption} onChange={handleChange} />
        </label>

        <label>
          80C Deductions:
          <input type="text" name="deductions80C" value={inputs.deductions80C} onChange={handleChange} />
        </label>
        <label>
          80D Deductions:
          <input type="text" name="deductions80D" value={inputs.deductions80D} onChange={handleChange} />
        </label>
        <label>
          80E Deductions:
          <input type="text" name="deductions80E" value={inputs.deductions80E} onChange={handleChange} />
        </label>
        <label>
          80G Deductions:
          <input type="text" name="deductions80G" value={inputs.deductions80G} onChange={handleChange} />
        </label>
        <label>
          NPS 80CCD(1B):
          <input type="text" name="deductionsNPS" value={inputs.deductionsNPS} onChange={handleChange} />
        </label>

        <label>
          Tax Regime:
          <select name="regime" value={inputs.regime} onChange={handleChange}>
            <option value="old">Old</option>
            <option value="new">New</option>
          </select>
        </label>
      </div>

      <button onClick={calculateTax} className="calculate-btn">
        Calculate Tax
      </button>

      {result && (
        <div className="results-table">
          <h2>Computation Summary ({result.regimeLabel})</h2>
          <table>
            <tbody>
              <tr><td>Gross Income</td><td>₹{result.grossIncome}</td></tr>
              <tr><td>Total Exemptions</td><td>₹{result.totalExemptions}</td></tr>
              <tr><td><strong>Income After Section 10</strong></td><td><strong>₹{result.afterSection10}</strong></td></tr>
              <tr><td>Standard Deduction</td><td>₹{result.standardDeduction}</td></tr>
              <tr><td><strong>Income After Section 16</strong></td><td><strong>₹{result.afterSection16}</strong></td></tr>
              <tr><td>Total Deductions</td><td>₹{result.deductionsTotal}</td></tr>
              <tr><td><strong>Taxable Income</strong></td><td><strong>₹{result.taxableIncome}</strong></td></tr>
              <tr><td>Income Tax</td><td>₹{result.tax}</td></tr>
              <tr><td>Cess (4%)</td><td>₹{result.cess}</td></tr>
              <tr><td><strong>Total Tax Payable</strong></td><td><strong>₹{result.totalTax}</strong></td></tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EmployeeTaxCalculator;
