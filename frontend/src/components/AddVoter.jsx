import React, { useState } from 'react';
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const AddVoter = ({ styles, token }) => {
  const [regno, setRegno] = useState('');
  const [message, setMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setSuccessMessage('');
    try {
      const response = await fetch(`${API_URL}/api/admin/voters`, {
        method: 'POST',
        headers: { 
          "Content-Type": "application/json", 
          "x-auth-token": token // <-- Send token
        },
        body: JSON.stringify({ regno }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || 'Failed to add voter');
      setSuccessMessage(`Success: ${data.msg}`);
      setRegno(''); 
    } catch (err) { 
      console.error(err);
      setMessage(`Error: ${err.message}`); 
    }
  };

  return (
    <div>
      <center><h3>Add Voter</h3></center>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Registration Number" required style={styles.input} value={regno} onChange={(e) => setRegno(e.target.value)} />
        <center>
          <button type="submit" style={{...styles.tab(false), borderRadius: "6px", background: "#0077cc", margin: 0, color: '#fff'}}>
            Add Voter
          </button>
        </center>
      </form>
      {message && <center style={{ marginTop: 15, fontWeight: 'bold', color: 'red' }}>{message}</center>}
      {successMessage && <center style={{ marginTop: 15, fontWeight: 'bold', color: 'green' }}>{successMessage}</center>}
    </div>
  );
};
export default AddVoter;
