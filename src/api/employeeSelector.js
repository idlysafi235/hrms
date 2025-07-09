import { BASE_URL } from './urls';


export const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

export const fetchEmployeesByNameOrId = async (query, token) => {
    if (!query || query.trim() === '') return [];
  
    const res = await fetch(
      `${BASE_URL}/employee/filtered?search=${encodeURIComponent(query.trim())}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
  
    if (!res.ok) {
      throw new Error('Failed to fetch employees');
    }
  
    return await res.json();
  };
  

export const mapEmployeesToOptions = (employees) =>
  employees.map(emp => ({
    label: `${emp.fullName} (${emp.employeeId})`,
    value: emp.employeeId,
  }));

export const getEmployeeById = async (employeeId) => {
  if (!employeeId || employeeId.trim() === '') return null;

  const res = await fetch(`${BASE_URL}/employees/${encodeURIComponent(employeeId.trim())}`);

  if (!res.ok) {

    return null;
  }

  const emp = await res.json();

  return {
    employeeId: emp.employeeId,
    fullName: [emp.firstName, emp.middleName, emp.lastName].filter(Boolean).join(' '),
    role: emp.roleName || '', 
  };
};
