
import React, { useEffect, useState } from 'react';
import './Helpdesk.css';
// import { fetchFAQs, submitTicket, fetchTickets } from '../../api/pay';

const predefinedFaqs = [
  {
    id: 1,
    question: 'How do I view my payslip?',
    answer: 'You can view your payslip by navigating to the Payslips section under Payroll.',
  },
  {
    id: 2,
    question: 'When is the salary paid each month?',
    answer: 'Salary is credited to your bank account on the last working day of each month.',
  },
  {
    id: 3,
    question: 'How do I update my bank details?',
    answer: 'Please contact HR or update your bank details via the Profile section in the HR portal.',
  },
  {
    id: 4,
    question: 'What is TDS and why is it deducted?',
    answer: 'TDS stands for Tax Deducted at Source. It is deducted as per government tax laws on your salary.',
  },
];

const Helpdesk = () => {
  const [query, setQuery] = useState('');
  const [tickets, setTickets] = useState([
    { id: 1, subject: 'Incorrect Tax Deduction', status: 'Resolved' },
    { id: 2, subject: 'Missing Payslip - Feb 2025', status: 'Pending' },
  ]);
  const [faqs, setFaqs] = useState(predefinedFaqs);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  // const getToken = () => {
  //   const user = JSON.parse(localStorage.getItem('user'));
  //   return user?.token || '';
  // };


  useEffect(() => {
    setLoading(true);
    setTimeout(() => {

      setLoading(false);
    }, 500);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
   
      setTickets((prev) => [
        ...prev,
        { id: prev.length + 1, subject: query.trim(), status: 'Pending' },
      ]);
      setQuery('');
      setError('');
    } else {
      setError('Please enter a valid query.');
    }
  };

  return (
    <div className="helpdesk-container">


      {loading ? (
        <div className="loading-indicator">Loading...</div>
      ) : (
        <>
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="helpdesk-form">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your payroll query"
              required
            />
            <button type="submit">Submit</button>
          </form>

          <h3>Frequently Asked Questions</h3>
          <ul className="faq-list">
            {faqs.map((faq) => (
              <li key={faq.id}>
                <strong>{faq.question}</strong>
                <p>{faq.answer}</p>
              </li>
            ))}
          </ul>

          <h3>My Tickets</h3>
          {tickets.length === 0 ? (
            <p>No tickets submitted yet.</p>
          ) : (
            <ul className="ticket-list">
              {tickets.map((t) => (
                <li key={t.id}>
                  <strong>{t.subject}</strong> - <span>{t.status}</span>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default Helpdesk;
