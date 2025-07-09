import { useState, useEffect, useMemo } from 'react';
import { fetchAttendanceData, getTeamAttendance } from '../api/services';
import { getAllEmployees } from '../api/employee';
import { useAuth } from '../components/context/AuthContext';

const useAttendanceData = () => {
  const today = new Date().toISOString().split('T')[0];
  const { token: authToken, roles: authRoles } = useAuth();
  const [filters, setFilters] = useState({
    from: today,
    to: today,
    team: 'all',
    search: ''
  });

  const [attendanceData, setAttendanceData] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);
  const [userRoles, setUserRoles] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(null); 
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError('');
      try {
        let token = authToken;
        let roles = authRoles || [];
        setUserRoles(roles);

        let attendance = [];

        if (roles.includes('Admin') || roles.includes('HR') || roles.includes('superadmin')) {
          attendance = await fetchAttendanceData(token);
          const employees = await getAllEmployees(token);
          setAllEmployees(employees);
        } else if (roles.includes('Manager')) {
          attendance = await getTeamAttendance(token);
          setAllEmployees([]);
        } else {
          throw new Error('Access denied: insufficient permissions.');
        }

        setAttendanceData(attendance);
      } catch (err) {
        setError(err.message || 'Error fetching data.');
        setAttendanceData([]);
        setAllEmployees([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredAttendance = attendanceData.filter((entry) => {
    const fromDate = filters.from ? new Date(filters.from) : null;
    const toDate = filters.to ? new Date(filters.to) : null;
    const entryDate = new Date(entry.date);

    return (
      (!fromDate || entryDate >= fromDate) &&
      (!toDate || entryDate <= toDate) &&
      (filters.team === 'all' || entry.team === filters.team) &&
      (filters.search === '' || (entry.fullName || '').toLowerCase().includes(filters.search.toLowerCase()))
    );
  });

  const totalEmployees = allEmployees.length;

  const presentCount = filteredAttendance.filter(item => item.status === 'Present').length;
  const wfhCount = filteredAttendance.filter(item => item.status === 'WFH').length;
  const absentCount = filteredAttendance.filter(item => item.status === 'Absent').length;

  const missingClockInOutCount = filteredAttendance.filter(item =>
    !item.clockInTime || !item.clockOutTime
  ).length;

  const paginatedData = filteredAttendance.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const totalPages = Math.ceil(filteredAttendance.length / rowsPerPage);

  const totalWorkHours = filteredAttendance.reduce((sum, item) => sum + (item.totalHours || 0), 0);
  const avgWorkHours = filteredAttendance.length ? (totalWorkHours / filteredAttendance.length) : 0;

  const selectedDayDetails = useMemo(() => {
    if (!selectedDate) return [];
    return filteredAttendance.filter(entry => entry.date === selectedDate);
  }, [selectedDate, filteredAttendance]);

  return {
    filters, setFilters,
    page, setPage,
    rowsPerPage, setRowsPerPage,
    attendanceData,
    allEmployees,
    loading,
    error,
    paginatedData,
    totalPages,
    totalEmployees,
    presentCount,
    wfhCount,
    absentCount,
    missingClockInOutCount,
    avgWorkHours,
    filteredData: filteredAttendance,
    userRoles,
    selectedDate, setSelectedDate,      
    selectedDayDetails,
    selectedEmployee,
    setSelectedEmployee,                   
  };
};

export default useAttendanceData;
