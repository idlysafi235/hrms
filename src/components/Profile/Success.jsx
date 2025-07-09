import React from 'react';
import { Link } from 'react-router-dom';

const Success = () => {
  return (
    <div className="success-page">
      <h2>Congratulations!</h2>
      <p>You have successfully completed the onboarding process.</p>
      <Link to="/dashboard">Go to Dashboard</Link>
    </div>
  );
};

export default Success;
