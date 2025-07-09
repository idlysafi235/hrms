
import { BASE_URL } from './urls';

export const createEmployee = async (employeeData, token) => {
  try {
    const res = await fetch(`${BASE_URL}/employee/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(employeeData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to create employee');
    }

    return await res.json();
  } catch (error) {
    console.error('Create Employee API error:', error);
    throw error;
  }
};


export const getAllonboarding = async (token) => {
  try {
    const res = await fetch(`${BASE_URL}/onboarding/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to fetch employees');
    }

    return await res.json();
  } catch (error) {
    console.error('Get All Employees API error:', error);
    throw error;
  }
};

