import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Verify = () => {
  const navigate = useNavigate();
  const [regno, setRegno] = useState("");
  const [certificate, setCertificate] = useState(null); // State for the file
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // For loading state

  const pageStyle = {
    minHeight: "100vh",
    width: "100vw",
    background: "#f0f6fc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: 0,
  };
  const cardStyle = {
    background: "#fff",
    padding: "2.5rem 2rem",
    borderRadius: "12px",
    boxShadow: "0 0 15px rgba(0,0,0,0.1)",
    textAlign: "center",
    width: "100%",
    maxWidth: 400,
    boxSizing: "border-box", 
  };
  const headingStyle = {
    color: "#2c3e50",
    marginBottom: "1.5rem",
    fontSize: "2rem",
    fontWeight: 700,
  };
  const inputStyle = {
    width: "100%",
    padding: "12px",
    margin: "10px 0 0 0",
    border: "1px solid #ccc",
    borderRadius: "8px",
    fontSize: "16px",
    display: "block",
    backgroundColor: "#fff",
    color: "#000",
    boxSizing: "border-box", 
  };
  const buttonStyle = {
    marginTop: "20px",
    padding: "12px 30px",
    fontSize: "16px",
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 600,
    transition: "background 0.3s",
    width: "100%", 
    boxSizing: "border-box", 
    opacity: isLoading ? 0.7 : 1, // Dim button when loading
  };
  const backButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#7f8c8d",
    marginTop: "1rem",
  };
  const errorStyle = {
    marginTop: "15px",
    color: "red",
    minHeight: "20px",
    fontWeight: 500,
  };
  const fileInputLabelStyle = {
    ...buttonStyle, 
    backgroundColor: "#2c3e50",
    marginTop: "1rem",
    display: "block", 
  };
  const hiddenFileInputStyle = {
    display: "none",
  };
  const fileNameStyle = {
    marginTop: "10px",
    color: "#555",
    fontStyle: "italic",
    minHeight: "20px",
  };
  
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setCertificate(e.target.files[0]);
      setMessage(""); // Clear any old errors
    }
  };

  // UPDATED: Submit logic to send to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear old messages
    
    if (regno.trim() === "") {
      setMessage("Please enter a Registration Number!");
      return;
    } else if (!certificate) { 
      setMessage("Please upload your verification certificate!");
      return;
    } 

    setIsLoading(true);

    // Use FormData to send file and text
    const formData = new FormData();
    formData.append('regno', regno);
    formData.append('certificate', certificate); // 'certificate' must match backend upload.single('certificate')

    try {
      // Send request to your backend
      // Make sure your backend server is running on http://localhost:5000
      const response = await fetch('http://localhost:5000/api/verify', {
        method: 'POST',
        body: formData,
        // NOTE: Don't set 'Content-Type' header, 
        // the browser will set it automatically for FormData
      });

      const data = await response.json();
      setIsLoading(false);

      if (!response.ok) {
        // If server returns an error (like "regno already exists")
        setMessage(data.msg || 'An error occurred.');
      } else {
        // Success
        setMessage("");
        alert(data.msg); // Show success message from backend
        navigate("/"); // Send user home to wait
      }
    } catch (err) {
      setIsLoading(false);
      console.error('Submit error:', err);
      setMessage('Failed to connect to the server. Please try again later.');
    }
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h2 style={headingStyle}>Voter Verification</h2>
        <p style={{color: "#555", marginTop: "-1rem", marginBottom: "1rem"}}>
          Please enter your Registration No. and upload your college ID card to vote.
        </p>
        <form onSubmit={handleSubmit} autoComplete="off">
          <input
            type="text"
            id="regno"
            name="regno"
            placeholder="Enter Registration Number"
            value={regno}
            onChange={(e) => setRegno(e.target.value)}
            style={inputStyle}
            disabled={isLoading}
          />

          {/* File Upload Section */}
          <label htmlFor="certificate-upload" style={fileInputLabelStyle}>
            Upload Certificate (ID Card)
          </label>
          <input
            id="certificate-upload"
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            style={hiddenFileInputStyle}
            onChange={handleFileChange}
            disabled={isLoading}
          />
          <div style={fileNameStyle}>
            {certificate ? certificate.name : "No file selected."}
          </div>
          {/* END NEW */}

          <button type="submit" style={buttonStyle} disabled={isLoading}>
            {isLoading ? 'Submitting...' : 'Submit for Verification'}
          </button>
          <div style={errorStyle}>{message}</div>
        </form>
        <button style={backButtonStyle} onClick={() => navigate("/")} disabled={isLoading}>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default Verify;