import React from 'react';

const EarlyLeavesKPI = ({ data }) => {
  const groupedByEmployeeAndDate = {};

  data.forEach(entry => {
    const key = `${entry.employeeId}_${entry.date}`;
    if (!groupedByEmployeeAndDate[key]) {
      groupedByEmployeeAndDate[key] = [];
    }
    groupedByEmployeeAndDate[key].push(entry);
  });

  const earlyLeavesCount = Object.values(groupedByEmployeeAndDate).reduce((count, entries) => {
    const lastClockOut = entries
      .map(e => e.clockOutTime && new Date(e.clockOutTime))
      .filter(Boolean)
      .sort((a, b) => b - a)[0];

    if (lastClockOut) {
      const cutoff = new Date(lastClockOut);
      cutoff.setHours(17, 30, 0, 0);
      if (lastClockOut < cutoff) {
        return count + 1;
      }
    }

    return count;
  }, 0);

  return (
    <div className="kpi-card">
      <h4 className="kpi-description">Early Clock-Outs</h4>
      <p className="kpi-value">{earlyLeavesCount}</p>
    </div>
  );
};

export default EarlyLeavesKPI;
