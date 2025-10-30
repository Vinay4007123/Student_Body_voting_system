import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const TAB_LIST = [
  { id: "candidateInfo", label: "Info" },
  { id: "liveResults", label: "Live Results" },
  { id: "finalResults", label: "Final Results" },
  { id: "settings", label: "Settings" },
];

const CandidateDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("candidateInfo");
  const [showEdit, setShowEdit] = useState(false);

  // --- NEW STATE FOR DYNAMIC DATA ---
  const [candidateInfo, setCandidateInfo] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', email: '', phone: '', description: '' });
  const [liveResults, setLiveResults] = useState([]);
  const [finalResults, setFinalResults] = useState([]);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const token = localStorage.getItem("token"); // Get token once

  // --- 1. PROTECTION & DATA FETCHING ---
  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (!token || role !== 'candidate') {
      navigate("/candidate-login");
      return;
    }

    // Fetch candidate data
    const fetchCandidateData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/candidate/me`, {
          headers: { "x-auth-token": token },
        });
        if (!response.ok) throw new Error("Token invalid");
        const data = await response.json();
        setCandidateInfo(data);
        setEditFormData({ // Pre-fill the edit form
          name: data.name,
          email: data.email,
          phone: data.phone || '',
          description: data.description || ''
        });
      } catch (err) {
        handleSignOut(); // Log out if token is bad
      }
    };
    fetchCandidateData();
  }, [navigate, token]);

  // --- 2. FETCH RESULTS BASED ON TAB ---
  useEffect(() => {
    const fetchResults = async (type) => {
      try {
        const response = await fetch(`${API_URL}/api/results/${type}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.msg);
        if (type === 'live') setLiveResults(data);
        if (type === 'final') setFinalResults(data);
      } catch (err) {
        console.error(err);
      }
    };

    if (activeTab === 'liveResults') fetchResults('live');
    if (activeTab === 'finalResults') fetchResults('final');
  }, [activeTab]);


  // --- 3. HANDLER FUNCTIONS ---
  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    navigate("/");
  };

  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    setMessage("");
    setSuccessMessage("");
    try {
      const response = await fetch(`${API_URL}/api/candidate/me`, {
        method: 'PUT',
        headers: { "Content-Type": "application/json", "x-auth-token": token },
        body: JSON.stringify(editFormData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.msg);
      
      setSuccessMessage(data.msg);
      setCandidateInfo(data.candidate); // Update info on screen
      setShowEdit(false); // Hide form
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setSuccessMessage("");
    try {
      const response = await fetch(`${API_URL}/api/candidate/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-auth-token": token },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.msg);
      
      setSuccessMessage(data.msg + " You will be logged out in 3 seconds.");
      setOldPassword("");
      setNewPassword("");
      setTimeout(handleSignOut, 3000);
    } catch (err) {
      setMessage(err.message);
    }
  };
  
  const handleFormChange = (e) => {
     setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };


  // --- STYLES (FILLED IN) ---
  const wrapperStyle = {
    minHeight: "100vh",
    width: "100vw",
    background: "#e6f2ff",
    margin: 0,
    display: "flex",
    flexDirection: "column",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  };
  const headerStyle = {
    background: "#1597ea",
    color: "white",
    width: "100%",
    minHeight: 60,
    display: "flex",
    alignItems: "center",
    padding: "0 32px",
    boxSizing: "border-box",
    boxShadow: "0 2px 5px rgba(0,0,0,0.13)",
    justifyContent: "space-between",
    flexWrap: "wrap"
  };
  const headerTitle = { fontSize: "2rem", fontWeight: 700, marginRight: 14 };
  const headerGreeting = { fontSize: "1.1rem", fontWeight: 400, marginRight: 16, marginLeft: 2 };
  const signOutBtn = {
    background: "#ff4d4d",
    color: "#fff",
    border: "none",
    fontSize: "1rem",
    fontWeight: "bold",
    borderRadius: "8px",
    padding: "10px 22px",
    cursor: "pointer",
    transition: "background 0.3s",
    marginLeft: 0
  };
  const tabsStyle = {
    width: "100%",
    background: "#fff",
    display: "flex",
    justifyContent: "center",
    gap: "26px",
    flexWrap: "wrap",
    padding: "18px 0",
    boxShadow: "0 2px 6px rgba(0,0,0,0.07)"
  };
  const tabStyle = (active) => ({
    border: "none",
    outline: "none",
    borderRadius: "24px",
    background: active ? "#1597ea" : "#1d9bfb",
    color: "#fff",
    fontWeight: 600,
    fontSize: "1.12rem",
    padding: "13px 36px",
    margin: "0 6px",
    boxShadow: active ? "0 3px 12px rgba(21,151,234,0.12)" : "none",
    cursor: "pointer",
    transition: "background 0.2s"
  });
  const sectionWrap = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    minHeight: 0,
    width: "100%",
  };
  const profileCard = {
    width: "100%",
    maxWidth: 850,
    background: "#fff",
    borderRadius: "18px",
    boxShadow: "0 3px 14px rgba(0,0,0,0.12)",
    padding: "2.3rem 2.5rem",
    margin: "40px auto 0 auto",
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    position: "relative",
    boxSizing: 'border-box',
  };
  const avatarStyle = {
    width: 70,
    height: 70,
    borderRadius: "50%",
    background: "#1597ea",
    color: "white",
    fontSize: "2.1rem",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 32
  };
  const infoBlock = { display: "flex", flexDirection: "column", flex: 1 };
  const infoLine = { margin: "4px 0", fontSize: "1.13rem", color: "#343a40" };
  const editBtnStyle = {
    background: "#1d9bfb",
    color: "#fff",
    border: "none",
    borderRadius: "24px",
    fontWeight: 700,
    fontSize: "1.08rem",
    padding: "12px 32px",
    marginLeft: 10,
    cursor: "pointer",
    boxShadow: "0 2px 7px rgba(29,155,251,0.07)",
    display: "flex",
    alignItems: "center"
  };
  const cardSectionStyle = {
    width: "100%",
    maxWidth: 850,
    background: "#fff",
    borderRadius: "14px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.09)",
    padding: "2.1rem 2.1rem",
    margin: "36px auto 0 auto",
    boxSizing: 'border-box',
  };
  const footerStyle = {
    width: "100%",
    background: "#03396C",
    color: "white",
    padding: "22px 36px",
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: "48px"
  };
  const footerCol = { display: "flex", flexDirection: "column" };
  const footerLinks = { 
    display: "flex", 
    gap: "17px", 
    marginTop: 5,
    visibility: "hidden" // Hides the links but keeps spacing
  };

  // New styles for forms
  const formInput = {
    width:"100%",
    padding:"10px",
    borderRadius:"7px",
    border:"1px solid #ccc",
    boxSizing: 'border-box',
    fontSize: '1rem',
    marginTop: '5px'
  };
  const formLabel = {
    fontWeight: 'bold',
    color: '#333'
  };
  const formGroup = {
    marginBottom: '15px'
  };
  const messageStyles = (isError = true) => ({
      textAlign: "center",
      color: isError ? "red" : "green",
      fontWeight: "bold",
      margin: "15px 0",
      fontSize: "1.1rem",
  });
  const resultsRow = (isWinner = false) => ({
      display: 'flex',
      justifyContent: 'space-between',
      padding: '10px',
      background: isWinner ? '#d4edda' : '#fff',
      borderBottom: '1px solid #eee',
      fontWeight: isWinner ? 'bold' : 'normal',
      color: '#333', // Make sure text is visible
  });


  // ========================= TAB CONTENTS =================== //
  function renderTab() {
    // Show a loading state until info is fetched
    if (!candidateInfo) {
      return (
        <div style={cardSectionStyle}>
          <center><h3 style={{color: '#333'}}>Loading Dashboard...</h3></center>
        </div>
      );
    }
    
    // INFO TAB
    if (activeTab === "candidateInfo") {
      return (
        <div style={profileCard}>
          <div style={avatarStyle}>{candidateInfo.name.charAt(0).toUpperCase()}</div>
          <div style={infoBlock}>
            <h2 style={{ margin: 0, fontSize: "1.65rem", color: "#212529", fontWeight: 700 }}>
              {candidateInfo.name}
            </h2>
            <div style={infoLine}><b>Email:</b> {candidateInfo.email}</div>
            <div style={infoLine}><b>Phone:</b> {candidateInfo.phone || 'N/A'}</div>
            <div style={infoLine}><b>About:</b> {candidateInfo.description || 'N/A'}</div>
          </div>
          <button style={editBtnStyle} onClick={() => setShowEdit(prev => !prev)}>
            <span role="img" aria-label="edit" style={{marginRight: 8}}>🖉</span>
            {showEdit ? 'Cancel' : 'Edit Info'}
          </button>
          
          {/* --- EDIT FORM --- */}
          {showEdit && (
            <div style={{marginTop: 30, width: "100%"}}>
              <form onSubmit={handleUpdateInfo}>
                <div style={formGroup}>
                  <label style={formLabel}>Name:</label>
                  <input type="text" name="name" value={editFormData.name} onChange={handleFormChange} style={formInput}/>
                </div>
                <div style={formGroup}>
                  <label style={formLabel}>Email:</label>
                  <input type="email" name="email" value={editFormData.email} onChange={handleFormChange} style={formInput}/>
                </div>
                <div style={formGroup}>
                  <label style={formLabel}>Phone:</label>
                  <input type="text" name="phone" value={editFormData.phone} onChange={handleFormChange} style={formInput}/>
                </div>
                <div style={formGroup}>
                  <label style={formLabel}>Description:</label>
                  <textarea name="description" value={editFormData.description} onChange={handleFormChange} style={{...formInput, minHeight: '80px'}}/>
                </div>
                {message && <div style={messageStyles(true)}>{message}</div>}
                {successMessage && <div style={messageStyles(false)}>{successMessage}</div>}
                <button type="submit" style={editBtnStyle}>Update Info</button>
              </form>
            </div>
          )}
        </div>
      );
    }

    // LIVE RESULTS TAB
    if (activeTab === "liveResults") {
      return (
        <div style={cardSectionStyle}>
          <center><h3 style={{color: '#333'}}>Live Voting Results</h3></center>
          <div style={{...resultsRow(), background: '#eee', fontWeight: 'bold'}}>
              <span>Candidate Name</span>
              <span>Vote Count</span>
          </div>
          {liveResults.length > 0 ? liveResults.map((c, index) => (
             <div key={c._id} style={resultsRow(index === 0)}>
                <span>{c.name} {c._id === candidateInfo._id && "(You)"}</span>
                <span>{c.votes}</span>
             </div>
          )) : (
            <p style={{textAlign: 'center', padding: '20px', color: '#555'}}>Voting has not started or no votes cast yet.</p>
          )}
        </div>
      );
    }
    
    // FINAL RESULTS TAB
    if (activeTab === "finalResults") {
      return (
        <div style={cardSectionStyle}>
          <center><h3 style={{color: '#333'}}>Final Results</h3></center>
          <div style={{...resultsRow(), background: '#eee', fontWeight: 'bold'}}>
              <span>Candidate Name</span>
              <span>Total Votes</span>
          </div>
          {finalResults.length > 0 ? finalResults.map((c, index) => (
             <div key={c._id} style={resultsRow(index === 0)}>
                <span>{c.name} {c._id === candidateInfo._id && "(You)"}</span>
                <span>{c.votes}</span>
             </div>
          )) : (
            <p style={{textAlign: 'center', padding: '20px', color: '#555'}}>Final results are not yet published.</p>
          )}
        </div>
      );
    }

    // SETTINGS TAB
    if (activeTab === "settings") {
      return (
        <div style={cardSectionStyle}>
          <center><h3 style={{color: '#333'}}>Settings - Change Password</h3></center>
          <form onSubmit={handleChangePassword}>
             <div style={formGroup}>
                <label style={formLabel}>Old Password:</label>
                <input 
                  type="password" 
                  value={oldPassword} 
                  onChange={(e) => setOldPassword(e.target.value)} 
                  style={formInput}
                  placeholder="Enter 'password123' if first login"
                />
             </div>
             <div style={formGroup}>
                <label style={formLabel}>New Password:</label>
                <input 
                  type="password" 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                  style={formInput}
                  placeholder="Enter a strong new password"
                />
             </div>
             {message && <div style={messageStyles(true)}>{message}</div>}
             {successMessage && <div style={messageStyles(false)}>{successMessage}</div>}
             <button type="submit" style={{...editBtnStyle, background: '#27ae60'}}>
                Update Password
             </button>
          </form>
        </div>
      );
    }
    return null;
  }

  // ======================== RETURN ======================== //
  return (
    <div style={wrapperStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <span style={headerTitle}>Candidate Dashboard</span>
          <span style={headerGreeting}>
            Welcome, <b style={{color:"#fff"}}>{candidateInfo?.name || '...'}</b>
          </span>
        </div>
        <button style={signOutBtn} onClick={handleSignOut}>Sign Out</button>
      </div>
      
      {/* Tabs Nav */}
      <nav style={tabsStyle}>
        {TAB_LIST.map(tab => (
          <button
            key={tab.id}
            style={tabStyle(activeTab === tab.id)}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      
      {/* Tab content section */}
      <main style={sectionWrap}>{renderTab()}</main>
      
      {/* Footer */}
      <footer style={footerStyle}>
        <div style={footerCol}>
          <h3 style={{margin:0, display:"flex",alignItems:"center",gap:7}}>
            <span role="img" aria-label="vote">🗳️</span>
            SBVS Voting Portal
          </h3>
          <div style={{marginTop:7}}>
            <span role="img" aria-label="phone">📞</span>
            Contact: +91-9182040905
          </div>
        </div>
        <div style={{textAlign:"right"}}>
          <div>© 2025 SBVS. All Rights Reserved.</div>
          <div style={footerLinks}>
            {/* Links are hidden via CSS */}
            <a href="/help">Help</a>
            <a href="/support">Support</a>
            <a href="/complaints">Complaints</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CandidateDashboard;

