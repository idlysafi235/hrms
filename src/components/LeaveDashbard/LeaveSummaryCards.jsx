function LeaveSummaryCards({ usedLeaves, totalLeaves, remainingLeaves }) {
  const cardClass = (remaining) => (remaining === 0 ? "card card-zero" : "card");

  return (
    <div className="leave-cards">
      <div className="card sick-leave">
        <h4>🩺 Sick Leave</h4>
        <div className="leave-usage">
          <span>Remaining </span>
          <span>{remainingLeaves['Sick Leave']}</span>
        </div>
        <div className="leave-progress">
          <div className="leave-data">
            <span>{usedLeaves['Sick Leave']} used</span>
          </div>
          <div className="leave-progress-bar-container">
            <div
              className="leave-progress-bar"
              style={{
                width: `${
                  (usedLeaves['Sick Leave'] / totalLeaves['Sick Leave']) * 100
                }%`,
              }}
            ></div>
          </div>
          <span>of {totalLeaves['Sick Leave']} days</span>
        </div>
      </div>

      <div className="card casual-leave">
        <h4>🏖️ Casual Leave</h4>
        <div className="leave-usage">
          <span>Remaining </span>
          <span>{remainingLeaves['Casual Leave']}</span>
        </div>
        <div className="leave-progress">
          <div className="leave-data">
            <span>{usedLeaves['Casual Leave']} used</span>
          </div>
          <div className="leave-progress-bar-container">
            <div
              className="leave-progress-bar"
              style={{
                width: `${
                  (usedLeaves['Casual Leave'] / totalLeaves['Casual Leave']) * 100
                }%`,
              }}
            ></div>
          </div>
          <span>of {totalLeaves['Casual Leave']} days</span>
        </div>
      </div>

      <div className="card total-leaves">
        <h4>📊 Total Leave</h4>
        <div className="leave-usage">
          <span>Remaining </span>
          <span>{remainingLeaves['Total']}</span>
        </div>
        <div className="leave-progress">
          <div className="leave-data">
            <span>{usedLeaves['Total']} used</span>
          </div>
          <div className="leave-progress-bar-container">
            <div
              className="leave-progress-bar"
              style={{
                width: `${
                  (usedLeaves['Total'] / totalLeaves['Total']) * 100
                }%`,
              }}
            ></div>
          </div>
          <span>of {totalLeaves['Total']} days</span>
        </div>
      </div>
    </div>
  );
}

export default LeaveSummaryCards;
