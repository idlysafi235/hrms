// src/api/utilitiesApi.js
export const fetchAadharPanLink = async (token) => {
    const response = await fetch('/api/utilities/aadhar-pan-link', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  
    if (!response.ok) {
      throw new Error('Failed to fetch Aadhar/PAN link data');
    }
  
    return await response.json();
  };
  