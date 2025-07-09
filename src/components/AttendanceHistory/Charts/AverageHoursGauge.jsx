import React from 'react';
import GaugeChart from 'react-gauge-chart';

const AverageHoursGauge = ({ avgWorkHours }) => (
  <div className="chart-box">
    <div className="chart-title">Avg. Working Hours</div>
    <GaugeChart
      id="avg-hours-gauge"
      nrOfLevels={20}
      percent={Math.min(avgWorkHours / 8, 1)}
      arcPadding={0.02}
      colors={["#6366f1"]}
      needleColor="#1e293b"
      textColor="#1e293b"
      formatTextValue={() => `${avgWorkHours.toFixed(1)} hrs`}
    />
  </div>
);

export default AverageHoursGauge;