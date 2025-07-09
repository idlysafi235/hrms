import React from "react";
import PropTypes from "prop-types";
import TimesheetRow from "./TimesheetRow";

const TimesheetTable = ({ timesheets, onApprove, onReject, onSelectEntry }) => (
  <div className="table-container">
  <table className="table">
  <thead>
  <tr>
    <th>Fullname</th>
    <th>Project</th>
    <th>Task</th>
    <th>Hours</th>
    <th>Date</th>
    <th>Status</th>
    <th>Actions</th>
    </tr>
    </thead>
    <tbody>
  {timesheets.map((entry) => (
    <TimesheetRow
      key={entry.id}
      entry={entry}
      onApprove={onApprove}
      onReject={onReject}
      onSelectEntry={onSelectEntry}
    />
  ))}
  </tbody>
  </table>
</div>

);

TimesheetTable.propTypes = {
  timesheets: PropTypes.array.isRequired,
  onApprove: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  onSelectEntry: PropTypes.func.isRequired,
};

export default TimesheetTable;
