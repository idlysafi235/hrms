import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { exportToCSV } from "../../utils/leaveUtils";
import "./AttendanceChart.css";

function AttendanceChart({ attendanceData }) {
  return (
    <div className="section chart-box">
      <h2>Weekly Attendance Summary</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={attendanceData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Present" fill="#4caf50" />
          <Bar dataKey="Absent" fill="#f44336" />
          <Bar dataKey="WFH" fill="#2196f3" />
        </BarChart>
      </ResponsiveContainer>
      <button
        className="export-btn"
        onClick={() => exportToCSV(attendanceData, "attendance-summary.csv")}
      >
        Export Attendance Data
      </button>
    </div>
  );
}

export default AttendanceChart;
