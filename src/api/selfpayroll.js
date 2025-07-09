import { BASE_URL } from './urls';
import { getToken } from '../utils/auth';

export const fetchSelfPayroll = async (month, year) => {
  const token = getToken();
  try {
    const res = await fetch(`${BASE_URL}/payroll/self?month=${month}&year=${year}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to fetch payroll');
    }

    return await res.json();
  } catch (error) {
    console.error('Fetch Self Payroll API error:', error);
    throw error;
  }
};
