import { useState } from "react";
import { WifiIcon, BellIcon, MoonIcon, SunIcon } from "@heroicons/react/outline";

const TopBar = () => {
  const [status] = useState("Live");
  const [interfaceName] = useState("Wi-Fi");
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="w-full h-16 bg-gray-800 text-white flex items-center justify-between px-6 border-b border-gray-700">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-sm font-medium">{status}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-300">
          <WifiIcon className="h-4 w-4" />
          <span>Interface: </span>
          <span className="font-mono text-blue-300">{interfaceName}</span>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button className="p-1 rounded-full hover:bg-gray-700 relative">
          <BellIcon className="h-5 w-5 text-gray-300" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <span className="text-xs font-mono bg-gray-700 px-2 py-1 rounded">
          {new Date().toLocaleTimeString()}
        </span>
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className="p-1 rounded-full hover:bg-gray-700"
        >
          {darkMode ? (
            <SunIcon className="h-5 w-5 text-yellow-300" />
          ) : (
            <MoonIcon className="h-5 w-5 text-gray-300" />
          )}
        </button>
      </div>
    </div>
  );
};

export default TopBar;
