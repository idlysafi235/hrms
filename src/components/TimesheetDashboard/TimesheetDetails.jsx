import React from "react";
import "./TimesheetDetails.css";
import StatusBadge from "../common/StatusBadge";
import formatDate from "../common/FormatDate";

const TimesheetDetails = ({ entry, onClose }) => {
  if (!entry) return null;

  return (
    <div className="timesheetmodal-overlay" onClick={onClose}>
      <div className="timesheetmodal" onClick={(e) => e.stopPropagation()}>
        <div className="timesheetmodal-header">
          <h2>Timesheet Details</h2>
        </div>

        <div className="timesheetmodal-content grid-container">
          <div className="field"><label>Full Name:</label><span>{entry.fullName || "-"}</span></div>
          <div className="field"><label>Employee ID:</label><span>{entry.employeeId || "-"}</span></div>
          <div className="field"><label>Date:</label><span>{formatDate(entry.date)}</span></div>

          <div className="field"><label>Project Name:</label><span>{entry.projectName || "-"}</span></div>
          <div className="field"><label>Task Description:</label><span>{entry.taskDescription || "-"}</span></div>
          <div className="field"><label>Hours Worked:</label><span>{entry.hoursWorked ?? "-"}</span></div>

          <div className="sfield"><label>Status:</label><td>
        <StatusBadge status={entry.status} />
      </td></div>
          <div className="field"><label>Reject Reason:</label><span>{entry.reason || "-"}</span></div>

          {entry.additionalNotes && (
            <div className="field"><label>Additional Notes:</label><span>{entry.additionalNotes}</span></div>
          )}

          <div className="field"><label>Approved By:</label><span>{entry.approvedBy || "-"}</span></div>
          <div className="field">
            <label>Approver:</label>
            <span>
              {entry.approverFullName && entry.approverEmployeeId
                ? `${entry.approverFullName} (${entry.approverEmployeeId})`
                : "-"}
            </span>
          </div>

          <div className="field"><label>Submitted At:</label><span>{formatDate(entry.submittedAt)}</span></div>
          <div className="field"><label>Approved On:</label><span>{formatDate(entry.approvedAt)}</span></div>
          <div className="field"><label>Created At:</label><span>{formatDate(entry.createdAt)}</span></div>
          <div className="field"><label>Updated At:</label><span>{formatDate(entry.updatedAt)}</span></div>
        </div>

        <div className="timesheetmodal-footer">
          <button onClick={onClose} className="timesheetmodal-close-btn">Close</button>
        </div>
      </div>
    </div>
  );
};

export default TimesheetDetails;
