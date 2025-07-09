import React, { useEffect, useState } from 'react';
import './PayComponentMaster.css';
import {
  fetchPayComponents,
  createPayComponent,
  updatePayComponent,
  deletePayComponent
} from '../../../api/payComponent';
import { getToken } from '../../../utils/auth';

const PayComponentMaster = () => {
  const [components, setComponents] = useState([]);
  const [form, setForm] = useState({ name: '', type: 'Earning', taxable: false });
  const [editIndex, setEditIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = getToken();

  const loadComponents = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchPayComponents(token);
      setComponents(data);
    } catch (err) {
      setError('Failed to load pay components.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComponents();
  }, []);

  const handleSubmit = async () => {
    if (!form.name.trim()) return;
    try {
      if (editIndex !== null) {
        const id = components[editIndex].id;
        await updatePayComponent(id, form, token);
      } else {
        await createPayComponent(form, token);
      }
      await loadComponents();
      resetForm();
    } catch (err) {
      setError('Submit failed. Please try again.');
      console.error(err);
    }
  };

  const handleEdit = (index) => {
    const selected = components[index];
    if (selected.isDefault) return;
    setForm({
      name: selected.name,
      type: selected.type,
      taxable: selected.taxable
    });
    setEditIndex(index);
  };

  const handleDelete = async (index) => {
    const selected = components[index];
    if (selected.isDefault) return;
    const confirmDelete = window.confirm('Are you sure you want to delete this component?');
    if (!confirmDelete) return;
    try {
      const id = selected.id;
      await deletePayComponent(id, token);
      await loadComponents();
    } catch (err) {
      setError('Delete failed. Please try again.');
      console.error(err);
    }
  };

  const resetForm = () => {
    setForm({ name: '', type: 'Earning', taxable: false });
    setEditIndex(null);
    setError('');
  };

  return (
    <div className="pcm-page">
      <h1 className="pcm-title">Pay Component Master</h1>

      <section className="pcm-form">
        <div className="pcm-form-row">
          <div className="pcm-form-group">
            <label>Component Name</label>
            <input
              type="text"
              placeholder="e.g., Basic"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="pcm-form-group">
            <label>Component Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="Earning">Earning</option>
              <option value="Deduction">Deduction</option>
            </select>
          </div>

          <div className="pcm-form-group checkbox">
            <label>
              <input
                type="checkbox"
                checked={form.taxable}
                onChange={(e) => setForm({ ...form, taxable: e.target.checked })}
              />
              Is Taxable
            </label>
          </div>
        </div>

        <div className="pcm-form-actions">
          <button className="btn primary" onClick={handleSubmit}>
            {editIndex !== null ? 'Update' : 'Add'}
          </button>
          {editIndex !== null && (
            <button className="btn secondary" onClick={resetForm}>Cancel</button>
          )}
        </div>

        {error && <p className="pcm-error">{error}</p>}
      </section>

      <section className="pcm-table-section">
        {loading ? (
          <p className="pcm-loading">Loading...</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th></th>
                <th>Component</th>
                <th>Type</th>
                <th>Taxable</th>
                <th>Default</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {components.map((comp, i) => (
                <tr key={comp.id}>
                  <td>{i + 1}</td>
                  <td>{comp.ComponentName}</td>
                  <td>{comp.ComponentType}</td>
                  <td>{comp.IsTaxable ? 'Yes' : 'No'}</td>
                  <td>{comp.isDefault ? 'Yes' : 'No'}</td>
                  <td>
                    {!comp.isDefault && (
                      <>
                        <button onClick={() => handleEdit(i)} className="btn-action edit">Edit</button>
                        <button onClick={() => handleDelete(i)} className="btn-action delete">Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default PayComponentMaster;
