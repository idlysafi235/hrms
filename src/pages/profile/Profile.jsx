import React, { useState } from 'react';
import './Profile.css';
import BasicDetails from './BasicDetails';
import EmergencyContacts from './EmergencyContacts';
import { ChevronDown } from 'lucide-react';

import AddressDetails from './Address';

const Profile = () => {
  const [expandedCard, setExpandedCard] = useState('basic');

  const toggleCard = (cardName) => {
    setExpandedCard((prev) => (prev === cardName ? null : cardName));
  };

  const renderAccordion = (title, name, Component) => (
    <div className="accordion-section">
      <div
        className={`accordion-header ${expandedCard === name ? 'expanded' : ''}`}
        onClick={() => toggleCard(name)}
      >
        <span>
          <ChevronDown />
        </span>
        <p className="accordion-title" style={{ margin: 0 }}>
          {title}
        </p>
      </div>
      <div className={`accordion-content ${expandedCard === name ? '' : 'collapsed'}`}>
        {expandedCard === name && <Component />}
      </div>
    </div>
  );

  return (
    <div className="profile-container">
      {renderAccordion('Personal Information', 'basic', BasicDetails)}
      {renderAccordion('Address', 'address', AddressDetails)}
      {renderAccordion('Emergency Contacts', 'emergency', EmergencyContacts)}
    </div>
  );
};

export default Profile;
