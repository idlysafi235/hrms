const RejectModal = ({ reason, setReason, onClose, onSubmit }) => (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Reject Timesheet</h3>
        <textarea
          rows={4}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter reason..."
        />
        <div className="modal-buttons">
          <button className="btn cancel" onClick={onClose}>Cancel</button>
          <button className="btn submit" onClick={onSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
  
  export default RejectModal;
  