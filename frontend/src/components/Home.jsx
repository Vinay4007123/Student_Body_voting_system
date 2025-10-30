import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  // Outer flex container for centering, with light blue background
  const wrapperStyle = {
    minHeight: "100vh",
    minWidth: "100vw",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f0f6fc", // Consistent app background
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  };

  // Card style (now white with a modern shadow)
  const containerStyle = {
    padding: "3rem", // Increased padding
    maxWidth: 800,
    margin: "0 auto",
    textAlign: "center",
    backgroundColor: "#ffffff", // White card
    borderRadius: "12px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.1)", // Softer shadow
  };

  // Base button style
  const buttonBaseStyle = {
    padding: "0.8rem 1.5rem",
    margin: "0.5rem",
    fontSize: "1rem",
    cursor: "pointer",
    borderRadius: "6px", // Consistent border radius
    border: "none",
    color: "#fff",
    fontWeight: 600, // Bolder text
    transition: "transform 0.2s, filter 0.2s",
  };

  // Specific button styles by merging with the base
  const styles = {
    adminButton: {
      ...buttonBaseStyle,
      backgroundColor: "#e74c3c", // Red
    },
    voterLoginButton: {
      ...buttonBaseStyle,
      backgroundColor: "#27ae60", // Green
    },
    voterVerifyButton: {
      ...buttonBaseStyle,
      backgroundColor: "#3498db", // Blue
    },
    candidateButton: {
      ...buttonBaseStyle,
      backgroundColor: "#f39c12", // Yellow
    }
  };


  return (
    <div style={wrapperStyle}>
      <div style={containerStyle}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 700, color: "#2c3e50", marginBottom: "1rem" }}>
          Student Body Voting System
        </h1>
        <p style={{ color: "#555", fontSize: "1.1rem", marginBottom: "2.5rem", lineHeight: 1.6 }}>
          The Student Body Voting System is designed to provide a secure and transparent platform for students to digitally elect their representatives. It includes a robust verification system to ensure voting integrity, real-time result updates, and prevents multiple votes by the same individual.
          Admins can easily manage candidates and voters, while all participants experience a user-friendly interface. This system was proudly created by Janakiram as a part of VFSTR's student projects to enhance democratic practices in campus life.
        </p>
        
        {/* Button Container */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px" }}>
          
          <button 
            style={styles.adminButton} 
            onClick={() => navigate("/admin-login")}
            onMouseOver={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
            onMouseOut={(e) => e.currentTarget.style.filter = 'brightness(1)'}
          >
            Admin Login
          </button>
          
          <button 
            style={styles.voterLoginButton} 
            onClick={() => navigate("/voting")}
            onMouseOver={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
            onMouseOut={(e) => e.currentTarget.style.filter = 'brightness(1)'}
          >
            Voter Login / Vote
          </button>

          <button 
            style={styles.voterVerifyButton} 
            onClick={() => navigate("/verify")}
            onMouseOver={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
            onMouseOut={(e) => e.currentTarget.style.filter = 'brightness(1)'}
          >
            Voter Verification
          </button>

          <button 
            style={styles.candidateButton} 
            onClick={() => navigate("/candidate-login")}
            onMouseOver={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
            onMouseOut={(e) => e.currentTarget.style.filter = 'brightness(1)'}
          >
            Candidate Login
          </button>

        </div>
      </div>
    </div>
  );
};

export default Home;
