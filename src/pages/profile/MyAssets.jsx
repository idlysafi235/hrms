import React, { useEffect, useState } from 'react';
import './MyAssets.css';
import { fetchAssetsMine, raiseAssetRequest, fetchMyAssetRequests } from '../../api/assets';
import RequestAssetModal from '../../components/Modals/RequestAssetModal';
import StatusBadge from '../../components/common/StatusBadge';
import { getToken } from '../../utils/auth';
import { notifySuccess, notifyError } from '../../components/Toast/ToastProvider';

const Assets = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [assetRequests, setAssetRequests] = useState([]);

  const loadAssetsAndRequests = async () => {
    try {
      setLoading(true);
      const token = getToken();
      if (!token) throw new Error('User token not found');

      const [assetData, requestData] = await Promise.all([
        fetchAssetsMine(token),
        fetchMyAssetRequests(token),
      ]);

      setAssets(assetData);
      setAssetRequests(requestData);
      setError(null);
    } catch (err) {
      const errMsg = err.message || 'Failed to fetch data';
      setError(errMsg);
      notifyError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssetsAndRequests();
  }, []);

  const handleRequestAsset = () => {
    setShowRequestModal(true);
  };

  const handleRequestSubmit = async (formData) => {
    try {
      const token = getToken();
      if (!token) throw new Error('User token not found');

      const response = await raiseAssetRequest(token, formData);
      notifySuccess(response?.message || 'Asset request submitted successfully!');
      setShowRequestModal(false);

      const updatedRequests = await fetchMyAssetRequests(token);
      setAssetRequests(updatedRequests);
    } catch (error) {
      notifyError(error.message || 'Failed to submit asset request');
    }
  };

  if (loading) return <div className="assets-loading">Loading assets...</div>;
  if (error) return <div className="assets-error">Error: {error}</div>;

  return (
    <div className="assets-container">
      <div className="assets-header">
        <h2 className="assets-title">My Assigned Assets</h2>
        <button className="asset-request-btn" onClick={handleRequestAsset}>
          + Request New Asset
        </button>
      </div>

      {assets.length === 0 ? (
        <p className="no-assets-msg">No assets assigned.</p>
      ) : (
        <div className="assets-list">
          {assets.map((asset, index) => (
            <div className="asset-card" key={index}>
              <div className="asset-details">
                <p><strong>Name:</strong> {asset.assetName}</p>
                <p><strong>Type:</strong> {asset.assetType}</p>
                <p><strong>Tag:</strong> {asset.assetTag}</p>
                <p><strong>Status:</strong> {asset.status}</p>
                <p><strong>Assigned Date:</strong> 
                  {asset.assignedAt
                    ? new Date(asset.assignedAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })
                    : 'N/A'}
                </p>
              </div>
              <div className="qr-code-section">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(asset.qrCodeValue)}&size=100x100`}
                  alt="QR Code"
                  className="qr-code"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {showRequestModal && (
        <RequestAssetModal
          onClose={() => setShowRequestModal(false)}
          onSubmit={handleRequestSubmit}
        />
      )}

      <h2 className="assets-subtitle">My Asset Requests</h2>
      {assetRequests.length === 0 ? (
        <p className="no-requests-msg">No asset requests raised.</p>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Asset Type</th>
                <th>Description</th>
                <th>Status</th>
                <th>Raised On</th>
              </tr>
            </thead>
            <tbody>
              {assetRequests.map((req) => (
                <tr key={req.requestId}>
                  <td
                    className="clickable"
                    style={{ color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    {req.requestId}
                  </td>
                  <td>{req.assetType}</td>
                  <td>{req.description || '—'}</td>
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
        </div>
      )}
    </div>
  );
};

export default Assets;
