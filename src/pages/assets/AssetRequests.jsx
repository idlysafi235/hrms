import React, { useState, useEffect } from "react";
import "./AssetRequests.css";
import {
  fetchAllAssetRequests,
  updateAssetRequestStatus,
} from "../../api/assets";
import StatusBadge from "../../components/common/StatusBadge";
import { CheckIcon, XIcon } from "lucide-react";


const AssetRequests = () => {
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const rowsPerPage = 5;

  const token = localStorage.getItem("token"); 

  const loadRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllAssetRequests(token);
      setRequests(data);
    } catch (err) {
      setError(err.message || "Failed to load asset requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleUpdateStatus = async (requestId, newStatus) => {
    try {
      const resolution = window.prompt("Add resolution (optional):") || "";

      await updateAssetRequestStatus(token, requestId, {
        status: newStatus,
        resolution,
      });

      setRequests((prev) =>
        prev.map((r) =>
          r.requestId === requestId
            ? { ...r, status: newStatus, approver: "You", comments: resolution }
            : r
        )
      );
    } catch (err) {
      alert(err.message || `Failed to ${(newStatus || "").toLowerCase()} request`);
    }
  };

  const filteredRequests = requests.filter((req) => {
    const lowerSearch = searchTerm.toLowerCase();

    const matchesSearch =
      (req.requestor && req.requestor.toLowerCase().includes(lowerSearch)) ||
      (req.department && req.department.toLowerCase().includes(lowerSearch)) ||
      (req.assetType && req.assetType.toLowerCase().includes(lowerSearch)) ||
      (req.requestId && req.requestId.toString().toLowerCase().includes(lowerSearch));

    const matchesStatus = statusFilter === "All" || req.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredRequests.length / rowsPerPage);
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="table-container">
      <div className="filters">
        <input
          type="text"
          placeholder="🔍 Search by Requestor, Dept, Asset, or ID"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
          <option value="Fulfilled">Fulfilled</option>
        </select>
      </div>

      {loading && <p>Loading asset requests...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Requestor</th>
                <th>Department</th>
                <th>Asset Type</th>
                <th>Quantity</th>
                <th>Request Date</th>
                <th>Status</th>
                <th>Approver</th>
                <th>Resolution</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRequests.length === 0 ? (
                <tr>
                  <td colSpan="10" className="no-data">
                    No matching requests found.
                  </td>
                </tr>
              ) : (
                paginatedRequests.map((req) => (
                  <tr key={req.requestId}>
                    <td>{req.requestId}</td>
                    <td>{req.requestedBy || "-"}</td>
                    <td>{req.department || "-"}</td>
                    <td>{req.assetType || "-"}</td>
                    <td>{req.quantity || "-"}</td>
                    <td>{formatDate(req.createdAt)}</td>
                    <td>
                  <StatusBadge status={req.status} />
                   </td>
                    <td>{req.handledBy || "-"}</td>
                    <td>{req.resolution || "-"}</td>
                    <td className="actions-cell">
                    {req.status === "Pending" ? (
                    <>
                      <button
                        className="action-btn approve"
                        onClick={() => handleDecision(req.requestId, "Approved")}
                      >
                        <CheckIcon size={16} />
                      </button>
                      <button
                        className="action-btn reject"
                        onClick={() => handleDecision(req.requestId, "Rejected")}
                      >
                        <XIcon size={16} />
                      </button>
                    </>
                  ) : (
                    <span>-</span>
                  )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              ◀ Prev
            </button>
            <span>
              Page {currentPage} of {totalPages || 1}
            </span>
            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next ▶
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AssetRequests;
