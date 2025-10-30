import React, { useState, useEffect } from 'react';
const API_URL = "http://localhost:5000";

const AllCandidates = ({ styles, token }) => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/admin/candidates`, {
        headers: { "x-auth-token": token } // <-- Send token
      });
      if (!response.ok) throw new Error("Failed to fetch candidates");
      const data = await response.json();
      setCandidates(data);
    } catch (err) { 
      console.error(err); 
      alert(err.message); // Show error
    } 
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (token) fetchCandidates(); // Only fetch if token exists
  }, [token]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      try {
        await fetch(`${API_URL}/api/admin/candidates/${id}`, { 
          method: 'DELETE',
          headers: { "x-auth-token": token } // <-- Send token
        });
        setCandidates(candidates.filter(c => c._id !== id));
      } catch (err) { 
        console.error(err);
        alert('Failed to delete candidate'); 
      }
    }
  };

  if (loading) return <center>Loading Candidates...</center>;

  return (
    <div>
      <center><h3>All Candidates</h3></center>
      {/* Fixed text color for header row */}
      <div style={{display:"flex", background:"#eee", padding:"10px", fontWeight:"bold", color: '#333'}}>
        <span style={{flex:2}}>Name</span>
        <span style={{flex:3}}>Email</span>
        <span style={{flex:1}}>Action</span>
      </div>
      {candidates.length === 0 ? (
        <div style={{padding: 20, textAlign: 'center'}}>No candidates found.</div>
      ) : (
        candidates.map(c => (
          <div key={c._id} style={{display:"flex", background:"#fff", padding:"10px", borderBottom: '1px solid #f0f0f0', alignItems: 'center'}}>
            <div style={{flex:2}}>{c.name}</div>
            <div style={{flex:3}}>{c.email}</div>
            <div style={{flex:1}}>
              <button onClick={() => handleDelete(c._id)} style={{background: 'red', color: 'white', border: 0, borderRadius: 4, cursor: 'pointer', padding: '5px 10px'}}>
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
export default AllCandidates;
