import React from 'react';

const DeclarationForm = ({
  form,
  proofs,
  handleChange,
  handleFileChange,
  handleSubmit,
  submitting,
  editingId,
  error
}) => (
  <form className="td-form" onSubmit={handleSubmit} encType="multipart/form-data">
    {['Basic Details', 'Rent Declaration', 'Investment under 80C', 'Medical Insurance (80D)'].map((title, idx) => (
      <section className="td-section" key={idx}>
        <h4>{title}</h4>
        <div className="td-grid">
          {idx === 0 && (
            <>
              <div className="td-input-group">
                <label>Fiscal Year</label>
                <select name="fiscalYear" value={form.fiscalYear} onChange={handleChange}>
                  <option value="2024-25">2024–25</option>
                  <option value="2025-26">2025–26</option>
                </select>
              </div>
              <div className="td-input-group">
                <label>HRA Received (₹)</label>
                <input type="text" name="hraReceived" value={form.hraReceived} onChange={handleChange} />
              </div>
            </>
          )}
          {idx === 1 && (
            <>
              <div className="td-input-group">
                <label>Rent Paid (₹)</label>
                <input type="text" name="rentPaid" value={form.rentPaid} onChange={handleChange} />
              </div>
              <div className="td-input-group">
                <label>Upload Rent Proof</label>
                <input type="file" name="rentProof" onChange={handleFileChange} />
              </div>
            </>
          )}
          {idx === 2 && (
            <>
              <div className="td-input-group">
                <label>Investment (₹)</label>
                <input type="text" name="investment80C" value={form.investment80C} onChange={handleChange} />
              </div>
              <div className="td-input-group">
                <label>Upload Investment Proof</label>
                <input type="file" name="investmentProof" onChange={handleFileChange} />
              </div>
            </>
          )}
          {idx === 3 && (
            <>
              <div className="td-input-group">
                <label>Premium (₹)</label>
                <input type="text" name="medicalInsurance" value={form.medicalInsurance} onChange={handleChange} />
              </div>
              <div className="td-input-group">
                <label>Upload Insurance Proof</label>
                <input type="file" name="insuranceProof" onChange={handleFileChange} />
              </div>
            </>
          )}
        </div>
      </section>
    ))}

    {error && <div className="td-error">{error}</div>}

    <div className="td-submit-container">
      <button type="submit" className="td-btn" disabled={submitting}>
        {submitting ? 'Submitting...' : editingId ? 'Update Declaration' : 'Submit Declaration'}
      </button>
    </div>
  </form>
);

export default DeclarationForm;
