import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AuthContext = createContext();

// helper that other files can import (axiosInstance imports a logout function - keep lightweight)

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  // window.location = '/login'; // don't force here; AuthContext will handle redirection when used
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
      // eslint-disable-next-line no-unused-vars
    } catch (e) {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // If token is removed elsewhere, sync
    const handleStorage = () => {
      const t = localStorage.getItem('token');
      const u = localStorage.getItem('user');
      setToken(t);
      setUser(u ? JSON.parse(u) : null);
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const login = ({ token: tkn, user: usr }) => {
    localStorage.setItem('token', tkn);
    localStorage.setItem('user', JSON.stringify(usr));
    setToken(tkn);
    setUser(usr);
    toast.success('Login successful');
    if (usr.role === 'faculty') navigate('/faculty-dashboard');
    else navigate('/student-dashboard');
  };

  const registerAndLogin = ({ token: tkn, user: usr }) => {
    // convenience
    login({ token: tkn, user: usr });
  };

  const doLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    toast.info('Session ended. Please login again.');
    navigate('/login');
  };

  // Auto-logout when token expired is handled by axiosInstance detecting 401 and calling logout helper.

  return (
    <AuthContext.Provider value={{ user, token, login, loading, setLoading, doLogout, registerAndLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);