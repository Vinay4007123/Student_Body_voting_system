import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const CandidateLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/api/candidate/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Login failed");
      }

      // --- SUCCESS ---
      // 1. Save the token
      localStorage.setItem("token", data.token);
      localStorage.setItem("userRole", "candidate"); // Good practice to store role

      // 2. Redirect to the dashboard
      navigate("/candidate-dashboard");

    } catch (err) {
      console.error(err);
      setMessage(err.message);
    }
  };

  // --- STYLES (Borrowed from your other components for consistency) ---
  const styles = {
    pageWrapper: {
      fontFamily: "'Segoe UI', sans-serif",
      background: "#f0f6fc",
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: "2rem",
      margin: 0,
      minHeight: "100vh",
      minWidth: "100vw",
      boxSizing: 'border-box',
    },
    loginBox: {
      width: "100%",
      maxWidth: "500px", // Perfect width for a login form
      margin: "auto",
      background: "#fff",
      padding: "2.5rem",
      borderRadius: "12px",
      boxShadow: "0 0 20px rgba(0,0,0,0.1)",
      boxSizing: 'border-box',
    },
    h2: {
      textAlign: "center",
      color: "#2c3e50",
      marginBottom: "30px",
    },
    input: {
      width: "100%",
      padding: "12px",
      fontSize: "16px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      boxSizing: "border-box",
      backgroundColor: "#fff",
      color: "#000",
      marginBottom: "1rem", // Add space between inputs
    },
    submitButton: {
      display: "block",
      width: "100%",
      padding: "16px",
      marginTop: "20px",
      backgroundColor: "#f39c12", // Candidate login color from Home page
      border: "none",
      color: "white",
      fontSize: "18px",
      borderRadius: "10px",
      cursor: "pointer",
      transition: "background 0.3s",
    },
    message: {
      textAlign: "center",
      color: "red",
      fontWeight: "bold",
      margin: "15px 0",
      fontSize: "1.1rem",
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.loginBox}>
        <form onSubmit={handleLogin}>
          <h2 style={styles.h2}>Candidate Login</h2>
          <input
            type="email"
            style={styles.input}
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            style={styles.input}
            placeholder="Enter your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" style={styles.submitButton}>
            Login
          </button>
          {message && <div style={styles.message}>{message}</div>}
        </form>
      </div>
    </div>
  );
};

export default CandidateLogin;
