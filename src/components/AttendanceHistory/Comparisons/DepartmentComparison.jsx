import React from 'react';

const DepartmentComparison = ({ data, onDepartmentClick }) => {
  const deptStats = data.reduce((acc, entry) => {
    const dept = entry.department || 'Unknown';
    if (!acc[dept]) acc[dept] = { total: 0, present: 0, wfh: 0, absent: 0 };
    acc[dept].total++;
    if (entry.status === 'Present') acc[dept].present++;
    else if (entry.status === 'WFH') acc[dept].wfh++;
    else if (entry.status === 'Absent') acc[dept].absent++;
    return acc;
  }, {});

  const departments = Object.entries(deptStats);

  return (
    <div className="department-comparison">
      <h3>Attendance by Department</h3>
      <table>
        <thead>
          <tr>
            <th>Department</th>
            <th>Present %</th>
            <th>WFH %</th>
            <th>Absent %</th>
          </tr>
        </thead>
        <tbody>
          {departments.map(([dept, stats]) => {
            const presentPct = ((stats.present / stats.total) * 100).toFixed(1);
            const wfhPct = ((stats.wfh / stats.total) * 100).toFixed(1);
            const absentPct = ((stats.absent / stats.total) * 100).toFixed(1);
            return (
              <tr key={dept} style={{ cursor: 'pointer' }} onClick={() => onDepartmentClick(dept)}>
                <td>{dept}</td>
                <td>{presentPct}%</td>
                <td>{wfhPct}%</td>
                <td>{absentPct}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DepartmentComparison;
