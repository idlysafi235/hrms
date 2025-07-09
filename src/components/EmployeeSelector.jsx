import React, { useState, useEffect, useCallback } from 'react';
import Select from 'react-select';
import {
  fetchEmployeesByNameOrId,
  mapEmployeesToOptions,
  debounce,
} from '../api/employeeSelector';

const EmployeeSelector = ({
  value,
  onChange,
  placeholder = 'Select employee...',
  disabled = false,
  excludeIds = [],
}) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadOptions = useCallback(
    debounce(async (inputValue) => {
      setLoading(true);
      try {
        const employees = await fetchEmployeesByNameOrId(inputValue || '');
        const filtered = excludeIds.length
          ? employees.filter((emp) => !excludeIds.includes(emp.employeeId))
          : employees;
        setOptions(mapEmployeesToOptions(filtered));
      } catch (error) {
        console.error('Failed to fetch employees:', error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    }, 300),
    [excludeIds]
  );

  useEffect(() => {
    loadOptions('');
  }, [loadOptions]);

  return (
    <Select
      value={value}
      onChange={onChange}
      options={options}
      isLoading={loading}
      onInputChange={loadOptions}
      placeholder={placeholder}
      isDisabled={disabled}
      isClearable
      className="employee-selector"
      classNamePrefix="select"
    />
  );
};

export default EmployeeSelector;
