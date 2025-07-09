import Modal from "react-modal";
import "./LeaveModal.css";
import StatusBadge from "../common/StatusBadge";

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "-";

const getFullName = (r) => `${r.firstName} ${r.lastName}`;

function LeaveModal({ modalData, onClose }) {
  if (!modalData) return null;

  const approverDisplay =
    modalData.approverFullName && modalData.approverEmployeeId
      ? `${modalData.approverFullName} (${modalData.approverEmployeeId})`
      : "-";

  const approvedByDisplay = modalData.approvedByFullName || "-";

  return (
    <Modal
      isOpen={!!modalData}
      onRequestClose={onClose}
      className="leavemgmt-modal"
      overlayClassName="leavemgmtmodal-overlay"
      ariaHideApp={false}
    >
      <div className="leavemgmtmodal-header">
        <h2>Leave Request Details</h2>
      </div>

      <div className="leavemgmtmodal-content grid-container">
        <div className="field"><label>Name:</label><span>{getFullName(modalData)}</span></div>
        <div className="field"><label>Employee ID:</label><span>{modalData.employeeId}</span></div>
        <div className="field"><label>Email:</label><span>{modalData.email}</span></div>
        <div className="field"><label>Department:</label><span>{modalData.department || "N/A"}</span></div>
        <div className="field"><label>Leave Type:</label><span>{modalData.leaveType}</span></div>
        <div className="field"><label>From:</label><span>{formatDate(modalData.startDate)}</span></div>
        <div className="field"><label>To:</label><span>{formatDate(modalData.endDate)}</span></div>
        <div className="field"><label>Days:</label><span>{modalData.numberOfDays}</span></div>

        <div className="field"><label>Status:</label><span><StatusBadge status={modalData.status} /></span></div>

        <div className="field"><label>Submitted At:</label><span>{formatDate(modalData.appliedDate)}</span></div>
        {modalData.approvedDate && (
          <div className="field"><label>Approved On:</label><span>{formatDate(modalData.approvedDate)}</span></div>
        )}
        <div className="field"><label>Created At:</label><span>{formatDate(modalData.createdAt)}</span></div>
        <div className="field"><label>Updated At:</label><span>{formatDate(modalData.updatedAt)}</span></div>

        <div className="field"><label>Approver:</label><span>{approverDisplay}</span></div>
        <div className="field"><label>Approved By:</label><span>{approvedByDisplay}</span></div>

        <div className="field"><label>Reason:</label><span>{modalData.reason || "No reason provided"}</span></div>
        <div className="field"><label>Comments:</label><span>{modalData.comments || "-"}</span></div>

        {modalData.attachment && (
          <div className="field">
            <label>Attachment:</label>
            <span>
              <a href={modalData.attachment} target="_blank" rel="noopener noreferrer">View Document</a>
            </span>
          </div>
        )}
      </div>

      <div className="leavemgmtmodal-footer">
        <button onClick={onClose} className="leavemgmtmodal-close-btn">Close</button>
      </div>
    </Modal>
  );
}

export default LeaveModal;
