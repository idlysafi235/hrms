import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer, Legend,
} from "recharts";

const COLORS = [
  "#82ca9d", "#8884d8", "#ffc658", "#ff7f50", "#a569bd", "#4bc0c0", "#f67280",
  "#c06c84", "#355c7d", "#2ecc71", "#f39c12", "#e74c3c", "#5dade2"
];

function LeaveChart({ data }) {

  const leaveTypes = Array.from(
    new Set(
      data.flatMap((entry) => Object.keys(entry).filter((key) => key !== "month"))
    )
  );

  const chartData = data.length > 0
    ? data
    : [{
        month: "No Data",
        ...(leaveTypes.length > 0
          ? Object.fromEntries(leaveTypes.map((type) => [type, 0]))
          : { Dummy: 0 }),
      }];

  const activeLeaveTypes = leaveTypes.length > 0 ? leaveTypes : [""];

  return (
    <div className="graph-container">
      <h3>Yearly Leave Graph</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis allowDecimals={true} domain={[0, 'auto']} />
          <Tooltip />
          <Legend />
          {activeLeaveTypes.map((type, index) => (
            <Bar
              key={type}
              dataKey={type}
              stackId="a"
              fill={COLORS[index % COLORS.length]}
              isAnimationActive={false}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default LeaveChart;
