import React from "react";
import { useNavigate } from "react-router-dom";

const Voting = () => {
  const navigate = useNavigate();

  const containerStyle = {
    padding: "2rem",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    maxWidth: "600px",
    margin: "2rem auto",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
    textAlign: "center"
  };

  const headingStyle = {
    marginBottom: "1rem",
    color: "#34495e"
  };

  const listStyle = {
    paddingLeft: "1.2rem",
    textAlign: "left",
    marginBottom: "1.2rem"
  };

  const buttonStyle = {
    padding: "0.7rem 1.5rem",
    fontSize: "1rem",
    color: "#fff",
    backgroundColor: "#2980b9",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  };

  const goHome = () => navigate("/");

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Cast Your Vote</h2>
      <p>Please select your preferred candidate from the list below:</p>
      <ul style={listStyle}>
        <li>Candidate 1: John Doe</li>
        <li>Candidate 2: Jane Smith</li>
        <li>Candidate 3: Raj Kumar</li>
      </ul>
      <button type="button" style={buttonStyle}>Submit Vote</button>
      <br />
      <button style={{...buttonStyle, marginTop:"1rem", backgroundColor:"#7f8c8d"}} onClick={goHome}>Back to Home</button>
    </div>
  );
};

export default Voting;
