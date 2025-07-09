import { BASE_URL } from './urls';


export const fetchAssets = async (token) => {
  try {
    const res = await fetch(`${BASE_URL}/assets`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to fetch assets');
    }

    return await res.json();
  } catch (error) {
    console.error('Fetch Assets API error:', error);
    throw error;
  }
};


export const fetchAssetsMine = async (token) => {
  try {
    const res = await fetch(`${BASE_URL}/assets/my`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to fetch my assets');
    }

    return await res.json();
  } catch (error) {
    console.error('Fetch My Assets API error:', error);
    throw error;
  }
};


export const createAsset = async (token, assetData) => {
  try {
    const res = await fetch(`${BASE_URL}/assets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(assetData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to create asset');
    }

    return await res.json();
  } catch (error) {
    console.error('Create Asset API error:', error);
    throw error;
  }
};


export const assignAsset = async (token, assignmentData) => {
  try {
    const res = await fetch(`${BASE_URL}/assets/assign`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(assignmentData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to assign asset');
    }

    return await res.json();
  } catch (error) {
    console.error('Assign Asset API error:', error);
    throw error;
  }
};


export const updateAssetStatus = async (token, assetId, statusData) => {
  try {
    

    const res = await fetch(`${BASE_URL}/assets/${assetId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(statusData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to update asset status');
    }

    return await res.json();
  } catch (error) {
    console.error('Update Asset Status API error:', error);
    throw error;
  }
};



export const fetchAssetById = async (token, assetId) => {
  try {
    const res = await fetch(`${BASE_URL}/assets/${assetId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to fetch asset');
    }

    return await res.json();
  } catch (error) {
    console.error('Fetch Asset By ID API error:', error);
    throw error;
  }
};


export const raiseAssetRequest = async (token, requestData) => {
  try {
    const res = await fetch(`${BASE_URL}/assets/requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to raise asset request');
    }

    return await res.json();
  } catch (error) {
    console.error('Raise Asset Request API error:', error);
    throw error;
  }
};


export const fetchAllAssetRequests = async (token) => {
  try {
    const res = await fetch(`${BASE_URL}/assets/requests`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to fetch asset requests');
    }

    return await res.json();
  } catch (error) {
    console.error('Fetch Asset Requests API error:', error);
    throw error;
  }
};

export const fetchMyAssetRequests = async (token) => {
  try {
    const res = await fetch(`${BASE_URL}/assets/requests/my`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to fetch my asset requests');
    }

    return await res.json();
  } catch (error) {
    console.error('Fetch My Asset Requests API error:', error);
    throw error;
  }
};


export const updateAssetRequestStatus = async (token, requestId, statusData) => {
  try {
    const res = await fetch(`${BASE_URL}/assets/requests/${requestId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(statusData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to update asset request status');
    }

    return await res.json();
  } catch (error) {
    console.error('Update Asset Request Status API error:', error);
    throw error;
  }
};
