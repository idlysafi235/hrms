import React, { useState, useEffect } from 'react';
import './AddEmergencyContactModal.css';
import { updateEmergencyContact, addEmergencyContact } from '../../api/profile';
import { XIcon } from 'lucide-react';
import { notifySuccess, notifyError } from '../Toast/ToastProvider';
import { getToken } from "../../utils/auth";

const relationshipOptions = ['Father', 'Mother', 'Sister', 'Brother', 'Others'];

const AddEmergencyContactModal = ({ onClose, contact }) => {
  const [formData, setFormData] = useState({
    name: '',
    relationship: '',
    phone: '',
    email: '',
    address: '',
  });

  useEffect(() => {
    if (contact) {
      setFormData({
        name: contact.name || '',
        relationship: contact.relationship || '',
        phone: contact.phone || '',
        email: contact.email || '',
        address: contact.address || '',
      });
    }
  }, [contact]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length > 10) return;
      setFormData((prev) => ({ ...prev, phone: digitsOnly }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const token = getToken();

    if (!token) {
      alert('User not authenticated');
      return;
    }

    if (formData.phone.length !== 10) {
      alert('Phone number must be exactly 10 digits');
      return;
    }

    try {
      let savedContact;
      if (contact) {
        const res = await updateEmergencyContact(token, contact.id, formData);
        savedContact = { ...contact, ...formData };
        notifySuccess(res.message || 'Contact updated successfully');
      } else {
        const res = await addEmergencyContact(token, formData);
        savedContact = res.contact || res.data || formData; 
        notifySuccess(res.message || 'Contact added successfully');
      }

      onClose(savedContact);
    } catch (error) {
      notifyError(error.message || 'Failed to save emergency contact');
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content-1">
        <div className="modal-header flex flex-row justify-between align-center w-full">
          <p className="modal-title-1">{contact ? 'Edit' : 'Add'} Emergency Contact</p>
          <button
            type="button"
            className="close-btn-2 flex items-center gap-2 "
            onClick={() => onClose(null)}
          >
            Close <XIcon size={12} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-form-1">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <select
              name="relationship"
              value={formData.relationship}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select Relationship</option>
              {relationshipOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              maxLength={10}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email (Optional)"
              value={formData.email}
              onChange={handleChange}
            />
            <textarea
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              required
            />
          </div>
          <div className="modal-actions-1">
            <button type="submit" className="submit-btn max-w-1/4">
              {contact ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmergencyContactModal;
