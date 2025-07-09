import DateBox from "./DateBox";

const getLocalDateKey = (date) => date.toLocaleDateString("en-CA");

const DateGrid = ({
  calendarDates,
  currentMonth,
  today,
  attendanceData = [],
  approvedLeaves = [],
  holidayLookup = {},
  onDateClick,
  selectedDate,
}) => {
  const selectedDateKey = selectedDate?.toLocaleDateString("en-CA");

  const attendanceMap = attendanceData.reduce((acc, entry) => {
    const entryDate = new Date(entry.date);
    const dateKey = getLocalDateKey(entryDate);
    acc[dateKey] = entry;
    return acc;
  }, {});

  const leaveMap = approvedLeaves.reduce((acc, leave) => {
    const dateObj = new Date(leave.date || leave.leaveDate || leave.startDate);
    if (!isNaN(dateObj)) {
      const dateKey = getLocalDateKey(dateObj);
      acc[dateKey] = leave;
    }
    return acc;
  }, {});

  return (
    <div className="date-grid">
      {calendarDates.map((date) => {
        const dateKey = getLocalDateKey(date);
        const record = attendanceMap[dateKey] || null;
        const isSelected = dateKey === selectedDateKey;
        const tags = [];
        if (leaveMap[dateKey]) {
          tags.push(leaveMap[dateKey]); 
        }
        
        if (holidayLookup[dateKey]) tags.push(holidayLookup[dateKey]);

        return (
          <DateBox
            key={dateKey}
            date={date}
            today={today}
            currentMonth={currentMonth}
            record={record}
            onClick={() => onDateClick?.(date)}
            selected={isSelected}
            tags={tags}
            holidayLookup={holidayLookup}
          />
        );
      })}
    </div>
  );
};

export default DateGrid;
