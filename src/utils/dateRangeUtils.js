export function formatDateRange(start, end) {
    const options = { day: 'numeric', month: 'short' };
    const startStr = start.toLocaleDateString('en-US', options);
    const endStr = end.toLocaleDateString('en-US', options);
    return `${startStr} - ${endStr}`;
  }
  
  export function getWeekDateRange(offsetWeeks = 0) {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diffToMonday = (dayOfWeek + 6) % 7;
  
    const start = new Date(today);
    start.setDate(today.getDate() - diffToMonday - 7 * offsetWeeks);
    start.setHours(0, 0, 0, 0);
  
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
  
    return [start, end];
  }
  