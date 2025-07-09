import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const useAuthToken = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [roles, setRoles] = useState(() => {
    const storedRoles = localStorage.getItem('role');
    return storedRoles ? JSON.parse(storedRoles) : [];
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenFromURL = params.get('token');
    const roleFromURL = params.get('role');

    if (tokenFromURL) {
      localStorage.setItem('token', tokenFromURL);
      setToken(tokenFromURL);
    }

    if (roleFromURL) {
      const roleArray = roleFromURL
        .split(',')
        .map(role => role.trim())
        .filter(role => role.length > 0);

      localStorage.setItem('role', JSON.stringify(roleArray));
      setRoles(roleArray);
    }

    if (tokenFromURL || roleFromURL) {
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  return { token, roles };
};

export default useAuthToken;
