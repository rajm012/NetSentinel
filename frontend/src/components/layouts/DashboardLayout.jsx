import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { useEffect, useState } from "react";

const DashboardLayout = () => {
  const location = useLocation();
  const [showVisualization, setShowVisualization] = useState(false);

  useEffect(() => {
    // Show visualization only if we're at the root dashboard path
    setShowVisualization(location.pathname === "/dashboard");
  }, [location]);

  return (
    <div className="flex h-screen bg-gray-950 text-white">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <TopBar />
        <div className="p-4 overflow-y-auto flex-1 bg-gray-950">
          <Outlet />
          
          {showVisualization && (
            <div className="h-full flex flex-col items-center justify-center">
              {/* Network Monitoring Visualization */}
              <div className="max-w-4xl w-full">
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-400">
                  Network Traffic Overview
                </h2>
                
                {/* Real-time Network Graph */}
                <div className="relative h-64 mb-8 bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-pulse text-gray-600">
                      <svg
                        className="w-16 h-16"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                        />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Animated network nodes */}
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute rounded-full bg-blue-500/20 border border-blue-400/30"
                      style={{
                        width: `${Math.random() * 20 + 10}px`,
                        height: `${Math.random() * 20 + 10}px`,
                        left: `${Math.random() * 90}%`,
                        top: `${Math.random() * 90}%`,
                        animation: `pulse ${Math.random() * 2 + 1}s infinite alternate`,
                      }}
                    />
                  ))}
                  
                  {/* Connection lines */}
                  <svg className="absolute inset-0 w-full h-full">
                    {[...Array(12)].map((_, i) => {
                      const x1 = Math.random() * 100;
                      const y1 = Math.random() * 100;
                      const x2 = Math.random() * 100;
                      const y2 = Math.random() * 100;
                      return (
                        <line
                          key={i}
                          x1={`${x1}%`}
                          y1={`${y1}%`}
                          x2={`${x2}%`}
                          y2={`${y2}%`}
                          stroke="rgba(96, 165, 250, 0.2)"
                          strokeWidth="1"
                        />
                      );
                    })}
                  </svg>
                </div>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <StatCard
                    title="Packets/sec"
                    value="1,248"
                    trend="up"
                    icon={
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    }
                  />
                  <StatCard
                    title="Threats"
                    value="3"
                    trend="up"
                    icon={
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01" />
                      </svg>
                    }
                  />
                  <StatCard
                    title="Active Sessions"
                    value="42"
                    trend="steady"
                    icon={
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    }
                  />
                </div>
                
                {/* Quick Actions */}
                <div className="flex flex-wrap justify-center gap-4">
                  <ActionButton
                    icon={
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    }
                    label="Start Monitoring"
                    link="/realtime"
                  />
                  <ActionButton
                    icon={
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                    }
                    label="Upload PCAP"
                    link="/historical"
                  />
                  <ActionButton
                    icon={
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    }
                    label="Run Scan"
                    link="/testbed"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, trend, icon }) => {
  const trendColor = trend === "up" ? "text-red-400" : trend === "down" ? "text-green-400" : "text-yellow-400";
  const trendIcon = trend === "up" ? "▲" : trend === "down" ? "▼" : "➔";
  
  return (
    <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className={`p-2 rounded-lg bg-gray-800 ${trendColor}`}>
          {icon}
        </div>
      </div>
      <div className={`mt-2 text-xs flex items-center ${trendColor}`}>
        <span>{trendIcon}</span>
        <span className="ml-1">{trend === "up" ? "5.2%" : trend === "down" ? "2.1%" : "0.0%"}</span>
        <span className="text-gray-500 ml-1">vs last hour</span>
      </div>
    </div>
  );
};

// Action Button Component
const ActionButton = ({ icon, label }) => {
  return (
    <button className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
      <span className="mr-2">{icon}</span>
      <span>{label}</span>
    </button>
  );
};

export default DashboardLayout;
