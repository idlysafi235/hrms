const KPISection = ({ statusCounts }) => (
    <div className="cards-section flex">
      {/* <div className="card total">
        <span>Total:</span> <span>{statusCounts.total}</span>
        </div> */}
      <div className="card approved">
      <span>Approved:</span> <span>{statusCounts.approved}</span>
      </div>
      <div className="card pending">
      <span>Pending:</span> <span>{statusCounts.pending}</span>
      </div>
      <div className="card rejected">
      <span>Rejected:</span> <span>{statusCounts.rejected}</span>
      </div>
      <div className="card approved">
      <span>Hours:</span> <span>{statusCounts.hours}</span>
      </div>
    </div>
  );
  
  export default KPISection;
  