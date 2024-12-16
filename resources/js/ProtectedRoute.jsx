import { useAuth } from "./AuthProvider";
import React from "react";
import { Navigate } from 'react-router-dom';


function ProtectedRoute({ children }) {
  const { auth } = useAuth();

  // If the user is not authenticated, redirect to the login page
  if (!auth) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  return children;
}

export default ProtectedRoute;
