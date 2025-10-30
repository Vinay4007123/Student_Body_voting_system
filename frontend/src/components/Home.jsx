import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  // Outer flex container for centering
  const wrapperStyle = {
    minHeight: "100vh",
    minWidth: "100vw",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "white", // true black look, use "#000" if you want pure black
  };

  // Card style
  const containerStyle = {
    padding: "2rem",
    maxWidth: 800,
    margin: "0 auto",
    textAlign: "center",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#d0e7ff",
    borderRadius: "12px",
    boxShadow: "0 2px 16px rgba(0,0,0,0.2)",
  };

  const buttonStyle = {
    padding: "0.8rem 1.5rem",
    margin: "0 0.5rem",
    fontSize: "1rem",
    cursor: "pointer",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#e74c3c",
    color: "#fff",
  };

  return (
    <div style={wrapperStyle}>
      <div style={containerStyle}>
        <h1 style={{ fontSize: "3rem", fontWeight: 700, color: "#fff", marginBottom: "1rem" }}>
          Student Body Voting System
        </h1>
        <p style={{ color: "#87aacc", fontSize: "1.2rem", marginBottom: "2rem", lineHeight: 1.5 }}>
          The Student Body Voting System is designed to provide a secure and transparent platform for students to digitally elect their representatives. It includes a robust verification system to ensure voting integrity, real-time result updates, and prevents multiple votes by the same individual.
          Admins can easily manage candidates and voters, while all participants experience a user-friendly interface. This system was proudly created by Janakiram as a part of VFSTR's student projects to enhance democratic practices in campus life.
        </p>
        <button style={buttonStyle} onClick={() => navigate("/admin-login")}>
          Admin Login
        </button>
        <button style={buttonStyle} onClick={() => navigate("/verify")}>
          Voter Login
        </button>
        <button style={buttonStyle} onClick={() => navigate("/candidate-login")}>
          Candidate Login
        </button>
      </div>
    </div>
  );
};

export default Home;
