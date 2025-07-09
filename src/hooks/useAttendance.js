import { useEffect, useState } from "react";
import { getToken } from "../utils/auth";
import { fetchClockStatus } from "../api/clock";
import { formatTotalHours } from "../utils/timeUtils"; 

export const useAttendanceData = (year, month, holidayLookup) => {
  const [attendanceData, setAttendanceData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = getToken();
      if (!token) return;

      setLoading(true);
      try {
        const data = await fetchClockStatus(token);
        const transformedData = {};

        data.forEach(record => {
          const dateKey = record.date.split("T")[0];
          const rawTotalHours = record.totalHours ?? 0;

          transformedData[dateKey] = {
            totalHoursRaw: rawTotalHours, 
            totalHours: formatTotalHours(rawTotalHours), 
            clockInTime: record.clockInTime,
            clockOutTime: record.clockOutTime,
            status: record.status,
            currentStatus: record.CurrentStatus,
            tags: [],
          };
        });

        Object.entries(holidayLookup).forEach(([dateKey, name]) => {
          if (!transformedData[dateKey]) {
            transformedData[dateKey] = {
              totalHoursRaw: 0,
              totalHours: formatTotalHours(0),
              tags: [],
            };
          }
        });

        transformedData.lopCount = 0;
        transformedData.checkinMissed = 0;
        transformedData.absenceMissed = 0;

        setAttendanceData(transformedData);
      } catch (error) {
        console.error("❌ Error fetching attendance data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [year, month, holidayLookup]);

  return { attendanceData, loading };
};
