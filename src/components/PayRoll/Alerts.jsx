import React from 'react';


const Alerts = ({
  message,
  showMessageDetails,
  setShowMessageDetails,
  summary,
  processed,
  skipped,
  showErrors,
  setShowErrors
}) => {
  return (
    <div className="alerts-container">
      {/* Success/Error Message */}
      {message && (
        <div
          className={`message-box ${message.startsWith('❌') ? 'error' : 'success'}`}
        >
          <div
            className="message-header"
            onClick={() => setShowMessageDetails(!showMessageDetails)}
          >
            <span>{message}</span>
            <span className="toggle-arrow">{showMessageDetails ? '▲' : '▼'}</span>
          </div>
          {showMessageDetails && summary && (
            <div className="message-body">
              <table className="table">
                <thead>
                  <tr>
                    <th>Employee ID</th>
                    <th>Gross Salary</th>
                    <th>Net Pay</th>
                    <th>TDS</th>
                    <th>LOP Days</th>
                  </tr>
                </thead>
                <tbody>
                  {processed && processed.length > 0 ? (
                    processed.map((p, idx) => (
                      <tr key={idx}>
                        <td>{p.employeeId}</td>
                        <td>₹{p.grossSalary?.toFixed(2)}</td>
                        <td>₹{p.netPay?.toFixed(2)}</td>
                        <td>₹{p.tds?.toFixed(2)}</td>
                        <td>{p.lopDays}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">No processed employees.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Skipped Employees */}
      {skipped && skipped.length > 0 && (
        <div className="message-box warning">
          <div
            className="message-header"
            onClick={() => setShowErrors(!showErrors)}
          >
            <span>⚠️ {skipped.length} employees skipped</span>
            <span className="toggle-arrow">{showErrors ? '▲' : '▼'}</span>
          </div>
          {showErrors && (
            <div className="message-body">
              <table className="table error-table">
                <thead>
                  <tr>
                    <th>Employee ID</th>
                    <th>Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {skipped.map((e, idx) => (
                    <tr key={idx}>
                      <td>{e.employeeId || 'N/A'}</td>
                      <td>{e.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Alerts;
