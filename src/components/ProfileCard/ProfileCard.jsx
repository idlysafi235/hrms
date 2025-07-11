import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfileCard.css';
import { fetchProfile } from '../../api/services';
import { getToken } from '../../utils/auth';

function ProfileCard({ user }) {
  const [profileData, setProfileData] = useState(user || null);
  const [loading, setLoading] = useState(!user);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  const defaultUser = {
    profileImageUrl: '',
    fullName: 'N/A',
    employeeId: 'N/A',
    email: 'N/A',
    position: 'N/A',
    reportingManagerName: 'N/A',
    dateOfJoining: new Date(),
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = getToken();
        if (!token) throw new Error('User token not found');

        const profile = await fetchProfile(token);
        setProfileData(profile);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };

    if (!user) {
      loadProfile();
    }
  }, [user]);

  const handleClick = () => {
    navigate('/profile/profile');
  };

  const displayData = profileData || defaultUser;

  const renderAvatar = () => {
    const hasImage = displayData.profileImageUrl && !imageError;

    if (hasImage) {
      return (
        <img src={displayData.profileImageUrl} alt="Profile" onError={() => setImageError(true)} />
      );
    }

    const initials = (() => {
      if (!displayData?.fullName) return 'U';

      const words = displayData.fullName.trim().split(/\s+/);
      if (words.length === 1) {
        return words[0][0].toUpperCase();
      } else if (words.length === 2) {
        return (words[0][0] + words[1][0]).toUpperCase();
      } else {
        return (words[0][0] + words[words.length - 1][0]).toUpperCase();
      }
    })();

    return (
      <div className="profile-image initials">
        <div className="icon-placeholder">
          <h1>{initials}</h1>
        </div>
      </div>
    );
  };

  if (loading) return <div className="profile_card">Loading profile...</div>;
  if (error) return <div className="profile_card error">{error}</div>;

  return (
    <div className="profile_card">
      <div className="profile-content">
        <div className="profile-left">
          <div className="profile-image">{renderAvatar()}</div>
          <div className="employee-details">
            <h4 className="profile-name">{displayData.fullName || 'N/A'}</h4>
            <span>{displayData.email || 'N/A'}</span>
            <span>{displayData.employeeId || 'N/A'}</span>
          </div>
        </div>

        <div className="profile-right">
          <p>
            <span>Position:</span> <span>{displayData.position || 'N/A'}</span>
          </p>
          <p>
            <span>Reporting Manager:</span> <span>{displayData.reportingManagerName || 'N/A'}</span>
          </p>
          <p>
            <span>Date of Joining:</span>{' '}
            <span>
              {displayData.dateOfJoining
                ? new Intl.DateTimeFormat('en-US', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  }).format(new Date(displayData.dateOfJoining))
                : 'N/A'}
            </span>
          </p>
          <button className="check-profile-button" onClick={handleClick}>
            Check Profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
