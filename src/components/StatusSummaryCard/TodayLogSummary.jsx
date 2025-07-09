import React, { useMemo, useState } from 'react';
import { useAttendanceLogsByDate } from '../../hooks/useAttendanceLogsByDate';
import './TodayLogSummary.css';

const formatTime = (isoString) => {
  if (!isoString) return '-';
  const date = new Date(isoString);
  return date.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

function TodayLogSummary({ refreshKey }) {
  const today = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  }, []);

  const { logs, loading, error } = useAttendanceLogsByDate(today, refreshKey);
  const [showAll, setShowAll] = useState(false);

  if (loading) return <div>Loading logs...</div>;
  if (error) return <div>Error loading logs</div>;
  if (!logs.length) return <div>No Clock in/out</div>;

  // Flatten and sort individual events (clock-ins and outs)
  const events = logs.flatMap((log) => {
    const eventList = [];
    if (log.clockInTime) {
      eventList.push({
        type: 'Clock In',
        time: log.clockInTime,
        id: `${log.id}-in`,
      });
    }
    if (log.clockOutTime) {
      eventList.push({
        type: 'Clock Out',
        time: log.clockOutTime,
        id: `${log.id}-out`,
      });
    }
    return eventList;
  });

  const sortedEvents = events.sort((a, b) => new Date(b.time) - new Date(a.time));
  const displayEvents = sortedEvents.slice(0, 4); // limit shown items

  return (
    <div className="log-summary">
      <h4>Timeline</h4>
      <ul className="log-summary-list">
        {displayEvents.map((event) => (
          <li className="log-summary-item" key={event.id}>
            <span className="label">{event.type}:</span>
            <span className="value">{formatTime(event.time)}</span>
          </li>
        ))}
      </ul>

      {sortedEvents.length > 4 && (
        <div
          className="show-more"
          onMouseEnter={() => setShowAll(true)}
          onMouseLeave={() => setShowAll(false)}
        >
          Show more
          {showAll && (
            <div className="todaytooltip right">
              <ul className="todaytooltip-list">
                {sortedEvents.map((event) => (
                  <li className="todaytooltip-item" key={event.id}>
                    <span className="label">{event.type}:</span>
                    <span className="value">{formatTime(event.time)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TodayLogSummary;
