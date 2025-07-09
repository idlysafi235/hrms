import React, { useState, useEffect } from 'react';
import './NewEmployee.css';
import { createEmployee } from '../../api/onboard';
import { getToken } from '../../utils/auth';

const NewEmployee = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    phone: '',
    dateOfJoining: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    role: '',
    department: '',
    position: '',
    employmentType: '',
  });

  const [roleOptions, setRoleOptions] = useState([]);

  useEffect(() => {
    const rawRoles = localStorage.getItem('role');
    const userRoles = rawRoles ? JSON.parse(rawRoles) : [];

    if (userRoles.includes('Admin')) {
      setRoleOptions(['Admin', 'HR', 'Manager', 'Employee']);
    } else if (userRoles.includes('HR')) {
      setRoleOptions(['HR', 'Manager', 'Employee']);
    } else {
      setRoleOptions(['Employee']);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = getToken();

      if (!token) {
        alert('User not authenticated');
        return;
      }

      await createEmployee(formData, token);
      alert('Employee onboarded successfully!');

      setFormData({
        firstName: '',
        middleName: '',
        lastName: '',
        phone: '',
        dateOfJoining: '',
        dateOfBirth: '',
        gender: '',
        bloodGroup: '',
        role: '',
        department: '',
        position: '',
        employmentType: '',
      });
    } catch (error) {
      console.error('Submission failed:', error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="new-employee__page">
      <form className="new-employee__form-grid" onSubmit={handleSubmit}>
        <div className="new-employee__form-group">
          <label>First Name</label>
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
        </div>

        <div className="new-employee__form-group">
          <label>Middle Name</label>
          <input type="text" name="middleName" value={formData.middleName} onChange={handleChange} />
        </div>

        <div className="new-employee__form-group">
          <label>Last Name</label>
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
        </div>

        <div className="new-employee__form-group">
          <label>Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={(e) => {
              const numericValue = e.target.value.replace(/\D/g, '');
              if (numericValue.length <= 10) {
                setFormData((prev) => ({ ...prev, phone: numericValue }));
              }
            }}
            required
            placeholder="Enter 10-digit number"
          />
        </div>

        <div className="new-employee__form-group">
          <label>Date of Joining</label>
          <input type="date" name="dateOfJoining" value={formData.dateOfJoining} onChange={handleChange} required />
        </div>

        <div className="new-employee__form-group">
          <label>Date of Birth</label>
          <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
        </div>

        <div className="new-employee__form-group">
          <label>Gender</label>
          <select name="gender" value={formData.gender} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="new-employee__form-group">
          <label>Role</label>
          <select name="role" value={formData.role} onChange={handleChange} required>
            <option value="">Select</option>
            {roleOptions.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>

        <div className="new-employee__form-group">
          <label>Department</label>
          <input type="text" name="department" value={formData.department} onChange={handleChange} required />
        </div>

        <div className="new-employee__form-group">
          <label>Position</label>
          <input type="text" name="position" value={formData.position} onChange={handleChange} required />
        </div>

        <div className="new-employee__form-group">
          <label>Employment Type</label>
          <select name="employmentType" value={formData.employmentType} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="Full Time">Full Time</option>
            <option value="Contract">Contract</option>
            <option value="Intern">Intern</option>
          </select>
        </div>

        <div className="new-employee__form-submit">
          <button type="submit">Add Employee</button>
        </div>
      </form>
    </div>
  );
};

export default NewEmployee;
