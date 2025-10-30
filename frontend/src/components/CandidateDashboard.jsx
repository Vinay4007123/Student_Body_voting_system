import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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

  // Main wrapper ensures 100vw/100vh; light blue background
  const wrapperStyle = {
    minHeight: "100vh",
    width: "100vw",
    background: "#e6f2ff",
    margin: 0,
    display: "flex",
    flexDirection: "column",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  };

  // Top blue header, full width
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

  // Navigation tabs, wide and bold
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

  // Section/card container is maxed but will fill horizontally on larger screens
  const sectionWrap = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    minHeight: 0,
    width: "100%",
  };

  // Profile card style
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
    position: "relative"
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
    margin: "36px auto 0 auto"
  };

  // Footer full width
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
  const footerLinks = { display: "flex", gap: "17px", marginTop: 5 };

  // ========================= TAB CONTENTS =================== //
  function renderTab() {
    if (activeTab === "candidateInfo") {
      return (
        <div style={profileCard}>
          <div style={avatarStyle}>J</div>
          <div style={infoBlock}>
            <h2 style={{ margin: 0, fontSize: "1.65rem", color: "#212529", fontWeight: 700 }}>Candidate</h2>
            <div style={infoLine}><b>Email:</b> candidate@example.com</div>
            <div style={infoLine}><b>Phone:</b> +91-7396480075</div>
            <div style={infoLine}><b>About:</b> Candidate for Student Council</div>
          </div>
          <button style={editBtnStyle} onClick={() => setShowEdit(prev => !prev)}>
            <span role="img" aria-label="edit" style={{marginRight: 8}}>🖉</span>Edit Info
          </button>
          {showEdit && (
            <div style={{marginTop: 30, width: "100%"}}>
              <form>
                <div style={{marginBottom:15}}><label>Name:</label><input type="text" defaultValue="Candidate" style={{width:"100%",padding:8,borderRadius:7,border:"1px solid #ccc"}}/></div>
                <div style={{marginBottom:15}}><label>Email:</label><input type="email" defaultValue="candidate@example.com" style={{width:"100%",padding:8,borderRadius:7,border:"1px solid #ccc"}}/></div>
                <div style={{marginBottom:15}}><label>Phone:</label><input type="text" defaultValue="+91-9876543210" style={{width:"100%",padding:8,borderRadius:7,border:"1px solid #ccc"}}/></div>
                <div style={{marginBottom:15}}><label>Description:</label><textarea defaultValue="Candidate for Student Council" style={{width:"100%",padding:8,borderRadius:7,border:"1px solid #ccc"}}/></div>
                <button type="submit" style={editBtnStyle}>Update Info</button>
              </form>
            </div>
          )}
        </div>
      );
    }
    if (activeTab === "liveResults") {
      return (
        <div style={cardSectionStyle}>
          <center><h3>Live Voting Results</h3></center>
          <div style={{ fontWeight: "bold", marginBottom: 10 }}>Voting is ongoing...</div>
          <div>[Demo] Candidate 1: 45 votes; Candidate 2: 32 votes</div>
        </div>
      );
    }
    if (activeTab === "finalResults") {
      return (
        <div style={cardSectionStyle}>
          <center><h3>Final Results</h3></center>
          <div>
            <p>Results will be published later</p>
          </div>
        </div>
      );
    }
    if (activeTab === "settings") {
      return (
        <div style={cardSectionStyle}>
          <center><h3>Settings</h3></center>
          <p>[Settings options go here — edit info, change password, etc.]</p>
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
          <span style={headerGreeting}>Welcome, <b style={{color:"#fff"}}>Candidate</b></span>
        </div>
        <button style={signOutBtn} onClick={() => navigate("/")}>Sign Out</button>
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
            <a href="/help" style={{color:"#fff", textDecoration:"underline"}}>Help</a>
            <a href="/support" style={{color:"#fff", textDecoration:"underline"}}>Support</a>
            <a href="/complaints" style={{color:"#fff", textDecoration:"underline"}}>Complaints</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CandidateDashboard;
