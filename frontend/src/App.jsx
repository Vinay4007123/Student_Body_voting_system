import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import CandidateDashboard from "./components/CandidateDashboard";
import ThankYou from "./components/ThankYou";
// import Voting from "./components/Voting"; // <-- Removed this line
import VoterPortal from "./components/VoterPortal"; // <-- Added this line for the new component
import AdminLogin from "./components/AdminLogin";
import CandidateLogin from "./components/CandidateLogin";
import Complaints from "./components/Complaints";
import ForgotPassword from "./components/ForgotPassword";
import Verify from "./components/Verify";
import AdminDashboard from "./components/AdminDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/candidate-dashboard" element={<CandidateDashboard />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/voting" element={<VoterPortal />} /> {/* <-- Changed this line */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/candidate-login" element={<CandidateLogin />} />
        <Route path="/complaints" element={<Complaints />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;