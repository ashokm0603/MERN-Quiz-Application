import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import "../styles/AppNavbar.css";
import logo from "../assets/college-logo.png";

export default function AppNavbar() {
  const { user, doLogout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.nav
      className="navbar-container"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="navbar-content">
        {/* === Brand === */}
        <Link to="/" className="navbar-brand">
          <img src={logo} className="college-logo" alt="logo" />
          <div>SIR C.R.REDDY COLLEGE</div>
        </Link>

        {/* === Hamburger Menu === */}
        <div
          className={`menu-toggle ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* === Navbar Links === */}
        <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
          {/* Not Logged In */}
          {!user && (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}>
                Register
              </Link>
            </>
          )}

          {/* Logged In */}
          {user && (
            <>
              {user.role === "faculty" ? (
                <Link
                  to="/faculty-dashboard"
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/quiz" onClick={() => setMenuOpen(false)}>
                    Take Quiz
                  </Link>
                  <Link
                    to="/student-dashboard"
                    onClick={() => setMenuOpen(false)}
                  >
                    Student Dashboard
                  </Link>
                </>
              )}

              <span className="user-name">{user.name}</span>
              <button className="logout-btn" onClick={doLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
