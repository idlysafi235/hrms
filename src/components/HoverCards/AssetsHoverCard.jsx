import React, { useState, useEffect } from 'react';
import { fetchAssetsMine } from '../../api/assets';
import QRCode from 'react-qr-code'; 
import './HoverCards.css';

function AssetsHoverCard({ token }) {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setLoading(true);
        const data = await fetchAssetsMine(token);
        setAssets(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch assets');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchAssets();
    }
  }, [token]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };

  return (
    <div className="home_card-hover assets_hover">
      {loading && <p>Loading assets...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && assets.length === 0 && <p>No assets assigned.</p>}

      {!loading && !error && assets.length > 0 && (
        <ul className="assets-list">
          {assets.map((asset) => (
            <li key={asset.assetId} className="asset-item">
              <div className="qr-code" style={{ background: 'white', padding: '4px' }}>
                <QRCode value={asset.qrCodeValue || 'N/A'} size={80} />
              </div>
              <div className="asset-info">
                <div><strong>Asset Name:</strong> {asset.assetName}</div>
                <div><strong>Asset Type:</strong> {asset.assetType}</div>
                <div><strong>Assigned Date:</strong> {formatDate(asset.assignedAt)}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AssetsHoverCard;
