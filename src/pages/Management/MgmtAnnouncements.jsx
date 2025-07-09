import React, { useState, useEffect } from "react";
import {
  fetchAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
  updateAnnouncement,
} from "../../api/general";
import { getToken } from "../../utils/auth";
import { timeAgo } from "../../utils/timeUtils";
import "./Management.css";
import { PencilLineIcon, XIcon } from "lucide-react";

function MgmtAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({ id: null, title: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = getToken();

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      const data = await fetchAnnouncements(token);
      setAnnouncements(data);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadAnnouncements();
    } else {
      setError("Unauthorized: No token found");
      setLoading(false);
    }
  }, [token]);

  const handleAddAnnouncement = async () => {
    const title = newTitle.trim();
    const description = newDescription.trim();
    if (!title || !description) {
      setError("Both title and description are required.");
      return;
    }
    try {
      await createAnnouncement(token, title, description);
      setNewTitle("");
      setNewDescription("");
      await loadAnnouncements();
      showSuccess("Announcement added successfully.");
      setError("");
    } catch (err) {
      setError(err.message || "Failed to add announcement");
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    try {
      await deleteAnnouncement(token, id);
      await loadAnnouncements();
      showSuccess("Announcement deleted.");
      setError("");
    } catch (err) {
      setError(err.message || "Failed to delete announcement");
    }
  };

  const handleEditSave = async () => {
    const title = editData.title.trim();
    const description = editData.description.trim();
    if (!title && !description) {
      setError("At least one of title or description must be provided.");
      return;
    }
    try {
      await updateAnnouncement(token, editData.id, title || undefined, description || undefined);
      setEditModalOpen(false);
      setEditData({ id: null, title: "", description: "" });
      await loadAnnouncements();
      showSuccess("Announcement updated.");
      setError("");
    } catch (err) {
      setError(err.message || "Failed to update announcement");
    }
  };

  const showSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 3000);
  };

  return (
    <section className="management-section">
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      {loading ? (
        <p>Loading announcements...</p>
      ) : (
        <>
          <ul className="item-list">
          {announcements.map(({ id, title, description, createdAt }) => (
  <li key={id} className="announcement-item">
    <div style={{ flex: 1 }}>
      <strong className="announcement-title">Title: {title}</strong>
      <p className="announcement-description">Description: {description}</p>
      <p className="announcement-time">{timeAgo(createdAt)}</p>
    </div>
    <div className="mgmt-actions">
      <button
        className="white-button"
        onClick={() => {
          setEditModalOpen(true);
          setEditData({ id, title, description });
          setError("");
          setSuccess("");
        }}
        title="Edit"
      >
        <PencilLineIcon size={20} />
      </button>
      <button
        className="cancel-button"
        onClick={() => handleDeleteAnnouncement(id)}
        title="Delete"
      >
        <XIcon size={20} />
      </button>
    </div>
  </li>
))}

          </ul>

          {/* Add new announcement */}
          <div className="mgmtform-group">
            <input
              type="text"
              placeholder="Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="new-announcement-input"
            />
            <textarea
              placeholder="Description"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="new-announcement-textarea"
            />
            <button onClick={handleAddAnnouncement}className="new-announcement-button">
              Add</button>
          </div>
        </>
      )}

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Announcement</h3>
            <input
              type="text"
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              placeholder="Title"
            />
            <textarea
              value={editData.description}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              placeholder="Description"
            />
            <div className="modal-actions">
              <button onClick={handleEditSave}>Save</button>
              <button
                onClick={() => {
                  setEditModalOpen(false);
                  setError("");
                  setSuccess("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default MgmtAnnouncements;
