import React, { createContext, useContext, useState, useEffect } from "react";

// Create an Auth Context
const AuthContext = createContext();

// Provider component to wrap around the app
export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    // Retrieve token from localStorage (or any storage method you prefer)
    const token = localStorage.getItem("authToken");
    if (token) {
      setAuth(token);
    }
  }, []);

  const login = (token) => {
    localStorage.setItem("authToken", token);
    setAuth(token);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setAuth(null);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);
