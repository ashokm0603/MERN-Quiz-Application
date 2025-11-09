import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../styles/Landing.css';

export default function Landing() {
  return (
    <div className="landing-container">
      <motion.div
        className="landing-content"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <motion.h1
          className="landing-title"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.7 }}
        >
          Quiz Master Portal
        </motion.h1>

        <motion.p
          className="landing-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          Take quizzes, review results — Faculty can upload questions.
        </motion.p>

        <motion.div
          className="landing-buttons"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <Link to="/login" className="btn-primary">Login</Link>
          <Link to="/register" className="btn-outline">Register</Link>
        </motion.div>

        <motion.div
          className="info-card"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="info-section">
            <h3>🎓 For Students</h3>
            <p>Choose your subject, take interactive timed quizzes, and get instant results with detailed analysis.</p>
          </div>
          <div className="divider"></div>
          <div className="info-section">
            <h3>👨‍🏫 For Faculty</h3>
            <p>Easily create and manage quiz questions, set time limits, and view student performance dashboards.</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
