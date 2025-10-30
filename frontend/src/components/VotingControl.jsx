import React, { useState, useEffect } from 'react';
const API_URL = "http://localhost:5000";

const VotingControl = ({ styles, token }) => {
  const [status, setStatus] = useState('Loading...');
  const [message, setMessage] = useState('');

  const fetchStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/election-status`, {
        headers: { "x-auth-token": token } // <-- Send token
      });
      if (!response.ok) throw new Error("Failed to fetch status");
      const data = await response.json();
      setStatus(data.status);
    } catch (err) { 
      console.error(err);
      setStatus('Error fetching status'); 
    }
  };

  // Fetch status when token is available
  useEffect(() => {
    if (token) fetchStatus();
  }, [token]);

  const handleSetStatus = async (newStatus) => {
    setMessage('');
    try {
      const response = await fetch(`${API_URL}/api/admin/election-status`, {
        method: 'POST',
        headers: { 
          "Content-Type": "application/json", 
          "x-auth-token": token // <-- Send token
        },
        body: JSON.stringify({ newStatus }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || 'Failed to update status');
      
      setStatus(data.status.status);
      setMessage(data.msg); // This will now include the "reset" message
    } catch (err) { 
      console.error(err);
      setMessage(`Error: ${err.message}`); 
    }
  };

  const btnStyle = (bg) => ({ ...styles.tab(false), background: bg, margin: '10px 5px', color: '#fff' });

  return (
    <div>
      <center>
        <h3>Voting Control</h3>
        <p style={{fontSize: 20, color: '#333'}}>Current Status: <b style={{color: '#0077cc'}}>{status}</b></p>
        <div>
          <button style={btnStyle('#28a745')} onClick={() => handleSetStatus('Running')} disabled={status === 'Running'}>
            Start Voting
          </button>
          <button style={btnStyle('#dc3545')} onClick={() => handleSetStatus('Ended')} disabled={status === 'Ended'}>
            Stop Voting
          </button>
          <button style={btnStyle('#ffc107')} onClick={() => handleSetStatus('Published')} disabled={status === 'Published'}>
            Publish Results
          </button>
          <button style={btnStyle('#6c757d')} onClick={() => handleSetStatus('Not Started')}>
            Reset (Not Started)
          </button>
        </div>
        {message && <p style={{fontWeight: 'bold', marginTop: 15, color: message.includes('Error') ? 'red' : 'green'}}>{message}</p>}
      </center>
    </div>
  );
};
export default VotingControl;
