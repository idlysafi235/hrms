import React from "react";
import HolidayList from "./HolidayList";
import { format, parseISO, isValid } from "date-fns";
import { useAttendanceLogsByDate } from "../../hooks/useAttendanceLogsByDate";
import "./SummarySection.css";

const SummarySection = ({
  currentMonth,
  currentYear,
  attendanceData,
  upcomingHolidays,
  holidayError,
  selectedDate,
}) => {
  const { logs, loading, error } = useAttendanceLogsByDate(selectedDate);

  let clockInTime = "—";
  let clockOutTime = "—";

  if (!loading && !error && logs.length > 0) {
    const firstLog = logs[0];

    if (firstLog.clockInTime) {
      const parsedIn = parseISO(firstLog.clockInTime);
      clockInTime = isValid(parsedIn) ? format(parsedIn, "hh:mm a") : "—";
    }

    if (firstLog.clockOutTime) {
      const parsedOut = parseISO(firstLog.clockOutTime);
      clockOutTime = isValid(parsedOut) ? format(parsedOut, "hh:mm a") : "—";
    }
  }

  return (
    <div className="summary-section">
      <section className="selected-date-summary">
        <h3> Clock In/Out Timeline {format(selectedDate, "MMMM d, yyyy")}</h3>
        {loading ? (
          <p>Loading logs...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : logs && logs.length > 0 ? (
          <ul className="log-list">
            {logs.map((log, idx) => {
              const items = [];
              if (log.clockInTime) {
                const parsedIn = parseISO(log.clockInTime);
                const formattedIn = isValid(parsedIn) ? format(parsedIn, "hh:mm a") : "—";
                items.push(
                  <li key={`${idx}-in`}>
                    <strong>Clock In</strong> {formattedIn}
                  </li>
                );
              }
              if (log.clockOutTime) {
                const parsedOut = parseISO(log.clockOutTime);
                const formattedOut = isValid(parsedOut) ? format(parsedOut, "hh:mm a") : "—";
                items.push(
                  <li key={`${idx}-out`}>
                    <strong>Clock Out</strong> {formattedOut}
                  </li>
                );
              }
              if (items.length === 0) {
                items.push(
                  <li key={`${idx}-unknown`}>No clock in/out time available</li>
                );
              }
              return items;
            })}
          </ul>
        ) : (
          <p className="no-data">No logs found for this date.</p>
        )}
      </section>

      <section className="holiday-list-section">
        {holidayError ? (
          <p className="error">{holidayError}</p>
        ) : (
          <HolidayList upcomingHolidays={upcomingHolidays} />
        )}
      </section>
    </div>
  );
};

export default SummarySection;
