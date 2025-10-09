import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import LecturerForm from "./pages/forms/LecturerForm";

// ✅ dashboards
import StudentDashboard from "./pages/student/StudentDashboard";
import LecturerDashboard from "./pages/lecturer/LecturerDashboard";
import PRLDashboard from "./pages/prl/PRLDashboard";
import PLDashboard from "./pages/pl/PLDashboard";

import ProtectedRoute from "./components/ProtectedRoute";

// ✅ Helper for role-based protection
function RoleRoute({ children, allowedRole }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!token) return <Navigate to="/login" replace />;
  if (user.role !== allowedRole) return <Navigate to="/" replace />;

  return children;
}

function Navbar() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
      <Link className="navbar-brand" to="/">LUCT Reporting</Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav ms-auto">
          {!token ? (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/register">Register</Link>
              </li>
            </>
          ) : (
            <>
              {user.role === "student" && (
                <li className="nav-item">
                  <Link className="nav-link" to="/student-dashboard">Student Dashboard</Link>
                </li>
              )}
              {user.role === "lecturer" && (
                <li className="nav-item">
                  <Link className="nav-link" to="/lecturer-dashboard">Lecturer Dashboard</Link>
                </li>
              )}
              {user.role === "prl" && (
                <li className="nav-item">
                  <Link className="nav-link" to="/prl-dashboard">PRL Dashboard</Link>
                </li>
              )}
              {user.role === "pl" && (
                <li className="nav-item">
                  <Link className="nav-link" to="/pl-dashboard">PL Dashboard</Link>
                </li>
              )}
              <li className="nav-item">
                <button className="btn btn-link nav-link" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          )}
          <li className="nav-item">
            <Link className="nav-link" to="/lecturer-form">Lecturer Form</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="container mt-4">
        {/* Navbar */}
        <Navbar />

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/lecturer-form" element={<LecturerForm />} />

          {/* ✅ Role-based dashboards */}
          <Route
            path="/student-dashboard"
            element={
              <RoleRoute allowedRole="student">
                <StudentDashboard />
              </RoleRoute>
            }
          />
          <Route
            path="/lecturer-dashboard"
            element={
              <RoleRoute allowedRole="lecturer">
                <LecturerDashboard />
              </RoleRoute>
            }
          />
          <Route
            path="/prl-dashboard"
            element={
              <RoleRoute allowedRole="prl">
                <PRLDashboard />
              </RoleRoute>
            }
          />
          <Route
            path="/pl-dashboard"
            element={
              <RoleRoute allowedRole="pl">
                <PLDashboard />
              </RoleRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
