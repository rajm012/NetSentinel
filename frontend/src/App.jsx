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
import TestbedView from "../src/views/dashboard/TestbedView";
import PacketDetailView from "../src/views/dashboard/PacketDetailView";
import Header from "./components/layouts/Header";
import Footer from "./components/layouts/Footer";
import ProfileView from "../src/views/dashboard/ProfileView";
import SettingsView from "../src/views/dashboard/SettingsView";
import DocumentationPage from "../src/views/dashboard/DocumentationPage";

function App() {
  return (
    <Router>
      <Header /> {/* Add Header component */}
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
      <Route path="testbed" element={<TestbedView />} />
      <Route path="upload-logs" element={<PacketDetailView />} />
      <Route path="profile" element={<ProfileView />} />
      <Route path="settings" element={<SettingsView />} />
      <Route path="docs" element={<DocumentationPage />} />
      </Route>
      </Routes>
      <Footer /> {/* Add Footer component */}
    </Router>
  );
}

export default App;
