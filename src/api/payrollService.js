import { BASE_URL } from './urls';

export const runPayroll = async (token, body) => {
  try {
    const res = await fetch(`${BASE_URL}/pay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || data.message || 'Payroll run failed');
    }

    return data;
  } catch (error) {
    console.error('Payroll run error:', error);
    throw error;
  }
};


export const fetchAllPayrolls = async (token) => {
  try {
    const res = await fetch(`${BASE_URL}/pay`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to fetch payroll records');
    }
    return Array.isArray(data.data) ? data.data : [];
  } catch (error) {
    console.error('Fetch payroll error:', error);
    throw error;
  }
};

export const getPayrollByEmployee = async (token, employeeId) => {
  try {
    const res = await fetch(`${BASE_URL}/payroll/employee/${employeeId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to fetch employee payroll');
    }

    return Array.isArray(data.data) ? data.data : [];
  } catch (error) {
    console.error('Get payroll by employee error:', error);
    throw error;
  }
};

export const updatePayrollStatus = async (token, { payrollId, status }) => {
  try {
    const res = await fetch(`${BASE_URL}/payroll/update-status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ payrollId, status }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to update payroll status');
    }

    return data;
  } catch (error) {
    console.error('Update payroll status error:', error);
    throw error;
  }
};

export const fetchPayrollruns = async (token) => {
  try {
    const res = await fetch(`${BASE_URL}/pay/payrolls`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to fetch payroll runs');
    }
    return Array.isArray(data.data) ? data.data : [];
  } catch (error) {
    console.error('Fetch payrollruns:', error);
    throw error;
  }
};
