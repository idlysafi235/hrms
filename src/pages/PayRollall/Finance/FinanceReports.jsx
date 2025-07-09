import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, PieChart, Pie, Cell
} from 'recharts';
import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './FinanceReports.css';
import { getToken } from '../../../utils/auth';
import { fetchPayrollSummary } from '../../../api/pay';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const FinanceReports = () => {
  const today = new Date();
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [months, setMonths] = useState([]);
  const [years, setYears] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [statuses] = useState(['Processed', 'Pending']);
  const [empStatuses] = useState(['Active', 'Resigned', 'Terminated']);
  const [filters, setFilters] = useState({
    month: today.getMonth() + 1,
    year: today.getFullYear(),
    department: 'All',
    payrollStatus: 'All',
    employeeStatus: 'All',
  });
  const [reports, setReports] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    (async () => {
      const token = getToken();
      const arr = await fetchPayrollSummary(token);
      const d = Array.isArray(arr) ? arr : [];
      setData(d);
      setFiltered(d);

      const uniqMonths = [...new Set(d.map(it => it.month))].sort();
      const uniqYears = [...new Set(d.map(it => it.year))].sort((a, b) => b - a);
      setMonths(uniqMonths);
      setYears(uniqYears);
      setDepartments(['All', ...new Set(d.map(it => it.department))]);
    })();
  }, []);

  useEffect(() => {
    const f = data.filter(it =>
      it.month === +filters.month &&
      it.year === +filters.year &&
      (filters.department === 'All' || it.department === filters.department) &&
      (filters.payrollStatus === 'All' || it.status === filters.payrollStatus) &&
      (filters.employeeStatus === 'All' || it.employeeStatus === filters.employeeStatus)
    );
    setFiltered(f);

    const grouped = {};
    f.forEach(it => {
      const key = `${it.month}-${it.year}`;
      if (!grouped[key]) {
        grouped[key] = {
          month: it.month, year: it.year,
          totalGross: 0, totalNet: 0,
          totalDed: 0, PF: 0, TDS: 0, PT: 0, Other: 0,
          employees: new Set(),
        };
      }
      grouped[key].totalGross += it.grossSalary || 0;
      grouped[key].totalNet += it.netPay || 0;
      grouped[key].PF += it.pf || 0;
      grouped[key].TDS += it.tds || 0;
      grouped[key].PT += it.professionalTax || 0;
      grouped[key].Other += it.otherDeductions || 0;
      grouped[key].totalDed += (it.pf || 0) + (it.tds || 0) + (it.professionalTax || 0) + (it.otherDeductions || 0);
      grouped[key].employees.add(it.employeeId);
    });

    const arr = Object.values(grouped).map(item => ({
      ...item,
      employees: item.employees.size,
      monthName: new Date(item.year, item.month - 1).toLocaleString('default', { month: 'short' })
    })).sort((a, b) => a.year === b.year ? a.month - b.month : a.year - b.year);
    setReports(arr);
  }, [data, filters]);

  const exportExcel = async () => {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Finance');
    ws.columns = [
      { header: 'Month', key: 'monthName', width: 12 },
      { header: 'Year', key: 'year', width: 10 },
      { header: 'Gross', key: 'totalGross', width: 15 },
      { header: 'Net', key: 'totalNet', width: 15 },
      { header: 'PF', key: 'PF', width: 12 },
      { header: 'TDS', key: 'TDS', width: 12 },
      { header: 'PT', key: 'PT', width: 12 },
      { header: 'Other', key: 'Other', width: 12 },
      { header: 'Employees', key: 'employees', width: 12 },
    ];
    reports.forEach(r => ws.addRow(r));
    const buf = await wb.xlsx.writeBuffer();
    saveAs(new Blob([buf]), 'Finance_Report.xlsx');
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    const body = reports.map(r => [
      r.monthName, r.year, r.totalGross, r.totalNet, r.PF, r.TDS, r.PT, r.Other, r.employees
    ]);
    doc.text('Finance Report', 10, 10);
    doc.autoTable({
      head: [['Month', 'Year', 'Gross', 'Net', 'PF', 'TDS', 'PT', 'Other', 'Employees']],
      body
    });
    doc.save('Finance_Report.pdf');
  };

  const downloadDetails = (r) => {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet(`${r.monthName}_${r.year}_Details`);
    ws.addRows(Object.entries(r).map(([k, v]) => [k, String(v)]));
    wb.xlsx.writeBuffer().then(buf => {
      saveAs(new Blob([buf]), `${r.monthName}_${r.year}_Details.xlsx`);
    });
  };

  return (
    <div className="finance-dashboard">
      <h2>Finance Dashboard</h2>

      <div className="filters-bar">
        <select value={filters.month} onChange={e => setFilters({ ...filters, month: +e.target.value })}>
          {months.map(m => (
            <option key={m} value={m}>
              {new Date(0, m - 1).toLocaleString('default', { month: 'short' })}
            </option>
          ))}
        </select>
        <select value={filters.year} onChange={e => setFilters({ ...filters, year: +e.target.value })}>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <select value={filters.department} onChange={e => setFilters({ ...filters, department: e.target.value })}>
          {departments.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select value={filters.payrollStatus} onChange={e => setFilters({ ...filters, payrollStatus: e.target.value })}>
          {['All', ...statuses].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={filters.employeeStatus} onChange={e => setFilters({ ...filters, employeeStatus: e.target.value })}>
          {['All', ...empStatuses].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="charts-grid">
        <div className="chart-box">
          <h4>Gross / Net / Deductions</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={reports}>
              <XAxis dataKey="monthName" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalGross" stackId="a" fill="#8884d8" />
              <Bar dataKey="totalNet" stackId="a" fill="#82ca9d" />
              <Bar dataKey="totalDed" stackId="a" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h4>Trend: PF, TDS, Net Pay</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={reports}>
              <XAxis dataKey="monthName" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line dataKey="PF" stroke="#0088FE" />
              <Line dataKey="TDS" stroke="#00C49F" />
              <Line dataKey="totalNet" stroke="#FFBB28" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h4>Latest Deductions</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={[
                  { name: 'PF', value: reports[0]?.PF || 0 },
                  { name: 'TDS', value: reports[0]?.TDS || 0 },
                  { name: 'PT', value: reports[0]?.PT || 0 },
                  { name: 'Other', value: reports[0]?.Other || 0 },
                ]}
                dataKey="value"
                innerRadius={40}
                outerRadius={80}
                label
              >
                {COLORS.map((c, i) => <Cell key={i} fill={c} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="export-bar">
        <button onClick={exportExcel}>Export Excel</button>
        <button onClick={exportPDF}>Export PDF</button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Month</th><th>Year</th><th>Gross</th><th>Net</th><th>PF</th><th>TDS</th>
            <th>PT</th><th>Other</th><th>Employees</th><th>Details</th>
          </tr>
        </thead>
        <tbody>
          {reports.map(r => (
            <tr key={`${r.month}-${r.year}`}>
              <td>{r.monthName}</td>
              <td>{r.year}</td>
              <td>₹{r.totalGross.toLocaleString()}</td>
              <td>₹{r.totalNet.toLocaleString()}</td>
              <td>₹{r.PF.toLocaleString()}</td>
              <td>₹{r.TDS.toLocaleString()}</td>
              <td>₹{r.PT.toLocaleString()}</td>
              <td>₹{r.Other.toLocaleString()}</td>
              <td>{r.employees}</td>
              <td><button onClick={() => setSelected(r)}>View</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      {selected && (
        <div className="timesheetmodal-overlay" onClick={() => setSelected(null)}>
          <div className="timesheetmodal" onClick={e => e.stopPropagation()}>
            <h3>{selected.monthName} {selected.year} Details</h3>
            <div className="timesheetmodal-content grid-container">
              {Object.entries(selected).map(([key, value]) => (
                <div key={key} className="field">
                  <strong>{key}</strong>: {String(value)}
                </div>
              ))}
            </div>
            <div className="modal-actions">
              <button onClick={() => downloadDetails(selected)}>Download</button>
              <button onClick={() => setSelected(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceReports;
