const StatusBadge = ({ status }) => {
    switch (status) {
      case "Approved":
        return <span className={` status-approved`}>Approved</span>;
      case "Resolved":
          return <span className={`status-approved`}>Resolved</span>;
      case "Rejected":
        return <span className={`status-rejected`}>Rejected</span>;
        case "In Progress":
          return <span className={`status-pending`}>InProgress</span>;
      case "Pending":
      default:
        return <span className={`status-pending`}>Pending</span>;
      
    }
  };
  
  export default StatusBadge;
  