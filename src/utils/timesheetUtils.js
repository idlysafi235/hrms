import { format, isSameWeek } from 'date-fns';

export const groupEntriesByDate = (entries, currentWeekStart) => {
  const grouped = {};
  entries
    .filter((entry) =>
      isSameWeek(new Date(entry.date), currentWeekStart, { weekStartsOn: 1 })
    )
    .forEach((entry) => {
      const dateStr = format(new Date(entry.date), 'yyyy-MM-dd');
      if (!grouped[dateStr]) grouped[dateStr] = [];

      grouped[dateStr].push({
        ...entry,
        date: dateStr,
        project: entry.projectName,
      });
    });
  return grouped;
};


export const getWeekDates = (start) =>
  Array.from({ length: 7 }, (_, i) => {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    return date;
  });

export const calculateTotalHours = (entriesByDate) => {
  let total = 0;
  Object.values(entriesByDate).forEach((dayEntries) => {
    dayEntries.forEach((entry) => {
      total += parseFloat(entry.hoursWorked || 0);
    });
  });
  return total;
};
