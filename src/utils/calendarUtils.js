export const generateCalendar = (year, month) => {
    const firstDayOfMonth = new Date(year, month, 1);
    const firstDayWeekday = firstDayOfMonth.getDay(); 
  
    const offsetToMonday = (firstDayWeekday + 6) % 7;
  
    const calendar = [];
    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(startDate.getDate() - offsetToMonday);
  
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      calendar.push(date);
    }
  
    return calendar;
  };
  