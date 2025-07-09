import React, { useState, useEffect } from 'react';
import './RequestAssetModal.css';

const RequestAssetModal = ({ assets = [], onClose, onSubmit }) => {
  const [requestType, setRequestType] = useState('new'); 

  const [newAssetData, setNewAssetData] = useState({
    assetType: '',
    description: ''
  });

  const [repairData, setRepairData] = useState({
    selectedAssetId: '',
    issueType: '',
    issueDescription: ''
  });

  const [selectedAssetInfo, setSelectedAssetInfo] = useState(null);

  useEffect(() => {
    if (requestType === 'repair' && assets.length > 0) {

      if (!repairData.selectedAssetId) {
        setRepairData(prev => ({
          ...prev,
          selectedAssetId: assets[0].assetId || assets[0].id || ''
        }));
      }
    }
  }, [requestType, assets]);

  useEffect(() => {
    if (repairData.selectedAssetId) {
      const asset = assets.find(
        (a) => a.assetId === repairData.selectedAssetId || a.id === repairData.selectedAssetId
      );
      setSelectedAssetInfo(asset || null);
    } else {
      setSelectedAssetInfo(null);
    }
  }, [repairData.selectedAssetId, assets]);

  const handleRequestTypeChange = (e) => {
    setRequestType(e.target.value);
    setNewAssetData({ assetType: '', description: '' });
    setRepairData({ selectedAssetId: '', issueType: '', issueDescription: '' });
    setSelectedAssetInfo(null);
  };

  const handleNewAssetChange = (e) => {
    const { name, value } = e.target;
    setNewAssetData(prev => ({ ...prev, [name]: value }));
  };

  const handleRepairChange = (e) => {
    const { name, value } = e.target;
    setRepairData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (requestType === 'new') {
     
      onSubmit({
        requestType: 'New Asset Request',
        assetType: newAssetData.assetType,
        description: newAssetData.description,
      });
    } else if (requestType === 'repair') {
      if (!selectedAssetInfo) return;

      onSubmit({
        requestType: 'Asset Repair Request',
        assetId: repairData.selectedAssetId,
        assetName: selectedAssetInfo.assetName || selectedAssetInfo.name || '',
        assetTag: selectedAssetInfo.assetTag || '',
        issueType: repairData.issueType,
        issueDescription: repairData.issueDescription,
      });
    }
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <h3>Request Asset</h3>

        <form onSubmit={handleSubmit} className="modal-form">
          <label>
            Request Type
            <select value={requestType} onChange={handleRequestTypeChange}>
              <option value="new">New Asset Request</option>
              <option value="repair">Asset Repair Request</option>
            </select>
          </label>

          {requestType === 'new' && (
            <>
              <label>
                Asset Type
                <input
                  type="text"
                  name="assetType"
                  value={newAssetData.assetType}
                  onChange={handleNewAssetChange}
                  required
                  placeholder="e.g., Laptop, Mouse"
                />
              </label>

              <label>
                Description
                <textarea
                  name="description"
                  value={newAssetData.description}
                  onChange={handleNewAssetChange}
                  required
                  placeholder="Why do you need this asset?"
                  rows="3"
                />
              </label>
            </>
          )}

          {requestType === 'repair' && (
            <>
              <label>
                Select Asset
                <select
                  name="selectedAssetId"
                  value={repairData.selectedAssetId}
                  onChange={handleRepairChange}
                  required
                >
                  <option value="" disabled>
                    -- Select an asset --
                  </option>
                  {assets.map((asset) => (
                    <option
                      key={asset.assetId || asset.id}
                      value={asset.assetId || asset.id}
                    >
                      {asset.assetName || asset.name} ({asset.assetTag})
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Issue Type
                <input
                  type="text"
                  name="issueType"
                  value={repairData.issueType}
                  onChange={handleRepairChange}
                  required
                  placeholder="e.g., Hardware, Software, Other"
                />
              </label>

              <label>
                Issue Description
                <textarea
                  name="issueDescription"
                  value={repairData.issueDescription}
                  onChange={handleRepairChange}
                  required
                  placeholder="Describe the issue"
                  rows="3"
                />
              </label>
            </>
          )}

          <div className="modal-actions">
            <button type="submit" className="submit-btn">
              Submit Request
            </button>
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestAssetModal;
