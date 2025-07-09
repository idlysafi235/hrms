import React, { useState } from 'react';
import { format, startOfWeek, subWeeks, addDays } from 'date-fns';

const CopyPreviousWeekButton = ({
  currentWeekStart,
  entriesByDate,
  setEntriesByDate,
  selectedDates,
  setSelectedDates,
}) => {
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState('');

  const getWeekDates = (weekStart) => {
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  };

  const normalizeEntriesByDate = (rawEntriesByDate) => {
    const normalized = {};
    Object.keys(rawEntriesByDate).forEach(key => {
      const normalizedKey = format(new Date(key), 'yyyy-MM-dd');
      if (!normalized[normalizedKey]) {
        normalized[normalizedKey] = [];
      }
      normalized[normalizedKey].push(...rawEntriesByDate[key]);
    });
    return normalized;
  };

  const handleCopy = () => {
    console.log('Copy/Update button clicked.');
    setMessage('');

    const prevWeekStart = startOfWeek(subWeeks(currentWeekStart, 1), { weekStartsOn: 1 });
    const currentWeekStartDate = startOfWeek(currentWeekStart, { weekStartsOn: 1 });

    const prevWeekDates = getWeekDates(prevWeekStart);
    const currentWeekDates = getWeekDates(currentWeekStartDate);

    console.log('Previous Week Dates:', prevWeekDates.map(d => format(d, 'yyyy-MM-dd')));
    console.log('Current Week Dates:', currentWeekDates.map(d => format(d, 'yyyy-MM-dd')));

    const normalizedEntriesByDate = normalizeEntriesByDate(entriesByDate);

    const hasPrevData = prevWeekDates.some(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const hasEntries = Array.isArray(normalizedEntriesByDate[dateStr]) && normalizedEntriesByDate[dateStr].length > 0;
      console.log(`Checking ${dateStr} → has entries:`, hasEntries);
      return hasEntries;
    });

    if (!hasPrevData) {
      console.log('No timesheet details found for previous week.');
      setMessage('No timesheet details for previous week.');
      return;
    }

    const updatedEntriesByDate = { ...normalizedEntriesByDate };

    prevWeekDates.forEach((prevDate, idx) => {
      const prevDateStr = format(prevDate, 'yyyy-MM-dd');
      const currDateStr = format(currentWeekDates[idx], 'yyyy-MM-dd');
      const prevEntries = normalizedEntriesByDate[prevDateStr] || [];

      if (prevEntries.length > 0) {
        console.log(`Copying ${prevEntries.length} entries from ${prevDateStr} → ${currDateStr}`);
        updatedEntriesByDate[currDateStr] = prevEntries.map(entry => ({
          ...entry,
          id: null,
          date: currDateStr,
          isSubmitted: false,
        }));
      }
    });

    setEntriesByDate(updatedEntriesByDate);
    setSelectedDates(currentWeekDates);
    setCopied(true);
    setMessage('');
    console.log('Copy complete.');
  };

  return (
    <div style={{ display: 'inline-block', marginLeft: '10px' }}>
      <button className="bar-btn" onClick={handleCopy}>
        {copied ? 'Update This Week' : 'Copy Previous Week'}
      </button>
      {message && <div style={{ color: 'red', marginTop: 4 }}>{message}</div>}
    </div>
  );
};

export default CopyPreviousWeekButton;
