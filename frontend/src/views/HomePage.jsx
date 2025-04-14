// src/views/HomePage.jsx
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="relative text-gray-100 min-h-screen flex items-center justify-center">
    {/* Animated background from HomePage */}
    <div className="absolute inset-0 z-0 bg-gray-950">
      {/* Cool animated grid background */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle,#00ffe088_1px,transparent_1px)] bg-[size:18px_18px] animate-pulse" />

      {/* Optional gradient glows */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-cyan-400/20 to-transparent blur-lg z-0" />
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-cyan-400/20 to-transparent blur-lg z-0" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
        <h1 className="text-5xl font-extrabold text-cyan-400 drop-shadow-lg mb-4">
          🛡️ NetSentinel
        </h1>

        <p className="text-lg md:text-xl text-gray-300 max-w-xl mb-8">
          Real-time Network Traffic Monitoring and Threat Detection
        </p>

        <div className="flex gap-4 flex-wrap justify-center">
          <Link to="/dashboard">
            <button className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-6 py-3 rounded-2xl shadow-lg transition duration-200">
              ➡️ Go to Dashboard
            </button>
          </Link>

          <Link to="/docs">
            <button className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-2xl shadow-lg transition duration-200">
              📜 View Docs
            </button>
          </Link>

          <Link to="/login">
            <button className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-2xl shadow-lg transition duration-200">
              🔐 Login / Admin Access
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
