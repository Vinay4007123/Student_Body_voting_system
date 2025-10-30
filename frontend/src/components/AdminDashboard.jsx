import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import VerifyVoters from "./VerifyVoters"; // <-- 1. IMPORT THE NEW COMPONENT

// Demo admin name
const adminName = "Admin";

// Tab definitions
const TABS = [
  { id: "addCandidate", label: "Add Candidate" },
  { id: "addVoter", label: "Add Voter" },
  { id: "verifyVoters", label: "Verify Voters" }, // <-- 2. ADD THE NEW TAB
  { id: "votingControl", label: "Voting Control" },
  { id: "liveResults", label: "Live Results" },
  { id: "finalResults", label: "Final Results" },
  { id: "complaintsTab", label: "Complaints" },
  { id: "allCandidates", label: "All Candidates" },
  { id: "allVoters", label: "All Voters" },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState(TABS[0].id);
  const navigate = useNavigate();

  // Styles matching your HTML/CSS
  const styles = {
    page: {
      minHeight: "100vh",
      background: "#e6f2ff",
      margin: 0,
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      display: "flex",
      flexDirection: "column",
      width: "100vw", // Use viewport width
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
    }),
    mainContent: {
      flex: 1, // This makes the content area grow
      width: "100%",
    },
    card: {
      maxWidth: 800,
      margin: "32px auto",
      background: "#fff",
      padding: "2rem 2.5rem",
      borderRadius: "12px",
      boxShadow: "0 0 15px rgba(0,0,0,0.1)",
      minHeight: "220px",
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
    },
    input: {
      width: "100%",
      margin: "8px 0",
      padding: 8,
      borderRadius: 4,
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
    footerLinks: { display: "flex", gap: "17px", marginTop: 5 },
  };

  // CONTENT by TAB
  function renderTabContent() {
    switch (activeTab) {
      case "addCandidate":
        return (
          <div>
            <center><h3>Add Candidate</h3></center>
            <form>
              <input type="text" placeholder="Name" required style={styles.input}/>
              <input type="email" placeholder="Email" required style={styles.input}/>
              <input type="password" placeholder="Password" required style={styles.input}/>
              <input type="text" placeholder="Phone (10 digits)" required style={styles.input}/>
              <textarea placeholder="Description" style={{...styles.input, height: '100px', resize: 'vertical'}}/>
              <center>
                <button type="submit" style={{...styles.tab(false), borderRadius: "6px", background: "#0077cc", margin: 0}}>
                  Add Candidate
                </button>
              </center>
            </form>
          </div>
        );
      case "addVoter":
        return (
          <div>
            <center><h3>Add Voter</h3></center>
            <form>
              <input type="text" placeholder="Registration Number" required style={styles.input}/>
              <center>
                <button type="submit" style={{...styles.tab(false), borderRadius: "6px", background: "#0077cc", margin: 0}}>
                  Add Voter
                </button>
              </center>
            </form>
          </div>
        );
      case "verifyVoters": // <-- 3. ADD THIS CASE TO RENDER THE COMPONENT
        return <VerifyVoters />;
      case "votingControl":
        return (
          <div>
            <center>
              <h3>Voting Control</h3>
              <button style={{...styles.tab(false), background: "#0077cc"}}>Start Voting</button>
              <button style={{...styles.tab(false), background: "#0077cc", marginLeft: 10}}>Stop Voting</button>
            </center>
          </div>
        );
      case "liveResults":
        return (
          <div>
            <center><h3>Live Results</h3><div style={{fontWeight:"bold"}}>Ongoing</div></center>
            <table style={{width:"100%",marginTop:15,borderCollapse:"collapse"}}>
              <thead><tr><th>Name</th><th>Description</th><th>Votes</th></tr></thead>
              <tbody>
                <tr><td>Sample Candidate</td><td>For demo only.</td><td>11</td></tr>
              </tbody>
            </table>
          </div>
        );
      case "finalResults":
        return (
          <div>
            <center>
              <h3>Final Results</h3>
              <div style={{color:"green"}}><b>Approved</b></div>
            </center>
            <table style={{width:"100%",marginTop:15,borderCollapse:"collapse"}}>
              <thead><tr><th>Name</th><th>Description</th><th>Total Votes</th></tr></thead>
              <tbody>
                <tr style={{background:"#d4edda",fontWeight:"bold"}}><td>Candidate X</td><td>Demo Winner</td><td>100</td></tr>
              </tbody>
            </table>
          </div>
        );
      case "complaintsTab":
        return (
          <div>
            <center><h3>User Complaints</h3></center>
            <table style={{width:"100%",marginTop:15,borderCollapse:"collapse"}}>
              <thead>
                <tr><th>Name</th><th>Email</th><th>Message</th><th>Reply</th><th>Delete</th></tr>
              </thead>
              <tbody>
                <tr><td>User1</td><td>user@example.com</td><td>Test</td><td><button>Reply</button></td><td><button>Delete</button></td></tr>
              </tbody>
            </table>
          </div>
        );
      case "allCandidates":
        return (
          <div>
            <center><h3>All Candidates</h3></center>
  .         <input type="text" placeholder="Search by name or email" style={styles.input} />
            <div style={{display:"flex",background:"grey",padding:"10px 20px",borderRadius:8,marginBottom:10,boxShadow:"0 2px 6px rgba(0,0,0,0.05)"}}>
              <span style={{flex:1}}>Name</span>
              <span style={{flex:1}}>Email</span>
              <span style={{flex:1}}>Phone</span>
              <span style={{width:60}}></span>
            </div>
            {/* Candidate list here */}
            <div style={{display:"flex",background:"#fff",padding:"12px 20px",borderRadius:10,boxShadow:"0 3px 6px rgba(0,0,0,0.08)"}}>
              <div style={{flex:1}}>Sample Name</div>
              <div style={{flex:1}}>email@demo.com</div>
              <div style={{flex:1}}>1234567890</div>
              <div style={{width:60}}><button>Delete</button></div>
            </div>
          </div>
        );
      case "allVoters":
        return (
          <div>
            <center><h3>All Voters</h3></center>
            <input type="text" placeholder="Search by registration number" style={styles.input} />
            <div style={{display:"flex",background:"#dfefff",padding:"10px 20px",borderRadius:8,marginBottom:10,boxShadow:"0 2px 6px rgba(0,0,0,0.05)"}}>
              <span style={{flex:1}}>Registration No.</span>
              <span style={{width:60}}></span>
            </div>
            {/* Voter list here */}
            <div style={{display:"flex",background:"#fff",padding:"12px 20px",borderRadius:10,boxShadow:"0 3px 6px rgba(0,0,0,0.08)"}}>
              <div style={{flex:1}}>20BCS1234</div>
              <div style={{width:60}}><button>Delete</button></div>
            </div>
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h2>Admin Dashboard</h2>
        <div>
          Welcome, <b>{adminName}</b>
          <button style={styles.signoutBtn} onClick={() => navigate("/")}>
            Sign Out
          </button>
        </div>
      </div>
      <div style={styles.tabs}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            style={styles.tab(tab.id === activeTab)}
            className={tab.id === activeTab ? "active-tab" : ""}
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
            Contact: +91-9182040905
          </div>
        </div>
        <div style={{textAlign:"right"}}>
          <div>© 2025 SBVS. All Rights Reserved.</div>
          <div style={styles.footerLinks}>
            <a href="/help" style={{color:"#fff", textDecoration:"underline"}}>Help</a>
            <a href="/support" style={{color:"#fff", textDecoration:"underline"}}>Support</a>
            <a href="/complaints" style={{color:"#fff", textDecoration:"underline"}}>Complaints</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboard;