import React from 'react';

const TeamComparison = ({ data, onTeamClick }) => {
 
  const teamStats = data.reduce((acc, entry) => {
    const team = entry.team || 'Unknown';
    if (!acc[team]) acc[team] = { total: 0, present: 0, wfh: 0, absent: 0 };
    acc[team].total++;
    if (entry.status === 'Present') acc[team].present++;
    else if (entry.status === 'WFH') acc[team].wfh++;
    else if (entry.status === 'Absent') acc[team].absent++;
    return acc;
  }, {});

  const teams = Object.entries(teamStats);

  return (
    <div className="team-comparison">
      <h3>Attendance by Team</h3>
      <table>
        <thead>
          <tr>
            <th>Team</th>
            <th>Present %</th>
            <th>WFH %</th>
            <th>Absent %</th>
          </tr>
        </thead>
        <tbody>
          {teams.map(([team, stats]) => {
            const presentPct = ((stats.present / stats.total) * 100).toFixed(1);
            const wfhPct = ((stats.wfh / stats.total) * 100).toFixed(1);
            const absentPct = ((stats.absent / stats.total) * 100).toFixed(1);
            return (
              <tr key={team} style={{ cursor: 'pointer' }} onClick={() => onTeamClick(team)}>
                <td>{team}</td>
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

export default TeamComparison;
