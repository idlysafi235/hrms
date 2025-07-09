import { BASE_URL } from './urls';

// GET all organizations
export const fetchOrganizations = async (token) => {
  try {
    const res = await fetch(`${BASE_URL}/organizations`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to fetch organizations');
    }

    return await res.json();
  } catch (error) {
    console.error('Fetch Organizations API error:', error);
    throw error;
  }
};

// GET active organizations only
export const fetchActiveOrganizations = async (token) => {
  try {
    const res = await fetch(`${BASE_URL}/organizations/active`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to fetch active organizations');
    }

    return await res.json();
  } catch (error) {
    console.error('Fetch Active Organizations API error:', error);
    throw error;
  }
};

// GET organization by ID
export const fetchOrganizationById = async (id, token) => {
  try {
    const res = await fetch(`${BASE_URL}/organizations/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to fetch organization');
    }

    return await res.json();
  } catch (error) {
    console.error('Fetch Organization By ID API error:', error);
    throw error;
  }
};

// CREATE new organization
export const createOrganization = async (data, token) => {
  try {
    const res = await fetch(`${BASE_URL}/organizations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to create organization');
    }

    return await res.json();
  } catch (error) {
    console.error('Create Organization API error:', error);
    throw error;
  }
};

// UPDATE organization by ID
export const updateOrganization = async (id, data, token) => {
  try {
    const res = await fetch(`${BASE_URL}/organizations/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to update organization');
    }

    return await res.json();
  } catch (error) {
    console.error('Update Organization API error:', error);
    throw error;
  }
};

// DELETE organization by ID
export const deleteOrganization = async (id, token) => {
  try {
    const res = await fetch(`${BASE_URL}/organizations/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to delete organization');
    }

    return await res.json();
  } catch (error) {
    console.error('Delete Organization API error:', error);
    throw error;
  }
};
