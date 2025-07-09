import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMyHRRequests } from '../../api/hrrequests';
import { useAuth } from '../context/AuthContext';

function ESSHoverCard({ roles = [] }) {
  const [pendingRequests, setPendingRequests] = useState(0);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { token } = useAuth();

  const isAdminOrHR = roles.some(role => {
    const normalized = role.toLowerCase();
    return ['admin', 'hr'].includes(normalized); 
  });

  useEffect(() => {
    const loadMyPendingRequests = async () => {
      if (isAdminOrHR) return;

      try {
        const requests = await fetchMyHRRequests(token);
        const pending = requests.filter(req => req.status.toLowerCase() === 'pending');
        setPendingRequests(pending.length);
      } catch (err) {
        console.error('Error loading pending requests:', err);
        setError('Unable to load pending requests');
      }
    };

    loadMyPendingRequests();
  }, [token, isAdminOrHR]);

  const handleRaiseRequest = () => {
    navigate('/profile/hr-requests');
  };

  const handleUpdateDetails = () => {
    navigate('/profile/profile');
  };

  return (
    <div className="home_card-hover ess_hover">
      {!isAdminOrHR && (
        <>
          {error ? (
            <p style={{ color: 'red' }}>{error}</p>
          ) : (
            <p>Pending HR Requests: {pendingRequests}</p>
          )}
          <button onClick={handleRaiseRequest}>Raise HR Request</button>
        </>
      )}
      <button onClick={handleUpdateDetails}>Update Details</button>
    </div>
  );
}


export default ESSHoverCard;
