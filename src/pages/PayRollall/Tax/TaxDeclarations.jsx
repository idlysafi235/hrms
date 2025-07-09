import React, { useEffect, useState } from 'react';
import './TaxDeclarationsStyles.css';
import { getToken } from '../../../utils/auth';
import { fetchProfile, updateProfile } from '../../../api/profile';

import {
  createDeclaration,
  getMyDeclarations,
  updateDeclaration,
  deleteDeclaration,
} from '../../../api/investmentDeclarationsApi';

import DeclarationForm from '../../../components/TaxDeclaration/DeclarationForm';
import DeclarationTable from '../../../components/TaxDeclaration/DeclarationTable';
import EditModal from '../../../components/TaxDeclaration/EditModal';
import { notifySuccess, notifyError } from '../../../components/Toast/ToastProvider';

const TaxDeclarations = () => {
  const [form, setForm] = useState({
    fiscalYear: '',
    hraReceived: '',
    rentPaid: '',
    investment80C: '',
    medicalInsurance: ''
  });

  const [proofs, setProofs] = useState({
    rentProof: null,
    investmentProof: null,
    insuranceProof: null
  });

  const [declarations, setDeclarations] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [regime, setRegime] = useState('');
  const [regimeSelection, setRegimeSelection] = useState('');
  const [initDone, setInitDone] = useState(false); 

  const token = getToken();

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      const profile = await fetchProfile(token);
      if (profile && profile.taxRegime) {
        console.log('[INIT] Found taxRegime:', profile.taxRegime);
        setRegime(profile.taxRegime);
        setRegimeSelection(profile.taxRegime);

        if (profile.taxRegime === 'old') {
          await fetchDeclarations();
        }
      }
    } catch (err) {
      notifyError('Error fetching profile', err.message);
    } finally {
      setInitDone(true); 
    }
  };

  const fetchDeclarations = async () => {
    try {
      const data = await getMyDeclarations(token);
      setDeclarations(data);
    } catch (err) {
      notifyError(err.message || 'Failed to fetch declarations');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setProofs(prev => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => formData.append(key, val));
      Object.entries(proofs).forEach(([key, file]) => {
        if (file) formData.append(key, file);
      });

      if (editingId) {
        await updateDeclaration(editingId, formData, token);
        setEditingId(null);
        setShowModal(false);
      } else {
        await createDeclaration(formData, token);
      }

      await fetchDeclarations();

      setForm({
        fiscalYear: '',
        hraReceived: '',
        rentPaid: '',
        investment80C: '',
        medicalInsurance: ''
      });

      setProofs({
        rentProof: null,
        investmentProof: null,
        insuranceProof: null
      });
    } catch (err) {
      notifyError(err.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (dec) => {
    setEditingId(dec.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this declaration?')) {
      try {
        await deleteDeclaration(id, token);
        await fetchDeclarations();
      } catch (err) {
        notifyError('Delete failed', err.message);
      }
    }
  };

  const handleModalUpdate = async (id, formData) => {
    try {
      await updateDeclaration(id, formData, token);
      await fetchDeclarations();
    } catch (err) {
      notifyError('Update failed in modal', err.message);
    }
  };

  const handleRegimeSave = async () => {
    try {
      const payload = { taxRegime: regimeSelection };
      await updateProfile(token, payload);
      setRegime(regimeSelection);

      if (regimeSelection === 'old') {
        await fetchDeclarations();
      }

      notifySuccess('Tax regime saved successfully.');
    } catch (err) {
      notifyError('Error updating tax regime:', err.message);
    }
  };

  const selectedDeclaration = declarations.find(d => d.id === editingId);

  if (!initDone) {
    return <div className="td-loading">Loading tax information...</div>;
  }

  return (
    <div className="td-wrapper">
      <h2 className="td-header">Tax Declaration Portal</h2>

      {!regime && (
        <div className="td-select-regime">
          <label htmlFor="regimeDropdown">Select your tax regime:</label>
          <select
            id="regimeDropdown"
            value={regimeSelection}
            onChange={(e) => setRegimeSelection(e.target.value)}
          >
            <option value="">-- Select Regime --</option>
            <option value="old">Old Regime</option>
            <option value="new">New Regime</option>
          </select>
          <button
            onClick={handleRegimeSave}
            disabled={!regimeSelection}
            className="td-button save"
          >
            Save
          </button>
        </div>
      )}

      {regime === 'new' && (
        <div className="td-new-regime-msg">
          <p>
            <strong>Tax regime Details has been Saved</strong> 
          </p>
        </div>
      )}

      {regime === 'old' && (
        <>
          <DeclarationForm
            form={form}
            proofs={proofs}
            handleChange={handleChange}
            handleFileChange={handleFileChange}
            handleSubmit={handleSubmit}
            submitting={submitting}
            editingId={editingId}
            error={error}
          />

          <DeclarationTable
            declarations={declarations}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />

          {showModal && selectedDeclaration && (
            <EditModal
              declaration={selectedDeclaration}
              onClose={() => {
                setShowModal(false);
                setEditingId(null);
              }}
              onUpdate={handleModalUpdate}
            />
          )}
        </>
      )}
    </div>
  );
};

export default TaxDeclarations;
