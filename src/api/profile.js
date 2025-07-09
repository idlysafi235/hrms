import { BASE_URL } from './urls';


export const fetchProfile = async (token) => {
  try {
    const res = await fetch(`${BASE_URL}/profile/me`, {
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


export const updateProfile = async (token, profileData) => {
  try {
    const isFormData = profileData instanceof FormData;

    const res = await fetch(`${BASE_URL}/profile/me`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      },
      body: isFormData ? profileData : JSON.stringify(profileData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to update profile');
    }

    return await res.json();
  } catch (error) {
    console.error('Update Profile API error:', error);
    throw error;
  }
};

export const fetchEmergencyContacts = async (token) => {
  try {
    const res = await fetch(`${BASE_URL}/emergencycontacts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to fetch emergency contacts');
    }

    return await res.json();
  } catch (error) {
    console.error('Fetch Emergency Contacts API error:', error);
    throw error;
  }
};


export const updateEmergencyContact = async (token, contactId, contactData) => {
    try {
      const res = await fetch(`${BASE_URL}/emergencycontacts/${contactId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(contactData),
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update emergency contact');
      }
  
      return await res.json();
    } catch (error) {
      console.error('Update Emergency Contact API error:', error);
      throw error;
    }
  };
  


export const fetchHRRequests = async (token) => {
    try {
      const res = await fetch(`${BASE_URL}/hr-requests/my`, {
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
      console.error('Fetch HR Requests API error:', error);
      throw error;
    }
  };

  export const fetchAllHRRequests = async (token) => {
    const res = await fetch('/api/hr-requests/all', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  };

  export const addEmergencyContact = async (token, contactData) => {
    try {
      const res = await fetch(`${BASE_URL}/emergencycontacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(contactData),
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to add emergency contact');
      }
  
      return await res.json();
    } catch (error) {
      console.error('Add Emergency Contact API error:', error);
      throw error;
    }
  };
  