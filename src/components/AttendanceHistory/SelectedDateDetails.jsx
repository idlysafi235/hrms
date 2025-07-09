import React from 'react';
import './SelectedDateDetails.css';

const SelectedDateDetails = ({ date, data }) => {
  if (!date) return null;

  return (
    <div className="selected-date-details">
      <h3>Attendance Details for <span>{date}</span></h3>

      {data.length === 0 ? (
        <p>No attendance records found for this date.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Status</th>
              <th>Clock In</th>
              <th>Clock Out</th>
              <th>Total Hours</th>
              <th>Team</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry, index) => (
              <tr key={index}>
                <td>{entry.fullName}</td>
                <td>{entry.status}</td>
                <td>{entry.clockInTime || '—'}</td>
                <td>{entry.clockOutTime || '—'}</td>
                <td>{entry.totalHours || 0}</td>
                <td>{entry.team || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SelectedDateDetails;
