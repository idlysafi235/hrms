import { useState, useEffect } from 'react';
import { fetchMyAttendanceLogsByDate } from '../api/clock';
import { getToken } from '../utils/auth';

export function useAttendanceLogsByDate(date, refreshKey = 0) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      if (!token) throw new Error('User not authenticated');

      const formattedDate = date.toLocaleDateString('en-CA');
    
      const data = await fetchMyAttendanceLogsByDate(token, formattedDate);
      setLogs(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch attendance logs');
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (date) {
      loadLogs();
    }
  }, [date, refreshKey]); 

  return {
    logs,
    loading,
    error,
    refreshLogs: loadLogs,
  };
}
