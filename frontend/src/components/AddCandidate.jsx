import React, { useState } from 'react';
const API_URL = "http://localhost:5000";

const AddCandidate = ({ styles, token }) => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', description: '' });
  const [message, setMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setSuccessMessage('');
    try {
      const response = await fetch(`${API_URL}/api/admin/candidates`, {
        method: 'POST',
        headers: { 
          "Content-Type": "application/json", 
          "x-auth-token": token // <-- Send token
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || 'Failed to add candidate');
      
      // Show success message with default password
      setSuccessMessage(`Success! Candidate ${data.candidate.name} added. Default Password: ${data.defaultPassword}`);
      setFormData({ name: '', email: '', phone: '', description: '' }); // Clear form
    } catch (err) { 
      console.error(err);
      setMessage(`Error: ${err.message}`); 
    }
  };

  return (
    <div>
      <center><h3>Add Candidate</h3></center>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" required style={styles.input} value={formData.name} onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" required style={styles.input} value={formData.email} onChange={handleChange} />
        {/* No password field needed, it's auto-generated */}
        <input type="text" name="phone" placeholder="Phone (10 digits)" style={styles.input} value={formData.phone} onChange={handleChange} />
        <textarea name="description" placeholder="Description" style={{...styles.input, height: '100px', resize: 'vertical'}} value={formData.description} onChange={handleChange} />
        <center>
          <button type="submit" style={{...styles.tab(false), borderRadius: "6px", background: "#0077cc", margin: 0, color: '#fff'}}>
            Add Candidate
          </button>
        </center>
      </form>
      {message && <center style={{ marginTop: 15, fontWeight: 'bold', color: 'red' }}>{message}</center>}
      {successMessage && <center style={{ marginTop: 15, fontWeight: 'bold', color: 'green' }}>{successMessage}</center>}
    </div>
  );
};
export default AddCandidate;
