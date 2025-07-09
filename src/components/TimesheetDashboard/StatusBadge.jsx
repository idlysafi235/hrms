const StatusBadge = ({ status }) => {
    const base = "badge";
    switch (status) {
      case "Approved":
        return <span className={`${base} badge-approved`}>✔️ Approved</span>;
      case "Rejected":
        return <span className={`${base} badge-rejected`}>❌ Rejected</span>;
      case "Pending":
      default:
        return <span className={`${base} badge-pending`}>⏳ Pending</span>;
    }
  };
  
  export default StatusBadge;
  