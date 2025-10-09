import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
    // 🚫 No token? Kick back to login
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default ProtectedRoute;
