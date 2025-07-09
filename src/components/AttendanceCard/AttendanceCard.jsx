
import React, { useState, useEffect } from "react";
import "./AttendanceCard.css";
import { useNavigate } from "react-router-dom";
import { fetchClockStatus } from "../../api/clock";
import { getToken } from "../../utils/auth";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { FaCalendarAlt } from "react-icons/fa";

function AttendanceCard() {
  const [weekStartDate, setWeekStartDate] = useState(getMonday(new Date()));
  const [chartData, setChartData] = useState([]);
  const navigate = useNavigate();

  function getMonday(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = (day + 6) % 7;
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - diff);
    return d;
  }

  function getWeekDates(startDate) {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      days.push(d);
    }
    return days;
  }

  function formatDateKey(date) {
    const localDate = new Date(date);
    localDate.setHours(0, 0, 0, 0);
    return localDate.toISOString().split("T")[0];
  }

  useEffect(() => {
    async function loadData() {
      try {
        const token = getToken();
        const response = await fetchClockStatus(token);
        const weekDates = getWeekDates(weekStartDate);
        const mappedData = weekDates.map((date) => {
          const dateKey = formatDateKey(date);
          const record = (response || []).find(
            (r) => formatDateKey(r.date) === dateKey
          );
          const totalHours = record ? record.totalHours : 0;
          return {
            day: date.toLocaleDateString(undefined, { weekday: "short" }),
            hours: totalHours || 0,
            isToday: formatDateKey(date) === formatDateKey(new Date()),
          };
        });
        setChartData(mappedData);
      } catch (error) {
        console.error("Error fetching attendance:", error);
        setChartData([]);
      }
    }
    loadData();
  }, [weekStartDate]);

  const getBarColor = (hours) => {
    if (hours >= 7) return "#0ab031";
    if (hours > 0) return " rgba(33, 9, 61, 1)";

    return "#e74c3c";            
  };

  return (
    <div className="attendance-card minimal" onClick={() => navigate("/attendance/daily")}>
      <div className="attendance-card-title">
        <FaCalendarAlt className="attendance-icon" />
        <span>Attendance</span>
      </div>

      <div className="attendance-chart-box">
      <ResponsiveContainer width="100%" height="100%">
  <BarChart
    data={chartData}
    margin={{ top: 0, right: -20, left: -20, bottom: -10 }}
  >
    <XAxis
      dataKey="day"
      tick={{ fontSize: 12 }}
      axisLine={false}
      tickLine={false}
    />
    <YAxis
      tick={{ fontSize: 12 }}
      unit="h"
      domain={[0, dataMax => Math.ceil(Math.max(dataMax, 10) / 2) * 2]}
      ticks={[2, 4, 6, 8, 10]}
      axisLine={false}
      tickLine={false}
    />
    <Tooltip formatter={(value) => `${value} hrs`} />
    <Bar
      dataKey="hours"
      radius={[4, 4, 0, 0]}
      barSize={12} 
    >
      {chartData.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={getBarColor(entry.hours)} />
      ))}
    </Bar>
  </BarChart>
</ResponsiveContainer>

      </div>
    </div>
  );
}

export default AttendanceCard;
