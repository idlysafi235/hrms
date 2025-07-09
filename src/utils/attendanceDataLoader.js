import { fetchAvailableLeaves } from "../api/leave";
import { fetchHolidays } from "../api/general";


const toDateKey = (date) => new Date(date).toISOString().split("T")[0];

const expandApprovedLeaves = (leaveHistory) => {
    const approved = [];
  
    leaveHistory
      .filter((leave) => leave.status === "Approved")
      .forEach((leave) => {
        const start = new Date(leave.startDate);
        const end = new Date(leave.endDate);
  
        if (start.getTime() === end.getTime()) {
          approved.push({
            date: toDateKey(start),
            leaveType: leave.leaveType,
            fraction: leave.numberOfDays, 
            original: leave,
          });
        } else {
          for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            approved.push({
              date: toDateKey(d),
              leaveType: leave.leaveType,
              fraction: 1,
              original: leave,
            });
          }
        }
      });
  
    return approved;
  };
  

const buildHolidayLookup = (holidays) => {
  const lookup = {};
  holidays.forEach(({ holidayDate, name }) => {
    const dateKey = toDateKey(holidayDate);
    lookup[dateKey] = name;
  });
  return lookup;
};


export const loadAttendanceMeta = async (token) => {
  const [leaveRes, holidaysRes] = await Promise.all([
    fetchAvailableLeaves(token),
    fetchHolidays(token),
  ]);

  const approvedLeaves = expandApprovedLeaves(leaveRes.history || []);
  const holidayLookup = buildHolidayLookup(holidaysRes || []);

  return { approvedLeaves, holidayLookup };
};
