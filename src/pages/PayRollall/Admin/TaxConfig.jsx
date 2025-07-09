import React, { useEffect, useState } from 'react';
import {
  fetchTaxConfigs,
  createTaxConfig,
  deleteTaxConfig,
  fetchTaxSlabs,
  createTaxSlabs,
  deleteTaxSlabs,
 } from '../../../api/taxService';
import { getToken } from '../../../utils/auth';
import { Edit, X, XIcon } from 'lucide-react';

const TaxConfig= () => {
  const [configs, setConfigs] = useState([]);
  const [slabs, setSlabs] = useState([]);
  const [newConfig, setNewConfig] = useState({
    taxRegime: 'old',
    financialYear: '',
    standardDeduction: '',
    rebateThreshold: '',
    rebateAmount: ''
  });
  const [newSlabs,setNewSlabs] = useState({
    taxRegime: 'old',
    financialYear: '',
    slabFrom: '',
    slabTo: '',
    taxrate:'',
    surchargeApplicable:'',
    effectiveDate:'',
  })
  const [message, setMessage] = useState('');
  const token = getToken();

  const loadConfigs = async () => {
    try {
      const data = await fetchTaxConfigs(token);
      const slabdata = await fetchTaxSlabs(token);
      setConfigs(data);
      setSlabs(slabdata);
      setMessage('');
    } catch (err) {
      setMessage(' Failed to load tax '.err);
    }
  };

  useEffect(() => {
    loadConfigs();
  }, []);

  const handleChange = (e) => {
    setNewConfig({ ...newConfig, [e.target.name]: e.target.value });
    setNewSlabs({...newSlabs,[e.target.name]: e.target.value});
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

  const handleCreateSlabs = async () => {
    try {
      await createTaxSlabs(token, newSlabs);
      setMessage(' Tax Slabs saved.');
      setNewSlabs({
        taxRegime: 'old',
        financialYear: '',
        slabFrom: '',
        slabTo: '',
        taxRate: '',
        surchargeApplicable:'',
        effectiveDate:'',
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
        <input name="standardDeduction" type="text" placeholder="Standard Deduction" value={newConfig.standardDeduction} onChange={handleChange} />
        <input name="rebateThreshold" type="text" placeholder="Rebate Threshold" value={newConfig.rebateThreshold} onChange={handleChange} />
        <input name="rebateAmount" type="text" placeholder="Rebate Amount" value={newConfig.rebateAmount} onChange={handleChange} />
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
              <button
              className="action-btn approve"
              onClick={() => handleDecision( "Approved")}
              >
              <Edit size={16} />
              </button>
                <button className="action-btn reject" onClick={() => handleDelete(c.configId)}>
                <XIcon size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>


      <div className="tax-form">
        <h4>Add New Tax Slabs</h4>
        <select name="taxRegime" value={newSlabs.taxRegime} onChange={handleChange}>
          <option value="old">Old Regime</option>
          <option value="new">New Regime</option>
        </select>
        <input name="financialYear" placeholder="2024-25" value={newSlabs.financialYear} onChange={handleChange} />
        <input name="slabFrom" type="text" placeholder="Slab From" value={newSlabs.slabFrom} onChange={handleChange} />
        <input name="slabTo" type="text" placeholder="Slab To" value={newSlabs.slabTo} onChange={handleChange} />
        <input name="taxRate" type="text" placeholder="Tax rate" value={newSlabs.taxrate} onChange={handleChange} />
        <input name="Surcharge" type="text" placeholder="Surrcharge Applicable" value={newSlabs.surchargeApplicable} onChange={handleChange} />
        <input name="effectiveDate" type="calendar" placeholder="Effective Date" value={newSlabs.effectiveDate} onChange={handleChange} />
        <button onClick={handleCreateSlabs}>Save</button>
      </div>
      
      <div className="table-container">
      <h3>Existing Tax Slabs</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Year</th>
            <th>Regime</th>
            <th>Slab From</th>
            <th>Slab To</th>
            <th>Tax Rate</th>
            <th>Surrcharge Applicable</th>
            <th>Effective Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {slabs.map((s) => (
            <tr key={s.slabId}>
              <td>{s.financialYear}</td>
              <td>{s.taxRegime}</td>
              <td>{s.slabFrom}</td>
              <td>{s.slabTo}</td>
              <td>{s.taxRate}</td>
              <td>{s.surchargeApplicable}</td>
              <td>{s.effectiveDate}</td>
              <td>
              <button
              className="action-btn approve"
              onClick={() => handleDecision( "Approved")}
              >
              <Edit size={16} />
              </button>
                <button className="action-btn reject" onClick={() => handleDelete(e.slabId)}>
                <XIcon size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}

export default TaxConfig;