import React from "react";
import "./ApplyLeave.css";
import useLeaveForm from "../../hooks/useLeaveForm";
import DateInput from "../../components/common/DateInput";

function ApplyLeaveForm({ onSuccess }) {
  const {
    formData,
    errors,
    duration,
    leaveBalance,
    loadingBalance,
    showSuccessModal,
    submitError,
    handleChange,
    handleSubmit,
    closeSuccessModal,
  } = useLeaveForm(onSuccess);

  const renderLeaveBalance = () => {
    if (loadingBalance) return <div className="leave-balance">Loading...</div>;
    if (formData.leaveType && leaveBalance[formData.leaveType]) {
      return (
        <div className="leave-balance">
          Leave Balance: {leaveBalance[formData.leaveType]} day
          {leaveBalance[formData.leaveType] > 1 ? "s" : ""}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="leave-form-container">
      <div className="leave-form">
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Leave Type */}
          <div className="leave-section-card">
            <label>Leave Type:</label>
            <select
              name="leaveType"
              value={formData.leaveType}
              onChange={handleChange}
              className={errors.leaveType ? "error-input" : ""}
            >
              <option value="">Select</option>
              <option value="Casual">Casual</option>
              <option value="Sick">Sick</option>
              <option value="Maternity">Maternity</option>
              <option value="Comp Off">Comp Off</option>
              <option value="Unpaid">Unpaid</option>
            </select>
            {errors.leaveType && (
              <small className="error-text">{errors.leaveType}</small>
            )}
            {renderLeaveBalance()}
          </div>

          {/* Dates */}
          {formData.leaveType && (
            <div className="leave-section-card">
              <label>From Date:</label>
              <div className="date-row">
                <DateInput
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className={errors.startDate ? "error-input" : ""}
                />
                <select
                  name="startDayType"
                  value={formData.startDayType}
                  onChange={handleChange}
                >
                  <option value="Full Day">Full Day</option>
                  <option value="Half Day">Half Day</option>
                </select>
              </div>
              {errors.startDate && (
                <small className="error-text">{errors.startDate}</small>
              )}

              <label>To Date:</label>
              <div className="date-row">
                <DateInput
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className={errors.endDate ? "error-input" : ""}
                />
                {formData.startDate &&
                  formData.endDate &&
                  formData.startDate !== formData.endDate && (
                    <select
                      name="endDayType"
                      value={formData.endDayType}
                      onChange={handleChange}
                    >
                      <option value="Full Day">Full Day</option>
                      <option value="Half Day">Half Day</option>
                    </select>
                  )}
              </div>
              {errors.endDate && (
                <small className="error-text">{errors.endDate}</small>
              )}

              {duration && typeof duration === "number" && (
                <div className="leave-duration">
                  Duration: {duration} day{duration > 1 ? "s" : ""}
                </div>
              )}
            </div>
          )}

          {/* Reason */}
          {formData.leaveType && (
            <div className="leave-section-card">
              <label>Reason:</label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                rows={3}
                className={errors.reason ? "error-input" : ""}
              />
              {errors.reason && (
                <small className="error-text">{errors.reason}</small>
              )}
            </div>
          )}

          {formData.leaveType === "Sick" && (
            <div className="leave-section-card">
              <label>Attachment (Optional):</label>
              <input
                type="file"
                name="attachment"
                onChange={handleChange}
                accept=".pdf,.jpg,.png"
              />
            </div>
          )}

          {(submitError || errors.duration || duration === "Invalid date range") && (
            <div className="form-errors-summary">
              {submitError && <div className="error-text">{submitError}</div>}
              {duration === "Invalid date range" && (
                <div className="error-text">End date cannot be before start date</div>
              )}
              {errors.duration && (
                <div className="error-text">{errors.duration}</div>
              )}
            </div>
          )}

          {formData.leaveType &&
            formData.startDate &&
            formData.endDate &&
            formData.reason.trim() && <button type="submit">Apply</button>}
        </form>
      </div>

      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>🎉 Leave Applied Successfully!</h3>
            <div className="confirm-buttons">
              <button className="confirm-stay" onClick={closeSuccessModal}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ApplyLeaveForm;
