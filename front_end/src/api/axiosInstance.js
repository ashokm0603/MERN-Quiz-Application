// src/api/axiosInstance.js
import axios from 'axios';
import { logout } from '../context/authHelpers';

// Base API URL (from .env or default)
// CRA style
const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

// Create an Axios instance
const instance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Add token before every request
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Global response handling (e.g., token expired or unauthorized)
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      try {
        logout();
      } catch (e) {
        console.error('Logout error:', e);
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
