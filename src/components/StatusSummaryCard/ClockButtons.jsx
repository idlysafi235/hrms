import {  PlayIcon, Square, StopCircleIcon } from 'lucide-react';
import React from 'react';

function ClockButtons({ clockedIn, onClockIn, onClockOut }) {
  return (
    <div className="statussummary_buttons">
      <button
        className={`statussummary_button statussummary_clockin-button ${clockedIn ? 'disabled' : ''}`}
        onClick={onClockIn}
        disabled={clockedIn}
      >
       <PlayIcon size={14} /> Clock IN
      </button>

      <button
        className={`statussummary_button statussummary_clockout-button ${!clockedIn ? 'disabled' : ''}`}
        onClick={onClockOut}
        disabled={!clockedIn}
      >
       <Square size={14} /> Clock OUT
      </button>
    </div>
  );
}

export default ClockButtons;
