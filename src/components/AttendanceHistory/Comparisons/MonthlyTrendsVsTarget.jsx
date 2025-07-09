import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MonthlyTrendsVsTarget = ({ data, targetAttendancePct }) => {
 
  const monthlyStats = data.reduce((acc, entry) => {
    const month = entry.date.slice(0, 7);
    if (!acc[month]) acc[month] = { present: 0, total: 0 };
    acc[month].total++;
    if (entry.status === 'Present') acc[month].present++;
    return acc;
  }, {});

  const chartData = Object.entries(monthlyStats).map(([month, stats]) => ({
    month,
    presentPct: stats.total > 0 ? (stats.present / stats.total) * 100 : 0,
    target: targetAttendancePct
  })).sort((a, b) => a.month.localeCompare(b.month));

  return (
    <div className="monthly-trends-vs-target" style={{ width: '100%', height: 300 }}>
      <h3>Monthly Attendance vs Target</h3>
      <ResponsiveContainer>
        <BarChart data={chartData}>
          <XAxis dataKey="month" />
          <YAxis domain={[0, 100]} tickFormatter={(val) => `${val}%`} />
          <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
          <Legend />
          <Bar dataKey="presentPct" fill="#82ca9d" name="Actual Attendance" />
          <Bar dataKey="target" fill="#8884d8" name="Target Attendance" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyTrendsVsTarget;
