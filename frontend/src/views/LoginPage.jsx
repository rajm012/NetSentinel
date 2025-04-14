import { useState } from "react";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    // <div className="relative h-screen w-full bg-gradient-to-br from-gray-900 to-black text-white overflow-hidden">
    <div className="relative text-gray-100 min-h-screen p-24 items-center justify-center">
      
    {/* Animated background from HomePage */}
    <div className="absolute inset-0 z-0 bg-gray-950">
      {/* Cool animated grid background */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle,#00ffe088_1px,transparent_1px)] bg-[size:18px_18px] animate-pulse" />
      
      {/* Optional cyan glows */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-cyan-400/20 to-transparent blur-lg z-0" />
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-cyan-400/20 to-transparent blur-lg z-0" />
      </div>

      {/* Login Card */}
      <div className="relative z-10 flex items-center justify-center h-full px-4">
        <div className="bg-gray-800/90 p-8 rounded-2xl shadow-xl w-full max-w-md backdrop-blur-md">
          <h2 className="text-3xl font-bold mb-6 text-center text-cyan-400">Admin Login</h2>

          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Username</label>
            <input
              type="text"
              className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-300 mb-2">Password</label>
            <input
              type="password"
              className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 rounded-lg transition duration-200">
            🔐 Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
