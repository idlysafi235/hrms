import React, { useEffect, useState } from 'react';
import { fetchTaxConfigs, createTaxConfig, deleteTaxConfig } from '../../../api/taxService';
import './TaxSetup.css';
import { getToken } from '../../../utils/auth';

export default function TaxSetup() {
  const [configs, setConfigs] = useState([]);
  const [newConfig, setNewConfig] = useState({
    taxRegime: 'old',
    financialYear: '',
    standardDeduction: '',
    rebateThreshold: '',
    rebateAmount: ''
  });
  const [message, setMessage] = useState('');
  const token = getToken();

  const loadConfigs = async () => {
    try {
      const data = await fetchTaxConfigs(token);
      setConfigs(data);
      setMessage('');
    } catch (err) {
      setMessage(' Failed to load tax configs');
    }
  };

  useEffect(() => {
    loadConfigs();
  }, []);

  const handleChange = (e) => {
    setNewConfig({ ...newConfig, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    try {
      await createTaxConfig(token, newConfig);
      setMessage(' Tax configuration saved.');
      setNewConfig({
        taxRegime: 'old',
        financialYear: '',
        standardDeduction: 50000,
        rebateThreshold: 500000,
        rebateAmount: 12500
      });
      loadConfigs();
    } catch (err) {
      setMessage(' Failed to create configuration.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTaxConfig(token, id);
      setMessage(' Tax config deleted.');
      loadConfigs();
    } catch {
      setMessage(' Failed to delete configuration.');
    }
  };

  return (
    <div className="tax-setup-container">
     
      <div className="tax-form">
        <h4>Add New Tax Configuration</h4>
        <input name="financialYear" placeholder="2024-25" value={newConfig.financialYear} onChange={handleChange} />
        <select name="taxRegime" value={newConfig.taxRegime} onChange={handleChange}>
          <option value="old">Old Regime</option>
          <option value="new">New Regime</option>
        </select>
        <input name="standardDeduction" type="number" placeholder="Standard Deduction" value={newConfig.standardDeduction} onChange={handleChange} />
        <input name="rebateThreshold" type="number" placeholder="Rebate Threshold" value={newConfig.rebateThreshold} onChange={handleChange} />
        <input name="rebateAmount" type="number" placeholder="Rebate Amount" value={newConfig.rebateAmount} onChange={handleChange} />
        <button onClick={handleCreate}>Save</button>
      </div>

      {message && <p className="message">{message}</p>}

      <div className="table-container">
      <h3>Existing Configurations</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Year</th>
            <th>Regime</th>
            <th>Std Deduction</th>
            <th>Rebate Threshold</th>
            <th>Rebate Amount</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {configs.map((c) => (
            <tr key={c.configId}>
              <td>{c.financialYear}</td>
              <td>{c.taxRegime}</td>
              <td>{c.standardDeduction}</td>
              <td>{c.rebateThreshold}</td>
              <td>{c.rebateAmount}</td>
              <td>
                <button className="delete-btn" onClick={() => handleDelete(c.configId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
}
