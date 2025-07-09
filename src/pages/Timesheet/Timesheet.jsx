import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import './Timesheet.css';

import WeekNavigator from '../../components/Timesheet/WeekNavigator';
import DayGrid from '../../components/Timesheet/DayGrid';
import TimesheetForm from '../../components/Timesheet/TimesheetForm';
// import CopyPreviousWeekButton from '../../components/Timesheet/CopyPreviousWeekButton';
import useTimesheet from '../../hooks/useTimesheet';
import { getWeekDates } from '../../utils/timesheetUtils';
import { fetchAvailableLeaves } from '../../api/leave';
import { getToken } from '../../utils/auth';
import { notifyError } from '../../components/Toast/ToastProvider';


const Timesheet = () => {
  const [approvedLeaves, setApprovedLeaves] = useState([]);
  const {
    selectedDates,
    currentWeekStart,
    entriesByDate,
    handleWeekChange,
    handleDayClick,
    handleChange,
    addRow,
    removeRow,
    handleSubmit,
    calculateTotalHours,
    setEntriesByDate,
    setSelectedDates,
  } = useTimesheet(approvedLeaves);

  const navigate = useNavigate();
  const weekDates = getWeekDates(currentWeekStart);

  useEffect(() => {
    const loadLeaves = async () => {
      try {
        const token = getToken();
        const response = await fetchAvailableLeaves(token);
        const approved = response.history.filter((l) => l.status === 'Approved');

        const leaveDates = [];

        approved.forEach((leave) => {
          const start = new Date(leave.startDate);
          const end = new Date(leave.endDate);

          for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            const formatted = format(new Date(d), 'yyyy-MM-dd');
            leaveDates.push({
              date: formatted,
              leaveType: leave.leaveType,
              numberOfDays: leave.numberOfDays,
              original: leave,
            });
          }
        });
        setApprovedLeaves(leaveDates);
      } catch (error) {
        console.error('Error loading approved leaves:', error);
      }
    };

    loadLeaves();
  }, []);

  return (
    <div className="timesheet-wrapper">
      <div className="top-bar">
        <WeekNavigator currentWeekStart={currentWeekStart} onWeekChange={handleWeekChange} />
        <div className="top-buttons">
          <button className="bar-btn" onClick={() => navigate('/leaves/apply')}>
            Apply Leave
          </button>
          <button
            className="bar-btn"
            onClick={handleSubmit}
            disabled={selectedDates.every(
              (date) =>
                (entriesByDate[format(date, 'yyyy-MM-dd')] || []).every((e) => e.isSubmitted)
            )}
            title="Submit timesheets for selected dates"
          >
            Submit for Approval
          </button>
        </div>
      </div>

      <div className="calendar-row">
        <div className="total-hourst">
          Total Hours For This Week<strong>{calculateTotalHours(entriesByDate).toFixed(1)}</strong>
        </div>
        <div className="week-days-container">
          <DayGrid
            weekDates={weekDates}
            selectedDates={selectedDates}
            entriesByDate={entriesByDate}
            onDayClick={handleDayClick}
            approvedLeaves={approvedLeaves}
          />
        </div>
      </div>

      <div className="tasks-section">
        {selectedDates.map((date) => {
          const dateStr = format(date, 'yyyy-MM-dd');
          const entries =
            entriesByDate[dateStr] || [
              { date: dateStr, project: '', hoursWorked: '', taskDescription: '', isSubmitted: false },
            ];

          const leaveEntry = approvedLeaves.find((l) => l.date === dateStr);
          const isHalfDay = leaveEntry && leaveEntry.original.numberOfDays === 0.5;
          const showForm = !leaveEntry || isHalfDay;

          return (
            <div key={dateStr} className="daily-timesheet">
              <h4>{format(date, 'eeee, MMM dd')}</h4>
              {leaveEntry && !isHalfDay ? (
                <div className="leave-block">On {leaveEntry.leaveType} Leave</div>
              ) : (
                <TimesheetForm
                entries={entries}
                onChange={handleChange}
                onAdd={() => {
                 if ((entriesByDate[dateStr] || []).length >= 3) {
                  notifyError("Cannot add more than 3 entries for this day.");
                  return;
                  }
                  addRow(date);
                   }}
                onRemove={(index) => removeRow(dateStr, index)}
                disabled={false}
                maxRows={3}
                />

              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Timesheet;
