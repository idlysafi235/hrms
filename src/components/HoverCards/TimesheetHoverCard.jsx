import React, { useEffect, useState } from 'react';
import { fetchMyTimeSheetsAPI } from '../../api/timeSheet';
import { getToken } from '../../utils/auth';

function TimesheetHoverCard({ navigate }) {
  const getStartOfWeek = (date) => {
    const day = date.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const monday = new Date(date);
    monday.setDate(date.getDate() + diffToMonday);
    monday.setHours(0, 0, 0, 0);
    return monday;
  };

  const [weekStart, setWeekStart] = useState(getStartOfWeek(new Date()));
  const [timesheets, setTimesheets] = useState([]);
  const [statusCounts, setStatusCounts] = useState({
    submitted: 0,
    saved: 0,
    approved: 0,
    rejected: 0,
  });
  const [weekHours, setWeekHours] = useState(Array(7).fill('0.0h'));

  const formatWeekRange = (startDate) => {
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    const options = { month: 'short', day: 'numeric' };
    const startStr = startDate.toLocaleDateString(undefined, options);
    const endStr = endDate.toLocaleDateString(undefined, options);
    return `${startStr} – ${endStr}`;
  };

  const handlePrevWeek = () => {
    const newStart = new Date(weekStart);
    newStart.setDate(newStart.getDate() - 7);
    setWeekStart(newStart);
  };

  const handleNextWeek = () => {
    const newStart = new Date(weekStart);
    newStart.setDate(newStart.getDate() + 7);
    setWeekStart(newStart);
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = getToken();
      if (!token) {
        console.warn('No token found for timesheet fetch.');
        return;
      }

      try {
        const data = await fetchMyTimeSheetsAPI(token);

    
        const filtered = data.filter((entry) => {
          const entryDate = new Date(entry.date);
          return entryDate >= weekStart && entryDate <= new Date(weekStart.getTime() + 6 * 86400000);
        });

        const counts = {
          submitted: filtered.length, 
          saved: filtered.filter(e => e.status === 'Pending').length,
          approved: filtered.filter(e => e.status === 'Approved').length,
          rejected: filtered.filter(e => e.status === 'Rejected').length,
        };

    
        const hoursByDay = Array(7).fill(0);
        filtered.forEach((entry) => {
          const entryDate = new Date(entry.date);
          const dayIndex = (entryDate.getDay() + 6) % 7;
          const hours = parseFloat(entry.hoursWorked || 0);
          hoursByDay[dayIndex] += hours;
        });

        const formattedHours = hoursByDay.map(h => `${h.toFixed(1)}h`);

        setTimesheets(filtered);
        setStatusCounts(counts);
        setWeekHours(formattedHours);
      } catch (error) {
        console.error('Failed to fetch timesheets:', error);
      }
    };

    fetchData();
  }, [weekStart]);

  const totalHours = weekHours.reduce((sum, h) => sum + parseFloat(h), 0);

  return (
    <div className="home_card-hover checkin_hover">
      <div className="week-nav">
        <button className="arrow-btn plain" onClick={handlePrevWeek}>&#8619;</button>
        <span className="week-label">{formatWeekRange(weekStart)}</span>
        <button className="arrow-btn plain" onClick={handleNextWeek}>&#8620;</button>
      </div>

      <div className="status-grid">
        <div className="status-box submitted">Submitted: {statusCounts.submitted}</div>
        {/* <div className="status-box saved">Saved: {statusCounts.saved}</div> */}
        <div className="status-box approved">Approved: {statusCounts.approved}</div>
        <div className="status-box rejected">Rejected: {statusCounts.rejected}</div>
      </div>
      <div className="week-hours">
        <div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div><div>Sun</div>
      </div>
      <div className="week-hours filled">
        {weekHours.map((h, idx) => <div key={idx}>{h}</div>)}
      </div>

      <div className="total-row">Total: {totalHours.toFixed(1)}h</div>
      <button onClick={() => navigate('/attendance/timesheet')} className="goto-btn">Go to Timesheet</button>
    </div>
  );
}

export default TimesheetHoverCard;
