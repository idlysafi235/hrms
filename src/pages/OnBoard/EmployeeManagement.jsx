// src/pages/OnBoard/EmployeeManagement.jsx
import React, { useEffect, useState } from 'react';
import './EmployeeManagement.css';
import { getAllEmployees, updateEmployee } from '../../api/employee';
import { getToken } from '../../utils/auth';
import EmployeeEditModal from '../../components/Modals/EmployeeEditModal';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({});
  const [originalData, setOriginalData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const res = await getAllEmployees(token);
      setEmployees(res);
    } catch (err) {
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setFormData({ ...employee });
    setOriginalData({ ...employee }); 
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getModifiedFields = (original, updated) => {
    const changes = {};
    for (const key in updated) {
      if (updated[key] !== original[key]) {
        changes[key] = updated[key];
      }
    }
    return changes;
  };

  const handleSave = async () => {
    const updatedFields = getModifiedFields(originalData, formData);

    if (Object.keys(updatedFields).length === 0) {
      alert("No changes made.");
      return;
    }

    try {
      setSaving(true);
      const token = getToken();
      await updateEmployee(token, formData.id, updatedFields);
      setEditingEmployee(null);
      fetchEmployees(); 
    } catch (error) {
      console.error('Failed to update employee:', error.message);
      alert(`Error updating employee: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingEmployee(null);
  };

  return (
    <div className="employee-management">
      {loading ? (
        <p>Loading employees...</p>
      ) : (
        <div className="employee-card-list">
          {employees.map((emp) => (
            <div className="employee-card" key={emp.id}>
              <div className="edit-icon" onClick={() => handleEdit(emp)}>✏️</div>
              <img
                className="employee-avatar"
                src={emp.profileImageUrl || '/default-avatar.png'}
                alt="Profile"
              />
              <div className="employee-info">
                <p><strong>ID:</strong> {emp.employeeId}</p>
                <p><strong>Employee Name:</strong> {emp.fullName}</p>
                <p><strong>Email:</strong> {emp.email}</p>
                <p><strong>Position:</strong> {emp.position}</p>
                <p><strong>Manager:</strong> {emp.reportingManagerName || 'Not Assigned'}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingEmployee && (
        <EmployeeEditModal
          formData={formData}
          onChange={handleChange}
          onSave={handleSave}
          onCancel={handleCancel}
          isSaving={saving}
        />
      )}
    </div>
  );
};

export default EmployeeManagement;
