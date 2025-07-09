import React from 'react';

const DashboardCard = ({ title, value }) => (
  <div className="dashboard-card">
    <h4>{title}</h4>
    <p>{value}</p>
  </div>
);

export default DashboardCard;
