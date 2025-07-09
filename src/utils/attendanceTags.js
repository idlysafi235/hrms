export function getAttendanceTags(record, recordDate, holidayDates, today = new Date()) {
  const tags = [];
  const dateKey = recordDate.toISOString().split("T")[0];
  const dayOfWeek = recordDate.getDay(); 
  const totalHours = record.totalHours ?? 0;

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);

  const recordDateNormalized = new Date(recordDate);
  recordDateNormalized.setHours(0, 0, 0, 0);

  
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return tags;
  }

  // Holiday tag
  if (holidayDates.has(dateKey)) {
    tags.push("Holiday");
    return tags;
  }

  if (recordDateNormalized.getTime() === yesterday.getTime()) {
    if (totalHours < 7) {
      tags.push("LOP");
    }
  } else {
  }

  return tags;
}
