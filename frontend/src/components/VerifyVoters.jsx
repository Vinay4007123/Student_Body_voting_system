import React, { useState, useEffect } from 'react';

// This is the component for the admin to see and approve voters
const VerifyVoters = () => {
  const [pendingVoters, setPendingVoters] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Function to fetch pending voters from the backend
  const fetchPendingVoters = async () => {
    setError('');
    setMessage('');
    try {
      const response = await fetch('http://localhost:5000/api/admin/pending');
      if (!response.ok) throw new Error('Failed to fetch pending voters');
      const data = await response.json();
      setPendingVoters(data);
    } catch (err) {
      setError('Error fetching pending voters: ' + err.message);
    }
  };

  // Fetch voters when component loads
  useEffect(() => {
    fetchPendingVoters();
  }, []);

  // Function to handle approving a voter
  const handleApprove = async (voterId) => {
    setError('');
    setMessage('');
    try {
      const response = await fetch(`http://localhost:5000/api/admin/approve/${voterId}`, {
        method: 'PATCH',
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Failed to approve voter');
      }
      
      setMessage(data.msg); // Show "Voter approved"
      // Remove the approved voter from the list
      setPendingVoters(prev => prev.filter(voter => voter._id !== voterId));
      
    } catch (err) {
      setError('Error: ' + err.message);
    }
  };

  // Styles (you can move these to your main style object)
  const tableStyle = {
    width: "100%", 
    marginTop: 20, 
    borderCollapse: "collapse"
  };
  const thStyle = {
    border: "1px solid #ddd",
    padding: 8,
    background: "#f2f2f2",
    textAlign: "left",
  };
  const tdStyle = {
    border: "1px solid #ddd",
    padding: 8,
    textAlign: "left",
    verticalAlign: "middle",
  };
  const imgStyle = {
    width: 100,
    height: "auto",
    cursor: "pointer",
    display: "block",
  };
  const buttonStyle = {
    padding: "5px 10px",
    background: "#28a745",
    color: "white",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
  };

  return (
    <div>
      <center><h3>Voter Verification Requests</h3></center>
      {message && <div style={{ color: 'green', textAlign: 'center', marginBottom: '1rem' }}>{message}</div>}
      {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>{error}</div>}
      
      {pendingVoters.length === 0 ? (
        <p style={{ textAlign: 'center', marginTop: 20 }}>No pending verification requests.</p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Reg. Number</th>
              <th style={thStyle}>Certificate (Click to view)</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {pendingVoters.map(voter => (
              <tr key={voter._id}>
                <td style={tdStyle}>{voter.regno}</td>
                <td style={tdStyle}>
                  {/* The URL points to your backend's static file server */}
                  <a 
                    href={`http://localhost:5000/${voter.certificateImage.replace(/\\/g, '/')}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <img 
                      src={`http://localhost:5000/${voter.certificateImage.replace(/\\/g, '/')}`} 
                      alt="Certificate" 
                      style={imgStyle}
                    />
                  </a>
                </td>
                <td style={{...tdStyle, textAlign: "center"}}>
                  <button 
                    style={buttonStyle}
                    onClick={() => handleApprove(voter._id)}
                  >
                    Approve
                  </button>
                  {/* You could add a 'Reject' button here too */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default VerifyVoters;