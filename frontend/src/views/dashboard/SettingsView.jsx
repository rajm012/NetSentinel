import React, { useState } from "react";

const SettingsView = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [autoUpdates, setAutoUpdates] = useState(false);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold text-white mb-6">⚙️ Settings</h1>

      <div className="space-y-6 text-white">

        {/* Appearance Settings */}
        <section className="bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">🖼️ Appearance</h2>
          <div className="flex items-center justify-between">
            <span>Dark Mode</span>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`px-4 py-1 rounded text-sm ${
                darkMode ? "bg-green-600" : "bg-gray-600"
              }`}
            >
              {darkMode ? "Enabled" : "Disabled"}
            </button>
          </div>
        </section>

        {/* Notifications */}
        <section className="bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">🔔 Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Email Alerts</span>
              <input
                type="checkbox"
                checked={emailNotifs}
                onChange={() => setEmailNotifs(!emailNotifs)}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Auto Update Data</span>
              <input
                type="checkbox"
                checked={autoUpdates}
                onChange={() => setAutoUpdates(!autoUpdates)}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
            </div>
          </div>
        </section>

        {/* Data Privacy */}
        <section className="bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">🔒 Data & Privacy</h2>
          <p className="text-sm text-gray-400 mb-4">
            Control how your usage data is handled. These preferences are currently for demo purposes only.
          </p>
          <div className="flex justify-between">
            <span className="text-sm">Share anonymous usage stats</span>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-blue-600"
                defaultChecked
              />
            </label>
          </div>
        </section>

        {/* Account Actions */}
        <section className="bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">👤 Account</h2>
          <div className="space-y-3">
            <button className="w-full px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition">
              🔑 Reset Password
            </button>
            <button className="w-full px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition">
              🗑️ Delete Account
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SettingsView;

