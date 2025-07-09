import React, { useState, useEffect } from "react";
import "./AssetListTab.css";
import EditAssetModal from "../../components/Modals/EditAssetModal";
import CreateAssetModal from "../../components/Modals/CreateAssetModal";
import { fetchAssets, updateAssetStatus } from "../../api/assets";
import { getToken } from "../../utils/auth";

const statusClass = (status) => {
  switch (status) {
    case "Available":
      return "status available";
    case "Assigned":
    case "Unavailable":
      return "status assigned";
    case "In Repair":
      return "status repair";
    case "Retired":
      return "status retired";
    case "Lost":
      return "status lost";
    default:
      return "status";
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const AssetListTab = () => {
  const [assets, setAssets] = useState([]);
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingAsset, setEditingAsset] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const rowsPerPage = 10;

  useEffect(() => {
    const loadAssets = async () => {
      try {
        setLoading(true);
        const token = getToken();
        const data = await fetchAssets(token);
        setAssets(data);
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to fetch assets");
      } finally {
        setLoading(false);
      }
    };

    loadAssets();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const filteredAssets = assets.filter((a) => {
    const matchesStatus = statusFilter === "All" || a.status === statusFilter;
    const matchesSearch =
      a.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.assetId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(filteredAssets.length / rowsPerPage);
  const paginatedAssets = filteredAssets.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleSelect = (id) => {
    setSelectedAssets((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedAssets(paginatedAssets.map((a) => a.assetId));
    } else {
      setSelectedAssets([]);
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm("Delete selected assets?")) {
      setAssets((prev) => prev.filter((a) => !selectedAssets.includes(a.assetId)));
      setSelectedAssets([]);
    }
  };

  const handleBulkAssign = () => {
    const name = prompt("Assign selected assets to:");
    if (name) {
      setAssets((prev) =>
        prev.map((a) =>
          selectedAssets.includes(a.assetId)
            ? {
                ...a,
                status: "Assigned",
                assignedTo: name,
                assignedAt: new Date().toISOString(),
              }
            : a
        )
      );
      setSelectedAssets([]);
    }
  };

  const handleBulkChangeStatus = async (newStatus) => {
    try {
      const token = getToken();
      for (const assetId of selectedAssets) {
        await updateAssetStatus(assetId, newStatus, token);
      }

      setAssets((prev) =>
        prev.map((a) =>
          selectedAssets.includes(a.assetId)
            ? { ...a, status: newStatus }
            : a
        )
      );
      setSelectedAssets([]);
    } catch (err) {
      alert("Failed to update status: " + err.message);
    }
  };

  const handleEditSave = async (updatedAsset) => {
    try {
      const token = getToken();
  
      const payload = {
        status: updatedAsset.status,
        assignedTo: updatedAsset.assignedTo === undefined || updatedAsset.assignedTo === null
          ? ""
          : updatedAsset.assignedTo.trim(),
        remarks: updatedAsset.remarks || "", 
      };
  
      await updateAssetStatus(token, updatedAsset.assetId, payload);
  
      setAssets((prev) =>
        prev.map((a) => (a.assetId === updatedAsset.assetId ? updatedAsset : a))
      );
  
      setEditingAsset(null);
    } catch (err) {
      alert("Failed to update asset: " + err.message);
    }
  };
  

  const handleCreateAsset = (newAsset) => {
    setAssets((prev) => [newAsset, ...prev]);
    setShowCreateModal(false);
  };

  return (
    <div className="asset-list-tab">
      <div className="asset-list-container">
      <div className="asset-list-header">
  <div className="top-controls">
    <input
      type="text"
      placeholder="🔍 Search by name or ID"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
    <select
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
    >
      <option value="All">All Status</option>
      <option value="Available">Available</option>
      <option value="Assigned">Assigned</option>
      <option value="In Repair">In Repair</option>
      <option value="Retired">Retired</option>
      <option value="Lost">Lost</option>
    </select>
  </div>

  <div className="create-button-container">
    <button className="create-button" onClick={() => setShowCreateModal(true)}>
      ➕ Create Asset
    </button>
  </div>
</div>
        {loading ? (
          <p>Loading asset data...</p>
        ) : error ? (
          <p className="error">Error: {error}</p>
        ) : (
          <>
            {selectedAssets.length > 0 && (
              <div className="bulk-actions">
                <button onClick={handleBulkDelete}>🗑️ Delete</button>
                <button onClick={handleBulkAssign}>📤 Assign</button>
                <button onClick={() => handleBulkChangeStatus("Available")}>✅ Available</button>
                <button onClick={() => handleBulkChangeStatus("In Repair")}>🛠️ In Repair</button>
              </div>
            )}

            <table className="asset-list-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={
                        paginatedAssets.length > 0 &&
                        selectedAssets.length === paginatedAssets.length
                      }
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th>Asset Name</th>
                  <th>Asset ID</th>
                  <th>Status</th>
                  <th>Assigned To</th>
                  <th>Updated On</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedAssets.map((asset) => (
                  <tr key={asset.assetId}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedAssets.includes(asset.assetId)}
                        onChange={() => handleSelect(asset.assetId)}
                      />
                    </td>
                    <td>{asset.assetName}</td>
                    <td>{asset.assetId}</td>
                    <td>
                      <span className={statusClass(asset.status)}>{asset.status}</span>
                    </td>
                    <td>{asset.assignedTo || "-"}</td>
                    <td>{formatDate(asset.updatedAt)}</td>
                    <td>
                      <button title="Edit" onClick={() => setEditingAsset(asset)}>✏️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pagination">
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <div>
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  ◀ Prev
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  Next ▶
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {editingAsset && (
        <EditAssetModal
          asset={editingAsset}
          onClose={() => setEditingAsset(null)}
          onSave={handleEditSave}
        />
      )}

      {showCreateModal && (
        <CreateAssetModal
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreateAsset}
        />
      )}
    </div>
  );
};

export default AssetListTab;
