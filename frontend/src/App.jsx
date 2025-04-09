import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import RealtimeView from './components/views/RealtimeView';
import HistoricalView from './components/views/HistoricalView';
import ThreatIntelView from './components/views/ThreatIntelView';
import AlertFeed from './components/alerts/AlertFeed';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 text-gray-900">
        <AlertFeed />
        <Routes>
          <Route path="/" element={<RealtimeView />} />
          <Route path="/historical" element={<HistoricalView />} />
          <Route path="/threats" element={<ThreatIntelView />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
