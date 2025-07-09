import React from 'react';
import { format, isSameDay } from 'date-fns';

const DayGrid = ({ weekDates, selectedDates = [], entriesByDate, approvedLeaves = [], onDayClick }) => {
  return (
    <div className="week-days">
      {weekDates.map((date) => {
        const formattedDate = format(date, 'yyyy-MM-dd');
        const entries = entriesByDate[formattedDate] || [];
        const totalHours = entries.reduce(
          (sum, entry) => sum + parseFloat(entry.hoursWorked || 0),
          0
        );

        const isSelected = selectedDates.some((selected) => isSameDay(selected, date));
        const leave = approvedLeaves.find((l) => l.date === formattedDate);
        const isLeave = !!leave;
        const isHalfDay = leave && leave.original.numberOfDays === 0.5;

        let statusClass = 'no-hours'; 
        if (entries.length > 0) {
          const allApproved = entries.every((e) => e.status === 'Approved');
          const allPending = entries.every((e) => e.status === 'Pending');

          if (allApproved) statusClass = 'approved-hours';
          else if (allPending) statusClass = 'pending-hours';
        }

        return (
          <div
            key={date.toDateString()}
            className={`day-box ${isSelected ? 'selected' : ''} ${isLeave ? 'leave-day' : ''}`}
            onClick={() => {
              if (!isLeave || isHalfDay) {
                onDayClick(date);
              }
            }}
          >
            <div className="day-number">{format(date, 'd')}</div>
            <div className="day-name">{format(date, 'EEE')}</div>

            {isLeave ? (
              <>
                <div className="leave-info">
                  Leave: {leave.leaveType} {isHalfDay ? '(Half Day)' : ''}
                </div>
                {isHalfDay && totalHours > 0 && (
                  <div className={`day-hours ${statusClass}`}>
                    {totalHours.toFixed(1)}
                  </div>
                )}
              </>
            ) : (
              <div className={`day-hours ${statusClass}`}>
                {totalHours > 0 ? totalHours.toFixed(1) : '0.0'}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DayGrid;
