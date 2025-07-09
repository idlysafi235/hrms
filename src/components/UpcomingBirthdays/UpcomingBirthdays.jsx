import React, { useEffect, useState } from 'react';
import './UpcomingBirthdays.css';
import { getUpcomingBirthdays } from '../../api/employee';

const UpcomingBirthdays = () => {
  const [todayBirthdays, setTodayBirthdays] = useState([]);

  useEffect(() => {
    const fetchBirthdays = async () => {
      try {
        const token = localStorage.getItem('token');
        const data = await getUpcomingBirthdays(token);

        const today = new Date();
        const todayMonth = today.getMonth();
        const todayDate = today.getDate(); 

        const birthdaysToday = data.filter(emp => {
          if (!emp.dateOfBirth) return false;
          const dob = new Date(emp.dateOfBirth);
          return dob.getMonth() === todayMonth && dob.getDate() === todayDate;
        });

        setTodayBirthdays(birthdaysToday);
      } catch (err) {
        console.error('Failed to fetch birthdays:', err);
      }
    };

    fetchBirthdays();
  }, []);

  const maxVisible = 3;
  const visibleBirthdays = todayBirthdays.slice(0, maxVisible);
  const remainingCount = todayBirthdays.length - maxVisible;

  return (
    <div className="birthdays-container">
      <h3>Today's Birthdays</h3>
      <ul className="birthday-list">
        {todayBirthdays.length === 0 ? (
          <li className="no-birthdays">No birthdays today</li>
        ) : (
          <>
            {visibleBirthdays.map((emp, idx) => (
              <li key={idx} className="birthday-item">
                <div className="birthday-name">{emp.fullName || 'Unknown'}</div>
              </li>
            ))}

            {remainingCount > 0 && (
              <li className="birthday-item more-item">
                +{remainingCount} more
                <div className="tooltipbox">
                  <ul className="full-birthday-list">
                    {todayBirthdays.map((emp, idx) => (
                      <li key={idx} className="full-birthday-item">
                        {emp.fullName || 'Unknown'}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            )}
          </>
        )}
      </ul>
    </div>
  );
};

export default UpcomingBirthdays;
