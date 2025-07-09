import React from 'react';

const NoClockInOutKPI = ({ data }) => {
  const noClockInCount = data.filter(entry => !entry.clockInTime).length;
  const noClockOutCount = data.filter(entry => !entry.clockOutTime).length;

  return (
    <div className="kpi-card">
      <h4 className="kpi-description">Missing Clock In/Out</h4>
      <p className="kpi-value">
        {noClockInCount} / {noClockOutCount}
      </p>
      {/* <p className="kpi-subtext">No Clock-In / No Clock-Out</p> */}
    </div>
  );
};

export default NoClockInOutKPI;
