import React from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const containerStyle = {
    maxWidth: "400px",
    margin: "3rem auto",
    padding: "2rem",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#fafafa",
    borderRadius: "8px",
    boxShadow: "0 3px 12px rgba(0,0,0,0.1)",
    textAlign: "center"
  };

  const headingStyle = {
    marginBottom: "1.5rem",
    color: "#34495e"
  };

  const labelStyle = {
    display: "block",
    marginBottom: "0.5rem",
    fontWeight: "600",
    textAlign: "left"
  };

  const inputStyle = {
    width: "100%",
    padding: "0.5rem",
    marginBottom: "1rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "1rem"
  };

  const buttonStyle = {
    width: "100%",
    padding: "0.7rem",
    backgroundColor: "#27ae60",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "1rem"
  };

  const goHome = () => navigate("/");

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Forgot Password</h2>
      <form>
        <label htmlFor="email" style={labelStyle}>Email:</label>
        <input type="email" id="email" name="email" style={inputStyle} />

        <button type="submit" style={buttonStyle}>Reset Password</button>
      </form>
      <button 
        style={{ ...buttonStyle, marginTop: "1rem", backgroundColor: "#7f8c8d" }} 
        onClick={goHome}
      >
        Back to Home
      </button>
    </div>
  );
};

export default ForgotPassword;
