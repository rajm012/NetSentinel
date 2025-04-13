// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./views/HomePage";
import DocsPage from "./views/DocsPage";
import LoginPage from "./views/LoginPage"
import DashboardLayout from "./components/layouts/DashboardLayout";;
import "./index.css";
import RealtimeView from "../src/views/dashboard/RealtimeView";
import HistoricalView from "../src/views/dashboard/HistoricalView";
import ThreatIntelView from "../src/views/dashboard/ThreatIntelView";
import ConfigurationView from "../src/views/dashboard/ConfigView";


function App() {
  return (
    <Router>
      <Routes>
      {/* -----------------------Home page routes------------------------------------ */}
        <Route path="/" element={<HomePage />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/login" element={<LoginPage />} />

      {/* -----------------------dashboard routes------------------------------------ */}
      <Route path="/dashboard" element={<DashboardLayout />}>
      <Route path="realtime" element={<RealtimeView />} />
      <Route path="historical" element={<HistoricalView />} />
      <Route path="threat-intel" element={<ThreatIntelView />} />
      <Route path="config" element={<ConfigurationView />} />
      </Route>
      </Routes>
    </Router>
  );
}

export default App;
