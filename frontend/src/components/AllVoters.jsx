import React, { useState, useEffect } from 'react';
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const AllVoters = ({ styles, token }) => {
  const [voters, setVoters] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVoters = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/admin/voters`, {
        headers: { "x-auth-token": token } // <-- Send token
      });
      if (!response.ok) throw new Error("Failed to fetch voters");
      const data = await response.json();
      setVoters(data);
    } catch (err) { 
      console.error(err); 
      alert(err.message);
    } 
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (token) fetchVoters();
  }, [token]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this voter?')) {
      try {
        await fetch(`${API_URL}/api/admin/voters/${id}`, { 
          method: 'DELETE',
          headers: { "x-auth-token": token } // <-- Send token
        });
        setVoters(voters.filter(v => v._id !== id));
      } catch (err) { 
        console.error(err);
        alert('Failed to delete voter'); 
      }
    }
  };

  const statusStyle = (status) => {
    let color = status === 'approved' ? 'green' : (status === 'pending' ? 'orange' : 'red');
    return { color: color, fontWeight: 'bold' };
  };

  if (loading) return <center>Loading Voters...</center>;

  return (
    <div>
      <center><h3>All Voters</h3></center>
      {/* Fixed text color for header row */}
      <div style={{display:"flex", background:"#eee", padding:"10px", fontWeight:"bold", color: '#333'}}>
        <span style={{flex:2}}>Registration No.</span>
        <span style={{flex:1}}>Status</span>
        <span style={{flex:1}}>Voted</span>
        <span style={{flex:1}}>Action</span>
      </div>
      {voters.length === 0 ? (
        <div style={{padding: 20, textAlign: 'center'}}>No voters found.</div>
      ) : (
        voters.map(v => (
          <div key={v._id} style={{display:"flex", alignItems: 'center', background:"#fff", padding:"10px", borderBottom: '1px solid #f0f0f0'}}>
            <div style={{flex:2}}>{v.regno}</div>
            <div style={{flex:1}}><span style={statusStyle(v.status)}>{v.status}</span></div>
            <div style={{flex:1}}>{v.hasVoted ? 'Yes' : 'No'}</div>
            <div style={{flex:1}}>
              <button onClick={() => handleDelete(v._id)} style={{background: 'red', color: 'white', border: 0, borderRadius: 4, cursor: 'pointer', padding: '5px 10px'}}>
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
export default AllVoters;
