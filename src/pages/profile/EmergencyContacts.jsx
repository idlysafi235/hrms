import React, { useState, useEffect } from 'react';
import './EmergencyContacts.css';
import { fetchEmergencyContacts } from '../../api/profile';
import AddEmergencyContactModal from '../../components/Modals/AddEmergencyContactModal';
import { getToken } from '../../utils/auth';
import { Edit2Icon } from 'lucide-react';

const EmergencyContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  const loadContacts = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      if (!token) throw new Error('User not authenticated.');
      const data = await fetchEmergencyContacts(token);
      setContacts(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load emergency contacts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const handleAddClick = () => {
    setSelectedContact(null);
    setShowModal(true);
  };

  const handleEditClick = (contact) => {
    setSelectedContact(contact);
    setShowModal(true);
  };

  const handleModalClose = (savedContact = null) => {
    setShowModal(false);
    setSelectedContact(null);

    if (!savedContact) return;

    setContacts((prev) => {
      const index = prev.findIndex((c) => c.id === savedContact.id);
      if (index !== -1) {
        const updated = [...prev];
        updated[index] = savedContact;
        return updated;
      } else {
        return [...prev, savedContact];
      }
    });
  };

  if (loading) return <div aria-live="polite">Loading emergency contacts...</div>;
  if (error) return <div role="alert" className="error-msg">Error: {error}</div>;

  return (
    <div className="emergency-contacts">
      {contacts.length === 0 ? (
        <div className="no-contacts-header">
          <p>No emergency contacts found.</p>
          <button className="add-btn" onClick={handleAddClick}>
            + Add
          </button>
        </div>
      ) : (
        <>
          {contacts.length <= 1 && (
            <div className="add-btn-wrapper">
              <button className="add-btn" onClick={handleAddClick}>
                + Add
              </button>
            </div>
          )}
          <div className="contacts-grid">
            {contacts.map((contact) => (
              <div className="contact-card" key={contact.id}>
                <span className="edit-icon-1" onClick={() => handleEditClick(contact)}>
                  <Edit2Icon size={16} />
                  Edit
                </span>
                <p><strong>Name:</strong> {contact.name}</p>
                <p><strong>Relation:</strong> {contact.relationship}</p>
                <p><strong>Phone:</strong> {contact.phone}</p>
                <p><strong>Email:</strong> {contact.email}</p>
                <p><strong>Address:</strong> {contact.address}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {showModal && (
        <AddEmergencyContactModal onClose={handleModalClose} contact={selectedContact} />
      )}
    </div>
  );
};

export default EmergencyContacts;
