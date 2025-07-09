import React, { useEffect, useState } from 'react';
import {
  fetchAllSalaryStructures,
  deleteSalaryStructure,
  createSalaryStructure,
  updateSalaryStructure,
} from '../../../api/salaryStructureApi';
import { getToken } from '../../../utils/auth';
import { notifyError, notifySuccess } from '../../../components/Toast/ToastProvider';
import './SalaryStructure.css';

const SalaryStructure = () => {
  const [structures, setStructures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: '',
    effectiveFrom: '',
    ctc: '',
    variablepay: '',
  });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({
      id: null, 
      employeeId: '',
      effectiveFrom: '',
      ctc: '',
      variablepay: '',
    });

  const token = getToken();

  const loadSalaryStructures = async () => {
    try {
      setLoading(true);
      const data = await fetchAllSalaryStructures(token);
      setStructures(data);
    } catch (err) {
      notifyError(err?.message || 'Failed to load salary structures');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;

    try {
      await deleteSalaryStructure(token, id);
      notifySuccess('Salary structure deleted successfully');
      await loadSalaryStructures();
    } catch (err) {
      notifyError(err?.message || 'Failed to delete salary structure');
    }
  };

  const handleEditClick = (s) => {
    setEditData({
      id:s.id,
      employeeId: s.employeeId,
      fullName: s.fullName,
      ctc: s.ctc || "",
    });
    setEditModalOpen(true);
  };

  const handleEditSave = async () => {
      if (!editData.ctc.trim()) {
        alert("CTC cannot be empty.");
        return;
      }
      if (!editData.id) {
        alert("Invalid employee ID.");
        return;
      }
      setSaving(true);
      try {
        const token = getToken();
        await updateSalaryStructure(token, editData.id, {
          ctc: editData.ctc.trim(),
        });
        await fetchAllSalaryStructures();
        setEditModalOpen(false);
      } catch (error) {
        console.error("Error updating employee:", error);
        alert(error.message || "Failed to update employee.");
      } finally {
        setSaving(false);
      }
    };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.employeeId || !formData.effectiveFrom || !formData.ctc) {
      notifyError('Employee ID, Effective Date, and CTC are required');
      return;
    }

    const payload = {
      employeeId: formData.employeeId.trim(),
      effectiveFrom: formData.effectiveFrom,
      ctc: parseFloat(formData.ctc),
      variablePay: parseFloat(formData.variablepay || '0'),
    };

    try {
      const result = await createSalaryStructure(token, payload);

      if (result?.success) {
        notifySuccess(result.message || 'Salary structure created successfully');
        setFormData({
          employeeId: '',
          effectiveFrom: '',
          ctc: '',
          variablepay: '',
        });
        await loadSalaryStructures();
      } else {
        notifyError(result?.message || 'Failed to create salary structure');
      }
    } catch (err) {
      if (err?.message) {
        notifyError(`Error: ${err.message}`);
      } else {
        notifyError('Something went wrong while creating salary structure');
      }
    }
  };

  useEffect(() => {
    if (token) {
      loadSalaryStructures();
    }
  }, [token]);

  return (
    <div className="salary-structure">
      <h2>Employee Salary Structures</h2>

      {/* Add Form */}
      <form className="salary-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="employeeId"
          placeholder="Employee ID"
          value={formData.employeeId}
          onChange={handleChange}
        />
        <input
          type="date"
          name="effectiveFrom"
          value={formData.effectiveFrom}
          onChange={handleChange}
        />
        <input
          type="number"
          name="ctc"
          placeholder="CTC"
          value={formData.ctc}
          onChange={handleChange}
        />
        <input
          type="number"
          name="variablepay"
          placeholder="Variable Pay"
          value={formData.variablepay}
          onChange={handleChange}
        />
        <button type="submit">Add</button>
      </form>

      {loading ? (
        <p>Loading salary structures...</p>
      ) : (
        <div className="card-container">
          {structures.length > 0 ? (
            structures.map((s) => (
              <div className="salary-card" key={s.id}>
                <div className="card-header">
                  <strong>Employee ID:</strong> {s.employeeId}
                  <span className="date">
                    {new Date(s.effectiveFrom).toLocaleDateString()}
                  </span>
                </div>
                <div className="card-body">
                  <div><strong>CTC:</strong> ₹{s.ctc}</div>
                  <div><strong>Basic:</strong> ₹{s.basic}</div>
                  <div><strong>HRA:</strong> ₹{s.hra}</div>
                  <div><strong>Special Allowance:</strong> ₹{s.specialAllowance}</div>
                  <div><strong>Medical Allowance:</strong> ₹{s.medicalAllowance}</div>
                  <div><strong>Conveyance:</strong> ₹{s.conveyanceAllowance}</div>
                  <div><strong>LTA:</strong> ₹{s.leavetravelAssistance}</div>
                  <div><strong>Phone/Internet:</strong> ₹{s.phoneinternetReimbursment}</div>
                  <div><strong>Food:</strong> ₹{s.foodReimbursment}</div>
                  <div><strong>PF:</strong> ₹{s.pf}</div>
                  <div><strong>Variable Pay:</strong> ₹{s.variablePay}</div>
                  <div><strong>Active:</strong> {s.isActive ? 'Yes' : 'No'}</div>
                </div>
                <div className="card-footer">
                <button onClick={() => handleEditClick(s.id)}>Edit</button>
                  <button onClick={() => handleDelete(s.id)}>Delete</button>
                </div>
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center' }}>No salary structures found.</p>
          )}
        </div>
      )}

       {editModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Salary Structure</h3>

            <div className="modal-field">
              <label>Employee ID:</label>
              <input
                type="text"
                value={editData.employeeId}
                readOnly
              />
            </div>

            <div className="modal-field">
              <label>Name:</label>
              <input
                type="text"
                value={editData.fullName}
                readOnly
              />
            </div>

            <div className="modal-field">
              <label>CTC:</label>
              <input
                type="text"
                value={editData.ctc}
                onChange={(e) =>
                  setEditData({ ...editData, ctc: e.target.value })
                }
                placeholder="Enter CTC"
              />
            </div>
            <div className="modal-field">
              <label>Variable Pay:</label>
              <input
                type="text"
                value={editData.variablepay}
                onChange={(e) =>
                  setEditData({ ...editData, variablepay: e.target.value })
                }
                placeholder="Enter Variable Pay"
              />
            </div>

            <div className="modal-actions">
              <button onClick={handleEditSave} disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => {
                  setEditModalOpen(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalaryStructure;
