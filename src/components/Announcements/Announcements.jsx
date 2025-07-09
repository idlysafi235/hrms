import React, { useEffect, useState } from 'react';
import './Announcements.css';
import { fetchAnnouncements } from '../../api/general';
import { getToken } from '../../utils/auth';
import { Megaphone } from 'lucide-react';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [error, setError] = useState('');

  const iconColors = [
    'bg-red-200',
    'bg-green-200',
    'bg-blue-200',
    'bg-yellow-200',
    'bg-purple-200',
    'bg-pink-200',
    'bg-indigo-200',
    'bg-orange-200'
  ];

  useEffect(() => {
    const token = getToken();
    const loadAnnouncements = async () => {
      try {
        const data = await fetchAnnouncements(token);
        setAnnouncements(data);
      } catch (err) {
        setError('Failed to load announcements');
        console.error(err);
      }
    };

    if (token) {
      loadAnnouncements();
    } else {
      setError('Unauthorized: No token found');
    }
  }, []);

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  return (
    <div className="announcements-card">
      <div className="announcements-card-title">
              <span>📢 Announcements</span>
            </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className="announcements-container">
        <ul>
          {announcements.length === 0 ? (
            <li>No announcements available.</li>
          ) : (
            announcements.map((a, index) => (
              <li key={a.id} className="announcement-item">
                <div className={`icon ${iconColors[index % iconColors.length]}`}>
                  <Megaphone size={16} />
                </div>
                <div className="announcement-content">
                  <div className="announcement-header">
                    <strong>{a.title}</strong>
                    <span className="announcement-time">{getTimeAgo(a.createdAt)}</span>
                  </div>
                  <p>{a.description}</p>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default Announcements;
