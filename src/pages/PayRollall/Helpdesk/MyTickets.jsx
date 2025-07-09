import React, { useState, useEffect } from 'react';
import './HelpdeskPage.css';
// import { fetchMyPayTickets } from '../../api/helpdeskApi';
// import { getToken } from '../../utils/auth';

const MOCK_TICKETS = [
  {
    id: 101,
    subject: 'PF not credited',
    status: 'Resolved',
    createdAt: '2025-06-01T00:00:00.000Z',
    updatedAt: '2025-06-05T00:00:00.000Z'
  },
  {
    id: 102,
    subject: 'Salary discrepancy',
    status: 'In Progress',
    createdAt: '2025-06-10T00:00:00.000Z',
    updatedAt: '2025-06-15T00:00:00.000Z'
  },
  {
    id: 103,
    subject: 'Payslip request',
    status: 'Open',
    createdAt: '2025-06-20T00:00:00.000Z',
    updatedAt: '2025-06-21T00:00:00.000Z'
  }
];

const MOCK_FAQ = [
  {
    question: 'When is the salary credited?',
    answer: 'Salary is usually credited by the 5th working day of each month.'
  },
  {
    question: 'How can I download my payslip?',
    answer: 'Navigate to the Payroll section and click on "Download Payslip".'
  },
  {
    question: 'What should I do if my PF is not credited?',
    answer: 'Raise a ticket mentioning your PF account details.'
  }
];

const MOCK_DOCUMENTS = [
  {
    title: 'Salary Policy',
    url: '/mock-pdfs/salary-policy.pdf'
  },
  {
    title: 'PF Guidelines',
    url: '/mock-pdfs/pf-guidelines.pdf'
  },
  {
    title: 'Tax Declaration Form',
    url: '/mock-pdfs/tax-declaration.pdf'
  }
];

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

 
  useEffect(() => {
    const loadMockData = () => {
      setTimeout(() => {
        setTickets(MOCK_TICKETS);
        setLoading(false);
      }, 500);
    };
    loadMockData();
  }, []);

  return (
    <div className="helpdesk-page">
      <section className="section">
        <h3>Recent Tickets</h3>
        {loading ? (
          <p>Loading tickets...</p>
        ) : tickets.length === 0 ? (
          <p>No tickets found.</p>
        ) : (
          <table className="tickets-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Created</th>
                <th>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(ticket => (
                <tr key={ticket.id}>
                  <td>#{ticket.id}</td>
                  <td>{ticket.subject}</td>
                  <td>
                    <span className={`status-badge ${ticket.status.toLowerCase().replace(' ', '-')}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                  <td>{new Date(ticket.updatedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="section">
        <h3>FAQs</h3>
        <ul className="faq-list">
          {MOCK_FAQ.map((faq, idx) => (
            <li key={idx}>
              <strong>{faq.question}</strong>
              <p>{faq.answer}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="section">
        <h3>Helpful Documents</h3>
        <ul className="document-list">
          {MOCK_DOCUMENTS.map((doc, idx) => (
            <li key={idx}>
              <a href={doc.url} target="_blank" rel="noopener noreferrer">
                📄 {doc.title}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default MyTickets;
