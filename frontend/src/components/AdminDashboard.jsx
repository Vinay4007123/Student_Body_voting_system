import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// --- IMPORT ALL YOUR TAB COMPONENTS ---
import VerifyVoters from "./VerifyVoters";
import AddCandidate from "./AddCandidate";
import AddVoter from "./AddVoter";
import AllCandidates from "./AllCandidates";
import AllVoters from "./AllVoters";
import VotingControl from "./VotingControl";
import LiveResults from "./LiveResults";
import FinalResults from "./FinalResults";
import ComplaintsTab from "./ComplaintsTab";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
// Tab definitions
const TABS = [
  { id: "votingControl", label: "Voting Control" },
  { id: "liveResults", label: "Live Results" },
  { id: "finalResults", label: "Final Results" },
  { id: "verifyVoters", label: "Verify Voters" },
  { id: "addCandidate", label: "Add Candidate" },
  { id: "allCandidates", label: "All Candidates" },
  { id: "addVoter", label: "Add Voter" },
  { id: "allVoters", label: "All Voters" },
  { id: "complaintsTab", label: "Complaints" },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState(TABS[0].id);
  const [adminEmail, setAdminEmail] = useState("Admin"); // --- NEW: State for admin name
  const navigate = useNavigate();

  // --- NEW: Protection and Data Fetching ---
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");

    // 1. Check if user is an admin
    if (!token || role !== 'admin') {
      navigate("/admin-login"); // Redirect if not admin
      return;
    }

    // 2. Fetch admin data
    const fetchAdminData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/admin/me`, {
          headers: {
            "x-auth-token": token,
          },
        });
        if (!response.ok) {
          throw new Error("Token invalid");
        }
        const data = await response.json();
        setAdminEmail(data.email); // Set the admin's email
      } catch (err) {
        // If token is bad, log them out
        handleSignOut();
      }
    };

    fetchAdminData();
  }, [navigate]); // Add navigate to dependency array

  // --- NEW: Fixed Sign Out Function ---
  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    navigate("/");
  };


  // --- STYLES (Unchanged from your code, text color is fixed) ---
  const styles = {
    page: {
      minHeight: "100vh",
      background: "#e6f2ff",
      margin: 0,
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      display: "flex",
      flexDirection: "column",
      width: "100vw",
      boxSizing: "border-box", 
      color: "#333", // <-- This fixes text visibility
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      background: "#0077cc",
      color: "white", 
      padding: "17px 32px",
      boxSizing: "border-box",
    },
    tabs: {
      display: "flex",
      justifyContent: "center",
      background: "#fff",
      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
      flexWrap: "wrap",
      padding: "15px 0",
      boxSizing: "border-box",
    },
    tab: (active) => ({
      margin: "5px 10px",
      padding: "10px 20px",
      background: active ? "#005c99" : "#0099ff",
      color: "#fff", 
      borderRadius: "30px",
      cursor: "pointer",
      fontWeight: "bold",
      border: "none",
      outline: "none",
      transition: "background 0.2s",
    }),
    mainContent: {
      flex: 1, 
      width: "100%",
      boxSizing: "border-box",
    },
    card: {
      maxWidth: 900,
      minWidth: 320,
      margin: "32px auto",
      background: "#fff",
      padding: "2rem 2.5rem",
      borderRadius: "12px",
      boxShadow: "0 0 15px rgba(0,0,0,0.1)",
      minHeight: "220px",
      boxSizing: "border-box",
      color: "#333", // <-- This fixes text visibility
    },
    signoutBtn: {
      background: "#ff4d4d",
      color: "#fff", 
      border: "none",
      borderRadius: "6px",
      padding: "10px 18px",
      fontWeight: "bold",
      cursor: "pointer",
      marginLeft: 24,
      transition: "background 0.2s",
    },
    input: {
      width: "100%",
      margin: "8px 0",
      padding: 10, 
      borderRadius: 6, 
      border: "1px solid #ccc",
      backgroundColor: "#fff",
      color: "#000", 
      fontSize: 16,
      boxSizing: "border-box"
    },
    footer: {
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
    },
    footerCol: { display: "flex", flexDirection: "column" },
    // footerLinks: { display: "flex", gap: "17px", marginTop: 5 }, // No longer needed
  };

  // --- RENDER TAB CONTENT (All components now send the token) ---
  function renderTabContent() {
    // All components now receive the token as a prop
    const token = localStorage.getItem("token");

    switch (activeTab) {
      case "votingControl":
        return <VotingControl styles={styles} token={token} />;
      case "liveResults":
        return <LiveResults styles={styles} token={token} />;
      case "finalResults":
        return <FinalResults styles={styles} token={token} />;
      case "verifyVoters":
        return <VerifyVoters token={token} />; // Has its own styles
      case "addCandidate":
        return <AddCandidate styles={styles} token={token} />;
      case "allCandidates":
        return <AllCandidates styles={styles} token={token} />;
      case "addVoter":
        return <AddVoter styles={styles} token={token} />;
      case "allVoters":
        return <AllVoters styles={styles} token={token} />;
      case "complaintsTab":
        return <ComplaintsTab styles={styles} token={token} />;
      default:
        return null;
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h2>Admin Dashboard</h2>
        <div>
          {/* --- NEW: Dynamic Admin Name --- */}
          Welcome, <b>{adminEmail}</b>
          {/* --- NEW: Fixed Sign Out Button --- */}
          <button style={styles.signoutBtn} onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </div>
      <div style={styles.tabs}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            style={styles.tab(tab.id === activeTab)}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <main style={styles.mainContent}>
        <div style={styles.card}>
          {renderTabContent()}
        </div>
      </main>

      <footer style={styles.footer}>
        <div style={styles.footerCol}>
          <h3 style={{margin:0, display:"flex",alignItems:"center",gap:7}}>
            <span role="img" aria-label="vote">🗳️</span>
            SBVS Voting Portal
          </h3>
          <div style={{marginTop:7}}>
            <span role="img" aria-label="phone">📞</span>
            Contact: +91-7396480075
          </div>
        </div>
        <div style={{textAlign:"right"}}>
          <div>© 2025 SBVS. All Rights Reserved.</div>
          {/* --- REMOVED FOOTER LINKS --- */}
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboard;

