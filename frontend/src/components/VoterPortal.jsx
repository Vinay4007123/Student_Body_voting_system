import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; 

const API_URL = "http://localhost:5000";

const VoterPortal = () => {
  const [regno, setRegno] = useState("");
  const [stage, setStage] = useState("check_regno"); // 'check_regno', 'vote', 'voted'
  const [message, setMessage] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [votedFor, setVotedFor] = useState(null); // { name: '...', ... }
  
  const [timer, setTimer] = useState(45);
  const [redirectCountdown, setRedirectCountdown] = useState(5);
  const intervalRef = useRef(null); 

  const navigate = useNavigate();

  // --- STAGE 1: Check Registration Number (MODIFIED) ---
  const handleRegnoCheck = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      // --- FIXED: Call the new PUBLIC election status route ---
      const statusResponse = await fetch(`${API_URL}/api/election-status`);
      const statusData = await statusResponse.json();

      if (!statusResponse.ok) {
        throw new Error(statusData.msg || "Error fetching election status.");
      }

      if (statusData.status !== 'Running') {
        setMessage(`Voting is not currently active. (Status: ${statusData.status})`);
        return; // Stop here if voting is not running
      }
      // --- End of fix ---

      // If election is running, proceed to check the voter
      const response = await fetch(`${API_URL}/api/voter-status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ regno }),
      });
      
      const data = await response.json(); 

      if (!response.ok) {
        setMessage(data.msg || "An error occurred.");
        if (data.msg && data.msg.includes("already voted")) {
          setStage("voted");
          setVotedFor(null); 
        }
        return;
      }
      // Success: Move to voting stage
      setStage("vote");

    } catch (err) {
      console.error(err);
      setMessage("Failed to fetch. Please check your connection and ensure the server is running.");
    }
  };

  // --- STAGE 2: Fetch Candidates and START TIMER ---
  useEffect(() => {
    if (stage === "vote") {
      // Fetch candidates
      const fetchCandidates = async () => {
        try {
          // --- FIXED: Call the new PUBLIC candidates route ---
          const response = await fetch(`${API_URL}/api/candidates`);
          const data = await response.json();
          if (!response.ok) throw new Error(data.msg || "Failed to load candidates");
          setCandidates(data);
        } catch (err) {
          setMessage("Failed to load candidates. Please try again.");
        }
      };
      fetchCandidates();

      // Start the 45-second timer
      intervalRef.current = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      // --- BACK BUTTON LOGIC ---
      window.history.pushState(null, "", window.location.pathname);
      const handleBackButton = (e) => {
        e.preventDefault(); 
        const confirmed = window.confirm(
          "Are you sure you want to go back? Your vote will be cast as NOTA (None of the Above) and you cannot vote again."
        );
        if (confirmed) {
          submitNotaVote(); 
        } else {
          window.history.pushState(null, "", window.location.pathname);
        }
      };
      window.addEventListener('popstate', handleBackButton);
      // --- End Back Button Logic ---

      // Cleanup function
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        window.removeEventListener('popstate', handleBackButton);
      };
    }
  }, [stage]); // This dependency array is correct

  // --- TIMER LOGIC: Check if timer hit 0 ---
  useEffect(() => {
    if (timer <= 0) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      
      if (stage === "vote") { 
        if (selectedCandidate) {
          setMessage("Time's up! Submitting your selected vote.");
          handleVoteSubmit();
        } else {
          setMessage("Time's up! Submitting your vote as NOTA.");
          submitNotaVote();
        }
      }
    }
    // Added dependencies to prevent stale state
  }, [timer, stage, selectedCandidate, regno]); 

  // --- REDIRECT LOGIC: Start countdown on 'voted' stage ---
  useEffect(() => {
    if (stage === "voted") {
      const redirectInterval = setInterval(() => {
        setRedirectCountdown(prev => prev - 1);
      }, 1000);

      const redirectTimeout = setTimeout(() => {
        navigate("/verify"); // Redirect to verify page
      }, 5000);

      return () => {
        clearInterval(redirectInterval);
        clearTimeout(redirectTimeout);
      };
    }
  }, [stage, navigate]);

  // --- STAGE 3: Submit the Vote ---
  const handleVoteSubmit = async (e) => {
    if (e) e.preventDefault(); 
    if (intervalRef.current) clearInterval(intervalRef.current); 

    if (!selectedCandidate) {
      setMessage("Please select a candidate before voting.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          regno: regno, 
          candidateId: selectedCandidate
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || "Failed to cast vote.");

      const candidate = candidates.find(c => c._id === selectedCandidate);
      setVotedFor(candidate);
      setStage("voted");

    } catch (err) {
      setMessage(err.message);
    }
  };

  // --- NEW: Submit NOTA Vote ---
  const submitNotaVote = async () => {
    if (intervalRef.current) clearInterval(intervalRef.current); 
    
    try {
      const response = await fetch(`${API_URL}/api/vote/nota`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ regno }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || "Failed to cast vote.");
      
      setVotedFor({ name: "NOTA (None of the Above)" });
      setStage("voted");

    } catch (err) {
      setMessage(err.message);
    }
  };

  // ----- STYLES (Fixed layout and input) -----
  const styles = {
    // This wrapper centers the whole page and fills the screen
    pageWrapper: {
      fontFamily: "'Segoe UI', sans-serif",
      background: "#f0f6fc", // Light blue background
      display: 'flex',
      alignItems: 'center',     // Vertical centering
      justifyContent: 'center',  // Horizontal centering
      padding: "2rem",           // Space from screen edges
      margin: 0,
      minHeight: "100vh",        // Full viewport height
      minWidth: "100vw",         
      boxSizing: 'border-box',   // Include padding in height
    },
    // This is the main white content card (MODIFIED)
    voteBox: (stage) => ({
      width: "100%",
      // --- DYNAMIC MAX-WIDTH ---
      maxWidth: stage === 'vote' ? '1200px' : (stage === 'check_regno' ? '500px' : '700px'),
      margin: "auto",
      background: "#fff",
      padding: "2.5rem",
      borderRadius: "12px",
      boxShadow: "0 0 20px rgba(0,0,0,0.1)",
      boxSizing: 'border-box', // Ensure padding is included
      transition: 'max-width 0.4s ease-in-out', // Smooth transition
    }),
    h2: {
      textAlign: "center",
      color: "#2c3e50",
      marginBottom: "30px",
    },
    candidatesGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "20px",
    },
    candidateCard: (isSelected) => ({
      backgroundColor: "#ffffff",
      borderRadius: "15px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      textAlign: "center",
      padding: "25px 20px",
      transition: "transform 0.2s ease, border-color 0.2s, box-shadow 0.2s",
      border: isSelected ? "3px solid #3498db" : "3px solid transparent", 
      cursor: "pointer",
    }),
    candidatePhoto: {
      width: "100px",
      height: "100px",
      borderRadius: "50%",
      objectFit: "cover",
      backgroundColor: "#dfe6e9", // Placeholder color
      margin: "0 auto 15px auto", // Center the image
    },
    candidateName: {
      fontSize: "20px",
      fontWeight: "bold",
      color: "#2c3e50",
    },
    candidateDescription: { 
      fontSize: "14px",
      color: "#7f8c8d",
      margin: "8px 0 15px",
      minHeight: '40px', // Give space for 2 lines
    },
    submitButton: (disabled) => ({
      display: "block",
      width: "100%",
      padding: "16px",
      marginTop: "30px",
      backgroundColor: disabled ? "#95a5a6" : "#27ae60",
      border: "none",
      color: "white",
      fontSize: "18px",
      borderRadius: "10px",
      cursor: disabled ? "not-allowed" : "pointer",
      transition: "background 0.3s",
    }),
    input: {
      width: "100%",
      padding: "12px",
      fontSize: "16px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      boxSizing: "border-box", 
      backgroundColor: "#fff", 
      color: "#000", 
    },
    message: {
      textAlign: "center",
      color: "red",
      fontWeight: "bold",
      margin: "15px 0",
      fontSize: "1.1rem",
    },
    votedMessage: {
      textAlign: "center",
      padding: "40px",
      background: "#d4edda",
      color: "#155724",
      borderRadius: "12px",
    },
    timer: {
      textAlign: "center",
      fontSize: "1.5rem",
      fontWeight: "bold",
      color: timer <= 10 ? "red" : "#2c3e50", 
      margin: "20px 0",
    }
  };
  
  // ----- RENDER LOGIC -----

  const renderContent = () => {
    // STAGE 1: CHECK REGISTRATION NUMBER
    if (stage === "check_regno") {
      return (
        <form onSubmit={handleRegnoCheck}>
          <h2 style={styles.h2}>Voter Verification</h2>
          <p style={{textAlign: 'center', color: '#555'}}>Please enter your Registration Number to proceed.</p>
          <input
            type="text"
            style={styles.input}
            placeholder="Enter your Registration No."
            value={regno}
            onChange={(e) => setRegno(e.target.value)}
            required
          />
          <button type="submit" style={styles.submitButton(false)}>Check Status</button>
          {message && <div style={styles.message}>{message}</div>}
        </form>
      );
    }

    // STAGE 2: VOTE (Using new card)
    if (stage === "vote") {
      return (
        <form onSubmit={handleVoteSubmit}>
          <h2 style={styles.h2}>Cast Your Vote</h2>
          <div style={styles.timer}>Time left: {timer}s</div> 
          <div style={styles.candidatesGrid}>
            {candidates.map((candidate) => (
              <div
                key={candidate._id}
                style={styles.candidateCard(selectedCandidate === candidate._id)}
                onClick={() => setSelectedCandidate(candidate._id)}
              >
                <img 
                  src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" 
                  alt={candidate.name} 
                  style={styles.candidatePhoto} 
                />
                <div style={styles.candidateName}>{candidate.name}</div>
                <div style={styles.candidateDescription}>{candidate.description || "Candidate"}</div>
                <input
                  type="radio"
                  name="selected_candidate"
                  value={candidate._id}
                  checked={selectedCandidate === candidate._id}
                  readOnly
                  style={{cursor: 'pointer', transform: 'scale(1.2)'}}
                />
              </div>
            ))}
          </div>
          <button type="submit" style={styles.submitButton(!selectedCandidate)} disabled={!selectedCandidate}>
            Submit Vote
          </button>
          {message && <div style={styles.message}>{message}</div>}
        </form>
      );
    }

    // STAGE 3: VOTED (or already voted)
    if (stage === "voted") {
      return (
        <div style={styles.votedMessage}>
          <h2 style={{...styles.h2, color: '#155724'}}>Thank You!</h2>
          {votedFor ? (
            <p style={{fontSize: 18}}>You have cast your vote for <b>{votedFor.name}</b>.</p>
          ) : (
            <p style={{fontSize: 18}}>You have already voted in this election.</p>
          )}
          <p>Your vote has been recorded.</p>
          <p style={{marginTop: 20, fontWeight: 'bold'}}>
            Redirecting in {redirectCountdown} seconds...
          </p>
        </div>
      );
    }
  };

  return (
    <div style={styles.pageWrapper}> 
      {/* This div now uses the dynamic style based on the stage */}
      <div style={styles.voteBox(stage)}> 
        {renderContent()}
      </div>
    </div>
  );
};

export default VoterPortal;
