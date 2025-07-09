import React, { useEffect, useState } from 'react';

function AttendanceWidget() {
  const [checkInTime] = useState(() =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [totalHours, setTotalHours] = useState('00h : 00m');
  const [checkInMoment] = useState(new Date());
  const [moodDates, setMoodDates] = useState([]);
  const [streak, setStreak] = useState(0);
  const [notification, setNotification] = useState('');
  const [moodOffset, setMoodOffset] = useState(0);

  useEffect(() => {
    const today = new Date();
    const offsetDates = Array.from({ length: 4 }).map((_, i) => {
      const date = new Date();
      date.setDate(today.getDate() + (i - 3 + moodOffset));
      return {
        label: date.toLocaleDateString('en-US', { weekday: 'short' }),
        day: date.getDate(),
      };
    });
    setMoodDates(offsetDates);
  }, [moodOffset]);

  const handleCheckOut = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setCheckOutTime(timeStr);

    const duration = Math.floor((now - checkInMoment) / 60000);
    const hh = Math.floor(duration / 60);
    const mm = duration % 60;
    setTotalHours(`${hh.toString().padStart(2, '0')}h : ${mm.toString().padStart(2, '0')}m`);

    setStreak((prev) => (prev < 20 ? prev + 1 : prev));
    setNotification('Checked out successfully!');
    setTimeout(() => setNotification(''), 4000);
  };

  return (
    <div className="attendance-box">
      <p className="attendance-message">🌈 Every great day starts with a single punch.</p>
      <div className="attendance-date-box">
        <h4>{new Date().toDateString()}</h4>
        <span className="shift-timing">Shift Timing - (09:30 - 17:30)</span>
        <div className="time-row">
          <div>
            <p>Check In</p>
            <strong>{checkInTime}</strong>
          </div>
          <div>
            <p>Check Out</p>
            <strong>{checkOutTime || '--:--'}</strong>
          </div>
          <div>
            <p>Total Hours</p>
            <strong>{totalHours}</strong>
          </div>
        </div>
        <button className="check-out-btn" onClick={handleCheckOut} disabled={checkOutTime !== null}>
          {checkOutTime ? 'Checked Out' : 'Check Out'}
        </button>
        {notification && (
          <p style={{ color: 'green', fontWeight: 500, marginTop: 8 }}>{notification}</p>
        )}
      </div>

      <div className="mood-section">
        <h4>
          How Are You Feeling Today?
          <span className="mood-navigation">
            <button onClick={() => setMoodOffset((prev) => prev - 1)}>&larr;</button>
            <button onClick={() => setMoodOffset((prev) => prev + 1)}>&rarr;</button>
          </span>
        </h4>
        <div className="mood-days">
          {moodDates.map((d, idx) => (
            <div key={idx}>
              <span role="img" aria-label="emoji">
                😊
              </span>
              <br />
              {d.label}
              <br />
              {d.day}
            </div>
          ))}
        </div>
      </div>

      <div className="attendance-streak">
        <h4>Attendance Streak</h4>
        <p>
          <strong>Level 1</strong>
        </p>
        <p>You're {20 - streak} day(s) away from a 20-day streak!</p>
        <div className="progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: `${(streak / 20) * 100}%` }}></div>
        </div>
        <p>{streak}/20</p>
      </div>
    </div>
  );
}

export default AttendanceWidget;
