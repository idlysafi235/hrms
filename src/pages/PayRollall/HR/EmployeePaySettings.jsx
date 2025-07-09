import React, { useEffect, useState } from "react";
import { getAllEmployees, updateEmployee } from "../../../api/employee";
import { getToken } from "../../../utils/auth";
import { Edit2Icon } from "lucide-react";

const EmployeePaySettings = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({
    id: null, 
    employeeId: "",
    fullName: "",
    payType: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const res = await getAllEmployees(token);
      const sorted = [...res].sort((a, b) =>
        a.employeeId.toLowerCase().localeCompare(b.employeeId.toLowerCase())
      );
      setEmployees(sorted);
    } catch (err) {
      console.error("Error fetching employees:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (emp) => {
    setEditData({
      id: emp.id,
      employeeId: emp.employeeId,
      fullName: emp.fullName,
      payType: emp.payType || "",
    });
    setEditModalOpen(true);
  };

  const handleEditSave = async () => {
    if (!editData.payType.trim()) {
      alert("Pay Type cannot be empty.");
      return;
    }
    if (!editData.id) {
      alert("Invalid employee ID.");
      return;
    }
    setSaving(true);
    try {
      const token = getToken();
      await updateEmployee(token, editData.id, {
        payType: editData.payType.trim(),
      });
      await fetchEmployees();
      setEditModalOpen(false);
    } catch (error) {
      console.error("Error updating employee:", error);
      alert(error.message || "Failed to update employee.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="employee-pay-settings">
      <h2>Employee Pay Settings</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Pay Type</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.employeeId}</td>
                <td>{emp.fullName}</td>
                <td>{emp.payType}</td>
                <td>
                  <button
                    className="action-btn"
                    onClick={() => handleEditClick(emp)}
                  >
                    <Edit2Icon size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Pay Type</h3>

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
              <label>Pay Type:</label>
              <input
                type="text"
                value={editData.payType}
                onChange={(e) =>
                  setEditData({ ...editData, payType: e.target.value })
                }
                placeholder="Enter pay type"
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

export default EmployeePaySettings;
