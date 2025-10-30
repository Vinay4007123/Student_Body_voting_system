import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  // Wrapper with white background
  const wrapperStyle = {
    minHeight: "100vh",
    minWidth: "100vw",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#ffffff",
  };

  const containerStyle = {
    maxWidth: 400,
    width: "100%",
    padding: "2rem",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#f6eeeeff",
    borderRadius: "12px",
    boxShadow: "0 3px 14px rgba(255, 248, 248, 0.14)",
    textAlign: "center"
  };

  const inputStyle = {
    width: "100%",
    padding: "0.7rem",
    color: "#333",
    marginBottom: "1.1rem",
    borderRadius: "4px",
    border: "1px solid #aaa",
    fontSize: "1.1rem",
    background: "#f9fdfdff",
    boxSizing: "border-box"
  };

  // Styles for the password input container and icon
  const passwordContainerStyle = {
    position: "relative",
    width: "100%",
    marginBottom: "1.1rem",
  };

  const passwordInputStyle = {
    ...inputStyle,
    marginBottom: 0, // Remove margin from input itself
    paddingRight: "2.5rem", // Make space for the icon
  };

  const eyeIconStyle = {
    position: "absolute",
    top: "50%",
    right: "10px",
    transform: "translateY(-50%)",
    cursor: "pointer",
    userSelect: "none", // Prevents text selection on the icon
    fontSize: "1.2rem",
    color: "#555",
  };

  const buttonStyle = {
    width: "100%",
    padding: "0.8rem",
    fontSize: "1.08rem",
    cursor: "pointer",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#2980b9",
    color: "#f4ededff",
    fontWeight: 600,
    marginBottom: "0.5rem"
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // Add authentication logic here if needed
    navigate("/admin-dashboard");
  };

  return (
    <div style={wrapperStyle}>
      <div style={containerStyle}>
        <h2 style={{ marginBottom: "1.5rem", color: "#2980b9" }}>Admin Login</h2>
        
        <form onSubmit={handleLogin} autoComplete="off">
          <label htmlFor="username" style={{ display: "block", marginBottom: 5, fontWeight: 600, color: "#333", textAlign: 'left' }}>
            Email:
          </label>
          <input
            type="email"
            id="username"
            name="username"
            placeholder="Enter your email"
            style={inputStyle}
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />

          <label htmlFor="password" style={{ display: "block", marginBottom: 5, fontWeight: 600, color: "#333", textAlign: 'left' }}>
            Password:
          </label>
          
          <div style={passwordContainerStyle}>
            <input
              type={showPassword ? "text" : "password"} // Dynamic type based on showPassword state
              id="password"
              name="password"
              placeholder="Enter your password"
              style={passwordInputStyle}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            {/* Eye icon with strike-off */}
            <span 
              style={eyeIconStyle} 
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "👁️" : "🚫"} {/* Simple eye or no-entry sign */}
            </span>
          </div>

          <button type="submit" style={buttonStyle}>
            Login
          </button>
        </form>

        <button
          style={{
            ...buttonStyle,
            backgroundColor: "#7f8c8d",
            color: "#f5efefff",
            margin: 0
          }}
          onClick={() => navigate("/")}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;