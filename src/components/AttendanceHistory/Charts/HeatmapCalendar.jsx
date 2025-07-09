import React from 'react';

const COLORS = {
  Present: '#82ca9d',
  WFH: '#8884d8',
  Absent: '#ff6b6b',
  NoData: '#ccc'
};

const HeatmapCalendar = ({ data }) => {

  const statusByDate = data.reduce((acc, entry) => {
    const date = entry.date;
    if (!acc[date]) acc[date] = { Present: 0, WFH: 0, Absent: 0 };
    acc[date][entry.status] = (acc[date][entry.status] || 0) + 1;
    return acc;
  }, {});

  const last30Days = [...Array(30)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return d.toISOString().split('T')[0];
  });

 
  const dayStatuses = last30Days.map(date => {
    const statusCounts = statusByDate[date];
    if (!statusCounts) return { date, status: 'NoData' };

    const maxStatus = Object.entries(statusCounts).reduce((max, curr) => (curr[1] > max[1] ? curr : max), ['', 0]);
    return { date, status: maxStatus[0] };
  });

  return (
    <div className="heatmap-calendar">
      <h3>Attendance Heatmap (Last 30 Days)</h3>
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', maxWidth: 420 }}>
        {dayStatuses.map(({ date, status }) => (
          <div
            key={date}
            title={`${date}: ${status}`}
            style={{
              width: 12,
              height: 12,
              backgroundColor: COLORS[status] || COLORS.NoData,
              borderRadius: 2,
            }}
          />
        ))}
      </div>
      <div style={{ marginTop: 8, fontSize: 12 }}>
        <span style={{ color: COLORS.Present }}>■ Present </span>
        <span style={{ color: COLORS.WFH, marginLeft: 10 }}>■ WFH </span>
        <span style={{ color: COLORS.Absent, marginLeft: 10 }}>■ Absent </span>
        <span style={{ color: COLORS.NoData, marginLeft: 10 }}>■ No Data </span>
      </div>
    </div>
  );
};

export default HeatmapCalendar;
