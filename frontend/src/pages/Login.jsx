import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { loginUser } from "../api/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await loginUser({ email, password }); // Login through API
      login(userData); // Update context with user data
      navigate("/"); // Redirect to home after successful login
    } catch (err) {
      setError("Invalid credentials");
      console.error("Login error:", err);
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Login;
