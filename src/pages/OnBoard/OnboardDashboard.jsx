import React, { useEffect, useState } from 'react';
import './OnboardDashboard.css';
import { Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from 'chart.js';
import { getAllonboarding } from '../../api/onboard';
import { getToken } from '../../utils/auth';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
);

const OnboardDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = getToken();
        const data = await getAllonboarding(token);
        setEmployees(data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const summaryData = {
    total: employees.length,
    inProgress: employees.filter((e) => e.status === 'In Progress').length,
    completed: employees.filter((e) => e.status === 'Completed').length,
    pending: employees.filter((e) => e.status === 'Pending').length,
  };

  const pieData = {
    labels: ['Completed', 'In Progress', 'Pending'],
    datasets: [
      {
        label: 'Onboarding Status',
        data: [
          summaryData.completed,
          summaryData.inProgress,
          summaryData.pending,
        ],
        backgroundColor: ['#4CAF50', '#FF9800', '#F44336'],
        borderWidth: 1,
      },
    ],
  };


  const getWeekOfMonth = (date) => {
    const d = new Date(date);
    const day = d.getDate();
    return Math.ceil(day / 7);
  };


  const getCurrentMonthTrends = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const weeklyCounts = [0, 0, 0, 0]; 

    employees.forEach((e) => {
      if (!e.startedAt) return;
      const startedDate = new Date(e.startedAt);
      if (
        startedDate.getMonth() === currentMonth &&
        startedDate.getFullYear() === currentYear
      ) {
        const weekIndex = getWeekOfMonth(startedDate) - 1;
        if (weekIndex >= 0 && weekIndex < 4) {
          weeklyCounts[weekIndex]++;
        }
      }
    });

    return weeklyCounts;
  };

  const lineData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Onboarded Employees',
        data: getCurrentMonthTrends(),
        fill: false,
        borderColor: '#3f51b5',
        tension: 0.3,
      },
    ],
  };

  const activities = employees
    .filter((e) => e.startedAt)
    .sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt))
    .slice(0, 5)
    .map((e, index) => ({
      id: index,
      message: `${e.fullName} (${e.status}) onboarded by ${e.onboardedByFullName}`,
    }));

  return (
    <div className="onboard-dashboard">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="summary-cards">
            <div className="card">
              <h3>Total Employees</h3>
              <p>{summaryData.total}</p>
            </div>
            <div className="card">
              <h3>In Progress</h3>
              <p>{summaryData.inProgress}</p>
            </div>
            <div className="card">
              <h3>Completed</h3>
              <p>{summaryData.completed}</p>
            </div>
            <div className="card">
              <h3>Pending</h3>
              <p>{summaryData.pending}</p>
            </div>
          </div>

          <div className="charts-section">
            <div className="chart-box">
              <h4>Onboarding Status</h4>
              <Pie data={pieData} />
            </div>

            <div className="chart-box">
              <h4>Onboarding Trends (This Month)</h4>
              <Line data={lineData} />
            </div>
          </div>

          <div className="recent-activities">
            <h4>Recent Activities</h4>
            <ul>
              {activities.map((activity) => (
                <li key={activity.id}>{activity.message}</li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default OnboardDashboard;
