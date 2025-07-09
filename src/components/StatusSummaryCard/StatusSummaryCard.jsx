import React, { useState } from 'react';
import './StatusSummaryCard.css';
import { useStatusSummary } from '../../hooks/useStatusSummary';

import DurationDisplay from './DurationDisplay';
import ClockButtons from './ClockButtons';
import { formatTotalHours } from '../../utils/timeUtils';

function StatusSummaryCard() {
  const {
    clockedIn,
    clockInTime,
    clockOutTime,
    duration,
    locationMessage,
    handleClockIn,
    handleClockOut,
    weeklySummaries
  } = useStatusSummary();

  const handleClockInWithRefresh = async () => {
    await handleClockIn();
  };

  const handleClockOutWithRefresh = async () => {
    await handleClockOut();
  };

  return (
    <div className="summary_card statussummary_wrapper">
      <div className="statussummary_content">
        <div className="statussummary_title">
          <h2>⏰ Time Tracker</h2>
        </div>

        <div className="statussummary_duration-wrapper">
          <DurationDisplay
            hours={duration.hours}
            mins={duration.mins}
            secs={duration.secs}
            format="hh:mm:ss"
          />

          {locationMessage && (
            <div className="statussummary_location-absolute">
              {locationMessage}
            </div>
          )}
        </div>

        <ClockButtons
          clockedIn={clockedIn}
          onClockIn={handleClockInWithRefresh}
          onClockOut={handleClockOutWithRefresh}
        />
         <hr />
         <div className="weekly_summary">
  <div className="weekly_summary_details">
    <span>This Week</span>
    <span>{weeklySummaries?.thisWeek?.hours != null ? formatTotalHours(weeklySummaries.thisWeek.hours) : '-'}</span>
  </div>
  
  <div className="weekly_summary_details">
    <span>Last Week</span>
    <span>{weeklySummaries?.lastWeek?.hours != null ? formatTotalHours(weeklySummaries.lastWeek.hours) : '-'}</span>
  </div>
  {/* <div className="weekly_summary_details">
    <span>{weeklySummaries?.lastWeek?.range ?? '-'}</span>
  </div> */}
</div>
      </div>
    </div>
  );
}

export default StatusSummaryCard;
