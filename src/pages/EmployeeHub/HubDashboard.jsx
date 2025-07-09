import React, { useEffect, useState } from 'react';
import './OnboardDashboard.css';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,ArcElement,Tooltip, Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
} from 'chart.js';
import { getAllonboarding } from '../../api/onboard';
import { getAllEmployees } from '../../api/employee';
import { getToken } from '../../utils/auth';
import {
  AlertOctagonIcon,
  CheckCircleIcon,
  Clock,
  Users2Icon,
  UserX,
} from 'lucide-react';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement
);

const HubDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [onboardings, setOnboardings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken();
        const [allEmployees, onboardingData] = await Promise.all([
          getAllEmployees(token),
          getAllonboarding(token),
        ]);
        setEmployees(allEmployees);
        setOnboardings(onboardingData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const summary = {
    totalEmployees: employees.length,
    inProgress: onboardings.filter((e) => e.status === 'In Progress').length,
    completed: onboardings.filter((e) => e.status === 'Completed').length,
    pending: onboardings.filter((e) => e.status === 'Pending').length,
    // employeesOnLeave: employees.filter(e => e.isOnLeave).length,
  };

  const employeesWithoutManager = employees.filter(e => !e.reportingManagerId);

  const employeesMissingRole = employees.filter(e => !e.roleName || e.roleName.trim() === '');

  const departmentCounts = employees.reduce((acc, e) => {
    const dept = e.department || 'Unknown';
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {});

  const deptLabels = Object.keys(departmentCounts);
  const deptData = Object.values(departmentCounts);

  const donutData = {
    labels: ['Completed', 'In Progress', 'Pending'],
    datasets: [
      {
        data: [summary.completed, summary.inProgress, summary.pending],
        backgroundColor: ['#16A34A', '#F59E0B', '#EF4444'],
        borderWidth: 0,
      },
    ],
  };

  const getWeekOfMonth = (date) => Math.ceil(new Date(date).getDate() / 7);

  const trends = (() => {
    const counts = [0, 0, 0, 0];
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();

    onboardings.forEach((e) => {
      if (!e.startedAt) return;
      const d = new Date(e.startedAt);
      if (d.getMonth() === month && d.getFullYear() === year) {
        const week = getWeekOfMonth(d) - 1;
        if (week >= 0 && week < 4) counts[week]++;
      }
    });

    return counts;
  })();

  const trendLineData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Weekly Onboarding',
        data: trends,
        borderColor: '#3B82F6',
        backgroundColor: '#3B82F6',
        fill: false,
        tension: 0.3,
        pointRadius: 4,
      },
    ],
  };

  const trendLineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          precision: 0,
        },
        grace: '10%',
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
  };

  const deptBarData = {
    labels: deptLabels,
    datasets: [
      {
        label: 'Employees',
        data: deptData,
        backgroundColor: '#3B82F6',
        borderRadius: 4,
      },
    ],
  };

  const deptBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          precision: 0,
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
  };

  const recentHires = employees
    .filter(e => {
      if (!e.hireDate) return false;
      const hireDate = new Date(e.hireDate);
      const now = new Date();
      const diffDays = (now - hireDate) / (1000 * 60 * 60 * 24);
      return diffDays >= 7 && diffDays <= 30;
    })
    .sort((a, b) => new Date(b.hireDate) - new Date(a.hireDate))
    .slice(0, 5);

  const recentPromotions = employees
    .filter(e => e.lastPromotionDate)
    .sort((a, b) => new Date(b.lastPromotionDate) - new Date(a.lastPromotionDate))
    .slice(0, 5);

  const recentTerminations = employees
    .filter(e => e.terminationDate)
    .sort((a, b) => new Date(b.terminationDate) - new Date(a.terminationDate))
    .slice(0, 5);

  return (
    <div className="onboard-dashboard">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="summary-cards">
            <div className="card-1">
              <div className="flex justify-between items-center w-full">
                <p>{summary.totalEmployees}</p>
                <Users2Icon size={18} color="#2563EB" />
              </div>
              <h3>Total Employees</h3>
            </div>
            {/* <div className="card-1">
              <div className="flex justify-between items-center w-full">
                <p>{summary.employeesOnLeave}</p>
                <CheckCircleIcon size={18} color="#16A34A" />
              </div>
              <h3>Employees on Leave</h3>
            </div> */}
            <div className="card-1">
              <div className="flex justify-between items-center w-full">
                <p>{employeesWithoutManager.length}</p>
                <Clock size={18} color="#F97316" />
              </div>
              <h3>Without Reporting Manager</h3>
            </div>
            <div className="card-1">
              <div className="flex justify-between items-center w-full">
                <p>{employeesMissingRole.length}</p>
                <AlertOctagonIcon size={18} color="#DC2626" />
              </div>
              <h3>Missing Role</h3>
            </div>
          </div>

          {/* === Charts Section === */}
          <div className="charts-section">
            <div className="chart-box-1 small-chart">
              <h4 className="card-heading">Onboarding Status</h4>
              <Doughnut data={donutData} />
            </div>
            <div className="chart-box-1 small-chart">
              <h4 className="card-heading">Onboarding Trends (This Month)</h4>
              <div className="flex justify-between items-center chart-card-1">
                <p>Total Employees onboarded: </p>
                <span>
                  {trendLineData?.dataset?.reduce((total, data) => total + data.value, 0) || 0}
                </span>
              </div>
              <div style={{ height: 250 }}>
                <Line data={trendLineData} options={trendLineOptions} />
              </div>
            </div>
            <div className="chart-box-1">
              <h4 className="card-heading">Employees by Department/Team</h4>
              <div style={{ height: 300, width: '100%' }}>
                <Bar data={deptBarData} options={deptBarOptions} />
              </div>
            </div>
          </div>

          {/* === Activity Alerts === */}
          <div className="activity-alerts">
            <div className="activities">
              {/* <h4>Recent New Hires (7-30 days)</h4>
              <ul className="activities-list">
                {recentHires.length > 0 ? (
                  recentHires.map((e, i) => (
                    <li key={i} className="activity-item">
                      <div className="activity-main">
                        <span className="activity-name">{e.fullName}</span>{' '}
                        <span className="status">
                          (Hired on {new Date(e.hireDate).toLocaleDateString()})
                        </span>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="activity-none">No recent hires.</li>
                )}
              </ul>

              <h4>Recent Promotions</h4>
              <ul className="activities-list">
                {recentPromotions.length > 0 ? (
                  recentPromotions.map((e, i) => (
                    <li key={i} className="activity-item">
                      <div className="activity-main">
                        <span className="activity-name">{e.fullName}</span>{' '}
                        <span className="status">
                          (Promoted on {new Date(e.lastPromotionDate).toLocaleDateString()})
                        </span>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="activity-none">No recent promotions.</li>
                )}
              </ul>

              <h4>Recent Terminations/Resignations</h4>
              <ul className="activities-list">
                {recentTerminations.length > 0 ? (
                  recentTerminations.map((e, i) => (
                    <li key={i} className="activity-item">
                      <div className="activity-main">
                        <span className="activity-name">{e.fullName}</span>{' '}
                        <span className="status pending">
                          (Terminated on {new Date(e.terminationDate).toLocaleDateString()})
                        </span>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="activity-none">No recent terminations.</li>
                )}
              </ul> */}

              <div className="alerts">
                <h4>Alerts</h4>
                <ul className="alerts-list">
                  {employeesWithoutManager.length > 0 ? (
                    employeesWithoutManager.map((e, i) => (
                      <li key={i} className="alert-item">
                        <UserX size={16} color="#EF4444" className="mx-2" />{' '}
                        <span className="alert-text">
                          {e.fullName} – <strong>No Reporting Manager</strong>
                        </span>
                      </li>
                    ))
                  ) : (
                    <li className="alert-none">All employees are assigned a reporting manager.</li>
                  )}
                  {employeesMissingRole.length > 0 &&
                    employeesMissingRole.map((e, i) => (
                      <li key={`role-${i}`} className="alert-item">
                        <UserX size={16} color="#EF4444" className="mx-2" />{' '}
                        <span className="alert-text">
                          {e.fullName} – <strong>Missing Role</strong>
                        </span>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HubDashboard;
