import React from 'react';

const EmployeeFilters = ({
  searchQuery,
  setSearchQuery,
  departmentFilter,
  setDepartmentFilter,
  departments
}) => {
  return (
    <div className="filters">
      <div className="filter-item">
        <label htmlFor="search">Search: </label>
        <input
          id="search"
          type="text"
          placeholder="Search by Employee ID or Full Name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="filter-item">
        <label htmlFor="department">Department: </label>
        <select
          id="department"
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
        >
          <option value="">All Departments</option>
          {departments.map((dept) => (
  <option key={dept} value={dept}>
    {dept}
  </option>
))}

        </select>
      </div>
    </div>
  );
};

export default EmployeeFilters;
