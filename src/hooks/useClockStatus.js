import { useState, useEffect } from 'react';
import { fetchClockStatus } from '../api/clock';
import { getToken } from '../utils/auth';
import { formatTotalHours } from '../utils/timeUtils';

export function useClockStatus() {
  const [clockData, setClockData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadClockStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      if (!token) throw new Error('User is not authenticated');
      const rawData = await fetchClockStatus(token);

      const formattedData = rawData.map(entry => ({
        ...entry,
        formattedTotalHours: formatTotalHours(entry.totalHours),
      }));

      setClockData(formattedData);
    } catch (err) {
      setError(err.message || 'Failed to fetch clock status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClockStatus();
  }, []);

  return {
    clockData,          
    loading,
    error,
    refreshClockStatus: loadClockStatus,
  };
}
