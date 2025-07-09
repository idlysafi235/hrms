import React from 'react';
import './TeamOverview.css';

const TeamOverview = ({ attendanceData = [], filters, setFilters }) => {
  const teamStats = attendanceData.reduce((acc, entry) => {
    const team = entry.team || 'Unknown';
    if (!acc[team]) {
      acc[team] = { present: 0, wfh: 0, absent: 0, total: 0 };
    }
    acc[team].total += 1;
    if (entry.status === 'Present') acc[team].present += 1;
    else if (entry.status === 'WFH') acc[team].wfh += 1;
    else if (entry.status === 'Absent') acc[team].absent += 1;
    return acc;
  }, {});

  const handleTeamClick = (team) => {
    setFilters(prev => ({ ...prev, team }));
  };

  return (
    <div className="team-overview">
      <h3 className="team-overview-heading">Team Attendance Breakdown</h3>
      <div className="team-overview-table-wrapper">
        <table className="team-overview-table">
          <thead>
            <tr>
              <th>Team</th>
              <th>Present</th>
              <th>WFH</th>
              <th>Absent</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(teamStats).map(([team, stats]) => {
              const { present, wfh, absent, total } = stats;
              return (
                <tr key={team}>
                  <td>
                    <button
                      className="team-name-button"
                      onClick={() => handleTeamClick(team)}
                    >
                      {team}
                    </button>
                  </td>
                  <td>{((present / total) * 100).toFixed(1)}%</td>
                  <td>{((wfh / total) * 100).toFixed(1)}%</td>
                  <td>{((absent / total) * 100).toFixed(1)}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamOverview;
