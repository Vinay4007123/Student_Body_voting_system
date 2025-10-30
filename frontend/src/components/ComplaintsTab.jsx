import React, { useState, useEffect } from 'react';
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const ComplaintsTab = ({ styles, token }) => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/admin/complaints`, {
        headers: { "x-auth-token": token } // <-- Send token
      });
      if (!response.ok) throw new Error("Failed to fetch complaints");
      const data = await response.json();
      setComplaints(data);
    } catch (err) { 
      console.error(err); 
      alert(err.message);
    } 
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (token) fetchComplaints();
  }, [token]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this complaint?')) {
      try {
        await fetch(`${API_URL}/api/admin/complaints/${id}`, { 
          method: 'DELETE',
          headers: { "x-auth-token": token } // <-- Send token
        });
        setComplaints(complaints.filter(c => c._id !== id));
      } catch (err) { 
        console.error(err);
        alert('Failed to delete complaint'); 
      }
    }
  };

  if (loading) return <center>Loading Complaints...</center>;

  return (
    <div>
      <center><h3>User Complaints</h3></center>
      <div style={{border: '1px solid #ddd', borderRadius: 8, overflow: 'hidden'}}>
        {complaints.length === 0 ? (
          <div style={{padding: 20, textAlign: 'center'}}>No complaints found.</div>
        ) : (
          complaints.map(c => (
            <div key={c._id} style={{background:"#fff", padding:"15px", borderBottom: '1px solid #f0f0f0'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10}}>
                <div style={{fontWeight: 'bold'}}>{c.name} <span style={{fontWeight: 'normal', color: '#555'}}>&lt;{c.email}&gt;</span></div>
                <button onClick={() => handleDelete(c._id)} style={{background: 'red', color: 'white', border: 0, borderRadius: 4, cursor: 'pointer', padding: '5px 10px'}}>
                  Delete
                </button>
              </div>
              <p style={{margin: 0, background: '#f9f9f9', padding: 10, borderRadius: 4}}>{c.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
export default ComplaintsTab;
