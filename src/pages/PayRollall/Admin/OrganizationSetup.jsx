import React, { useState, useEffect } from 'react';
import './AdminPanel.css';
import {
  fetchOrganizations,
  createOrganization,
  updateOrganization,
  deleteOrganization,
} from '../../../api/organization';
import { getToken } from '../../../utils/auth';

const OrganizationSetup = () => {
  const [organizations, setOrganizations] = useState([]);
  const [form, setForm] = useState({
    OrganizationName: '',
    PAN: '',
    GSTIN: '',
    ContactEmail: '',
    ContactPhone: '',
    Country: 'India',
    State: '',
    Address: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const token = getToken();

  useEffect(() => {
    loadOrganizations();
  }, []);

  const loadOrganizations = async () => {
    try {
      const data = await fetchOrganizations(token);
      setOrganizations(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingId) {
        await updateOrganization(editingId, form, token);
        setSuccess('Organization updated successfully');
      } else {
        await createOrganization(form, token);
        setSuccess('Organization created successfully');
      }
      setForm({
        OrganizationName: '',
        PAN: '',
        GSTIN: '',
        ContactEmail: '',
        ContactPhone: '',
        Country: 'India',
        State: '',
        Address: '',
      });
      setEditingId(null);
      loadOrganizations();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (org) => {
    setForm({ ...org });
    setEditingId(org.OrganizationID);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this organization?')) {
      try {
        await deleteOrganization(id, token);
        setSuccess('Deleted successfully');
        loadOrganizations();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="admin-panel-container">
      <h2>Organization Setup</h2>

      {error && <p className="error-msg">{error}</p>}
      {success && <p className="success-msg">{success}</p>}

      <form className="org-form" onSubmit={handleSubmit}>
  <div className="form-grid">
    <input type="text" name="OrganizationName" placeholder="Organization Name" value={form.OrganizationName} onChange={handleChange} required />
    <input type="text" name="PAN" placeholder="PAN" value={form.PAN} onChange={handleChange} />
    <input type="text" name="GSTIN" placeholder="GSTIN" value={form.GSTIN} onChange={handleChange} />
    <input type="email" name="ContactEmail" placeholder="Email" value={form.ContactEmail} onChange={handleChange} />
    <input type="text" name="ContactPhone" placeholder="Phone" value={form.ContactPhone} onChange={handleChange} />
    <input type="text" name="State" placeholder="State" value={form.State} onChange={handleChange} />
    <input type="text" name="Country" placeholder="Country" value={form.Country} onChange={handleChange} />
    <textarea name="Address" placeholder="Address" value={form.Address} onChange={handleChange} />
  </div>
  <button type="submit" className="submit-btn">
    {editingId ? 'Update' : 'Add'}
  </button>
</form>

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>PAN</th>
            <th>GSTIN</th>
            <th>Email</th>
            <th>Phone</th>
            <th>State</th>
            <th>Country</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {organizations.map((org) => (
            <tr key={org.OrganizationID}>
              <td>{org.OrganizationName}</td>
              <td>{org.PAN || '-'}</td>
              <td>{org.GSTIN || '-'}</td>
              <td>{org.ContactEmail || '-'}</td>
              <td>{org.ContactPhone || '-'}</td>
              <td>{org.State || '-'}</td>
              <td>{org.Country || '-'}</td>
              <td>{org.Address || '-'}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(org)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(org.OrganizationID)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrganizationSetup;
