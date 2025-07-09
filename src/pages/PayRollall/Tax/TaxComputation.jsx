import React, { useEffect, useRef, useState } from "react";
import {
  fetchTaxSlabsByRegimeYear,
  fetchTaxConfigSingle,
} from "../../../api/taxService";
import { fetchProfile } from "../../../api/services";
import { fetchMSalaryStructure } from "../../../api/salaryStructureApi";
import { getToken } from "../../../utils/auth";
import formatDate from "../../../components/common/FormatDate";
import { useReactToPrint } from "react-to-print";
import "./TaxStyles.css";

const formatCurrency = (amount) =>
  amount != null ? `₹${Number(amount).toLocaleString("en-IN")}` : "₹0";

const calculateDynamicTax = (income, slabs = [], config = {}) => {
  let totalTax = 0;

  for (const slab of slabs) {
    if (income > slab.slabFrom) {
      const upperLimit = slab.slabTo ?? Infinity;
      const taxableAmount = Math.min(income, upperLimit) - slab.slabFrom;
      const slabTax = taxableAmount * (slab.taxRate / 100);
      totalTax += slabTax;
    }
  }

  const rebate = income <= (config.rebateThreshold ?? 0) ? config.rebateAmount ?? 0 : 0;
  const cess = totalTax * ((config.cessRate ?? 0) / 100);
  const netTax = totalTax + cess - rebate;

  return {
    tax: totalTax,
    cess,
    rebate,
    netTax: Math.max(0, netTax),
  };
};

const TaxComputation = () => {
  const [profile, setProfile] = useState(null);
  const [salaryData, setSalaryData] = useState({});
  const [fiscalYear] = useState("2025-26");
  const [taxRegime, setTaxRegime] = useState("New");
  const [slabs, setSlabs] = useState([]);
  const [config, setConfig] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = getToken();
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Tax_Summary_${profile?.employeeId || ""}`,
  });

  useEffect(() => {
    const loadInitial = async () => {
      try {
        setLoading(true);
        const [profileRes, salaryResArray] = await Promise.all([
          fetchProfile(token),
          fetchMSalaryStructure(token),
        ]);
        setProfile(profileRes || {});
        setSalaryData(Array.isArray(salaryResArray) && salaryResArray[0] ? salaryResArray[0] : {});
        setTaxRegime(profileRes?.taxRegime || "New");
      } catch (err) {
        console.error(err);
        setError(err.message || "Error loading data");
      } finally {
        setLoading(false);
      }
    };
    loadInitial();
  }, [token]);

  useEffect(() => {
    if (!taxRegime) return;
    const loadTaxData = async () => {
      try {
        setLoading(true);
        const [slabsData, configData] = await Promise.all([
          fetchTaxSlabsByRegimeYear(token, taxRegime, fiscalYear),
          fetchTaxConfigSingle(token, taxRegime, fiscalYear),
        ]);
        setSlabs(slabsData || []);
        setConfig(configData || {});
      } catch (err) {
        console.error(err);
        setError(err.message || "Error loading tax configuration");
      } finally {
        setLoading(false);
      }
    };

    loadTaxData();
  }, [taxRegime, fiscalYear, token]);

  if (loading) return <div className="tax-container">Loading...</div>;
  if (error) return <div className="tax-container error">Error: {error}</div>;

  const grossSalary =
    (salaryData?.basic || 0) +
    (salaryData?.hra || 0) +
    (salaryData?.specialAllowance || 0) +
    (salaryData?.medicalAllowance || 0) +
    (salaryData?.conveyanceAllowance || 0) +
    (salaryData?.leavetravelAssistance || 0) +
    (salaryData?.phoneinternetReimbursment || 0) +
    (salaryData?.foodReimbursment || 0);

  const standardDeduction = config?.standardDeduction ?? 50000;
  const professionalTax = salaryData?.professionalTax || 0;
  const pf = salaryData?.pf || 0;
  const exemptions = taxRegime === "Old" ? (salaryData?.hra || 0) * 0.4 : 0;
  const netIncome = grossSalary - exemptions - standardDeduction - professionalTax - pf;

  const { tax, cess, rebate, netTax } = calculateDynamicTax(netIncome, slabs, config);

  return (
    <div className="tax-container">
      <h2 className="tax-heading">Tax Computation Summary</h2>

      <div className="print-button-container">
        <button onClick={handlePrint} className="print-button">Download PDF</button>
      </div>

      <div ref={componentRef} className="print-area">
        <table className="tax-table">
          <tbody>
            <tr>
              <td><strong>Employee ID</strong></td>
              <td>{profile?.employeeId || "—"}</td>
              <td><strong>Employee Name</strong></td>
              <td>{profile?.fullName || "—"}</td>
            </tr>
            <tr>
              <td><strong>Date of Joining</strong></td>
              <td>{profile?.dateOfJoining ? formatDate(profile.dateOfJoining) : "—"}</td>
              <td><strong>Designation</strong></td>
              <td>{profile?.position || "—"}</td>
            </tr>
            <tr>
              <td><strong>Financial Year</strong></td>
              <td>{fiscalYear}</td>
              <td><strong>Tax Regime</strong></td>
              <td>
                <select value={taxRegime} onChange={(e) => setTaxRegime(e.target.value)}>
                  <option value="Old">Old</option>
                  <option value="New">New</option>
                </select>
              </td>
            </tr>
            <tr>
              <td><strong>CTC</strong></td>
              <td>{formatCurrency(salaryData?.ctc)}</td>
              <td><strong>Effective From</strong></td>
              <td>{salaryData?.effectiveFrom ? formatDate(salaryData.effectiveFrom) : "—"}</td>
            </tr>
          </tbody>
        </table>

        <table className="tax-table">
          <tbody>
            <tr><td colSpan="2"><strong>Income Details</strong></td></tr>
            {[
              { label: "Basic", key: "basic" },
              { label: "HRA", key: "hra" },
              { label: "Special Allowance", key: "specialAllowance" },
              { label: "Medical Allowance", key: "medicalAllowance" },
              { label: "Conveyance Allowance", key: "conveyanceAllowance" },
              { label: "LTA", key: "leavetravelAssistance" },
              { label: "Phone & Internet", key: "phoneinternetReimbursment" },
              { label: "Food Reimbursement", key: "foodReimbursment" },
              { label: "Variable Pay", key: "variablePay" },
            ].map((item) => (
              <tr key={item.key}>
                <td>{item.label}</td>
                <td>{formatCurrency(salaryData?.[item.key])}</td>
              </tr>
            ))}
            <tr className="highlight-row">
              <td><strong>Gross Salary</strong></td>
              <td><strong>{formatCurrency(grossSalary)}</strong></td>
            </tr>

            <tr><td colSpan="2"><strong>Deductions</strong></td></tr>
            <tr><td>Exemptions</td><td>{formatCurrency(exemptions)}</td></tr>
            <tr><td>Standard Deduction</td><td>{formatCurrency(standardDeduction)}</td></tr>
            <tr><td>Professional Tax</td><td>{formatCurrency(professionalTax)}</td></tr>
            <tr><td>PF Contribution</td><td>{formatCurrency(pf)}</td></tr>
            <tr className="highlight-row">
              <td><strong>Net Income</strong></td>
              <td><strong>{formatCurrency(netIncome)}</strong></td>
            </tr>

            <tr><td colSpan="2"><strong>Tax Calculation</strong></td></tr>
            <tr><td>Income Tax</td><td>{formatCurrency(tax)}</td></tr>
            <tr><td>Health & Education Cess (4%)</td><td>{formatCurrency(cess)}</td></tr>
            <tr><td>Rebate (87A)</td><td>{formatCurrency(rebate)}</td></tr>
            <tr className="highlight-row">
              <td><strong>Net Tax Payable</strong></td>
              <td><strong>{formatCurrency(netTax)}</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaxComputation;
