import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FacultyDashboard from "./pages/FacultyDashboard";
import Quiz from "./pages/Quiz";
import Results from "./pages/Results";
import AppNavbar from "./components/AppNavbar";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StudentDashboard from "./pages/StudentDashboard";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppNavbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/quiz"
            element={
              <ProtectedRoute role="student">
                <Quiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student-dashboard"
            element={
              <ProtectedRoute role="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/faculty-dashboard"
            element={
              <ProtectedRoute role="faculty">
                <FacultyDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/results"
            element={
              <ProtectedRoute role="student">
                <Results />
              </ProtectedRoute>
            }
          />
        </Routes>
        <ToastContainer position="top-right" />
      </AuthProvider>
    </Router>
  );
}
