import React, { useState } from "react";
import "./CreateAssetModal.css";
import { getToken } from "../../utils/auth";
import { createAsset } from "../../api/assets";

const CreateAssetModal = ({ onClose, onSave }) => {
  const [assetName, setAssetName] = useState("");
  const [assetType, setAssetType] = useState("");
  const [description, setDescription] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [status, setStatus] = useState("Available");
  const [assetTag, setAssetTag] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newAsset = {
      assetName,
      assetType,
      description,
      purchaseDate,
      assignedTo: assignedTo || null,
      status,
      assetTag,
    };

    try {
      const token = getToken();
      await createAsset(token, newAsset);
      onSave(newAsset);
    } catch (err) {
      alert("Failed to create asset: " + err.message);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Create New Asset</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Asset Name:
            <input
              type="text"
              value={assetName}
              onChange={(e) => setAssetName(e.target.value)}
              required
            />
          </label>
          <label>
            Asset Type:
            <input
              type="text"
              value={assetType}
              onChange={(e) => setAssetType(e.target.value)}
              required
            />
          </label>
          <label>
            Description:
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          <label>
            Purchase Date:
            <input
              type="date"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
              required
            />
          </label>
          <label>
            Assigned To:
            <input
              type="text"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
            />
          </label>
          <label>
            Status:
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="Available">Available</option>
              <option value="Assigned">Assigned</option>
              <option value="In Repair">In Repair</option>
              <option value="Retired">Retired</option>
              <option value="Lost">Lost</option>
            </select>
          </label>
          <label>
            Asset Tag:
            <input
              type="text"
              value={assetTag}
              onChange={(e) => setAssetTag(e.target.value)}
              required
            />
          </label>

          <div className="modal-actions">
            <button type="submit">Create</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAssetModal;
