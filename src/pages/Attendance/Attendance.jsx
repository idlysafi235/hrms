import React, { useState, useEffect, useMemo } from "react";
import { generateCalendar } from "../../utils/calendarUtils";
import { useClockStatus } from "../../hooks/useClockStatus";
import CalendarHeader from "../../components/AttendanceMain/CalendarHeader";
import MonthSelector from "../../components/AttendanceMain/MonthSelector";
import WeekdaysRow from "../../components/AttendanceMain/WeekdaysRow";
import DateGrid from "../../components/AttendanceMain/DateGrid";
import SummarySection from "../../components/AttendanceMain/SummarySection";
import { loadAttendanceMeta } from "../../utils/attendanceDataLoader";
import { getToken } from "../../utils/auth";
import "./Attendance.css";

const normalizeDate = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

const Attendance = () => {
  const today = useMemo(() => normalizeDate(new Date()), []);
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [approvedLeaves, setApprovedLeaves] = useState([]);
  const [holidayLookup, setHolidayLookup] = useState({});
  const [holidayError, setHolidayError] = useState("");
  const [selectedDate, setSelectedDate] = useState(today);

  const { clockData, loading } = useClockStatus();

  useEffect(() => {
    const token = getToken();

    if (!token) {
      setHolidayError("Unauthorized: No token found");
      return;
    }

    const loadMeta = async () => {
      try {
        const { approvedLeaves, holidayLookup } = await loadAttendanceMeta(token);
        setApprovedLeaves(approvedLeaves);
        setHolidayLookup(holidayLookup);
        setHolidayError("");
      } catch (err) {
        console.error("Failed to fetch attendance metadata:", err);
        setHolidayError("Failed to load leave or holiday data");
      }
    };

    loadMeta();
  }, [currentYear]);

  const attendanceData = useMemo(() => {
    const filtered = clockData.filter((entry) => {
      const date = new Date(entry.date);
      return date.getFullYear() === currentYear && date.getMonth() === currentMonth;
    });

    return filtered.map((entry) => ({
      ...entry,
      date: entry.date.split("T")[0],
      status: entry.status,
      totalHours: entry.totalHours,
      formattedTotalHours: entry.formattedTotalHours,
    }));
  }, [clockData, currentYear, currentMonth]);

  const calendarDates = generateCalendar(currentYear, currentMonth);

  const goToToday = () => {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    setSelectedDate(today);
  };

  const handleDateClick = (date) => {
    const normalized = normalizeDate(new Date(date));
    setSelectedDate(normalized);
    setCurrentMonth(normalized.getMonth());
    setCurrentYear(normalized.getFullYear());
  };

  return (
    <div className="attendance-container">
      <div className="calendar-section">
        <CalendarHeader
          year={currentYear}
          setYear={setCurrentYear}
          onTodayClick={goToToday}
        />
        <MonthSelector currentMonth={currentMonth} setCurrentMonth={setCurrentMonth} />
        <WeekdaysRow />
        <DateGrid
          calendarDates={calendarDates}
          currentMonth={currentMonth}
          today={today}
          attendanceData={attendanceData}
          selectedDate={selectedDate}
          onDateClick={handleDateClick}
          holidayLookup={holidayLookup}
          approvedLeaves={approvedLeaves}
        />
      </div>
      <SummarySection
        currentMonth={currentMonth}
        currentYear={currentYear}
        attendanceData={attendanceData}
        upcomingHolidays={Object.entries(holidayLookup).map(([date, name]) => ({
          holidayDate: date,
          name,
        }))}
        holidayError={holidayError}
        selectedDate={selectedDate}
      />
    </div>
  );
};

export default Attendance;
