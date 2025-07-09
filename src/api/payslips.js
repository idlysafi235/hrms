import { BASE_URL } from './urls';

export const viewPayslipPDF = async (token, month, year) => {
    const res = await fetch(`${BASE_URL}/payslips/view?month=${month}&year=${year}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!res.ok) throw new Error('Failed to view payslip');
    return await res.blob(); 
  };

export const downloadPayslipPDF = async (token, month, year) => {
    const res = await fetch(`${BASE_URL}/payslips/download?month=${month}&year=${year}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!res.ok) throw new Error('Failed to download payslip');
  
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Payslip_${month}_${year}.pdf`;
    a.click();
  };

  export const sendBulkPayslips = async (token, month, year) => {
    const res = await fetch(`${BASE_URL}/payslips/bulk-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ month, year }),
    });
  
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to email payslips');
    return data.message;
  };

  export const fetchPayslipMonths = async (token) => {
    const res = await fetch(`${BASE_URL}/payslips/months`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!res.ok) throw new Error('Failed to fetch payslip months');
    const data = await res.json();
    return data.months; 
  };

  export const fetchPayregister = async (token) => {
    const res = await fetch(`${BASE_URL}/payslips/list`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!res.ok) throw new Error('Failed to fetch List');
    const data = await res.json();
    return data.payslips; 
  };
  
  