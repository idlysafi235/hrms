import React, { useState, useEffect } from 'react';
import { fetchHolidays, createHoliday, deleteHoliday } from '../../api/general';
import { getToken } from '../../utils/auth';
import { XIcon } from 'lucide-react';
import './Management.css';

function Holidays() {
  const [holidays, setHolidays] = useState([]);
  const [newHolidayName, setNewHolidayName] = useState('');
  const [newHolidayDate, setNewHolidayDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = getToken();

  const loadHolidays = async () => {
    try {
      setLoading(true);
      const data = await fetchHolidays(token);
      const sorted = [...data].sort((a, b) => new Date(a.holidayDate) - new Date(b.holidayDate));
      setHolidays(sorted);
    } catch (err) {
      setError(err.message || 'Failed to load holidays');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadHolidays();
    } else {
      setError('Unauthorized: No token found');
      setLoading(false);
    }
  }, [token]);

  const handleAddHoliday = async () => {
    const trimmedName = newHolidayName.trim();

    if (!trimmedName || !newHolidayDate) return;

    const isDuplicate = holidays.some(
      (h) => h.name.toLowerCase() === trimmedName.toLowerCase() || h.holidayDate === newHolidayDate
    );

    if (isDuplicate) {
      alert('A holiday with the same name or date already exists.');
      return;
    }

    try {
      await createHoliday(token, trimmedName, newHolidayDate);
      setNewHolidayName('');
      setNewHolidayDate('');
      await loadHolidays();
    } catch (err) {
      setError(err.message || 'Failed to add holiday');
    }
  };

  const handleDeleteHoliday = async (id) => {
    try {
      await deleteHoliday(token, id);
      await loadHolidays();
    } catch (err) {
      setError(err.message || 'Failed to delete holiday');
    }
  };

  return (
    <section className="management-section">
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading ? (
        <p>Loading holidays...</p>
      ) : (
        <>
          <div className="form-group">
            <input
              type="text"
              placeholder="Holiday name"
              value={newHolidayName}
              onChange={(e) => {
                const value = e.target.value;
                if (/^[a-zA-Z\s]*$/.test(value)) {
                  setNewHolidayName(value);
                }
              }}
              className="new-holiday-input"
            />
            <input
  type="date"
  min="1900-01-01"
  max="2100-12-31"
  value={newHolidayDate}
  onChange={(e) => setNewHolidayDate(e.target.value)}
  onInput={(e) => {
    const val = e.target.value;
    const year = val.split("-")[0];
    if (year.length > 4) {
      e.target.value = "";
      setNewHolidayDate("");
    }
  }}
/>

            <button onClick={handleAddHoliday} className="new-announcement-button">
              Add
            </button>
          </div>
          <ul className="item-list">
            {holidays.map(({ id, name, holidayDate }) => {
              const formattedDate = new Date(holidayDate).toLocaleDateString('en-US', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              });
              return (
                <li key={id} className="mgmt-row">
                  <div className="mgmt-title">
                    <strong>{name}</strong>
                  </div>
                  <div className="mgmt-date">{formattedDate}</div>
                  <div className="mgmt-actions">
                    <button
                      className="cancel-button"
                      onClick={() => handleDeleteHoliday(id)}
                      aria-label={`Delete holiday ${name}`}
                    >
                      <XIcon size={20} />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </section>
  );
}

export default Holidays;
