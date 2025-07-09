import { BASE_URL } from './urls';

// Clock In API
export const clockIn = async (token, body) => {
  try {
  
    const res = await fetch(`${BASE_URL}/clock/clockin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Clock In failed');
    }

    return await res.json();
  } catch (error) {
    console.error('Clock In API error:', error);
    throw error;
  }
};

// Clock Out API
export const clockOut = async (token, body) => {
  try {
    const res = await fetch(`${BASE_URL}/clock/clockout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Clock Out failed');
    }

    return await res.json();
  } catch (error) {
    console.error('Clock Out API error:', error);
    throw error;
  }
};

export const fetchTodaySessions = async (token) => {
  try {
    const res = await fetch(`${BASE_URL}/clock/today-sessions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(
        errorData.message || "Failed to fetch today's attendance sessions"
      );
    }
    return await res.json();
  } catch (error) {
    console.error('Fetch Today Sessions API error:', error);
    throw error;
  }
};

export const fetchClockStatus = async (token) => {
  try {
    const res = await fetch(`${BASE_URL}/attendance/my`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to fetch clock status');
    }

    return await res.json();
  } catch (error) {
    console.error('Fetch Clock Status API error:', error);
    throw error;
  }
};


export const fetchMyAttendanceLogsByDate = async (token, date) => {
  try {
    const res = await fetch(`${BASE_URL}/attendance/logs/my?date=${encodeURIComponent(date)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to fetch attendance logs');
    }

    return await res.json();
  } catch (error) {
    console.error('Fetch My Attendance Logs API error:', error);
    throw error;
  }
};


export const fetchAllAttendanceLogsByDate = async (token, date) => {
  try {
    const res = await fetch(`${BASE_URL}/attendance/logs?date=${encodeURIComponent(date)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to fetch all attendance logs');
    }

    return await res.json();
  } catch (error) {
    console.error('Fetch All Attendance Logs API error:', error);
    throw error;
  }
};
