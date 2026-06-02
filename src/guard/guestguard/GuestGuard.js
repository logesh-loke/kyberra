import React from "react";
import { Navigate } from "react-router-dom";

const GuestGuard = ({ children }) => {
  const isAuthenticated = () => {
    const token = localStorage.getItem("authToken");
    return !!token;
  };

  const userData = JSON.parse(localStorage.getItem("userDetails") || "{}");
  const userRole = userData?.role;

  if (isAuthenticated()) {
    // Redirect based on role
    switch (userRole) {
      case "super_admin":
        return <Navigate to="/dashboard" replace />;
        case "admin":
        return <Navigate to="/inbox" replace />;
      case "user":
      case "employee":
        return <Navigate to="/inbox" replace />;

      default:
        return <Navigate to="/" replace />;
    }
  }

  // Not logged in → allow guest page
  return children;
};

export default GuestGuard;
