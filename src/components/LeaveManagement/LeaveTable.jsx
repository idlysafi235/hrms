import React, { useState } from "react";
import { CheckIcon, XIcon } from "lucide-react";
import StatusBadge from "../common/StatusBadge";

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

const getFullName = (r) => `${r.firstName} ${r.lastName}`;

const ROWS_PER_PAGE = 15;

function LeaveTable({ filteredLeaves, setModalData, handleDecision, roles = [] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const isHR = roles.some((r) => ["hr"].includes(r.toLowerCase()));

  const sortedLeaves = [...filteredLeaves].sort((a, b) => {
    if (a.status === "Pending" && b.status !== "Pending") return -1;
    if (a.status !== "Pending" && b.status === "Pending") return 1;
    return 0;
  });

  const totalPages = Math.ceil(sortedLeaves.length / ROWS_PER_PAGE);
  const paginatedLeaves = sortedLeaves.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE
  );

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Department</th>
            <th>Leave Type</th>
            <th>From</th>
            <th>To</th>
            <th>Days</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedLeaves.length === 0 ? (
            <tr>
              <td colSpan="8" style={{ textAlign: "center" }}>
                No matching leave requests.
              </td>
            </tr>
          ) : (
            paginatedLeaves.map((req) => (
              <tr key={req.leaveId}>
                <td>
  <button className="link-button" onClick={() => setModalData(req)}>
    <div className="employee-display">
      <span className="fullname">{getFullName(req)}</span>
      <span className="employee-id">({req.employeeId})</span>
    </div>
  </button>
</td>

                <td>{req.department || "N/A"}</td>
                <td>{req.leaveType}</td>
                <td>{formatDate(req.startDate)}</td>
                <td>{formatDate(req.endDate)}</td>
                <td>{req.numberOfDays}</td>
                <td>
                  <StatusBadge status={req.status} />
                </td>
                <td>
                  {req.status === "Pending" ? (
                    <>
                      <button
                        className="action-btn approve"
                        onClick={() => handleDecision(req.leaveId, "Approved")}
                      >
                        <CheckIcon size={16} />
                      </button>
                      <button
                        className="action-btn reject"
                        onClick={() => handleDecision(req.leaveId, "Rejected")}
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination-controls">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span style={{ margin: "0 8px" }}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default LeaveTable;
