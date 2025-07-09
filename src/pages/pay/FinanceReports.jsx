import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import './FinanceReports.css';
import { fetchPayrollSummary } from '../../api/pay';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const FinanceReports = () => {
  const [payrollData, setPayrollData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [filters, setFilters] = useState({
    department: 'All',
    month: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getToken = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.token || '';
  };

  const fetchReports = async () => {
    setLoading(true);
    setError('');
    try {
      const token = getToken();
      const data = await fetchPayrollSummary(token);
      setPayrollData(data);
      setFilteredData(data);

  
      const deptSet = new Set(data.map(d => d.department).filter(Boolean));
      setDepartments(['All', ...Array.from(deptSet)]);
    } catch (err) {
      setError('Failed to fetch payroll data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = () => {
    const { department, month } = filters;
    let data = [...payrollData];

    if (department !== 'All') {
      data = data.filter(d => d.department === department);
    }

    if (month) {
      const [yyyy, mm] = month.split('-');
      data = data.filter(d => d.month === parseInt(mm) && d.year === parseInt(yyyy));
    }

    setFilteredData(data);
  };

  const groupedReports = filteredData.reduce((acc, item) => {
    const key = `${item.month}-${item.year}`;
    if (!acc[key]) {
      acc[key] = {
        month: item.month,
        year: item.year,
        totalPayout: 0,
        employees: new Set(),
        pf: 0,
        tds: 0,
        esic: 0,
      };
    }
    acc[key].totalPayout += item.netSalary;
    acc[key].employees.add(item.employeeId);
    acc[key].pf += 0;
    acc[key].tds += 0;
    acc[key].esic += 0;
    return acc;
  }, {});

  const reports = Object.values(groupedReports).map(r => ({
    ...r,
    employees: r.employees.size,
    monthName: new Date(r.year, r.month - 1).toLocaleString('default', { month: 'long' })
  })).sort((a, b) => b.year - a.year || b.month - a.month);

  const totalPayout = reports.reduce((sum, r) => sum + r.totalPayout, 0);
  const totalEmployees = reports.reduce((sum, r) => sum + r.employees, 0);
  const avgPayout = totalEmployees ? Math.round(totalPayout / totalEmployees) : 0;

  return (
    <div className="finance-reports-container">
      <div className="summary-cards">
        <div className="summary-card">
          <h4>Total Payout</h4>
          <p>₹{totalPayout.toLocaleString()}</p>
        </div>
        <div className="summary-card">
          <h4>Total Employees Paid</h4>
          <p>{totalEmployees}</p>
        </div>
        <div className="summary-card">
          <h4>Average Payout</h4>
          <p>₹{avgPayout.toLocaleString()}</p>
        </div>
      </div>

      <div className="filters">
        <select name="department" value={filters.department} onChange={handleFilterChange}>
          {departments.map((dept, i) => (
            <option key={i} value={dept}>{dept}</option>
          ))}
        </select>
        <input
          type="month"
          name="month"
          value={filters.month}
          onChange={handleFilterChange}
        />
        <button onClick={applyFilters}>Apply</button>
      </div>

      {loading ? (
        <div className="loading-indicator">Loading reports...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <>
          <div className="charts-container">
            <div className="chart-box">
              <h4>Monthly Payout Trend</h4>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={reports}>
                  <XAxis dataKey="monthName" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="totalPayout" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-box">
              <h4>Latest Month Compliance</h4>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'PF', value: reports[0]?.pf || 0 },
                      { name: 'TDS', value: reports[0]?.tds || 0 },
                      { name: 'ESIC', value: reports[0]?.esic || 0 },
                    ]}
                    dataKey="value"
                    outerRadius={80}
                    label
                  >
                    {COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <table className="report-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Total Payout</th>
                <th>Employees</th>
                <th>PF</th>
                <th>TDS</th>
                <th>ESIC</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r, idx) => (
                <tr key={idx}>
                  <td>{r.monthName} {r.year}</td>
                  <td>₹{r.totalPayout.toLocaleString()}</td>
                  <td>{r.employees}</td>
                  <td>₹{r.pf}</td>
                  <td>₹{r.tds}</td>
                  <td>₹{r.esic}</td>
                  <td><button onClick={() => setSelectedReport(r)}>View</button></td>
                </tr>
              ))}
            </tbody>
          </table>

          {selectedReport && (
            <div className="report-modal">
              <div className="modal-content">
                <h3>{selectedReport.monthName} {selectedReport.year} Report</h3>
                <p><strong>Total Payout:</strong> ₹{selectedReport.totalPayout.toLocaleString()}</p>
                <p><strong>Employees:</strong> {selectedReport.employees}</p>
                <p><strong>PF:</strong> ₹{selectedReport.pf}</p>
                <p><strong>TDS:</strong> ₹{selectedReport.tds}</p>
                <p><strong>ESIC:</strong> ₹{selectedReport.esic}</p>

                <div className="download-buttons">
                  <button>Download PDF</button>
                  <button>Export Excel</button>
                </div>
                <button className="close-btn" onClick={() => setSelectedReport(null)}>Close</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FinanceReports;
