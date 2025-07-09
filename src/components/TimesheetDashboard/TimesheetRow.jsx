import React from "react";
import StatusBadge from "../common/StatusBadge";
import "./Timesheet.css";
import { CheckIcon, XIcon } from "lucide-react";
import formatDate from "../common/FormatDate";

const TimesheetRow = ({ entry, onApprove, onReject, onSelectEntry }) => {
 
  return (
    <tr>
      <td>
        {entry.fullName && entry.employeeId ? (
          <div
            className="clickable-id"
            onClick={() => onSelectEntry(entry)}
            title="View Details"
            style={{ cursor: "pointer", color: "#007bff", textDecoration: "underline" }}
          >
            {entry.fullName} ({entry.employeeId})
          </div>
        ) : (
          "-"
        )}
      </td>
      <td>{entry.projectName || "-"}</td>
      <td>{entry.taskDescription || "-"}</td>
      <td
        className={
          entry.hoursWorked > 45
            ? "overtime"
            : entry.hoursWorked < 20
            ? "underhours"
            : ""
        }
      >
        {entry.hoursWorked}
      </td>
      <td>{formatDate(entry.date)}</td>
      <td>
        <StatusBadge status={entry.status} />
      </td>
      <td>
        {entry.status === "Pending" && (
          <>
            <button
              className="action-btn approve"
              onClick={() => onApprove(entry.id)}
              title="Approve"
            >
              <CheckIcon size={16} />
            </button>
            <button
              className="action-btn reject"
              onClick={() => onReject(entry.id)}
              title="Reject"
            >
              <XIcon size={16} />
            </button>
          </>
        )}
      </td>
    </tr>
  );
};

export default TimesheetRow;
