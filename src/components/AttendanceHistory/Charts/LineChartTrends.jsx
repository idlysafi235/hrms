import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const LineChartTrends = ({ data }) => {
 
  const aggByDate = data.reduce((acc, entry) => {
    const date = entry.date;
    if (!acc[date]) acc[date] = { date, totalHoursSum: 0, count: 0 };
    acc[date].totalHoursSum += entry.totalHours || 0;
    acc[date].count++;
    return acc;
  }, {});

  const chartData = Object.values(aggByDate)
    .map(({ date, totalHoursSum, count }) => ({
      date,
      avgHours: count > 0 ? totalHoursSum / count : 0
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="line-chart-trends" style={{ width: '100%', height: 300 }}>
      <h3>Average Work Hours Trend</h3>
      <ResponsiveContainer>
        <LineChart data={chartData}>
          <XAxis dataKey="date" tickFormatter={date => new Date(date).toLocaleDateString()} />
          <YAxis domain={[0, 12]} />
          <Tooltip labelFormatter={date => new Date(date).toLocaleDateString()} />
          <Line type="monotone" dataKey="avgHours" stroke="#6366f1" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartTrends;
