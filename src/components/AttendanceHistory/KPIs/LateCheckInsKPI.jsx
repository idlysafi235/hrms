import React from 'react';

const LateCheckInsKPI = ({ data }) => {
  const groupedByEmployeeAndDate = {};

  data.forEach(entry => {
    const key = `${entry.employeeId}_${entry.date}`;
    if (!groupedByEmployeeAndDate[key]) {
      groupedByEmployeeAndDate[key] = [];
    }
    groupedByEmployeeAndDate[key].push(entry);
  });

  const lateCount = Object.values(groupedByEmployeeAndDate).reduce((count, entries) => {
    const firstClockIn = entries
      .map(e => e.clockInTime && new Date(e.clockInTime))
      .filter(Boolean)
      .sort((a, b) => a - b)[0];

    if (firstClockIn) {
      const cutoff = new Date(firstClockIn);
      cutoff.setHours(9, 30, 0, 0);
      if (firstClockIn > cutoff) {
        return count + 1;
      }
    }

    return count;
  }, 0);

  return (
    <div className="kpi-card">
      <h4 className="kpi-description">Late Clock-ins</h4>
      <p className="kpi-value">{lateCount}</p>
    </div>
  );
};

export default LateCheckInsKPI;
