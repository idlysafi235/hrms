import React, { useState } from 'react';
import './Teams.css';
import { useTeams } from '../../hooks/useTeams';
import { useUser } from '../../hooks/useUser';
import { XIcon } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Teams = () => {
  const {
    teamsData,
    loading,
    error,
    memberToRemove,
    teamToDelete,
    handleAddMember,
    requestRemoveMember,
    confirmRemoveMember: rawConfirmRemove,
    cancelRemoveMember,
    handleCreateTeam,
    requestDeleteTeam,
    confirmDeleteTeam: rawConfirmDelete,
    cancelDeleteTeam,
  } = useTeams();

  const { hasRole } = useUser();
  const canCreateTeam = hasRole(['Admin', 'HR']);
  const canDeleteTeam = canCreateTeam;

  const [openTeam, setOpenTeam] = useState(null);
  const [newTeamName, setNewTeamName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [creating, setCreating] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMember, setNewMember] = useState({ teamName: '', employeeId: '' });

  const handleToggleTeam = (teamName) => {
    setOpenTeam(openTeam === teamName ? null : teamName);
  };

  const onAddMemberClick = (teamName) => {
    setNewMember({ teamName, employeeId: '' });
    setShowAddModal(true);
  };

  const onCreateTeam = async () => {
    if (!newTeamName.trim()) {
      toast.error('Please enter a team name.');
      return;
    }

    const teamData = { name: newTeamName.trim() };
    setCreating(true);
    try {
      await handleCreateTeam(teamData);
      toast.success('Team created successfully!');
      setNewTeamName('');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setCreating(false);
    }
  };

  const confirmRemoveMember = async () => {
    try {
      await rawConfirmRemove();
      toast.success('Member removed successfully!');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const confirmDeleteTeam = async () => {
    try {
      await rawConfirmDelete();
      toast.success('Team deleted successfully!');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const renderTeamMembers = (members, teamName) => (
    <>
      <div className="members-actions-row">
        <button className="add-member-btn" onClick={() => onAddMemberClick(teamName)}>
          + Add Member
        </button>
        {canDeleteTeam && members.length === 0 && (
          <button
            className="delete-team-btn"
            onClick={() => requestDeleteTeam(teamName)}
            title={`Delete team "${teamName}"`}
          >
            Delete Team
          </button>
        )}
      </div>

      {members.length === 0 ? (
        <p className="no-members">No members in this team.</p>
      ) : (
        <table className="table">
          <thead className="light-table-head">
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Department</th>
              <th>Position</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Action</th>
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
                <td>
                  <button
                    className="remove-btn"
                    onClick={() =>
                      requestRemoveMember(teamName, member.employeeId, member.fullName)
                    }
                  >
                    <XIcon size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );

  const filteredTeams = teamsData
  .slice()
  .sort((a, b) => {
    const nameA = a.teamName || '';
    const nameB = b.teamName || '';
    return nameA.localeCompare(nameB);
  })
  
  .filter(({ teamName, members }) => {
    const search = searchTerm.toLowerCase();
    return (
      teamName?.toLowerCase().includes(search) ||
      members.some(
        (m) =>
          m.fullName?.toLowerCase().includes(search) ||
          m.employeeId?.toString().toLowerCase().includes(search)
      )
    );
  });

  if (loading) return <p className="loading">Loading teams...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="teams-container">
      <div className="Ttop-bar">
        <div className="Tleft-group">
          {canCreateTeam && (
            <>
              <input
                type="text"
                placeholder="New Team Name"
                value={newTeamName}
                onChange={(e) => {
                  const sanitized = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                  setNewTeamName(sanitized);
                }}
                
                disabled={creating}
                className="Tinput-field"
              />
              <button onClick={onCreateTeam} disabled={creating} className="Tcreate-btn">
                {creating ? 'Creating...' : 'Create Team'}
              </button>
            </>
          )}
        </div>

        <div className="Tright-group">
          <input
            type="text"
            placeholder="Search team or member..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="Tsearch-field"
          />
        </div>
      </div>

      <div className="team-list">
        {filteredTeams?.length === 0 ? (
          <p className="no-teams">No matching teams found.</p>
        ) : (
          filteredTeams.map(({ teamName, members }) => (
            <section key={teamName} className="team-section">
              <div className="team-header-wrapper">
                <button
                  className={`team-header ${openTeam === teamName ? 'open' : ''}`}
                  onClick={() => handleToggleTeam(teamName)}
                >
                  {teamName}
                  <span className="arrow">{openTeam === teamName ? '▲' : '▼'}</span>
                </button>
              </div>

              {openTeam === teamName && (
                <div className="team-members-container">{renderTeamMembers(members, teamName)}</div>
              )}
            </section>
          ))
        )}
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add Member to {newMember.teamName}</h3>
            <input
              type="text"
              placeholder="Enter Employee ID"
              value={newMember.employeeId}
              onChange={(e) =>
                setNewMember((prev) => ({ ...prev, employeeId: e.target.value }))
              }
              className="modal-input"
            />
            <div className="modal-buttons">
              <button
                className="confirm-btn"
                onClick={async () => {
                  if (!newMember.employeeId.trim()) {
                    toast.error('Please enter a valid Employee ID.');
                    return;
                  }
                  try {
                    await handleAddMember(newMember.teamName, newMember.employeeId.trim());
                    toast.success('Member added successfully!');
                    setShowAddModal(false);
                  } catch (err) {
                    toast.error(err.message);
                  }
                }}
              >
                Add
              </button>
              <button className="cancel-btn" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Member Confirmation Modal */}
      {memberToRemove && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>
              Are you sure you want to remove <b>{memberToRemove.fullName}</b> from{' '}
              <b>{memberToRemove.teamName}</b>?
            </p>
            <div className="modal-buttons">
              <button className="confirm-btn" onClick={confirmRemoveMember}>
                Yes, Remove
              </button>
              <button className="cancel-btn" onClick={cancelRemoveMember}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Team Confirmation Modal */}
      {teamToDelete && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>
              Are you sure you want to delete the team <b>{teamToDelete.teamName}</b>?
            </p>
            <div className="modal-buttons">
              <button className="confirm-btn" onClick={confirmDeleteTeam}>
                Yes, Delete
              </button>
              <button className="cancel-btn" onClick={cancelDeleteTeam}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

export default Teams;
