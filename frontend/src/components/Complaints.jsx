import React from "react";
import { useNavigate } from "react-router-dom";

const Complaints = () => {
  const navigate = useNavigate();

  const containerStyle = {
    padding: "2rem",
    maxWidth: "600px",
    margin: "2rem auto",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
    textAlign: "center"
  };

  const headingStyle = {
    color: "#2c3e50",
    marginBottom: "1rem"
  };

  const textareaStyle = {
    width: "100%",
    height: "120px",
    padding: "0.5rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "1rem",
    resize: "vertical",
    marginBottom: "1rem"
  };

  const buttonStyle = {
    padding: "0.7rem 1.5rem",
    backgroundColor: "#e74c3c",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "1rem"
  };

  const goHome = () => navigate("/");

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Complaints</h2>
      <form>
        <textarea placeholder="Enter your complaint here" style={textareaStyle} />
        <br />
        <button type="submit" style={buttonStyle}>Submit</button>
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

export default Complaints;
