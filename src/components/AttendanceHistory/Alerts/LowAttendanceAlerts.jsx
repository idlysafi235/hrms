import React from 'react';

const LowAttendanceAlerts = ({ data = [], threshold = 80 }) => {
  const total = data.length;
  if (total === 0) return null;

  const presentCount = data.filter(e => e.status === 'Present').length;
  const attendancePct = (presentCount / total) * 100;

  if (attendancePct >= threshold) return null;

  return (
    <div className="low-attendance-alert" style={{ backgroundColor: '#fee', padding: 10, marginBottom: 10 }}>
      <strong>Warning:</strong> Attendance is low ({attendancePct.toFixed(1)}%), below threshold of {threshold}%.
    </div>
  );
};

export default LowAttendanceAlerts;
