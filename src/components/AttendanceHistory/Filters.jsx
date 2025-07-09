import React from 'react';
import DateInput from '../common/DateInput';

const Filters = ({ filters, setFilters, attendanceData, setPage }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(1);
  };

  return (
    <div className="attendance-topbar">
      <div className="date-filter-box">
        <label>From Date</label>
        <DateInput name="from" value={filters.from} onChange={handleChange} />
      </div>
      <div className="date-filter-box">
        <label>To Date</label>
        <DateInput name="to" value={filters.to} onChange={handleChange} />
      </div>
      {/* <div className="date-filter-box">
        <label>Team</label>
        <select name="team" value={filters.team} onChange={handleChange}>
          <option value="all">All</option>
          {[...new Set(attendanceData.map(emp => emp.team || ''))].map(team => (
            <option key={team} value={team}>{team}</option>
          ))}
        </select>
      </div> */}
      <div className="date-filter-box">
        <label>Search Employee</label>
        <input
          type="text"
          name="search"
          placeholder="Search Employee"
          value={filters.search}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default Filters;
