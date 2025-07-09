import { BASE_URL } from './urls';

const handleResponse = async (res, defaultMessage) => {
  if (res.ok) {
    return res.json();
  }

  let errorMessage = defaultMessage;
  try {
    const errorData = await res.json();
    errorMessage = errorData.message || defaultMessage;
  } catch {
    const text = await res.text();
    if (text) {
      errorMessage = text;
    }
  }

  console.error('API error response:', {
    status: res.status,
    statusText: res.statusText,
    errorMessage,
  });

  throw new Error(errorMessage);
};


export const fetchAllSalaryStructures = async (token) => {
  try {
    const res = await fetch(`${BASE_URL}/salary`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    return await handleResponse(res, 'Failed to fetch salary structures');
  } catch (error) {
    console.error('Fetch All Salary Structures error:', error);
    throw error;
  }
};


export const createSalaryStructure = async (token, data) => {
  try {
    const res = await fetch(`${BASE_URL}/salary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

   
    if (!res.ok) {
      let errorBody;
      try {
        errorBody = await res.json();
      } catch (jsonErr) {
        errorBody = { message: 'Failed to parse error response' };
      }

      console.error('API error response:', {
        status: res.status,
        statusText: res.statusText,
        errorBody
      });

      throw new Error(
        errorBody?.error ||
        errorBody?.message ||
        'Failed to create salary structure'
      );
    }

    return await res.json();

  } catch (error) {
    console.error('Create Salary Structure error:', error);
    throw error;
  }
};


export const updateSalaryStructure = async (token, id, data) => {
  try {
    const res = await fetch(`${BASE_URL}/salary/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    return await handleResponse(res, 'Failed to update salary structure');
  } catch (error) {
    console.error('Update Salary Structure error:', error);
    throw error;
  }
};


export const deleteSalaryStructure = async (token, id) => {
  try {
    const res = await fetch(`${BASE_URL}/salary/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    return await handleResponse(res, 'Failed to delete salary structure');
  } catch (error) {
    console.error('Delete Salary Structure error:', error);
    throw error;
  }
};


export const fetchSalaryStructureByEmployee = async (token, employeeId) => {
  try {
    const res = await fetch(`${BASE_URL}/salary/${employeeId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    return await handleResponse(res, 'Failed to fetch employee salary structure');
  } catch (error) {
    console.error('Fetch Salary Structure By Employee error:', error);
    throw error;
  }
};

export const fetchMSalaryStructure = async (token) => {
  try {
    const res = await fetch(`${BASE_URL}/salary/my`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    return await handleResponse(res, 'Failed to fetch employee salary structure');
  } catch (error) {
    console.error('Fetch My Salary Structure error:', error);
    throw error;
  }
};
