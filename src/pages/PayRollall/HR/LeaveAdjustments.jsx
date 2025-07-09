import React, { useEffect, useState } from 'react';
import './HRPanel.css';

const LeaveAdjustments = () => {
  const [adjustments, setAdjustments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mockData = [
      { id: 1, employeeId: 'CVM0001', name: 'tej', month: 'June', leaveType: 'Earned Leave', days: 2 },
      { id: 2, employeeId: 'CVM0002', name: 'shashank', month: 'June', leaveType: 'Sick Leave', days: -1 },
    ];
    setAdjustments(mockData);
    setLoading(false);
  }, []);

  return (
    <div className="hr-panel-container">
      <h2>Leave Adjustments</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="hr-table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Month</th>
              <th>Leave Type</th>
              <th>Adjustment (Days)</th>
            </tr>
          </thead>
          <tbody>
            {adjustments.map((item) => (
              <tr key={item.id}>
                <td>{item.employeeId}</td>
                <td>{item.name}</td>
                <td>{item.month}</td>
                <td>{item.leaveType}</td>
                <td>{item.days}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LeaveAdjustments;
