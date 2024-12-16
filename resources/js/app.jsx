// import { Routes, Route, Navigate } from "react-router-dom";
// import React from "react";
// import { Dashboard, Auth } from "@/layouts";
// import ProtectedRoute from "./ProtectedRoute";
// import { AuthProvider } from "./AuthProvider";

// function App() {
//   return (
//     <AuthProvider>
//       <Routes>
//         {/* Protect Dashboard routes */}
//         <Route
//           path="/*"
//           element={
//             <ProtectedRoute>
//               <Dashboard />
//             </ProtectedRoute>
//           }
//         />
//          <Route
//           path="/dashboard/*"
//           element={
//             <ProtectedRoute>
//               <Dashboard />
//             </ProtectedRoute>
//           }
//         />
        
//         {/* Public Auth routes */}
//         <Route path="/auth/*" element={<Auth />} />

//         {/* Redirect any unknown routes to dashboard home */}
//         <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
//       </Routes>
//     </AuthProvider>
//   );
// }
// export default App;
import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import React from "react";

function App() {
  return (
    <Routes>
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="/auth/*" element={<Auth />} />
      <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
    </Routes>
  );
}

export default App;
