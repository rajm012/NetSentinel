// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/layouts/DashboardLayout';
import RealtimeView from './components/views/RealtimeView';
import HistoricalView from './components/views/HistoricalView';
import ThreatIntelView from './components/views/ThreatIntelView';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route path="/realtime" element={<RealtimeView />} />
          <Route path="/historical" element={<HistoricalView />} />
          <Route path="/threat-intel" element={<ThreatIntelView />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
