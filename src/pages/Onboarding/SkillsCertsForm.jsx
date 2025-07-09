import React, { useState } from 'react';
import './SkillsCertsForm.css';

const SkillsCertsForm = () => {
  const [skills, setSkills] = useState('');
  const [certificates, setCertificates] = useState([]);
  const [certNames, setCertNames] = useState('');

  const handleSkillsChange = (e) => {
    setSkills(e.target.value);
  };

  const handleCertNamesChange = (e) => {
    setCertNames(e.target.value);
  };

  const handleCertFilesChange = (e) => {
    setCertificates(Array.from(e.target.files));
  };

  const handleNext = () => {
    console.log('Skills:', skills);
    console.log('Certificates:', certNames);
    console.log('Uploaded Files:', certificates);
    alert('Next clicked! Check console for data.');
  };

  return (
    <section className="form-section" aria-label="Skills and Certificates Form">
      <h2 className="form-title">Skills & Certificates</h2>

      <div className="form-row">
        <label htmlFor="skills-input">Skills (comma separated)</label>
        <input
          id="skills-input"
          type="text"
          placeholder="e.g. JavaScript, React, Node.js"
          value={skills}
          onChange={handleSkillsChange}
          autoComplete="off"
        />
      </div>

      <div className="form-row">
        <label htmlFor="cert-names-input">Certificate Names (comma separated)</label>
        <input
          id="cert-names-input"
          type="text"
          placeholder="e.g. AWS Certified, PMP"
          value={certNames}
          onChange={handleCertNamesChange}
          autoComplete="off"
        />
      </div>

      <div className="form-row">
        <label htmlFor="certificates-upload">Upload Certificate Documents</label>
        <input
          id="certificates-upload"
          type="file"
          multiple
          onChange={handleCertFilesChange}
          aria-describedby="uploaded-certs-list"
        />
      </div>

      {certificates.length > 0 && (
        <div
          id="uploaded-certs-list"
          className="uploaded-documents"
          aria-live="polite"
        >
          <p>Uploaded Certificates:</p>
          <ul>
            {certificates.map((file, i) => (
              <li key={i}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="form-button-container">
        <button
          type="button"
          className="next-button"
          onClick={handleNext}
          disabled={skills.trim() === ''}
          aria-disabled={skills.trim() === ''}
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default SkillsCertsForm;
