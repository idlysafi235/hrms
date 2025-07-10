// import React, { useEffect } from 'react';

// const Login = () => {
//   useEffect(() => {
//     window.location.href = 'http://localhost:5000/api/auth/sso';
//   }, []);

// };

// export default Login;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import '../output.css';
import { loginUser } from '../api/services';
import logo from '../asset/logo.svg';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    console.log('📩 Attempting login...');
    setLoading(true);

    try {
      const response = await loginUser(email, password);
      console.log('📬 Login response:', response);

      if (response && response.token) {
        const userData = {
          id: response.id,
          employeeId: response.employeeId,
          employeeInternalId: response.employeeInternalId,
          reportingManagerId: response.reportingManagerId,
          email: response.email,
          roles: response.roles,
          firstName: response.firstName,
          lastName: response.lastName,
          token: response.token,
          onboardingStatus: response.onboardingStatus,
        };

        console.log('💾 Saving user data to localStorage...');
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', JSON.stringify(response.roles));

        console.log('✅ Login success. Onboarding status:', response.onboardingStatus);

        if (response.onboardingStatus === 'Pending' || response.onboardingStatus === 'InProgress') {
          console.log('➡️ Navigating to /onboarding/personal-info');
          navigate('/onboarding/personal-info');
        } else {
          console.log('➡️ Navigating to /home');
          navigate('/home');
        }
      } else {
        alert('Invalid credentials');
        console.warn('⚠️ Login failed: No token received');
      }
    } catch (error) {
      alert(error.message || 'Login failed');
      console.error('❌ Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page ">
      <div className="login-box">
        <h2 className="title">HRMS</h2>
        <div className="login-form">
          <label>Email</label>

          <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button onClick={handleLogin} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
