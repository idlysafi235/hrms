import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import "./documents.css";
import ProfileNavbar from '../Layouts/SelfServiceNavbar';

const EducationalDocuments = () => {
  const [documents, setDocuments] = useState([{ degree: '', institute: '', file: null }]);
  const navigate = useNavigate(); 

  const handleInputChange = (index, event) => {
    const { name, value, files } = event.target;
    const newDocuments = [...documents];
    if (name === 'file') {
      newDocuments[index][name] = files[0];
    } else {
      newDocuments[index][name] = value;
    }
    setDocuments(newDocuments);
  };

  const addNewDocument = () => {
    setDocuments([...documents, { degree: '', institute: '', file: null }]);
  };

  const deleteDocument = (index) => {
    const newDocuments = [...documents];
    newDocuments.splice(index, 1);
    setDocuments(newDocuments.length > 0 ? newDocuments : [{ degree: '', institute: '', file: null }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting documents:', documents);
    navigate('/experience');
  };

  return (
    <div className="employee-profile">
      <ProfileNavbar />
      <h2>Upload Educational Documents</h2>

      <form onSubmit={handleSubmit}>
        {documents.map((doc, index) => (
          <div key={index} className="document-section">
            <div className="form-header">
              <h4>Document {index + 1}</h4>
              {documents.length > 1 && (
                <button
                  type="button"
                  className="delete-doc-btn"
                  onClick={() => deleteDocument(index)}
                >
                  🗑️ Delete
                </button>
              )}
            </div>

            <div className="form-group">
              <label>Degree Title</label>
              <input
                type="text"
                name="degree"
                value={doc.degree}
                onChange={(e) => handleInputChange(index, e)}
                placeholder="Enter degree name"
                required
              />
            </div>

            <div className="form-group">
              <label>Institute Name</label>
              <input
                type="text"
                name="institute"
                value={doc.institute}
                onChange={(e) => handleInputChange(index, e)}
                placeholder="Enter institute name"
                required
              />
            </div>

            <div className="form-group">
              <label>Upload Certificate</label>
              <input
                type="file"
                name="file"
                accept="application/pdf,image/*"
                onChange={(e) => handleInputChange(index, e)}
                required
              />
            </div>
          </div>
        ))}

        <div className="buttons">
          <button type="button" className="add-btn" onClick={addNewDocument}>
            + Add More
          </button>
          <button type="submit" className="submit-btn">
            Submit Documents
          </button>
        </div>
      </form>
    </div>
  );
};

export default EducationalDocuments;
