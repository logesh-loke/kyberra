import React from 'react';
import { Navigate } from 'react-router-dom';
import Unauthorized from 'src/views/pages/unauthorized/Unauthorized';

const AuthGuard = ({ children, requiredRole }) => {
  const isAuthenticated = () => {
    const token = localStorage.getItem('authToken');  // your existing logic
    return !!token; 
  };

  // Step 1: Not logged in → redirect to login
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  // Step 2: Role validation
  const userData = JSON.parse(localStorage.getItem("userDetails") || "{}");
  const userRole = userData?.role;

  if (requiredRole && !requiredRole.includes(userRole)) {
    return <Unauthorized />;
  }

  return children;
};

export default AuthGuard;

















// import React from 'react';
// import { Navigate } from 'react-router-dom';

// const AuthGuard = ({ children, requiredRole }) => {
//   // Check if user has token in localStorage
//   const isAuthenticated = () => {
//     const token = localStorage.getItem('authToken');
//     return !!token; 
//   };

//   if (!isAuthenticated()) {
//     // Redirect to login if no token
//     return <Navigate to="/" replace />;
//   }

//   return children;
// };

// export default AuthGuard;