import React from 'react';

const OnTimePercentageKPI = ({ data }) => {

  const cutoffTime = new Date();
  cutoffTime.setHours(9, 30, 0, 0); 

  const validEntries = data.filter(entry => entry.clockInTime);

  const onTimeCount = validEntries.reduce((count, entry) => {
    const actualClockIn = new Date(entry.clockInTime);

    if (actualClockIn <= cutoffTime) {
      return count + 1;
    }
    return count;
  }, 0);

  const total = validEntries.length;
  const percent = total ? ((onTimeCount / total) * 100).toFixed(1) : 0;

  return (
    <div className="kpi-card">
      <h4 className="kpi-description">On-Time Clock-ins</h4>
      <p className="kpi-value">{percent}%</p>
    </div>
  );
};

export default OnTimePercentageKPI;
