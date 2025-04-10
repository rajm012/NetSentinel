import { useState } from "react";

const TopBar = () => {
  const [status] = useState("🟢 Live");
  const [interfaceName] = useState("wlan0");

  return (
    <div className="w-full h-16 bg-gray-800 text-white flex items-center justify-between px-6 shadow-md">
      <div className="flex items-center space-x-6">
        <span className="text-sm font-medium">{status}</span>
        <span className="text-sm text-gray-400">Interface: {interfaceName}</span>
      </div>
      <div className="flex items-center space-x-4">
        <button className="hover:text-yellow-300">🔔</button>
        <span className="text-xs text-gray-400">{new Date().toLocaleString()}</span>
        <button className="hover:text-blue-400">🌓</button>
      </div>
    </div>
  );
};

export default TopBar;
