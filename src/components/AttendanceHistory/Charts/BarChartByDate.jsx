import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BarChartByDate = ({ data }) => {

  const aggregated = data.reduce((acc, entry) => {
    const date = entry.date;
    if (!acc[date]) acc[date] = { date, Present: 0, WFH: 0, Absent: 0 };
    if (entry.status === 'Present') acc[date].Present++;
    else if (entry.status === 'WFH') acc[date].WFH++;
    else if (entry.status === 'Absent') acc[date].Absent++;
    return acc;
  }, {});

  const chartData = Object.values(aggregated).sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="bar-chart-by-date" style={{ width: '100%', height: 300 }}>
      <h3>Attendance by Date</h3>
      <ResponsiveContainer>
        <BarChart data={chartData}>
          <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString()} />
          <YAxis allowDecimals={false} />
          <Tooltip labelFormatter={(date) => new Date(date).toLocaleDateString()} />
          <Legend />
          <Bar dataKey="Present" fill="#82ca9d" />
          <Bar dataKey="WFH" fill="#8884d8" />
          <Bar dataKey="Absent" fill="#ff6b6b" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartByDate;
