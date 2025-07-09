import { BASE_URL } from './urls';

export const raiseHRRequest = async (token, { category, subject, description }) => {
  try {
    const res = await fetch(`${BASE_URL}/hr/requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ category, subject, description }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to raise HR request');
    }

    return await res.json();
  } catch (error) {
    console.error('Raise HR Request API error:', error);
    throw error;
  }
};

export const fetchMyHRRequests = async (token) => {
  try {
    const res = await fetch(`${BASE_URL}/hr/requests/my`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to fetch your HR requests');
    }

    return await res.json();
  } catch (error) {
    console.error('Fetch My HR Requests API error:', error);
    throw error;
  }
};

export const fetchAllHRRequests = async (token) => {
  try {
    const res = await fetch(`${BASE_URL}/hr/requests`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to fetch HR requests');
    }

    return await res.json();
  } catch (error) {
    console.error('Fetch All HR Requests API error:', error);
    throw error;
  }
};

export const updateHRRequestStatus = async (token, requestId, status, resolution = '') => {
  try {
    const res = await fetch(`${BASE_URL}/hr/requests/${requestId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status, resolution }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to update HR request status');
    }

    return await res.json();
  } catch (error) {
    console.error('Update HR Request Status API error:', error);
    throw error;
  }
};

export const assignHRRequest = async (token, requestId, assignedToEmployeeId) => {
  try {
    const res = await fetch(`${BASE_URL}/hr/requests/${requestId}/assign`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ assignedTo: assignedToEmployeeId }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to assign HR request');
    }

    return await res.json();
  } catch (error) {
    console.error('Assign HR Request API error:', error);
    throw error;
  }
};
