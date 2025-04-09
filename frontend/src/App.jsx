import React from 'react';
import RealtimeView from './components/views/RealtimeView';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <RealtimeView />
    </div>
  );
};

export default App;


// import AlertFeed from "./components/alerts/AlertFeed";

// const dummyAlerts = [
//   {
//     type: "Port Scan",
//     message: "Multiple SYN packets to sequential ports",
//     timestamp: new Date().toISOString()
//   },
//   {
//     type: "DNS Tunneling",
//     message: "Abnormal number of TXT DNS requests",
//     timestamp: new Date().toISOString()
//   }
// ];

// <AlertFeed alerts={dummyAlerts} />


// // App.jsx or RealtimeView.jsx
// import useWebSocket from '@/store/hooks/useWebSocket';

// function App() {
//   useWebSocket(); // Activates WebSocket when component mounts

//   return <div className="app">Your App</div>;
// }

