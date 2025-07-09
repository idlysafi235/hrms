import React, { useEffect, useState, useRef } from 'react';
import { fetchAllHRRequests } from '../../api/profile';
import { fetchMyHRRequests, raiseHRRequest } from '../../api/hrrequests';
import './HRRequests.css';
import RequestHRModal from '../../components/Modals/RequestHRModal';
import DetailsModal from '../../components/Modals/DetailsModal';
import { getToken } from '../../utils/auth';
import StatusBadge from '../../components/common/StatusBadge';
import { notifySuccess, notifyError } from '../../components/Toast/ToastProvider';

const RaiseHRRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const tokenRef = useRef('');

  const loadRequests = async (token, currentRoles) => {
    try {
      const isHRorAdmin = currentRoles.includes('HR') || currentRoles.includes('Admin');
      const data = isHRorAdmin
        ? await fetchAllHRRequests(token)
        : await fetchMyHRRequests(token);

      setRequests(data || []);
    } catch (error) {
      console.error('Failed to fetch HR requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = getToken();
    tokenRef.current = token;

    const user = JSON.parse(localStorage.getItem('user')) || {};
    const rolesFromStorage = user.roles || [];

    setRoles(rolesFromStorage);
    if (token) loadRequests(token, rolesFromStorage);
  }, []);

  const openModal = () => setShowModal(true);

  const closeModal = (refresh = false) => {
    setShowModal(false);
    if (refresh && tokenRef.current) {
      const user = JSON.parse(localStorage.getItem('user')) || {};
      const rolesFromStorage = user.roles || [];
      loadRequests(tokenRef.current, rolesFromStorage);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      await raiseHRRequest(tokenRef.current, formData);
      notifySuccess('HR request submitted successfully!');
      closeModal(true);
    } catch (error) {
      console.error('Error submitting HR request:', error);
      notifyError(error.message || 'Failed to raise HR request');
    }
  };
  

  const handleUpdateRequest = (updatedRequest) => {
    setRequests((prev) =>
      prev.map((r) => (r.requestId === updatedRequest.requestId ? updatedRequest : r))
    );
  };

  const isHRorAdmin = roles.includes('HR') || roles.includes('Admin');

  return (
    <div className="hr-requests-container">
      <div className="header">
        <h2>{isHRorAdmin ? 'All HR Requests' : 'My HR Requests'}</h2>

        {!isHRorAdmin && (
          <button className="new-request-btn" onClick={openModal}>
            + New Request
          </button>
        )}
      </div>

      {loading ? (
        <p className="loading">Loading requests...</p>
      ) : requests.length === 0 ? (
        <p className="no-requests">
          {isHRorAdmin
            ? 'No HR requests have been raised yet.'
            : 'You have not raised any HR requests yet.'}
        </p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Category</th>
              <th>Subject</th>
              {/* <th>Description</th> */}
              <th>Status</th>
              <th>Raised On</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.requestId}>
                <td
                  className="clickable"
                  onClick={() => setSelectedRequest(req)}
                  style={{ color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  {req.requestId}
                </td>
                <td>{req.category}</td>
                <td>{req.subject}</td>
                {/* <td>{req.description || '—'}</td> */}
                <td>
                  <StatusBadge status={req.status} />
                </td>
                <td>
                  {new Date(req.createdAt).toLocaleDateString('en-US', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && (
        <RequestHRModal onClose={() => closeModal(false)} onSubmit={handleSubmit} />
      )}

      {selectedRequest && (
        <DetailsModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onUpdate={handleUpdateRequest}
          token={tokenRef.current}
        />
      )}
    </div>
  );
};

export default RaiseHRRequests;
