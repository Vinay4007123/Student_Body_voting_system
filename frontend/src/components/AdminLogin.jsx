import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const AdminLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [secretKey, setSecretKey] = useState(""); 
  const [isRegister, setIsRegister] = useState(false); 
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState(""); 
  const [successMessage, setSuccessMessage] = useState(""); 

  // --- STYLES (Cleaned up and modernized) ---

  // 1. Define the base input style as a separate constant
  const baseInputStyle = {
    width: "100%",
    padding: "12px", // Increased padding
    color: "#333",
    marginBottom: "1.1rem",
    borderRadius: "6px", 
    border: "1px solid #ccc",
    fontSize: "1rem", 
    background: "#fff", // Simple white background
    boxSizing: "border-box"
  };

  // 2. Now create the main styles object, referencing the constant
  const styles = {
    pageWrapper: {
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      background: "#f0f6fc", // Consistent light blue background
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: "2rem",
      margin: 0,
      minHeight: "100vh",
      minWidth: "100vw",
      boxSizing: 'border-box',
    },
    containerStyle: {
      maxWidth: 400,
      width: "100%",
      padding: "2.5rem", 
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: "#ffffff", // Clean white card
      borderRadius: "12px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.1)", // Softer shadow
      textAlign: "center",
      boxSizing: 'border-box',
    },
    h2: {
        marginBottom: "1.5rem", 
        color: "#2c3e50" // Darker, more professional color
    },
    inputStyle: baseInputStyle, // <-- Use the constant
    passwordContainerStyle: {
      position: "relative",
      width: "100%",
      marginBottom: "1.1rem",
    },
    passwordInputStyle: {
      ...baseInputStyle, // <-- Use the constant here too
      marginBottom: 0, 
      paddingRight: "2.5rem", 
    },
    eyeIconStyle: {
      position: "absolute",
      top: "50%",
      right: "10px",
      transform: "translateY(-50%)",
      cursor: "pointer",
      userSelect: "none", 
      fontSize: "1.2rem",
      color: "#555",
    },
    buttonStyle: {
      width: "100%",
      padding: "0.8rem",
      fontSize: "1.08rem",
      cursor: "pointer",
      borderRadius: "6px", // Match input border radius
      border: "none",
      backgroundColor: "#2980b9",
      color: "#ffffff", // White text
      fontWeight: 600,
      marginBottom: "0.5rem",
      transition: "background 0.2s"
    },
    toggleButtonStyle: {
      background: "none",
      border: "none",
      color: "#2980b9",
      cursor: "pointer",
      fontWeight: "bold",
      padding: "10px",
      marginTop: "10px",
      fontSize: '0.9rem'
    },
    messageStyle: (isError = true) => ({
      textAlign: "center",
      color: isError ? "red" : "green",
      fontWeight: "bold",
      margin: "15px 0",
      fontSize: "1rem", // Slightly smaller
    }),
    label: {
        display: "block", 
        marginBottom: 5, 
        fontWeight: 600, 
        color: "#333", 
        textAlign: 'left'
    }
  };

  // --- LOGIN HANDLER (Unchanged) ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage(""); 
    setSuccessMessage("");

    try {
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.msg || "Login failed. Please check credentials.");
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("userRole", "admin"); 
      navigate("/admin-dashboard"); 

    } catch (err) {
      console.error(err);
      setMessage(err.message);
    }
  };

  // --- REGISTER HANDLER (Unchanged) ---
  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch(`${API_URL}/api/admin/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, secretKey }), // Send the secret key
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.msg || "Registration failed.");
      }

      // Success!
      setSuccessMessage(data.msg + " You can now log in.");
      setIsRegister(false); // Toggle back to login form
      setEmail("");
      setPassword("");
      setSecretKey("");

    } catch (err) {
      console.error(err);
      setMessage(err.message);
    }
  };
  
  // Use the correct handler based on the form mode
  const handleSubmit = isRegister ? handleRegister : handleLogin;

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.containerStyle}>
        <h2 style={styles.h2}>
          {isRegister ? "Admin Registration" : "Admin Login"}
        </h2>
        
        <form onSubmit={handleSubmit} autoComplete="off">
          <label htmlFor="email" style={styles.label}>
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            style={styles.inputStyle}
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password" style={styles.label}>
            Password:
          </label>
          
          <div style={styles.passwordContainerStyle}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Enter your password"
              style={styles.passwordInputStyle}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <span 
              style={styles.eyeIconStyle} 
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>
          
          {/* --- NEW: SECRET KEY FIELD (Conditional) --- */}
          {isRegister && (
            <>
              <label htmlFor="secretKey" style={styles.label}>
                Secret Key:
              </label>
              <input
                type="password" // Use password type to hide it
                id="secretKey"
                name="secretKey"
                placeholder="Enter the admin secret key"
                style={styles.inputStyle}
                value={secretKey}
                onChange={e => setSecretKey(e.target.value)}
                required
              />
            </>
          )}
          {/* ------------------------------------------- */}


          {/* Display error/success messages */}
          {message && <div style={styles.messageStyle(true)}>{message}</div>}
          {successMessage && <div style={styles.messageStyle(false)}>{successMessage}</div>}

          <button type="submit" style={styles.buttonStyle}>
            {isRegister ? "Register" : "Login"}
          </button>
        </form>

        <button
          style={styles.toggleButtonStyle}
          onClick={() => {
            setIsRegister(!isRegister); // Toggle the mode
            setMessage(""); // Clear messages
            setSuccessMessage("");
          }}
        >
          {isRegister ? "Already have an account? Login" : "Create a new Admin Account"}
        </button>

        <button
          style={{
            ...styles.buttonStyle,
            backgroundColor: "#7f8c8d",
            color: "#ffffff",
            margin: "10px 0 0 0" // Added top margin
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
