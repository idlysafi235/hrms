import { BASE_URL } from './urls';

const headers = (token) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`
});


export const fetchPayComponents = async (token) => {
  try {
    const res = await fetch(`${BASE_URL}/pay-components`, {
      method: 'GET',
      headers: headers(token)
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to fetch components');
    }

    return await res.json();
  } catch (error) {
    console.error('Fetch Pay Components Error:', error);
    throw error;
  }
};


export const createPayComponent = async (componentData, token) => {
  try {
    const res = await fetch(`${BASE_URL}/pay-components`, {
      method: 'POST',
      headers: headers(token),
      body: JSON.stringify(componentData)
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to create component');
    }

    return await res.json();
  } catch (error) {
    console.error('Create Pay Component Error:', error);
    throw error;
  }
};


export const updatePayComponent = async (id, updatedData, token) => {
  try {
    const res = await fetch(`${BASE_URL}/pay-components/${id}`, {
      method: 'PUT',
      headers: headers(token),
      body: JSON.stringify(updatedData)
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to update component');
    }

    return await res.json();
  } catch (error) {
    console.error('Update Pay Component Error:', error);
    throw error;
  }
};

export const deletePayComponent = async (id, token) => {
  try {
    const res = await fetch(`${BASE_URL}/pay-components/${id}`, {
      method: 'DELETE',
      headers: headers(token)
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to delete component');
    }

    return await res.json();
  } catch (error) {
    console.error('Delete Pay Component Error:', error);
    throw error;
  }
};
