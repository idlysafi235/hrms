import React, { useEffect, useState } from 'react';
import './Events.css';
import { fetchEvents } from '../../api/general';
import { getToken } from '../../utils/auth';
import { getUpcomingBirthdays } from '../../api/employee';
import { NavLink } from 'react-router-dom';
import { Monitor } from 'lucide-react';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');
  const [todayBirthdays, setTodayBirthdays] = useState([]);
  const [activeTab, setActiveTab] = useState('events'); 

  useEffect(() => {
    const token = getToken();

    const loadEvents = async () => {
      try {
        const data = await fetchEvents(token);
        setEvents(data);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events');
      }
    };

    const fetchBirthdays = async () => {
      try {
        const data = await getUpcomingBirthdays(token);
        const today = new Date();
        const todayMonth = today.getMonth();
        const todayDate = today.getDate();

        const birthdaysToday = data.filter((emp) => {
          if (!emp.dateOfBirth) return false;
          const dob = new Date(emp.dateOfBirth);
          return dob.getMonth() === todayMonth && dob.getDate() === todayDate;
        });

        setTodayBirthdays(birthdaysToday);
      } catch (err) {
        console.error('Failed to fetch birthdays:', err);
      }
    };

    if (token) {
      loadEvents();
      fetchBirthdays();
    } else {
      setError('Unauthorized: No token found');
    }
  }, []);

  const maxVisible = 3;
  const visibleBirthdays = todayBirthdays.slice(0, maxVisible);
  const remainingCount = todayBirthdays.length - maxVisible;

  return (
    <div className="events-birthdays-container">
      {/* Navbar */}
      <nav className="evelayouts-navbar">
  <button
    className={`evelayouts-tab ${activeTab === 'events' ? 'active' : ''}`}
    onClick={() => setActiveTab('events')}
  >
    📅 Upcoming Events
  </button>
  <button
    className={`evelayouts-tab ${activeTab === 'birthdays' ? 'active' : ''}`}
    onClick={() => setActiveTab('birthdays')}
  >
    🎂 Today's Birthdays
  </button>
</nav>

      {/* Events Section */}
      {activeTab === 'events' && (
  <div className="events-section">
    {error && <p style={{ color: 'red' }}>{error}</p>}
    <ul>
      {events.length === 0 ? (
        <li>No upcoming events.</li>
      ) : (
        [...events]
          .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate))
          .map((event, i) => {
            const eventDate = new Date(event.eventDate);
            const today = new Date();
            const tomorrow = new Date();
            tomorrow.setDate(today.getDate() + 1);

            const isToday =
              eventDate.toDateString() === today.toDateString();
            const isTomorrow =
              eventDate.toDateString() === tomorrow.toDateString();

            let label = eventDate.toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            });

            if (isToday) label = 'Today';
            else if (isTomorrow) label = 'Tomorrow';

            const time = eventDate.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <li key={i} className="event-item">
                <div className="event-icon-title">
                  <span className="event-icon"><Monitor size={20} /></span>
                  <div className="event-details">
                    <div className="event-title">{event.title}</div>
                    <div className="event-date-time">
                    {label} at {eventDate.toLocaleTimeString('en-US', {
                     hour: 'numeric',
                     minute: '2-digit',
                     hour12: true,
                    })}
                  </div>
                  </div>
                </div>
              </li>
            );
          })
      )}
    </ul>
  </div>
)}
      {/* Birthdays Section */}
      {activeTab === 'birthdays' && (
        <div className="birthdays-section">
          <ul className="birthday-list">
            {todayBirthdays.length === 0 ? (
              <li className="no-birthdays">No birthdays today</li>
            ) : (
              <>
                {visibleBirthdays.map((emp, idx) => (
                  <li key={idx} className="birthday-item">
                    <span className="birthday-icon">🎂</span>
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
      )}
    </div>
  );
};

export default Events;
