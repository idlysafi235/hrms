import React, { useState } from 'react';
import './ExperienceForm.css';

const ExperienceForm = () => {
  const [experienceData, setExperienceData] = useState([
    { company: '', role: '', startYear: '', endYear: '', description: '', documents: [] },
  ]);


  const handleChange = (e, index) => {
    const { name, value } = e.target;
    setExperienceData(prev => {
      const updated = [...prev];
      updated[index][name] = value;
      return updated;
    });
  };

  const handleFileChange = (e, index) => {
    const files = Array.from(e.target.files);
    setExperienceData(prev => {
      const updated = [...prev];
      updated[index].documents = files;
      return updated;
    });
  };


  const handleAdd = () => {
    setExperienceData(prev => [
      ...prev,
      { company: '', role: '', startYear: '', endYear: '', description: '', documents: [] },
    ]);
  };

  const handleNext = () => {
    console.log('Experience Data:', experienceData);
    alert('Next clicked! Check console for data.');
  };

  return (
    <section className="form-section" aria-label="Experience Form Section">
      <h2 className="form-title">Experience</h2>

      {experienceData.length === 0 && (
        <p className="empty-message">No experience entries added yet.</p>
      )}

      {experienceData.map((exp, index) => (
        <div key={index} className="exp-entry">
          <input
            name="company"
            type="text"
            placeholder="Company Name"
            value={exp.company}
            onChange={(e) => handleChange(e, index)}
          />

          <input
            name="role"
            type="text"
            placeholder="Role / Position"
            value={exp.role}
            onChange={(e) => handleChange(e, index)}
          />

          <div className="year-row">
            <input
              name="startYear"
              type="number"
              min="1900"
              max={new Date().getFullYear()}
              placeholder="Start Year"
              value={exp.startYear}
              onChange={(e) => handleChange(e, index)}
            />
            <input
              name="endYear"
              type="number"
              min="1900"
              max={new Date().getFullYear() + 10}
              placeholder="End Year (or 'Present')"
              value={exp.endYear}
              onChange={(e) => handleChange(e, index)}
            />
          </div>

          <textarea
            name="description"
            placeholder="Brief description of your role and responsibilities"
            value={exp.description}
            onChange={(e) => handleChange(e, index)}
            rows="3"
          />

          <input
            type="file"
            multiple
            onChange={(e) => handleFileChange(e, index)}
          />

          {exp.documents && exp.documents.length > 0 && (
            <div className="uploaded-documents">
              <p>Uploaded Documents:</p>
              <ul>
                {exp.documents.map((file, i) => (
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
        disabled={experienceData.length === 0}
        className="next-button"
      >
        Next
      </button>
    </section>
  );
};

export default ExperienceForm;
