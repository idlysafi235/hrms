import React, { useEffect, useState } from 'react';
import './Reimbursement.css';
import StatusBadge from '../../../components/common/StatusBadge';
import { getMyReimbursements, updateReimbursement } from '../../../api/reimbursementsApi';
import { getToken } from '../../../utils/auth';
import formatDate from '../../../components/common/FormatDate';

const ReimbursementClaimHistory = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingClaim, setEditingClaim] = useState(null);
  const [editForm, setEditForm] = useState({});
  const token = getToken();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMyReimbursements(token);
        setClaims(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch claims');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const openEditModal = (claim) => {
    setEditingClaim(claim);
    setEditForm({
      component_name: claim.component_name || '',
      amount: claim.amount,
      claimDate: claim.claim_date.split('T')[0],
      description: claim.description || '',
      remarks: ''
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        component_name: editForm.component_name,
        amount: parseFloat(editForm.amount),
        claimDate: editForm.claimDate,
        periodMonth: new Date(editForm.claimDate).getMonth() + 1,
        periodYear: new Date(editForm.claimDate).getFullYear(),
        description: editForm.remarks
          ? `${editForm.description} | ${editForm.remarks}`
          : editForm.description
      };

      await updateReimbursement(editingClaim.claimId, updatedData, token);
      setEditingClaim(null);

      const updatedClaims = await getMyReimbursements(token);
      setClaims(updatedClaims);
    } catch (err) {
      alert('Update failed: ' + err.message);
    }
  };

  return (
    <div className="reimburse-container">
      <h2>Reimbursement Claim History</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="error-msg">{error}</p>}
      {!loading && claims.length === 0 && <p>No claims found.</p>}

      {!loading && claims.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>Claim ID</th>
              <th>Component</th>
              <th>Date</th>
              <th>Amount (₹)</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {claims.map((claim) => (
              <tr key={claim.claimId}>
                <td>{claim.claimId}</td>
                <td>{claim.component_name}</td>
                <td>{formatDate(claim.claim_date)}</td>
                <td>{claim.amount}</td>
                <td><StatusBadge status={claim.status} /></td>
                <td>
                  {claim.status === 'Pending' && (
                    <button className="edit-btn" onClick={() => openEditModal(claim)}>
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editingClaim && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Claim - {editingClaim.claimId}</h3>
            <form onSubmit={handleEditSubmit}>
              <label>
                Component
                <select
                  name="component_name"
                  value={editForm.component_name}
                  onChange={handleEditChange}
                  required
                >
                  <option value="">Select Component</option>
                  <option value="Internet">Internet</option>
                  <option value="Travel">Travel</option>
                  <option value="Meals">Meals</option>
                  <option value="Books">Books</option>
                  <option value="Mobile Bill">Mobile Bill</option>
                </select>
              </label>

              <label>
                Amount (₹)
                <input
                  type="number"
                  name="amount"
                  value={editForm.amount}
                  onChange={handleEditChange}
                  required
                />
              </label>

              <label>
                Date of Expense
                <input
                  type="date"
                  name="claimDate"
                  value={editForm.claimDate}
                  onChange={handleEditChange}
                  required
                />
              </label>

              <label>
                Description
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleEditChange}
                  required
                />
              </label>

              <label>
                Remarks (optional)
                <textarea
                  name="remarks"
                  value={editForm.remarks}
                  onChange={handleEditChange}
                />
              </label>

              <div className="rmbmodal-actions">
                <button type="submit">Update</button>
                <button type="button" onClick={() => setEditingClaim(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReimbursementClaimHistory;
