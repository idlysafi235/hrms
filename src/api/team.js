import { BASE_URL } from './urls';


export const addTeamMember = async (token, { teamName, employeeId }) => {
  try {
    const res = await fetch(`${BASE_URL}/teams/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ teamName, employeeId }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to add team member');
    }

    return await res.json();
  } catch (error) {
    console.error('Add Team Member API error:', error);
    throw error;
  }
};

export const getTeamMembers = async (token, teamName) => {
  try {
    const res = await fetch(`${BASE_URL}/teams/${encodeURIComponent(teamName)}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to get team members');
    }

    return await res.json();
  } catch (error) {
    console.error('Get Team Members API error:', error);
    throw error;
  }
};


export const removeTeamMember = async (token, { teamName, employeeId }) => {
  try {
    const res = await fetch(`${BASE_URL}/teams/remove`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ teamName, employeeId }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to remove team member');
    }

    return await res.json();
  } catch (error) {
    console.error('Remove Team Member API error:', error);
    throw error;
  }
};

export const getMyTeam = async (token) => {
  try {
    const res = await fetch(`${BASE_URL}/teams/my-team`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to get your team');
    }

    return await res.json();
  } catch (error) {
    console.error('Get My Team API error:', error);
    throw error;
  }
};

export const getAllTeams = async (token) => {
  try {
    const res = await fetch(`${BASE_URL}/teams`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to get all teams');
    }

    return await res.json();
  } catch (error) {
    console.error('Get All Teams API error:', error);
    throw error;
  }
};


export const createTeam = async (token, { teamName:name}) => {
  try {
    const res = await fetch(`${BASE_URL}/teams/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ teamName:name }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to create team');
    }

    return await res.json();
  } catch (error) {
    console.error('Create Team API error:', error);
    throw error;
  }
};

export const deleteTeam = async (token, { teamName }) => {
  try {
    const res = await fetch(`${BASE_URL}/teams/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ teamName }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to delete team');
    }

    return await res.json();
  } catch (error) {
    console.error('Delete Team API error:', error);
    throw error;
  }
};
