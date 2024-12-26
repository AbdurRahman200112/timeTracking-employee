import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const expiry = localStorage.getItem("token_expiry");

      if (token && expiry) {
        const now = new Date().getTime();
        if (now > Number(expiry)) {
          // Token expired: clear from localStorage
          localStorage.removeItem("token");
          localStorage.removeItem("token_expiry");
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    checkAuth();

    // Listen for token changes (if other components modify localStorage)
    window.addEventListener("storage", checkAuth);

    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Prevent premature redirects
  }

  return isAuthenticated ? children : <Navigate to="/auth/sign-in" replace />;
};

export default ProtectedRoute;
