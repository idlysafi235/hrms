
import React, { useState, useEffect } from 'react';
import './OnboardingProgress.css';
import { getAllonboarding } from '../../api/onboard';
import { getToken } from '../../utils/auth';
import { SearchIcon } from 'lucide-react';

const milestones = [
  'Document Submission',
  'Background Check',
  'Training Scheduled',
  'Equipment Assigned',
  'Orientation Completed',
  'Final Approval',
];


const calculateProgressPercent = (milestoneStatus) => {
  if (!milestoneStatus) return 0;
  const completedCount = Object.values(milestoneStatus).filter(
    (status) => status === 'Completed'
  ).length;
  return Math.round((completedCount / milestones.length) * 100);
};

const OnboardingProgress = () => {
  const [employees, setEmployees] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchEmployees() {
      setLoading(true);
      setError(null);
      try {
        const token = getToken();
        const data = await getAllonboarding(token);
        setEmployees(data);
      } catch (err) {
        setError(err.message || 'Failed to load onboarding data');
      } finally {
        setLoading(false);
      }
    }
    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter((emp) => {
    const progressPercent = calculateProgressPercent(emp.milestoneStatus);

    if (filterStatus !== 'All') {
      if (
        (filterStatus === 'Completed' && progressPercent < 100) ||
        (filterStatus === 'In Progress' && (progressPercent === 0 || progressPercent === 100)) ||
        (filterStatus === 'Pending' && progressPercent !== 0)
      )
        return false;
    }

    if (
      searchTerm &&
      !emp.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !emp.department?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !emp.position?.toLowerCase().includes(searchTerm.toLowerCase())
    )
      return false;

    return true;
  });

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getMilestoneStatus = (emp, ms) => {
    if (!emp.milestoneStatus) return 'Pending';
    return emp.milestoneStatus[ms] || 'Pending';
  };

  return (
    <div className="onboarding-progress-page">
      <div className="controls">
      <div className="input-group">
        <input
          type="text"
          placeholder="Search by name, dept, role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
          disabled={loading}
        />
        <SearchIcon size={16} className="icon" />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="filter-select"
          disabled={loading}
        >
          <option value="All">All Status</option>
          <option value="Completed">Completed</option>
          <option value="In Progress">In Progress</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      {loading && <p>Loading onboarding data...</p>}
      {error && <p className="error-msg">{error}</p>}

      {!loading && !error && (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Position</th>
                <th>Scheduled Start</th>
                <th>Actual Start</th>
                <th>Onboardedby</th>
                <th>Progress</th>
                <th>Last Activity</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length === 0 && (
                <tr>
                  <td colSpan="10" style={{ textAlign: 'center' }}>
                    No employees found.
                  </td>
                </tr>
              )}

              {filteredEmployees.map((emp) => {
                const progressPercent = calculateProgressPercent(emp.milestoneStatus);
                const isExpanded = expandedId === emp.employeeId;
                return (
                  <React.Fragment key={emp.employeeId}>
                    <tr className="main-row">
                      <td>{emp.fullName || '-'}({emp.employeeId})</td>
                      <td>{emp.position || '-'}</td>
                      <td>{emp.startedAt
                          ? new Date(emp.startedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })
                          : '-'}</td>
                      <td>{emp.actualStart
                          ? new Date(emp.actualStart).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })
                          : '-'}</td>
                      <td>{emp.onboardedByFullName || '-'}</td>
                      <td>
                        <div className="progress-bar-container" title={`${progressPercent}% completed`}>
                          <div
                            className="progress-bar"
                            style={{ width: `${progressPercent}%` }}
                          ></div>
                        </div>
                        <span className="progress-percent">{progressPercent}%</span>
                      </td>
                      <td>{emp.updatedAt
                          ? new Date(emp.updatedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })
                          : '-'}</td>
                      <td>
                        <button className="details-btn" onClick={() => toggleExpand(emp.employeeId)}>
                          {isExpanded ? 'Hide' : 'Show'}
                        </button>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="details-row">
                        <td colSpan="10">
                          <div className="milestone-list">
                            {milestones.map((ms) => (
                              <div
                                key={ms}
                                className={`milestone-item ${
                                  getMilestoneStatus(emp, ms).toLowerCase().replace(/ /g, '-')
                                }`}
                              >
                                <strong>{ms}:</strong> {getMilestoneStatus(emp, ms)}
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OnboardingProgress;
