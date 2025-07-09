import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import StatusBadge from '../common/StatusBadge';

const DeclarationTable = ({ declarations, handleEdit, handleDelete }) => (
  <section className="td-table-section">
    <h3 className="td-table-title">Your Declarations</h3>
    {declarations.length === 0 ? (
      <p className="td-no-data">No declarations available.</p>
    ) : (
      <div className="td-table-scroll">
        <table className="table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Sub-Type</th>
              <th>Amount</th>
              <th>Fiscal Year</th>
              <th>Submitted On</th>
              <th>Status</th>
              <th>Approved Amt</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {declarations.map((dec) => (
              <tr key={dec.id}>
                <td>{dec.declarationType}</td>
                <td>{dec.subType}</td>
                <td>{dec.amount}</td>
                <td>{dec.financialYear}</td>
                <td>{new Date(dec.declarationDate).toLocaleDateString()}</td>
                <td>
        <StatusBadge status={dec.status} />
      </td>
                <td>{dec.approvedAmount || '-'}</td>
                <td>
                  {!dec.approvalDate && (
                    <span className="td-actions">
                      <FaEdit onClick={() => handleEdit(dec)} className="td-icon td-edit" />
                      <FaTrash onClick={() => handleDelete(dec.id)} className="td-icon td-delete" />
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </section>
);

export default DeclarationTable;
