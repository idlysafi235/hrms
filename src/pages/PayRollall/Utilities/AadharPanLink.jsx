// src/pages/utilities/AadharPanLink.jsx
import React, { useState, useEffect } from 'react';
import './UtilitiesPage.css';
import { fetchAadharPanLink } from '../../../api/utilitiesApi';
import { getToken } from '../../../utils/auth';

const AadharPanLink = () => {
  const [linkData, setLinkData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = getToken();
        const data = await fetchAadharPanLink(token);
        setLinkData(data);
      } catch (err) {
        setError('Error fetching Aadhar/PAN data.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <div className="utilities-page"><p>Loading...</p></div>;
  }

  if (error) {
    return <div className="utilities-page"><p>{error}</p></div>;
  }

  return (
    <div className="utilities-page">
      <h2>Aadhar / PAN Link</h2>
      <table className="table">
        <tbody>
          <tr>
            <td>Status</td>
            <td>{linkData.isLinked ? <strong>Linked</strong> : <strong>Not Linked</strong>}</td>
          </tr>
          <tr>
            <td>Aadhar</td>
            <td>{linkData.aadharNumber}</td>
          </tr>
          <tr>
            <td>PAN</td>
            <td>{linkData.panNumber}</td>
          </tr>
          <tr>
            <td>Updated At</td>
            <td>{new Date(linkData.updatedAt).toLocaleDateString()}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AadharPanLink;
