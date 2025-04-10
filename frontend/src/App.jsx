// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RealtimeView from "../src/components/views/RealtimeView";
import HistoricalView from "../src/components/views/HistoricalView";
import ThreatIntelView from "../src/components/views/ThreatIntelView";
import HomePage from "./views/HomePage";
import DocsPage from "./views/DocsPage";
import LoginPage from "./views/LoginPage";
import "./index.css";

function App() {
  return (
    <Router>
      <Routes>
      {/* -----------------------Home page routes------------------------------------ */}
        <Route path="/" element={<HomePage />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<RealtimeView />} />

      {/* -----------------------dashboard routes------------------------------------ */}

        <Route path="/historical" element={<HistoricalView />} />
        <Route path="/threat-intel" element={<ThreatIntelView />} />

      </Routes>
    </Router>
  );
}

export default App;
