import React, { useEffect, useState } from "react";
import {
  getAllReimbursements,
  updateReimbursementStatus,
} from "../../../api/reimbursementsApi";
import { getToken } from "../../../utils/auth";
import formatDate from "../../../components/common/FormatDate";
import { CheckIcon, XIcon } from "lucide-react";
import StatusBadge from "../../../components/common/StatusBadge";

const ReimbursmentApprovals = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [remarks, setRemarks] = useState("");
  const [updating, setUpdating] = useState(false);

  const fetchClaims = async () => {
    setLoading(true);
    setError("");
    try {
      const token = getToken();
      const data = await getAllReimbursements(token);
      setClaims(data);
    } catch (err) {
      setError(err.message || "Error fetching claims");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const handleDecision = (claim, status) => {
    setSelectedClaim(claim);
    setSelectedStatus(status);
    setRemarks("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedClaim(null);
    setSelectedStatus("");
    setRemarks("");
  };

  const handleSubmit = async () => {
    if (!selectedClaim) return;
    setUpdating(true);
    try {
      const token = getToken();
      await updateReimbursementStatus(
        selectedClaim.claimId,
        selectedStatus,
        remarks,
        token
      );
      await fetchClaims();
      closeModal();
    } catch (err) {
      alert(err.message || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p>Loading reimbursement claims...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>All Reimbursement Claims</h2>

      {claims.length === 0 ? (
        <p>No reimbursement claims found.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Claim ID</th>
              <th>Employee</th>
              <th>Component</th>
              <th>Amount</th>
              <th>Claim Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {claims.map((claim) => (
              <tr key={claim.claimId}>
                <td>{claim.claimId}</td>
                <td>{claim.EmployeeName}</td>
                <td>{claim.component_name}</td>
                <td>{claim.amount}</td>
                <td>{formatDate(claim.claim_date)}</td>
                <td>
                  <StatusBadge status={claim.status} />
                </td>
                <td>
                  {claim.status === "Pending" ? (
                    <>
                      <button
                        className="action-btn approve"
                        onClick={() => handleDecision(claim, "Approved")}
                      >
                        <CheckIcon size={16} />
                      </button>
                      <button
                        className="action-btn reject"
                        onClick={() => handleDecision(claim, "Rejected")}
                      >
                        <XIcon size={16} />
                      </button>
                    </>
                  ) : (
                    <span>-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {modalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "white",
              padding: "1rem",
              borderRadius: "4px",
              maxWidth: "400px",
              width: "100%",
            }}
          >
            <h3>{selectedStatus} Reimbursement</h3>
            <p>
              Claim ID: <strong>{selectedClaim?.claimId}</strong>
            </p>
            <textarea
              placeholder="Enter remarks (optional)"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={3}
              style={{ width: "100%", marginTop: "0.5rem" }}
              disabled={updating}
            />
            <div style={{ marginTop: "1rem", textAlign: "right" }}>
              <button
                onClick={handleSubmit}
                disabled={updating}
                style={{ marginRight: "0.5rem" }}
              >
                {updating ? "Submitting..." : "Submit"}
              </button>
              <button onClick={closeModal} disabled={updating}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReimbursmentApprovals;
