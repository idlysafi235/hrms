import React, { useEffect, useState } from "react";
import {
  fetchEvents,
  createEvent,
  deleteEvent,
  updateEvent,
} from "../../api/general";
import { getToken } from "../../utils/auth";
import { PencilLineIcon, XIcon } from "lucide-react";

function Events() {
  const [events, setEvents] = useState([]);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDate, setNewEventDate] = useState("");
  const [newEventTime, setNewEventTime] = useState("");
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ title: "", date: "", time: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = getToken();

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await fetchEvents(token);
      const sorted = [...data].sort(
        (a, b) => new Date(a.eventDate) - new Date(b.eventDate)
      );
      setEvents(sorted);
    } catch (err) {
      showError(err.message || "Failed to load events");

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadEvents();
    } else {
      showError(err.message || "Failed to load events");

      setLoading(false);
    }
  }, [token]);

  const handleAddEvent = async () => {
    const trimmedTitle = newEventTitle.trim();
    if (!trimmedTitle || !newEventDate || !newEventTime) {
      alert("Please fill in title, date, and time");
      return;
    }

    try {
      await createEvent(token, trimmedTitle, newEventDate, newEventTime);
      setNewEventTitle("");
      setNewEventDate("");
      setNewEventTime("");
      await loadEvents();
      showSuccess("Event added.");
    } catch (err) {
      showError(err.message || "Failed to load events");

    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      await deleteEvent(token, id);
      await loadEvents();
      showSuccess("Event deleted.");
    } catch (err) {
      showError(err.message || "Failed to load events");
    }
  };

  const handleEditEvent = async (id) => {
    const { title, date, time } = editData;
    if (!title.trim() || !date || !time) {
      alert("Please fill all fields.");
      return;
    }
  
    try {
      await updateEvent(token, id, title.trim(), date, time);
  
      setEditId(null);
      setEditData({ title: "", date: "", time: "" });
      await loadEvents();
      showSuccess("Event updated.");
    } catch (err) {
      showError(err.message || "Failed to load events");
    }
  };
  
  const showSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 3000);
  };

  const showError = (msg) => {
    setError(msg);
    setTimeout(() => setError(""), 3000);
  };
  

  return (
    <section className="management-section">
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      {loading ? (
        <p>Loading events...</p>
      ) : (
        <>
          <ul className="item-list">
            {events.map(({ id, title, eventDate }) => {
              const dateObj = new Date(eventDate);
              const localDate = dateObj.toISOString().slice(0, 10);
              const localTime = dateObj.toTimeString().slice(0, 5);

              return (
                <li key={id} className="event-item">
  {editId === id ? (
    <>
      <input
        value={editData.title}
        onChange={(e) => setEditData({ ...editData, title: e.target.value })}
        placeholder="Event title"
      />
      <input
        type="date"
        value={editData.date}
        onChange={(e) => setEditData({ ...editData, date: e.target.value })}
      />
      <input
        type="time"
        value={editData.time}
        onChange={(e) => setEditData({ ...editData, time: e.target.value })}
      />
      <button onClick={() => handleEditEvent(id)}>Save</button>
      <button onClick={() => setEditId(null)}>Cancel</button>
    </>
  ) : (
    <div className="mgmt-row">
      <div className="mgmt-title">{title}</div>
      <div className="mgmt-date">
        {dateObj.toLocaleString("en-US", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })}
      </div>
      <div className="mgmt-actions">
        <button
          className="mgmticon-button"
          onClick={() => {
            setEditId(id);
            setEditData({ title, date: localDate, time: localTime });
          }}
          aria-label="Edit Event"
        >
          <PencilLineIcon size={20} />
        </button>
        <button
          className="mgmticon-button"
          onClick={() => handleDeleteEvent(id)}
          aria-label="Delete Event"
        >
          <XIcon size={20} />
        </button>
      </div>
    </div>
  )}
</li>

              );
            })}
          </ul>

          <div className="form-group">
            <input
              type="text"
              placeholder="Event title"
              value={newEventTitle}
              onChange={(e) => {
                const value = e.target.value;
                if (/^[a-zA-Z0-9\s]*$/.test(value)) {
                  setNewEventTitle(value);
                }
              }}
            />
            <input
  type="date"
  min="1900-01-01"
  max="2100-12-31"
  value={newEventDate}
  onChange={(e) => setNewEventDate(e.target.value)}
  onInput={(e) => {
    const val = e.target.value;
    const year = val.split("-")[0];
    if (year.length > 4) {
      e.target.value = "";
      setNewEventDate("");
    }
  }}
/>
            <input
              type="time"
              value={newEventTime}
              onChange={(e) => setNewEventTime(e.target.value)}
            />
            <button onClick={handleAddEvent}>Add</button>
          </div>
        </>
      )}
    </section>
  );
}

export default Events;
