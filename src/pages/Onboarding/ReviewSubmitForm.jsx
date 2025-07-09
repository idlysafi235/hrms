import React from 'react';
import PropTypes from 'prop-types';
import './ReviewSubmitForm.css';

const ReviewSubmitForm = ({ data, onSubmit, onEdit }) => {
  if (!data) {
    return <p>Loading data...</p>; 
  }

  return (
    <section className="form-section" aria-label="Review and Submit Form">
      <h2 className="form-title">Review Your Details</h2>

      <div className="review-section">
        <h3>Experience</h3>
        {data.experience && data.experience.length > 0 ? (
          data.experience.map((exp, i) => (
            <div key={i} className="review-block">
              <p><strong>Company:</strong> {exp.company}</p>
              <p><strong>Role:</strong> {exp.role}</p>
              <p>
                <strong>Years:</strong> {exp.startYear} - {exp.endYear}
              </p>
              <p><strong>Description:</strong> {exp.description}</p>
              {exp.documents && exp.documents.length > 0 && (
                <>
                  <strong>Documents:</strong>
                  <ul>
                    {exp.documents.map((doc, idx) => (
                      <li key={idx}>{doc.name}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          ))
        ) : (
          <p>No experience data provided.</p>
        )}

        <h3>Skills & Certificates</h3>
        {data.skills || data.certNames ? (
          <div className="review-block">
            {data.skills && <p><strong>Skills:</strong> {data.skills}</p>}
            {data.certNames && <p><strong>Certificates:</strong> {data.certNames}</p>}
            {data.certificates && data.certificates.length > 0 && (
              <>
                <strong>Uploaded Certificates:</strong>
                <ul>
                  {data.certificates.map((file, i) => (
                    <li key={i}>{file.name}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        ) : (
          <p>No skills or certificates data provided.</p>
        )}

        <h3>Bank Details</h3>
        {data.bankDetails ? (
          <div className="review-block">
            <p><strong>Account Holder Name:</strong> {data.bankDetails.accountHolderName}</p>
            <p><strong>Account Number:</strong> {data.bankDetails.accountNumber}</p>
            <p><strong>Bank Name:</strong> {data.bankDetails.bankName}</p>
            <p><strong>IFSC Code:</strong> {data.bankDetails.ifscCode}</p>
            <p><strong>Branch:</strong> {data.bankDetails.branch}</p>
          </div>
        ) : (
          <p>No bank details provided.</p>
        )}
      </div>

      <div className="form-button-container">
        <button
          type="button"
          className="edit-button"
          onClick={() => onEdit && onEdit()}
        >
          Edit
        </button>

        <button
          type="button"
          className="submit-button"
          onClick={() => onSubmit && onSubmit()}
        >
          Submit
        </button>
      </div>
    </section>
  );
};

ReviewSubmitForm.propTypes = {
  data: PropTypes.object,
  onSubmit: PropTypes.func,
  onEdit: PropTypes.func,
};

export default ReviewSubmitForm;
