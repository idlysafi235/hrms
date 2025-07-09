import React, { useEffect, useState } from 'react';
import { getMyTeam } from '../../api/team'; 
import { useUser } from '../../hooks/useUser'; 
import './Teams.css';

const MyTeam = () => {
  const { token } = useUser();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyTeam = async () => {
      try {
        const data = await getMyTeam(token);

        if (Array.isArray(data)) {
          setTeam(data.length > 0 ? data[0] : null);
        } else {
          setTeam(data);
        }
      } catch (err) {
        setError(err.message || 'Failed to load your team');
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchMyTeam();
  }, [token]);

  if (loading) return <p className="loading">Loading your team...</p>;
  if (error) return <p className="error">{error}</p>;


  if (!team) return <p className="no-teams">You are not assigned to any team.</p>;

  const { teamName, members } = team;

  if (!Array.isArray(members)) {
    return <p className="no-members">No members data available.</p>;
  }

  return (
    <div className="teams-container">
      <section className="team-section">
        <div className="team-header-wrapper">
          <button className="team-header open" disabled>
            {teamName}
          </button>
        </div>

        <div className="team-members-container">
          {members.length === 0 ? (
            <p className="no-members">No members in your team.</p>
          ) : (
            <table className="members-table">
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Position</th>
                  <th>Email</th>
                  <th>Phone</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.employeeId} className="member-row">
                    <td>{member.employeeId}</td>
                    <td>{member.fullName}</td>
                    <td>{member.department}</td>
                    <td>{member.position}</td>
                    <td>{member.email}</td>
                    <td>{member.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
};

export default MyTeam;
