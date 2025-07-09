import React, { useEffect, useState } from 'react';
import './EmployeeManagement.css';
import { getAllEmployees, updateEmployee } from '../../api/employee';
import { getToken } from '../../utils/auth';
import EmployeeEditModal from '../../components/Modals/EmployeeEditModal';
import { CheckCheckIcon, CopyIcon, EditIcon, ChevronDown } from 'lucide-react';
import EmployeeFilters from '../../components/Employees/EmployeesFilters';
import { notifySuccess, notifyError } from '../../components/Toast/ToastProvider';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({});
  const [originalData, setOriginalData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState({});
  const [imageErrors, setImageErrors] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [departments, setDepartments] = useState([]);
  const [showInactive, setShowInactive] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const res = await getAllEmployees(token);
      // Sort by employeeId
      const sorted = [...res].sort((a, b) =>
        a.employeeId.toLowerCase().localeCompare(b.employeeId.toLowerCase())
      );
      // Normalize status to string
      const normalized = sorted.map(emp => ({
        ...emp,
        status: emp.status?.toString(),
      }));
      setEmployees(normalized);

      const uniqueDepartments = [
        ...new Set(
          res
            .map(emp => emp.department?.trim())
            .filter(dept => dept && dept.length > 0)
        ),
      ].sort();
      setDepartments(uniqueDepartments);
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

  const handleCopy = async (text, empId) => {
    if (!navigator.clipboard) {
      notifyError('Copy is not supported in this browser.');
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopied((prev) => ({ ...prev, [empId]: true }));
      setTimeout(() => {
        setCopied((prev) => ({ ...prev, [empId]: false }));
      }, 3000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      notifyError('Failed to copy.');
    }
  };

  const handleSave = async () => {
    const updatedFields = getModifiedFields(originalData, formData);
    if (Object.keys(updatedFields).length === 0) {
      notifyError('No changes made.');
      return;
    }
    try {
      setSaving(true);
      const token = getToken();
      await updateEmployee(token, formData.id, updatedFields);
      notifySuccess('Employee updated successfully!');
      setEditingEmployee(null);
      fetchEmployees();
    } catch (error) {
      console.error('Failed to update employee:', error);
      notifyError(`Error updating employee: ${error?.message || error}`);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingEmployee(null);
  };

  const activeEmployees = employees.filter((e) => e.status === '1');
  const inactiveEmployees = employees.filter((e) => e.status === '0');

  const filteredActive = activeEmployees.filter((emp) => {
    const matchesSearch =
      emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.fullName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDepartment =
      !departmentFilter || emp.department === departmentFilter;

    return matchesSearch && matchesDepartment;
  });

  const renderAvatar = (emp) => {
    let initials = 'U';
    if (emp.fullName) {
      const parts = emp.fullName.trim().split(' ');
      const first = parts[0]?.[0] || '';
      const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
      initials = (first + last).toUpperCase();
    }
    const hasImage = emp.profileImageUrl && !imageErrors[emp.id];
    if (hasImage) {
      return (
        <div className="profile-image">
          <img
            src={emp.profileImageUrl}
            alt="Profile"
            onError={() =>
              setImageErrors((prev) => ({ ...prev, [emp.id]: true }))
            }
          />
        </div>
      );
    }
    return (
      <div className="profile-image initials">
        <div className="icon-placeholder">
          <h1>{initials}</h1>
        </div>
      </div>
    );
  };

  const renderEmployeeCard = (emp) => (
    <div className="employee-card" key={emp.id}>
      <div className="flex top-card">
        {renderAvatar(emp)}
        <div className="employee-info">
          <p><span>ID:</span> <span>{emp.employeeId}</span></p>
          <p><span>Name:</span> <span>{emp.fullName}</span></p>
          <p><span>Position:</span> <span>{emp.position}</span></p>
          <p><span>Department:</span> <span>{emp.department}</span></p>
          <p><span>Phone:</span> <span>{emp.phone}</span></p>
          <p><span>Manager:</span> <span>{emp.reportingManagerName || 'Not Assigned'}</span></p>
        </div>
      </div>
      <div className="footer-card">
        <div className="employee-email">
          <span title={emp.email}>{emp.email}</span>
          <div className="copy-icon" title="Copy Email">
            <span
              className="copy-icon"
              onClick={() => handleCopy(emp.email, emp.id)}
            >
              {copied[emp.id] ? (
                <CheckCheckIcon size={14} />
              ) : (
                <CopyIcon size={14} />
              )}
            </span>
          </div>
        </div>
        <div className="card-edit-icon" onClick={() => handleEdit(emp)}>
          <EditIcon size={14} /> Edit
        </div>
      </div>
    </div>
  );

  return (
    <div className="employee-management">
      <EmployeeFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        departmentFilter={departmentFilter}
        setDepartmentFilter={setDepartmentFilter}
        departments={departments}
      />
      {loading ? (
        <p>Loading employees...</p>
      ) : (
        <>
          <div className="employee-card-list">
            {filteredActive.map(renderEmployeeCard)}
          </div>

          {/* Inactive Employees Accordion */}
          <div className="eaccordion-section">
            <div
              className={`eaccordion-header ${showInactive ? 'expanded' : ''}`}
              onClick={() => setShowInactive((prev) => !prev)}
            >
              <span><ChevronDown /></span>
              <p className="eaccordion-title" style={{ margin: 0 }}>
                Disabled ({inactiveEmployees.length})
              </p>
            </div>
            {showInactive && (
              <div className="eaccordion-content">
                {inactiveEmployees.map(renderEmployeeCard)}
              </div>
            )}
          </div>
        </>
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
