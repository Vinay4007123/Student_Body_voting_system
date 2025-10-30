import React, { useState, useEffect } from "react";
const API_URL = "http://localhost:5000";

const VerifyVoters = ({ token }) => {
  const [pendingVoters, setPendingVoters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define styles locally since it doesn't receive 'styles' prop
  const btnStyles = (color) => ({
    background: color, color: "#fff", border: "none", borderRadius: "6px",
    padding: "8px 16px", fontWeight: "bold", cursor: "pointer", margin: "0 5px"
  });
  
  const tableStyle = {
    width: "100%", 
    borderCollapse: "collapse", 
    color: '#333' // <-- Fixed text color
  };
  
  const thStyle = {
    background: '#eee',
    padding: '12px 8px',
    border: '1px solid #ddd',
    textAlign: 'left',
  };

  const tdStyle = {
    border: '1px solid #ddd', 
    padding: '12px 8px',
    textAlign: 'left',
  };


  const fetchPendingVoters = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/admin/pending`, {
        headers: { "x-auth-token": token } // <-- Send token
      });
      if (!response.ok) throw new Error("Failed to fetch pending voters.");
      const data = await response.json();
      setPendingVoters(data);
      setError(null);
    } catch (err) { 
      console.error(err);
      setError(err.message); 
    } 
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (token) fetchPendingVoters();
  }, [token]);

  const handleAction = async (voterId, action) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/${action}/${voterId}`, {
        method: "PATCH",
        headers: { "x-auth-token": token } // <-- Send token
      });
      if (!response.ok) throw new Error(`Failed to ${action} voter.`);
      setPendingVoters((current) => current.filter((v) => v._id !== voterId));
    } catch (err) { 
      console.error(err);
      alert(`Error: ${err.message}`); 
    }
  };
  
  if (loading) return <div>Loading Pending Voters...</div>;
  if (error) return <div style={{color: 'red', fontWeight: 'bold'}}>Error: {error}</div>;

  return (
    <div>
      <center><h3>Verify Voters</h3></center>
      {pendingVoters.length === 0 ? (
        <div style={{textAlign: "center", padding: 40}}>No pending voters found.</div>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Reg. No.</th>
              <th style={thStyle}>Certificate</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingVoters.map((voter) => (
              <tr key={voter._id}>
                <td style={tdStyle}>{voter.regno}</td>
                <td style={tdStyle}>
                  <a href={`${API_URL}/${voter.certificateImage}`} target="_blank" rel="noopener noreferrer">
                    View Image
                  </a>
                </td>
                <td style={tdStyle}>
                  <button style={btnStyles('#28a745')} onClick={() => handleAction(voter._id, 'approve')}>Approve</button>
                  <button style={btnStyles('#dc3545')} onClick={() => handleAction(voter._id, 'reject')}>Reject</button>
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
