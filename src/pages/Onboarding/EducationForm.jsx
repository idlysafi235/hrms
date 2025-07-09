import React, { useState } from 'react';
import './EducationForm.css';

const EducationForm = () => {
  const [educationData, setEducationData] = useState([
    { degree: '', institution: '', year: '', percentage: '', documents: [] },
  ]);


  const handleChange = (e, index) => {
    const { name, value } = e.target;
    setEducationData(prev => {
      const updated = [...prev];
      updated[index][name] = value;
      return updated;
    });
  };


  const handleFileChange = (e, index) => {
    const files = Array.from(e.target.files);
    setEducationData(prev => {
      const updated = [...prev];
      updated[index].documents = files;
      return updated;
    });
  };


  const handleAdd = () => {
    setEducationData(prev => [
      ...prev,
      { degree: '', institution: '', year: '', percentage: '', documents: [] },
    ]);
  };

  const handleNext = () => {
    console.log('Education Data:', educationData);
    alert('Next clicked! See console for data.');
  
  };

  return (
    <section className="form-section" aria-label="Education Form Section">
      <h2 className="form-title">Education</h2>

      {educationData.length === 0 && (
        <p className="empty-message">No education entries added yet.</p>
      )}

      {educationData.map((edu, index) => (
        <div key={index} className="edu-entry">
          <input
            name="degree"
            type="text"
            placeholder="Degree (e.g. Bachelor of Science)"
            value={edu.degree}
            onChange={(e) => handleChange(e, index)}
          />

          <input
            name="institution"
            type="text"
            placeholder="Institution (e.g. University Name)"
            value={edu.institution}
            onChange={(e) => handleChange(e, index)}
          />

          <input
            name="year"
            type="number"
            min="1900"
            max={new Date().getFullYear()}
            placeholder="Year (e.g. 2022)"
            value={edu.year}
            onChange={(e) => handleChange(e, index)}
          />

          <input
            name="percentage"
            type="text"
            placeholder="Percentage (e.g. 85%)"
            value={edu.percentage}
            onChange={(e) => handleChange(e, index)}
          />

          <input
            type="file"
            multiple
            onChange={(e) => handleFileChange(e, index)}
          />

          {edu.documents && edu.documents.length > 0 && (
            <div className="uploaded-documents">
              <p>Uploaded Documents:</p>
              <ul>
                {edu.documents.map((file, i) => (
                  <li key={i}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}

          <hr />
        </div>
      ))}

      <button type="button" onClick={handleAdd} className="add-more-btn">
        + Add More
      </button>

      <button
        type="button"
        onClick={handleNext}
        disabled={educationData.length === 0}
        className="next-button"
      >
        Next
      </button>
    </section>
  );
};

export default EducationForm;
