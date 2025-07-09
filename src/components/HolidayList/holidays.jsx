import React, { useEffect, useState } from 'react';
import { fetchHolidays } from '../../api/general';  // adjust the path if needed
import { getToken } from '../../utils/auth';

const UpcomingHolidays = () => {
  const [holidays, setHolidays] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = getToken();

    const loadHolidays = async () => {
      try {
        const data = await fetchHolidays(token);
        setHolidays(data);
      } catch (err) {
        console.error('Error fetching holidays:', err);
        setError('Failed to load holidays');
      }
    };

    if (token) {
      loadHolidays();
    } else {
      setError('Unauthorized: No token found');
    }
  }, []);

  return (
    <div>
      <h3>🎉 Upcoming Holidays</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {holidays.length === 0 ? (
          <li>No upcoming holidays.</li>
        ) : (
          holidays.map((holiday) => (
            <li key={holiday.id}>
              {holiday.name} - {new Date(holiday.holidayDate).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default UpcomingHolidays;
