import React from 'react';

const KPICards = ({ totalEmployees = 0, present = 0, wfh = 0, hideTotalEmployees }) => {
  const absent = totalEmployees - present;

  const metrics = [
    { label: 'Total Employees', value: totalEmployees, key: 'totalEmployees' },
    { label: 'Total Present', value: present, key: 'present' },
    { label: 'Total WFH', value: wfh, key: 'wfh' },
    { label: 'Total Absent', value: absent, key: 'absent' },
  ];

  return (
    <>
      {metrics.map(({ label, value, key }) => {
        if (hideTotalEmployees && key === 'totalEmployees') {
          return null;
        }
        return (
          <div className="kpi-card" key={key}>
            <h4 className="kpi-description">{label}</h4>
            <p className="kpi-value">{value}</p>
          </div>
        );
      })}
    </>
  );
};

export default KPICards;
