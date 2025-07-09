import React, { useState, useEffect } from 'react';
import './PayPage.css';
import { fetchMSalaryStructure } from '../../../api/salaryStructureApi';
import { getToken } from '../../../utils/auth';
import { fetchProfile } from '../../../api/services';

const formatDate = (dateStr) => {
  if (!dateStr) return '–';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const CompensationPlan = () => {
  const [salary, setSalary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const loadSalary = async () => {
      try {
        const token = getToken();
        const data = await fetchMSalaryStructure(token);
        const profileData = await fetchProfile(token);
        setProfile(profileData);
        if (data && data.length > 0) {
          setSalary(data[0]);
        } else {
          setError('No salary structure found.');
        }
      } catch (err) {
        setError('Error fetching salary data.');
      } finally {
        setLoading(false);
      }
    };

    loadSalary();
  }, []);

  if (loading) {
    return <div className="pay-page"><p>Loading...</p></div>;
  }

  if (error) {
    return <div className="pay-page"><p>{error}</p></div>;
  }

  return (
    <div className="pay-page">
      <h2>Compensation Plan</h2>

      <table className="tax-table">
        <tbody>
          <tr>
            <td><strong>Employee ID</strong></td>
            <td>{profile?.employeeId}</td>
            <td><strong>Employee Name</strong></td>
            <td>{profile?.fullName}</td>
          </tr>
          <tr>
            <td><strong>Date of Joining</strong></td>
            <td>{formatDate(profile?.dateOfJoining)}</td>
            <td><strong>Designation</strong></td>
            <td>{profile?.position}</td>
          </tr>
          <tr>
          <td><strong>Annual CTC</strong></td><td> ₹{salary.ctc?.toLocaleString()}</td>
          <td><strong>Effective From</strong></td><td> {formatDate(salary.effectiveFrom)}</td>
          </tr>
        </tbody>
      </table>
      <h2><strong>Salary Breakup:</strong></h2>

      <table className="table">
        <tbody>
          <tr>
            <td>Basic</td>
            <td>₹{salary.basic?.toLocaleString()}</td>
          </tr>
          <tr>
            <td>HRA</td>
            <td>₹{salary.hra?.toLocaleString()}</td>
          </tr>
          <tr>
            <td>Special Allowance</td>
            <td>₹{salary.specialAllowance?.toLocaleString()}</td>
          </tr>
          <tr>
            <td>Medical Allowance</td>
            <td>₹{salary.medicalAllowance?.toLocaleString()}</td>
          </tr>
          <tr>
            <td>Conveyance Allowance</td>
            <td>₹{salary.conveyanceAllowance?.toLocaleString()}</td>
          </tr>
          <tr>
            <td>Leave Travel Assistance</td>
            <td>₹{salary.leavetravelAssistance?.toLocaleString()}</td>
          </tr>
          <tr>
            <td>Phone/Internet Reimbursement</td>
            <td>₹{salary.phoneinternetReimbursment?.toLocaleString()}</td>
          </tr>
          <tr>
            <td>Food Reimbursement</td>
            <td>₹{salary.foodReimbursment?.toLocaleString()}</td>
          </tr>
          <tr>
            <td>PF</td>
            <td>₹{salary.pf?.toLocaleString()}</td>
          </tr>
          <tr>
            <td>Variable Pay</td>
            <td>₹{salary.variablePay?.toLocaleString()}</td>
          </tr>
          {/* <tr>
            <td>Professional Tax</td>
            <td>₹{salary.professionalTax?.toLocaleString()}</td>
          </tr> */}
        </tbody>
      </table>
    </div>
  );
};

export default CompensationPlan;
