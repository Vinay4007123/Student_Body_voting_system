import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CandidateLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Centering wrapper style
  const wrapperStyle = {
    minHeight: "100vh",
    minWidth: "100vw",
    background: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: 0,
  };

  const containerStyle = {
    maxWidth: 400,
    width: "100%",
    padding: "2rem",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 3px 16px rgba(0,0,0,0.13)",
    textAlign: "center",
  };

  const headingStyle = {
    marginBottom: "1.5rem",
    color: "#2c3e50",
    fontWeight: 700,
    fontSize: "2rem",
  };

  const inputStyle = {
    width: "100%",
    padding: "0.7rem",
    marginBottom: "1.1rem",
    borderRadius: "6px",
    border: "1px solid #aaa",
    fontSize: "1.08rem",
    background: "#fff",
    color: "#000",
    display: "block",
  };

  const buttonStyle = {
    width: "100%",
    padding: "0.8rem",
    fontSize: "1.08rem",
    cursor: "pointer",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#2980b9",
    color: "#fff",
    fontWeight: 600,
    marginBottom: "0.5rem",
    marginTop: "0.2rem"
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // Optionally add authentication here
    navigate("/candidate-dashboard");
  };

  return (
    <div style={wrapperStyle}>
      <div style={containerStyle}>
        <h2 style={headingStyle}>Candidate Login</h2>
        <form onSubmit={handleLogin} autoComplete="off">
          <label htmlFor="email" style={{ display: "block", marginBottom: 5, fontWeight: 600 }}>
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            style={inputStyle}
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <label htmlFor="password" style={{ display: "block", marginBottom: 5, fontWeight: 600 }}>
            Password:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            style={inputStyle}
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button type="submit" style={buttonStyle}>Login</button>
        </form>
        <button
          style={{
            ...buttonStyle,
            backgroundColor: "#7f8c8d",
            color: "#fff",
            marginTop: "1rem",
            marginBottom: 0
          }}
          onClick={() => navigate("/")}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default CandidateLogin;
