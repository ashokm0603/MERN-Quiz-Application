import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import axios from '../api/axiosInstance';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/Register.css';

export default function Register() {
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState({ name: '', email: '', password: '', rollNo: '' });
  const [faculty, setFaculty] = useState({ name: '', email: '', password: '' });

  const submitStudent = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/auth/studentregistration', { ...student, role: 'student' });
      toast.success('Student registered successfully!');
      setStudent({ name: '', email: '', password: '', rollNo: '' });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const submitFaculty = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/auth/facultyregistration', { ...faculty, role: 'faculty' });
      toast.success('Faculty registered successfully!');
      setFaculty({ name: '', email: '', password: '' });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="register-container d-flex align-items-center justify-content-center">
      <motion.div
        className="register-card glass-card shadow-lg p-4 w-100"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <motion.h3
          className="text-center mb-4 register-title"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          Create an Account
        </motion.h3>

        {/* Toggle buttons */}
        <div className="tab-buttons mb-4">
          <button
            className={role === 'student' ? 'active' : ''}
            onClick={() => setRole('student')}
          >
            Student
          </button>
          <button
            className={role === 'faculty' ? 'active' : ''}
            onClick={() => setRole('faculty')}
          >
            Faculty
          </button>
        </div>

        {/* Animated form switching */}
        <AnimatePresence mode="wait">
          {role === 'student' ? (
            <motion.div
              key="student"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
            >
              <Form onSubmit={submitStudent}>
                <Form.Group className="mb-3">
                  <Form.Label>Student Name</Form.Label>
                  <Form.Control
                    className="form-input"
                    placeholder="Enter your name"
                    required
                    value={student.name}
                    onChange={(e) => setStudent({ ...student, name: e.target.value })}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    className="form-input"
                    type="email"
                    placeholder="Enter email"
                    required
                    value={student.email}
                    onChange={(e) => setStudent({ ...student, email: e.target.value })}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Roll No</Form.Label>
                  <Form.Control
                    className="form-input"
                    placeholder="Enter Roll Number"
                    required
                    value={student.rollNo}
                    onChange={(e) => setStudent({ ...student, rollNo: e.target.value })}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    className="form-input"
                    type="password"
                    placeholder="Create password"
                    required
                    value={student.password}
                    onChange={(e) => setStudent({ ...student, password: e.target.value })}
                  />
                </Form.Group>
                <Button className="register-btn w-100" type="submit" disabled={loading}>
                  {loading ? 'Registering...' : 'Register'}
                </Button>
              </Form>
            </motion.div>
          ) : (
            <motion.div
              key="faculty"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.4 }}
            >
              <Form onSubmit={submitFaculty}>
                <Form.Group className="mb-3">
                  <Form.Label>Faculty Name</Form.Label>
                  <Form.Control
                    className="form-input"
                    placeholder="Enter your name"
                    required
                    value={faculty.name}
                    onChange={(e) => setFaculty({ ...faculty, name: e.target.value })}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    className="form-input"
                    type="email"
                    placeholder="Enter email"
                    required
                    value={faculty.email}
                    onChange={(e) => setFaculty({ ...faculty, email: e.target.value })}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    className="form-input"
                    type="password"
                    placeholder="Create password"
                    required
                    value={faculty.password}
                    onChange={(e) => setFaculty({ ...faculty, password: e.target.value })}
                  />
                </Form.Group>
                <Button className="register-btn w-100" type="submit" disabled={loading}>
                  {loading ? 'Registering...' : 'Register'}
                </Button>
              </Form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Container>
  );
}
