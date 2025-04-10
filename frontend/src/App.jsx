// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./views/HomePage";
import DocsPage from "./views/DocsPage";
import LoginPage from "./views/LoginPage"
import DashboardLayout from "./components/layouts/DashboardLayout";;
import "./index.css";

// Dashboard views
import RealtimeView from "./views/dashboard/RealtimeView";
import HistoricalView from "./views/dashboard/HistoricalView";
import ThreatIntelView from "./views/dashboard/ThreatIntelView";
import ConfigView from "./views/dashboard/ConfigView";
import UploadLogsView from "./views/dashboard/UploadLogsView";
import ProfileView from "./views/dashboard/ProfileView";

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
        {/* <Route path="historical" element={<HistoricalView />} />
        <Route path="threat-intel" element={<ThreatIntelView />} />
        <Route path="config" element={<ConfigView />} />
        <Route path="upload-logs" element={<UploadLogsView />} />
        <Route path="profile" element={<ProfileView />} /> */}
      </Route>

      </Routes>
    </Router>
  );
}

export default App;
