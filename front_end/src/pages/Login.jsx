import React, { useState } from 'react';
import axios from '../api/axiosInstance';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import '../styles/Login.css';

export default function Login() {
  const [key, setKey] = useState('student');
  const [loading, setLoading] = useState(false);
  const [studentForm, setStudentForm] = useState({ email: '', password: '' });
  const [facultyForm, setFacultyForm] = useState({ email: '', password: '' });
  const { login } = useAuth();

  const submitStudent = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/studentlogin', { ...studentForm, role: 'student' });
      const { token, user } = res.data;
      login({ token, user });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const submitFaculty = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/facultylogin', { ...facultyForm, role: 'faculty' });
      const { token, user } = res.data;
      login({ token, user });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Welcome Back 👋</h2>
        <div className="tab-buttons">
          <button
            className={key === 'student' ? 'active' : ''}
            onClick={() => setKey('student')}
          >
            Student
          </button>
          <button
            className={key === 'faculty' ? 'active' : ''}
            onClick={() => setKey('faculty')}
          >
            Faculty
          </button>
        </div>

        {key === 'student' ? (
          <form onSubmit={submitStudent}>
            <label>Email</label>
            <input
              type="email"
              required
              placeholder='Enter Mail'
              value={studentForm.email}
              onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
            />
            <label>Password</label>
            <input
              type="password"
              required
              placeholder='Enter Password'
              value={studentForm.password}
              onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })}
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        ) : (
          <form onSubmit={submitFaculty}>
            <label>Email</label>
            <input
              type="email"
              required
              placeholder='Enter Mail'
              value={facultyForm.email}
              onChange={(e) => setFacultyForm({ ...facultyForm, email: e.target.value })}
            />
            <label>Password</label>
            <input
              type="password"
              placeholder='Enter Password'
              required
              value={facultyForm.password}
              onChange={(e) => setFacultyForm({ ...facultyForm, password: e.target.value })}
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
