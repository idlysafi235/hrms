import React, { useState } from "react";
import { formatDate, getFullName } from "../../utils/leaveUtils";

function LeaveRequestTable({ leaveRequests, onRowClick, handleDecision }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredRequests = leaveRequests.filter((req) => {
    const matchesSearch = getFullName(req).toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search by employee name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Department ID</th>
            <th>Leave Type</th>
            <th>From</th>
            <th>To</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRequests.length > 0 ? (
            filteredRequests.map((req) => (
              <tr key={req.leaveId}>
                <td>
                  <button
                    className="link-button"
                    type="button"
                    onClick={() => onRowClick(req)}
                  >
                    {getFullName(req)}
                  </button>
                </td>
                <td>{req.departmentId || "N/A"}</td>
                <td>{req.leaveType}</td>
                <td>{formatDate(req.startDate)}</td>
                <td>{formatDate(req.endDate)}</td>
                <td>{req.status}</td>
                <td>
                  {req.status === "Pending" ? (
                    <>
                      <button onClick={() => handleDecision(req.leaveId, "Approved")}>
                        Approve
                      </button>
                      <button onClick={() => handleDecision(req.leaveId, "Rejected")}>
                        Reject
                      </button>
                    </>
                  ) : (
                    <span>{req.status}</span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No leave requests available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default LeaveRequestTable;
