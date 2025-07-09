import React, { useMemo } from 'react';

import Filters from '../../components/AttendanceHistory/Filters';
import KPICards from '../../components/AttendanceHistory/KPICards';
import AverageHoursGauge from '../../components/AttendanceHistory/Charts/AverageHoursGauge';
import LocationPieChart from '../../components/AttendanceHistory/Charts/LocationPieChart';
import AttendanceTable from '../../components/AttendanceHistory/AttendanceTable';
import Pagination from '../../components/AttendanceHistory/Pagination';

import LateCheckInsKPI from '../../components/AttendanceHistory/KPIs/LateCheckInsKPI';
import EarlyLeavesKPI from '../../components/AttendanceHistory/KPIs/EarlyLeavesKPI';
import NoClockInOutKPI from '../../components/AttendanceHistory/KPIs/NoClockInOutKPI';
import OnTimePercentageKPI from '../../components/AttendanceHistory/KPIs/OnTimePercentageKPI';

import ExportDataButton from '../../components/AttendanceHistory/Controls/ExportDataButton';
import PrintViewButton from '../../components/AttendanceHistory/Controls/PrintViewButton';

import AnomalyAlerts from '../../components/AttendanceHistory/Alerts/AnomalyAlerts';
import LowAttendanceAlerts from '../../components/AttendanceHistory/Alerts/LowAttendanceAlerts';

import EmployeeProfileModal from '../../components/AttendanceHistory/EmployeeProfileModal';

import useAttendanceData from '../../hooks/useAttendanceData';

import './styles/alerts.css';
import './styles/kpis.css';
import './styles/charts.css';
import './styles/controls.css';
import './styles/table-pagination.css';
import './styles/modals.css';
import './styles/responsive.css';
import './styles/Filters.css';

const AttendanceHistory = () => {
  const {
    filters, setFilters,
    page, setPage,
    attendanceData,
    loading, error,
    paginatedData, totalPages,
    presentCount, wfhCount, absentCount,
    avgWorkHours,
    totalEmployees,
    userRoles = [],
    selectedEmployee, setSelectedEmployee,
  } = useAttendanceData();

  const lowerUserRoles = useMemo(() => userRoles.map(r => r.toLowerCase()), [userRoles]);
  const isManager = lowerUserRoles.includes('manager');

  const areDatesSame = filters.from && filters.to && filters.from === filters.to;

  const tableFilteredData = useMemo(() => {
    return attendanceData.filter(record => {
      const matchesDate = (!filters.from || !filters.to) || (record.date >= filters.from && record.date <= filters.to);
      const matchesSearch = !filters.search || (record.name?.toLowerCase().includes(filters.search.toLowerCase()));
      return matchesDate && matchesSearch;
    });
  }, [attendanceData, filters]);
  
  const kpiFilteredData = useMemo(() => {
    return areDatesSame ? tableFilteredData : attendanceData;
  }, [areDatesSame, tableFilteredData, attendanceData]);

  return (
    <div className="attendance-history-container">
      {/* Alerts */}
      <AnomalyAlerts filteredData={tableFilteredData} />
      <LowAttendanceAlerts filteredData={tableFilteredData} />

      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading-message">Loading attendance data...</div>}

      {!error && !loading && (
        <>
          <Filters filters={filters} setFilters={setFilters} attendanceData={attendanceData} setPage={setPage} />
          <div className="kpi-grid">
            <KPICards
              totalEmployees={totalEmployees}
              present={presentCount}
              wfh={wfhCount}
              absent={absentCount}
              hideTotalEmployees={isManager}
            />
            <LateCheckInsKPI data={kpiFilteredData} />
            <EarlyLeavesKPI data={kpiFilteredData} />
            <NoClockInOutKPI data={kpiFilteredData} />
            <OnTimePercentageKPI data={kpiFilteredData} />
          </div>

          <div className="attendance-charts">
            <AverageHoursGauge avgWorkHours={avgWorkHours} />
            <LocationPieChart present={presentCount} wfh={wfhCount} />
          </div>

          <ExportDataButton filteredData={tableFilteredData} />
          <PrintViewButton />

          <AttendanceTable data={paginatedData} onEmployeeClick={setSelectedEmployee} />
          <Pagination page={page} totalPages={totalPages} setPage={setPage} />

          {selectedEmployee && selectedEmployee.employeeId && (
            <EmployeeProfileModal
              isOpen={true}
              onClose={() => setSelectedEmployee(null)}
              employeeId={selectedEmployee.employeeId}
              selectedDate={selectedEmployee.date}
              attendanceData={attendanceData}
            />
          )}
        </>
      )}
    </div>
  );
};

export default AttendanceHistory;
