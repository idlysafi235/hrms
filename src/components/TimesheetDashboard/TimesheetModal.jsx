import React from "react";
import "./Timesheet.css";

const TimesheetModal = ({ entry, onClose }) => {
  if (!entry) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} 
      >
        <h3>Timesheet Details</h3>
        <p><strong>ID:</strong> {entry.id}</p>
        <p><strong>Fullname:</strong> {entry.fullName || "-"}</p>
        <p><strong>Employee ID:</strong> {entry.employeeId || "-"}</p>
        <p><strong>Date:</strong> {formatDate(entry.date)}</p>
        <p><strong>Project Name:</strong> {entry.projectName || "-"}</p>
        <p><strong>Task Description:</strong> {entry.taskDescription || "-"}</p>
        <p><strong>Hours Worked:</strong> {entry.hoursWorked != null ? entry.hoursWorked : "-"}</p>
        <p><strong>Status:</strong> {entry.status || "-"}</p>
        <p><strong>Approved By:</strong> {entry.approvedBy || "-"}</p>
        <div>
  <strong>Approver:</strong>{" "}
  {entry.approverFullName && entry.approverEmployeeId
    ? `${entry.approverFullName} (${entry.approverEmployeeId})`
    : "-"}
</div>
        <p><strong>Submitted At:</strong> {formatDate(entry.submittedAt)}</p>
        <p><strong>Approved At:</strong> {formatDate(entry.approvedAt)}</p>
        <p><strong>Created At:</strong> {formatDate(entry.createdAt)}</p>
        <p><strong>Updated At:</strong> {formatDate(entry.updatedAt)}</p>
        <p><strong>Reason:</strong> {entry.reason || "-"}</p>
        <button className="btn-close" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default TimesheetModal;
