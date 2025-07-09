import { useState, useEffect } from 'react';
import {
  getAllTeams,
  addTeamMember,
  removeTeamMember,
  createTeam,
  deleteTeam,
} from '../api/team';
import { getToken } from '../utils/auth';

export function useTeams() {
  const [teamsData, setTeamsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [memberToRemove, setMemberToRemove] = useState(null);
  const [teamToDelete, setTeamToDelete] = useState(null);

  const fetchTeams = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      if (!token) throw new Error('User is not authenticated');
      const data = await getAllTeams(token);
      setTeamsData(data);
    } catch (err) {
      setError(err.message || 'Failed to load teams');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);


  const handleAddMember = async (teamName, employeeId) => {
    try {
      const token = getToken();
    
      const newMember = await addTeamMember(token, { teamName, employeeId });

      setTeamsData((prev) =>
        prev.map((team) =>
          team.teamName === teamName
            ? { ...team, members: [...team.members, newMember] }
            : team
        )
      );
    } catch (err) {
      throw new Error(err.message || 'Failed to add member');
    }
  };

  const handleCreateTeam = async ({ name }) => {
    try {
      const token = getToken();
      await createTeam(token, { teamName: name });
      await fetchTeams(); 
    } catch (err) {
      throw new Error(err.message || 'Failed to create team');
    }
  };
  

  const confirmRemoveMember = async () => {
    if (!memberToRemove) return;

    try {
      const token = getToken();
      await removeTeamMember(token, {
        teamName: memberToRemove.teamName,
        employeeId: memberToRemove.employeeId,
      });

      setTeamsData((prev) =>
        prev.map((team) =>
          team.teamName === memberToRemove.teamName
            ? {
                ...team,
                members: team.members.filter(
                  (m) => m.employeeId !== memberToRemove.employeeId
                ),
              }
            : team
        )
      );
    } catch (err) {
      throw new Error(err.message || 'Failed to remove member');
    } finally {
      setMemberToRemove(null);
    }
  };

  const confirmDeleteTeam = async () => {
    if (!teamToDelete) return;

    try {
      const token = getToken();
      await deleteTeam(token, { teamName: teamToDelete.teamName });
      setTeamsData((prev) =>
        prev.filter((team) => team.teamName !== teamToDelete.teamName)
      );
    } catch (err) {
      throw new Error(err.message || 'Failed to delete team');
    } finally {
      setTeamToDelete(null);
    }
  };

  const requestRemoveMember = (teamName, employeeId, fullName) => {
    setMemberToRemove({ teamName, employeeId, fullName });
  };

  const cancelRemoveMember = () => {
    setMemberToRemove(null);
  };

  const requestDeleteTeam = (teamName) => {
    setTeamToDelete({ teamName });
  };

  const cancelDeleteTeam = () => {
    setTeamToDelete(null);
  };

  return {
    teamsData,
    loading,
    error,
    memberToRemove,
    teamToDelete,
    fetchTeams,
    handleAddMember,
    requestRemoveMember,
    confirmRemoveMember,
    cancelRemoveMember,
    handleCreateTeam,
    requestDeleteTeam,
    confirmDeleteTeam,
    cancelDeleteTeam,
  };
}
