// src/views/HomePage.jsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const HomePage = () => {
  return (
    <div className="relative h-screen w-full bg-gradient-to-br from-gray-900 to-black text-white overflow-hidden">
      {/* Animated background (simple glowing dots simulating packet flow) */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full animate-pulse bg-[radial-gradient(circle,_#00ffe088_1px,_transparent_1px)] bg-[size:20px_20px]" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
        <motion.h1
          className="text-5xl font-bold mb-4 text-cyan-400"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          🛡️ NetSentinel
        </motion.h1>
        <p className="text-lg md:text-xl max-w-xl text-gray-300 mb-8">
          Real-time Network Traffic Monitoring and Threat Detection
        </p>

        <div className="flex gap-4 flex-wrap justify-center">
          <Link to="/dashboard">
            <button className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-6 py-3 rounded-2xl shadow-lg">
              ➡️ Go to Dashboard
            </button>
          </Link>

          <Link to="/docs">
            <button className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-2xl shadow-lg">
              📜 View Docs
            </button>
          </Link>

          <Link to="/login">
            <button className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-2xl shadow-lg">
              🔐 Login / Admin Access
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
