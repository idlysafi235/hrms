import React, { useState, useEffect } from 'react';
import {
  submitReimbursement,
  getEligibilitiesSelf,
  getAllComponents
} from '../../../api/reimbursementsApi';
import { fetchProfile } from '../../../api/services';
import './Reimbursement.css';
import { getToken } from '../../../utils/auth';
import formatDate from '../../../components/common/FormatDate';

const ReimbursementSubmission = () => {
  const [profile, setProfile] = useState(null);
  const [eligibilities, setEligibilities] = useState([]);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [claimAmounts, setClaimAmounts] = useState({});
  const token = getToken();

  const user = localStorage.getItem('user');
  const employeeId =
    typeof user === 'string' && user.startsWith('CVM')
      ? user
      : JSON.parse(user)?.employeeId;

  useEffect(() => {
    const loadData = async () => {
      try {
        const [profileData, eligibilitiesData, componentsData] = await Promise.all([
          fetchProfile(token),
          getEligibilitiesSelf(token),
          getAllComponents(token)
        ]);

        const merged = eligibilitiesData.map((elig) => {
          const component = componentsData.find(
            (c) => c.component_id === elig.component_id
          );
          return {
            ...elig,
            default_annual_limit: component?.annual_limit ?? null,
            default_monthly_limit: component?.monthly_limit ?? null
          };
        });

        setProfile(profileData);
        setEligibilities(merged);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Error loading data');
      }
    };
    loadData();
  }, [token]);

  const handleAmountChange = (eligibilityId, value) => {
    setClaimAmounts((prev) => ({
      ...prev,
      [eligibilityId]: value
    }));
  };

  const handleRowSubmit = async (eligibility) => {
    setError('');
    setSuccess('');

    const today = new Date();
    const amount = claimAmounts[eligibility.id];

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount.');
      return;
    }

    const payload = new FormData();
    payload.append('employeeId', employeeId);
    payload.append('component_id', eligibility.component_id);
    payload.append('amount', amount);
    payload.append('claimDate', today.toISOString());
    payload.append('periodMonth', today.getMonth() + 1);
    payload.append('periodYear', today.getFullYear());
    payload.append('description', `Claim for ${eligibility.component_name}`);

    try {
      const result = await submitReimbursement(payload, token);
      setSuccess(`Claim submitted for ${eligibility.component_name} | ID: ${result.claimId}`);
      setClaimAmounts((prev) => ({ ...prev, [eligibility.id]: '' }));
    } catch (err) {
      setError(`Error for ${eligibility.component_name}: ${err.message}`);
    }
  };

  return (
    <div className="reimburse-container">
      <h2>Reimbursement Submission</h2>
      {success && <p className="success-msg">{success}</p>}
      {error && <p className="error-msg">{error}</p>}

      <table className="tax-table">
        <tbody>
          <tr>
            <td><strong>Employee ID</strong></td>
            <td>{profile?.employeeId || '–'}</td>
            <td><strong>Employee Name</strong></td>
            <td>{profile?.fullName || '–'}</td>
          </tr>
          <tr>
            <td><strong>Date of Joining</strong></td>
            <td>{formatDate(profile?.dateOfJoining)}</td>
            <td><strong>Position</strong></td>
            <td>{profile?.position || '–'}</td>
          </tr>
        </tbody>
      </table>

      <h3 className="reimburse-subheading">Report your Claims:</h3>
      {eligibilities.length === 0 ? (
        <p>No eligible components found.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Pay Component</th>
              <th>Annual Limit</th>
              <th>Monthly Limit</th>
              <th>Amount</th>
              <th>Submit</th>
            </tr>
          </thead>
          <tbody>
            {eligibilities.map((elig) => (
              <tr key={elig.id}>
                <td>{elig.component_name}</td>
                <td>
                  ₹
                  {elig.annual_override !== null
                    ? elig.annual_override.toLocaleString()
                    : elig.default_annual_limit !== null
                      ? elig.default_annual_limit.toLocaleString()
                      : '–'}
                </td>
                <td>
                  ₹
                  {elig.monthly_override !== null
                    ? elig.monthly_override.toLocaleString()
                    : elig.default_monthly_limit !== null
                      ? elig.default_monthly_limit.toLocaleString()
                      : '–'}
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={claimAmounts[elig.id] || ''}
                    onChange={(e) => handleAmountChange(elig.id, e.target.value)}
                    placeholder="Enter amount"
                  />
                </td>
                <td>
                  <button
                    className="submit-claim-btn"
                    onClick={() => handleRowSubmit(elig)}
                  >
                    Submit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ReimbursementSubmission;
