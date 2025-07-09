import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#8884d8', '#82ca9d'];

const LocationPieChart = ({ present, wfh }) => {
  const locationPieData = [
    { name: 'Office', value: present },
    { name: 'Remote', value: wfh }
  ];

  return (
    <div className="chart-box">
      <div className="chart-title">Location Pie Chart</div>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={locationPieData} dataKey="value" nameKey="name" outerRadius={80} label>
            {locationPieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LocationPieChart;