
import { BASE_URL } from './urls';

export const loginUser = async (email, password) => {
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Login failed');
      }
  
      const data = await res.json(); 
  
      localStorage.setItem('user', JSON.stringify(data));
  
      return data;
    } catch (error) {
      console.error('Login API error:', error);
      throw error;
    }
  };
  

export const fetchUsers = async (token) => {
  try {
    const res = await fetch(`${BASE_URL}/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to fetch users');
    }

    return await res.json();
  } catch (error) {
    console.error('Fetch Users API error:', error);
    throw error;
  }
};


export const applyLeave = async (token, leaveData) => {
  try {
    const formData = new FormData();
    for (const key in leaveData) {
      const value = leaveData[key];
      if (value !== null && value !== '') {
        formData.append(key, value);
      }
    }

    const res = await fetch(`${BASE_URL}/leaves`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to apply for leave');
    }

    return await res.json();
  } catch (error) {
    console.error('Apply Leave API error:', error);
    throw error;
  }
};



  
  export const fetchProfile = async (token) => {
    try {
      const res = await fetch(`${BASE_URL}/employee`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch profile');
      }
  
      return await res.json();
    } catch (error) {
      console.error('Fetch Profile API error:', error);
      throw error;
    }
  };


export const fetchAvailableLeaves = async (token) => {
  try {
    const res = await fetch(`${BASE_URL}/leaves/my`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const contentType = res.headers.get("content-type");
  

    if (!res.ok) {
      if (contentType && contentType.includes("application/json")) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch leave data');
      } else {
        const text = await res.text();
        console.error('Non-JSON error response:', text);
        throw new Error(`Server error: ${res.status}`);
      }
    }

    const data = await res.json();

    return data;
  } catch (error) {
    console.error('Fetch Available Leaves API error:', error);
    throw error;
  }
};


  export const fetchAttendanceData = async (token) => {
    try {
      const res = await fetch(`${BASE_URL}/attendance`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch attendance data');
      }
  
      return await res.json();
    } catch (error) {
      console.error('Fetch Attendance Data API error:', error);
      throw error;
    }
  };

  export const getTeamAttendance = async (token) => {
    try {
      const res = await fetch(`${BASE_URL}/attendance/team`,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch attendance data');
      }
  
      return await res.json();
    } catch (error) {
      console.error('Fetch Attendance Data API error:', error);
      throw error;
    }
  };