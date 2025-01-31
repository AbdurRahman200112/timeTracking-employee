import { Routes, Route, Navigate } from "react-router-dom";
import React from "react";
import { Dashboard, Auth } from "@/layouts";
import ProtectedRoute from "./ProtectedRoute";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { AuthProvider } from "./AuthProvider";

function App() {
  return (
    <Provider store={store}>
          <AuthProvider>

      <Routes>
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/auth/*" element={<Auth />} />
        <Route path="/" element={<Navigate to="/dashboard/home" replace />} />
      </Routes>
      </AuthProvider>
    </Provider>
  );
}

export default App;
