import React, { useState } from "react";
import "./EditAssetModal.css";

const EditAssetModal = ({ asset, onClose, onSave }) => {
  const [formData, setFormData] = useState({ ...asset });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-backdrop">
      <div className="edit-asset-modal">
        <h2>Edit Asset</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Asset Name:
            <input
              type="text"
              name="assetName"
              value={formData.assetName}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Asset ID:
            <input
              type="text"
              name="assetId"
              value={formData.assetId}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Assigned To:
            <input
              type="text"
              name="assignedTo"
              value={formData.assignedTo || ""}
              onChange={handleChange}
            />
          </label>
          <label>
            Status:
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="Available">Available</option>
              <option value="Assigned">Assigned</option>
              <option value="In Repair">In Repair</option>
              <option value="Retired">Retired</option>
              <option value="Lost">Lost</option>
            </select>
          </label>
          <div className="modal-actions">
            <button type="submit">💾 Save</button>
            <button type="button" onClick={onClose}>❌ Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAssetModal;
