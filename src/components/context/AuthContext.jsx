import React, { createContext, useEffect, useState, useContext } from 'react';
import { isTokenExpired } from '../../utils/tokenUtils';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState([]);
  const [roles, setRoles] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');
    const urlRole = params.get('role');

    let currentToken = urlToken || localStorage.getItem('token');

    const currentPath = window.location.pathname;

    if ((!currentToken || isTokenExpired(currentToken)) && currentPath !== '/login') {
      localStorage.clear();
      setToken(null);
      setUser(null);
      setRole([]);
      setRoles([]);
      window.location.href = '/login';
      return;
    }

    if (urlToken) {
      localStorage.setItem('token', urlToken);
      setToken(urlToken);
    } else {
      setToken(currentToken);
    }

    if (urlRole) {
      const roleArray = [urlRole];
      localStorage.setItem('role', JSON.stringify(roleArray));
      setRole(roleArray);
    } else {
      const savedRole = localStorage.getItem('role');
      if (savedRole) {
        try {
          const parsedRole = JSON.parse(savedRole);
          setRole(Array.isArray(parsedRole) ? parsedRole : []);
        } catch {
          setRole([]);
        }
      }
    }

    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));

    const storedRoles = localStorage.getItem('role');
    if (storedRoles) {
      try {
        setRoles(JSON.parse(storedRoles));
      } catch {
        setRoles([]);
      }
    }

    if (urlToken || urlRole) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ token, role, roles, user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
