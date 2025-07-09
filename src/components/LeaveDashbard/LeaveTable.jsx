import Pagination from "./Pagination";
import StatusBadge from "../common/StatusBadge";

function LeaveTable({ leaves, getStatusBadge, currentPage, rowsPerPage, onPageChange }) {
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = leaves.slice(indexOfFirstRow, indexOfLastRow);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });

  return (
    <>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Leave Type</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Days</th>
              <th>Status</th>
              <th>Applied On</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((leave) => {
              return (
                <tr key={leave.id}>
                  <td>{leave.leaveType}</td>
                  <td>{formatDate(leave.startDate)}</td>
                  <td>{formatDate(leave.endDate)}</td>
                  <td>{leave.numberOfDays}</td>
                  <td>
                  <StatusBadge status={leave.status} />
                </td>
                  <td>{formatDate(leave.appliedDate)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalItems={leaves.length}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
      />
    </>
  );
}

export default LeaveTable;
