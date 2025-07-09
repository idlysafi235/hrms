import React from 'react';

const AnomalyAlerts = ({ data = [] }) => {
  const earlyClockIns = data.filter(entry => {
    if (!entry.clockInTime) return false;
    const clockInHour = new Date(entry.clockInTime).getHours();
    return clockInHour < 6;
  });

  if (earlyClockIns.length === 0) return null;

  return (
    <div className="anomaly-alerts" style={{ backgroundColor: '#fdd', padding: 10, marginBottom: 10 }}>
      <strong>Alert:</strong> {earlyClockIns.length} early clock-in(s) detected (before 6 AM).
    </div>
  );
};

export default AnomalyAlerts;
