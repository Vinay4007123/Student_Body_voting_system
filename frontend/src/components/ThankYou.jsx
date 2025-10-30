import React from "react";
import { useNavigate } from "react-router-dom";

const ThankYou = () => {
  const navigate = useNavigate();

  const containerStyle = {
    padding: "3rem",
    textAlign: "center",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#27ae60",
    backgroundColor: "#ecf9f1",
    borderRadius: "8px",
    margin: "3rem auto",
    maxWidth: "500px",
    boxShadow: "0 2px 10px rgba(39, 174, 96, 0.2)"
  };

  const headingStyle = {
    marginBottom: "1rem"
  };

  const paragraphStyle = {
    fontSize: "1.1rem",
    lineHeight: "1.5"
  };

  const buttonStyle = {
    marginTop: "2rem",
    padding: "0.8rem 1.6rem",
    backgroundColor: "#2980b9",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "1rem"
  };

  const goHome = () => navigate("/");

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Thank You!</h2>
      <p style={paragraphStyle}>Your response has been recorded.</p>
      <p style={paragraphStyle}>We appreciate your participation in the student body voting process.</p>

      <button style={buttonStyle} onClick={goHome}>Back to Home</button>
    </div>
  );
};

export default ThankYou;
