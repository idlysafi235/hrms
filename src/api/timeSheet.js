
import { BASE_URL } from './urls';

export const submitTimeSheetAPI = async (payload, token) => {
  try {


    const res = await fetch(`${BASE_URL}/timesheets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('TimeSheet API Error Response:', errorData);
      throw new Error(errorData.message || 'Time sheet submission failed');
    }

    const result = await res.json();

    return result;
  } catch (error) {
    console.error('Submit Time Sheet API Error:', error);
    throw error;
  }
};

export const fetchMyTimeSheetsAPI = async (token) => {
  try {
    const res = await fetch(`${BASE_URL}/timesheets/my`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Fetching time sheets failed');
    }

    const result = await res.json();
    return result;
  } catch (error) {
    console.error('Fetch Time Sheets API Error:', error);
    throw error;
  }
};

export const fetchAllLeaveRequests = async (token) => {
  try {
    const res = await fetch(`${BASE_URL}/leaves`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to fetch leave requests');
    }

    return await res.json(); 
  } catch (error) {
    console.error('Fetch All Leave Requests API error:', error);
    throw error;
  }
};

export const fetchTeamTimeSheetsAPI = async (token) => {
  try {
    const res = await fetch(`${BASE_URL}/timesheets/team`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Fetching team time sheets failed');
    }

    const result = await res.json();
    return result;
  } catch (error) {
    console.error('Fetch Team Time Sheets API Error:', error);
    throw error;
  }
};

export const updateTimesheetStatusAPI = async (id, { status, reason }, token) => {
  try {
    const res = await fetch(`${BASE_URL}/timesheets/${id}/approve`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status, reason }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Update Timesheet Status Error Response:', errorData);
      throw new Error(errorData.message || 'Updating timesheet status failed');
    }

    return await res.json();
  } catch (error) {
    console.error('Update Timesheet Status API Error:', error);
    throw error;
  }
};

export const fetchAllTimeSheetsAPI = async (token) => {
  try {
    const res = await fetch(`${BASE_URL}/timesheets`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Fetching all time sheets failed');
    }

    const result = await res.json();
    return result;
  } catch (error) {
    console.error('Fetch All Time Sheets API Error:', error);
    throw error;
  }
};
