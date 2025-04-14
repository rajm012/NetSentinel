import React from "react";

const AboutPage = () => {
  return (
    <div className="relative text-gray-100 min-h-screen p-6">
      {/* Animated background from HomePage */}
      <div className="absolute inset-0 z-0 bg-gray-950">
        {/* Cool animated grid background */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle,#00ffe088_1px,transparent_1px)] bg-[size:18px_18px] animate-pulse" />

        {/* Optional gradient glows */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-cyan-400/20 to-transparent blur-lg z-0" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-cyan-400/20 to-transparent blur-lg z-0" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 px-6 py-20 max-w-5xl mx-auto text-center">
        <h1 className="text-5xl font-extrabold text-cyan-400 drop-shadow-lg mb-4">
          🌐 About NetSentinel
        </h1>
        <p className="text-gray-300 text-lg max-w-3xl mx-auto mb-10">
          <strong>NetSentinel</strong> is a powerful real-time network monitoring and security dashboard designed for researchers, network engineers, and cybersecurity professionals. Built with performance and clarity in mind, it lets you track, analyze, and drill down into network behavior seamlessly.
        </p>

        <div className="bg-gray-800/70 p-8 rounded-2xl shadow-xl border border-gray-700 max-w-3xl mx-auto text-left">
          <h2 className="text-2xl text-cyan-300 font-bold mb-3">👨‍💻 Developer Info</h2>
          <p className="text-gray-300 mb-2">
            Hi, I'm <span className="text-white font-bold">Raj</span>, a cybersecurity enthusiast and full-stack developer. I created NetSentinel to learn, experiment, and share insights into network-level anomaly detection and packet behavior analysis.
          </p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div>
              <span className="block text-gray-400 mb-1">Email</span>
              <a href="mailto:rajmahimaurya@gmail.com" className="text-cyan-400 hover:underline">
                rajmahimaurya@gmail.com
              </a>
            </div>
            <div>
              <span className="block text-gray-400 mb-1">GitHub</span>
              <a href="https://github.com/rajm012" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
                github.com/rajm012
              </a>
            </div>
            <div>
              <span className="block text-gray-400 mb-1">LinkedIn</span>
              <a href="https://www.linkedin.com/in/raj-maurya-271b32237/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
                linkedin.com/in/raj-maurya-271b32237/
              </a>
            </div>
            <div>
              <span className="block text-gray-400 mb-1">Version</span>
              <span className="text-white">v1.0.0</span>
            </div>
          </div>
        </div>

        <footer className="mt-16 text-xs text-gray-500">
          Built with 💻 + ☕ | MIT Licensed
        </footer>
      </div>
    </div>
  );
};

export default AboutPage;
