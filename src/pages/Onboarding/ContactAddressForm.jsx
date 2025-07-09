import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ContactAddressForm.css';

const ContactAddressForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    alternatePhone: '',

    permStreet: '',
    permCity: '',
    permState: '',
    permpin: '',
    permCountry: '',

    currStreet: '',
    currCity: '',
    currState: '',
    currpin: '',
    currCountry: '',

    copyAddress: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem('contactAddress');
    if (saved) {
      setFormData(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (formData.copyAddress) {
      setFormData((prev) => ({
        ...prev,
        currStreet: prev.permStreet,
        currCity: prev.permCity,
        currState: prev.permState,
        currpin: prev.permpin,
        currCountry: prev.permCountry,
      }));
    }
  }, [
    formData.copyAddress,
    formData.permStreet,
    formData.permCity,
    formData.permState,
    formData.permpin,
    formData.permCountry,
  ]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const isFormComplete =
    formData.email.trim() !== '' &&
    formData.phone.trim() !== '' &&
    formData.alternatePhone.trim() !== '' &&
    formData.permStreet.trim() !== '' &&
    formData.permCity.trim() !== '' &&
    formData.permState.trim() !== '' &&
    formData.permpin.trim() !== '' &&
    formData.permCountry.trim() !== '' &&
    formData.currStreet.trim() !== '' &&
    formData.currCity.trim() !== '' &&
    formData.currState.trim() !== '' &&
    formData.currpin.trim() !== '' &&
    formData.currCountry.trim() !== '';

  useEffect(() => {
    localStorage.setItem('contactAddress', JSON.stringify(formData));
  }, [formData]);

  const handleNext = () => {
    if (isFormComplete) {
      navigate('/onboarding/education');
    }
  };

  return (
    <div className="page-container">
      <h2>Contact Details</h2>
      <div className="form-row three-columns">
        <div>
          <label>Personal Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </div>
        <div>
          <label>Phone Number</label>
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
        </div>
        <div>
          <label>Alternate Phone Number</label>
          <input
            type="text"
            name="alternatePhone"
            value={formData.alternatePhone}
            onChange={handleChange}
          />
        </div>
      </div>

      <h2>Permanent Address</h2>
      <div className="form-row three-columns">
        <div>
          <label>Street Address</label>
          <input type="text" name="permStreet" value={formData.permStreet} onChange={handleChange} />
        </div>
        <div>
          <label>City</label>
          <input type="text" name="permCity" value={formData.permCity} onChange={handleChange} />
        </div>
        <div>
          <label>State/Province</label>
          <input type="text" name="permState" value={formData.permState} onChange={handleChange} />
        </div>
      </div>
      <div className="form-row three-columns">
        <div>
          <label>pin/Postal Code</label>
          <input type="text" name="permpin" value={formData.permpin} onChange={handleChange} />
        </div>
        <div>
          <label>Country</label>
          <input type="text" name="permCountry" value={formData.permCountry} onChange={handleChange} />
        </div>
        <div></div>
      </div>

      <div className="form-row checkbox-row">
        <input
          type="checkbox"
          id="copyAddress"
          name="copyAddress"
          checked={formData.copyAddress}
          onChange={handleChange}
        />
        <label htmlFor="copyAddress">Current address same as permanent address</label>
      </div>

      <h2>Current Address</h2>
      <div className="form-row three-columns">
        <div>
          <label>Street Address</label>
          <input
            type="text"
            name="currStreet"
            value={formData.currStreet}
            onChange={handleChange}
            disabled={formData.copyAddress}
          />
        </div>
        <div>
          <label>City</label>
          <input
            type="text"
            name="currCity"
            value={formData.currCity}
            onChange={handleChange}
            disabled={formData.copyAddress}
          />
        </div>
        <div>
          <label>State/Province</label>
          <input
            type="text"
            name="currState"
            value={formData.currState}
            onChange={handleChange}
            disabled={formData.copyAddress}
          />
        </div>
      </div>
      <div className="form-row three-columns">
        <div>
          <label>pin/Postal Code</label>
          <input
            type="text"
            name="currpin"
            value={formData.currpin}
            onChange={handleChange}
            disabled={formData.copyAddress}
          />
        </div>
        <div>
          <label>Country</label>
          <input
            type="text"
            name="currCountry"
            value={formData.currCountry}
            onChange={handleChange}
            disabled={formData.copyAddress}
          />
        </div>
        <div></div>
      </div>

      <div className="form-button-container">
        <button
          className={`next-button ${isFormComplete ? 'enabled' : 'disabled'}`}
          disabled={!isFormComplete}
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ContactAddressForm;
