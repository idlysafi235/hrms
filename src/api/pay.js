import { BASE_URL } from './urls';


export const fetchPayrollSummary = async (token) => {
  try {
    const res = await fetch(`${BASE_URL}/pay`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to fetch payroll summary');
    }

    const result = await res.json();
    return Array.isArray(result.data) ? result.data : []; 
  } catch (error) {
    console.error('Fetch Payroll Summary API error:', error);
    return [];
  }
};



export const fetchRecentPayslips = async (token) => {
  try {
    const res = await fetch(`${BASE_URL}/payslips/pdf`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to fetch recent payslips');
    }

    return await res.json();
  } catch (error) {
    console.error('Fetch Recent Payslips API error:', error);
    throw error;
  }
};


export const fetchFAQs = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/helpdesk/faqs`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch FAQs');
    }

    return response.json();
  } catch (error) {
    console.error('Fetch FAQs API error:', error);
    throw error;
  }
};

export const submitTicket = async (token, subject) => {
  try {
    const response = await fetch(`${BASE_URL}/helpdesk/tickets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ subject }),
    });

    if (!response.ok) {
      throw new Error('Failed to submit ticket');
    }

    return response.json();
  } catch (error) {
    console.error('Submit Ticket API error:', error);
    throw error;
  }
};

export const fetchTickets = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/helpdesk/tickets`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch tickets');
    }

    return response.json();
  } catch (error) {
    console.error('Fetch Tickets API error:', error);
    throw error;
  }
};
export const fetchBankDetails = async (token) => {


  try {
    const res = await fetch(`${BASE_URL}/banks/my`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });


    if (res.status === 404) {

      return null;
    }

    if (!res.ok) {
      const errorData = await res.json();
      console.error('fetchBankDetails error response:', errorData);
      throw new Error(errorData.message || 'Failed to fetch bank details');
    }

    const data = await res.json();


    if (Array.isArray(data)) {

      return data;
    } else {

      return data; 
    }
  } catch (error) {
    console.error('Fetch BankDetails API error:', error);
    throw error;
  }
};

export const addBankDetails = async (token, bankDetails) => {
    try {
      const res = await fetch(`${BASE_URL}/banks`, {
        method: 'POST',  
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bankDetails),
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update bank details');
      }
  
      return await res.json();
    } catch (error) {
      console.error('Update BankDetails API error:', error);
      throw error;
    }
  };
  