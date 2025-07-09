'use client';

import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format, isBefore } from 'date-fns';
import './AttandanceMarker.css';
import { fetchClockStatus } from '../../api/services';

const AttendanceCalendar = () => {
  const [value, setValue] = useState(new Date());
  const [timeSheets, setTimeSheets] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user?.token;
      if (!token) return;

      try {
        const data = await fetchClockStatus(token);
        setTimeSheets(data);
      } catch (error) {
        console.error('Failed to fetch clock status:', error);
      }
    };

    fetchData();
  }, []);

  const getTileData = (date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    return timeSheets.find((entry) => entry.date.startsWith(formattedDate));
  };

  const tileClassName = ({ date, view }) => {
    if (view !== 'month') return '';

    const data = getTileData(date);
    if (!data) return '';

    if (data.status === 'Approved') return 'approved-day';
    if (data.status === 'Pending') return 'pending-day';
    return '';
  };

  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;

    const today = new Date();
    if (isBefore(date, today) || format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) {
      const data = getTileData(date);
      if (data) {
        const hours = parseFloat(data.totalHours).toFixed(1);
        const color = data.totalHours > 0 ? 'green' : 'red';

        return (
          <div className="hours-marker" style={{ color }}>
            {hours}
          </div>
        );
      }
    }

    return null;
  };

  return (
    <div className="p-8 overflow-visible">
      <h1 className="rsh t-cent">Attendance Calendar</h1>
      <div className="overflow-visible relative">
        <Calendar
          onChange={setValue}
          value={value}
          tileClassName={tileClassName}
          tileContent={tileContent}
        />
      </div>
    </div>
  );
};

export default AttendanceCalendar;
