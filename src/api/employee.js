import { BASE_URL } from './urls';

export const getAllEmployees = async (token) => {
  try {
    const res = await fetch(`${BASE_URL}/employee/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to fetch employees');
    }

    return await res.json();
  } catch (error) {
    console.error('Fetch Employees API error:', error);
    throw error;
  }
};

export const updateEmployee = async (token, employeeId, updatedData) => {
  try {
    const res = await fetch(`${BASE_URL}/employee/${employeeId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to update employee');
    }

    return await res.json();
  } catch (error) {
    console.error('Update Employee API error:', error);
    throw error;
  }
};

export const getUpcomingBirthdays = async (token) => {
  try {
    const res = await fetch(`${BASE_URL}/feature/dob`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to fetch birthdays');
    }

    return await res.json();
  } catch (error) {
    console.error('Fetch Birthdays API error:', error);
    throw error;
  }
};

export const getFilteredEmployees = async (token, roles = [], search = '') => {
  try {
    const query = new URLSearchParams();
    if (roles.length > 0) query.append('role', roles.join(','));
    if (search) query.append('search', search);

    const res = await fetch(`${BASE_URL}/employee/filtered?${query.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to fetch filtered employees');
    }

    return await res.json();
  } catch (error) {
    console.error('Fetch Filtered Employees API error:', error);
    throw error;
  }
};
