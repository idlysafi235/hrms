import React from 'react';
import { formatTotalHours } from '../../utils/timeUtils';
import formatDate from '../common/FormatDate';

const AttendanceTable = ({ data, onEmployeeClick }) => (
  <div className="table-container">
    <table className="table">
      <thead>
        <tr>
          <th>Employee</th>
          <th>Status</th>
          <th>Total Hours</th>
          <th>ClockIn</th>
          <th>ClockOut</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={idx}>
            <td>
            <button className="link-button" onClick={() => onEmployeeClick?.(row)}>
          <div className="employee-display">
            <span className="fullname">{row.fullName}</span>
            <span className="employee-id">({row.employeeId})</span>
           </div>
           </button>
          </td>
            <td>{row.status}</td>
            <td>
              {row.totalHours != null ? formatTotalHours(row.totalHours) : '-'}
            </td>
            <td>
              {row.clockInTime
                ? new Date(row.clockInTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : '-'}
            </td>
            <td>
              {row.clockOutTime
                ? new Date(row.clockOutTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : '-'}
            </td>
            <td>{formatDate(row.date)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default AttendanceTable;
