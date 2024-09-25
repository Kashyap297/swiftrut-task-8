import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyExpenses from "./pages/MyExpenses";
import ProtectedRoute from "./context/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MyExpenses />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
