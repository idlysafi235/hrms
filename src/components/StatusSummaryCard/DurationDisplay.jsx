import React from 'react';

function pad(num) {
  return String(num).padStart(2, '0');
}

function DurationDisplay({ hours = 0, mins = 0, secs = 0, locationMessage }) {
  return (
    <div className="statussummary_duration">
      <p>
        <span className="statussummary_big-num">{pad(hours)}</span>:
        <span className="statussummary_big-num">{pad(mins)}</span>:
        <span className="statussummary_big-num">{pad(secs)}</span>
      </p>
      <h4>Today's Working Hours</h4>
      {locationMessage && (
        <div className="statussummary_location">
          <small>{locationMessage}</small>
        </div>
      )}
    </div>
  );
}

export default DurationDisplay;
