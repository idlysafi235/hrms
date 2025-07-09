function LeaveStats({ leaveRequests, stats }) {
  return (
    <div className="stats-cards flex-col">
      <h4>Leaves Status Overview</h4>
      <div className="cards-section flex">
        <div className="card total">
          <span>Total Requests:</span> <span>{leaveRequests.length}</span>
        </div>
        <div className="card pending">
          <span>Pending:</span>{' '}
          <span>{leaveRequests.filter((r) => r.status === 'Pending').length}</span>
        </div>
        <div className="card approved">
          <span>Approved:</span>{' '}
          <span>{leaveRequests.filter((r) => r.status === 'Approved').length}</span>
        </div>
        <div className="card rejected">
          <span>Rejected:</span>{' '}
          <span>{leaveRequests.filter((r) => r.status === 'Rejected').length}</span>
        </div>
      </div>
    </div>
  );
}
export default LeaveStats;
