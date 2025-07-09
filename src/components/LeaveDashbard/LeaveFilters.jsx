function LeaveFilters({ filterType, setFilterType, statusFilter, setStatusFilter }) {
    const LEAVE_TYPES = ["All", "Casual", "Sick", "Comp Off", "Paternity", "Maternity", "Unpaid"];
    const LEAVE_STATUS = ["All", "Pending", "Approved", "Rejected"];
  
    return (
      <div className="filters">
        <label>Leave Type:</label>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          {LEAVE_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
        </select>
  
        <label>Status:</label>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          {LEAVE_STATUS.map(status => <option key={status} value={status}>{status}</option>)}
        </select>
      </div>
    );
  }
  export default LeaveFilters;
  