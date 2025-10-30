import React, { useState, useEffect } from 'react';
const API_URL = "http://localhost:5000";

const LiveResults = ({ styles }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchResults = async () => {
    try {
      // setLoading(true) // Don't show loading on auto-refresh
      const response = await fetch(`${API_URL}/api/results/live`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || 'Failed to fetch results');
      setResults(data);
      setError(null);
    } catch (err) { 
      setError(err.message); 
      console.error(err);
    } 
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchResults(); // Fetch once on load
    const interval = setInterval(fetchResults, 5000); // Auto-refresh every 5 seconds
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  if (loading && results.length === 0) return <center>Loading Live Results...</center>;
  if (error) return <center style={{color: 'red', fontWeight: 'bold'}}>{error}</center>;

  return (
    <div>
      <center><h3>Live Results</h3></center>
      {/* Fixed text color for header row */}
      <div style={{display:"flex", background:"#eee", padding:"10px", fontWeight:"bold", color: '#333'}}>
        <span style={{flex:3}}>Candidate Name</span>
        <span style={{flex:1, textAlign: 'right'}}>Vote Count</span>
      </div>
      {results.length === 0 ? (
        <div style={{padding: 20, textAlign: 'center'}}>No votes cast yet.</div>
      ) : (
        results.map((c, index) => (
          <div key={c._id} style={{display:"flex", background: index === 0 ? '#d4edda' : '#fff', padding:"10px", borderBottom: '1px solid #f0f0f0', alignItems: 'center'}}>
            <div style={{flex:3, fontWeight: index === 0 ? 'bold' : 'normal'}}>{c.name}</div>
            <div style={{flex:1, textAlign: 'right', fontWeight: 'bold', fontSize: 16}}>{c.votes}</div>
          </div>
        ))
      )}
    </div>
  );
};
export default LiveResults;
