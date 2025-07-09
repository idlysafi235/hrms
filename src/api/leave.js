import { BASE_URL } from './urls';

export const fetchAvailableLeaves = async (token) => {

  try {
    const res = await fetch(`${BASE_URL}/leaves/my`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const contentType = res.headers.get('content-type');

    if (!res.ok) {
      if (contentType && contentType.includes('application/json')) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch leave data');
      } else {
        const text = await res.text();
        console.error('Non-JSON error response:', text);
        throw new Error(`Server error: ${res.status} - ${text}`);
      }
    }

    if (contentType && contentType.includes('application/json')) {
      const data = await res.json();

      return data;
    } else {
      throw new Error('Unexpected response format');
    }
  } catch (error) {
    console.error('Fetch Available Leaves API error:', error);
    throw error;
  }
};

export const fetchManagerLeaveRequests = async (token) => {

  try {
    const res = await fetch(`${BASE_URL}/leaves/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const contentType = res.headers.get('content-type');

    if (!res.ok) {
      if (contentType && contentType.includes('application/json')) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch manager leave requests');
      } else {
        const text = await res.text();
        console.error('Non-JSON error response:', text);
        throw new Error(`Server error: ${res.status} - ${text}`);
      }
    }

    if (contentType && contentType.includes('application/json')) {
      const data = await res.json();

      return data;
    } else {
      throw new Error('Unexpected response format');
    }
  } catch (error) {
    console.error('Fetch Manager Leave Requests API error:', error);
    throw error;
  }
};

export const fetchManagerAttendanceData = async (token) => {

  try {
    const res = await fetch(`${BASE_URL}/attendance/team`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const contentType = res.headers.get('content-type');


    if (!res.ok) {
      if (contentType && contentType.includes('application/json')) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch manager attendance data');
      } else {
        const text = await res.text();
        console.error('Non-JSON error response:', text);
        throw new Error(`Server error: ${res.status} - ${text}`);
      }
    }

    if (contentType && contentType.includes('application/json')) {
      const data = await res.json();

      return data;
    } else {
      throw new Error('Unexpected response format');
    }
  } catch (error) {
    console.error('Fetch Manager Attendance Data API error:', error);
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
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch leave requests');
      } else {
        const text = await res.text();
        throw new Error(`Server error: ${res.status} - ${text}`);
      }
    }

    const data = await res.json();

    return data;
  } catch (error) {
    console.error('Fetch All Leave Requests API error:', error);
    throw error;
  }
};

export const updateLeaveStatus = async (id, status, token, comments = '') => {

  try {
    const res = await fetch(`${BASE_URL}/leaves/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status,
        comments,
      }),
    });

    if (!res.ok) {
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Failed to ${status.toLowerCase()} leave`);
      } else {
        const text = await res.text();
        throw new Error(`Server error: ${res.status} - ${text}`);
      }
    }

    const data = await res.json();

    return data;
  } catch (error) {
    console.error(`Update Leave Status API error (${status}):`, error);
    throw error;
  }
};

export const fetchAllLeavesForAdmin = async (token) => {
  try {
    const res = await fetch(`${BASE_URL}/leaves/admin-leaves`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const contentType = res.headers.get('content-type');

    if (!res.ok) {
      if (contentType && contentType.includes('application/json')) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch admin leave requests');
      } else {
        const text = await res.text();
        throw new Error(`Server error: ${res.status} - ${text}`);
      }
    }

    if (contentType && contentType.includes('application/json')) {
      const data = await res.json();

      return data;
    } else {
      throw new Error('Unexpected response format');
    }
  } catch (error) {
    console.error('Fetch All Leaves for Admin API error:', error);
    throw error;
  }
};

