import React, { useEffect, useState } from 'react';
import {
  getAllDeclarations,
  approveDeclaration
} from '../../../api/investmentDeclarationsApi'; 
import { getToken } from '../../../utils/auth';
import './DeclarationsApproval.css';

export default function DeclarationsApproval() {
  const [declarations, setDeclarations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState('');
  const [approving, setApproving] = useState(false);
  const token = getToken();

  const loadDeclarations = async () => {
    try {
      const records = await getAllDeclarations(token);
      setDeclarations(records || []);
    } catch (err) {
      console.error(err);
      setDeclarations([]);
    }
  };

  useEffect(() => {
    loadDeclarations();
  }, []);

  const openModal = (decl) => {
    setSelected(decl);
    setMessage('');
  };

  const closeModal = () => {
    setSelected(null);
  };

  const handleApprove = async () => {
    if (!selected) return;
    const approvedAmount = parseFloat(
      prompt('Enter approved amount:', selected.amount)
    );
    if (isNaN(approvedAmount) || approvedAmount < 0) {
      setMessage('❌ Invalid approved amount');
      return;
    }

    try {
      setApproving(true);
      await approveDeclaration(
        selected.id,
        { approvedAmount, approverRemarks: 'Approved via dashboard' },
        token
      );
      setMessage(' Declaration approved successfully');
      await loadDeclarations();
      closeModal();
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setApproving(false);
    }
  };

  return (
    <div className="declarations-container">
      <h2>Investment Declarations</h2>

      {message && (
        <div
          className={`message ${message.startsWith('❌') ? 'error' : 'success'}`}
        >
          {message}
        </div>
      )}

      {declarations.length === 0 ? (
        <p>No declarations found.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Type</th>
              <th>SubType</th>
              <th>Declared Amount</th>
              <th>Approved Amount</th>
              <th>Status</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {declarations.map((d) => (
              <tr key={d.id}>
                <td>{d.employeeId}</td>
                <td>{d.declarationType}</td>
                <td>{d.subType}</td>
                <td>₹{d.amount?.toFixed(2)}</td>
                <td>
                  {d.approvedAmount != null
                    ? `₹${d.approvedAmount.toFixed(2)}`
                    : '—'}
                </td>
                <td>{d.status}</td>
                <td>{new Date(d.declarationDate).toLocaleDateString()}</td>
                <td>
                  {d.status === 'Pending' && (
                    <button onClick={() => openModal(d)}>Approve</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selected && (
        <div className="declarationmodal-overlay">
          <div className="declarationmodal">
            <div className="declarationmodal-header">
              <h3>Approve Declaration</h3>
            </div>
            <div className="declarationmodal-content">
              <p>
                <strong>Employee ID:</strong> {selected.employeeId}
              </p>
              <p>
                <strong>Type:</strong> {selected.declarationType}
              </p>
              <p>
                <strong>SubType:</strong> {selected.subType}
              </p>
              <p>
                <strong>Declared Amount:</strong> ₹{selected.amount?.toFixed(2)}
              </p>
              {selected.proofSubmitted && selected.declarationFilePath && (
                <p>
                  <a
                    href={selected.declarationFilePath}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View Proof
                  </a>
                </p>
              )}
              {message && (
                <div
                  className={`message ${
                    message.startsWith('❌') ? 'error' : 'success'
                  }`}
                >
                  {message}
                </div>
              )}
            </div>
            <div className="declarationmodal-footer">
              <button onClick={handleApprove} disabled={approving}>
                {approving ? 'Approving...' : 'Approve'}
              </button>
              <button onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
