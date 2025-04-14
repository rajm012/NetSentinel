import React from "react";

const dummyUser = {
  name: "Alex Sniffer",
  email: "alex.sniffer@cybersec.io",
  role: "Network Analyst",
  joined: "Feb 2024",
  bio: "Cybersecurity enthusiast passionate about threat detection, packet analysis, and digital forensics.",
  status: "Active",
  avatar: "https://avatars.githubusercontent.com/u/1?v=4", // Replace with real avatar later
};

const ProfileView = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold text-white mb-6">👤 Profile</h1>

      <div className="bg-gray-800 rounded-lg shadow-md p-6 text-white">
        <div className="flex items-center space-x-6">
          <img
            src={dummyUser.avatar}
            alt="User Avatar"
            className="w-24 h-24 rounded-full border-4 border-blue-500"
          />
          <div>
            <h2 className="text-2xl font-bold">{dummyUser.name}</h2>
            <p className="text-sm text-gray-400">{dummyUser.email}</p>
            <p className="mt-2 text-sm text-green-400">{dummyUser.status}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-700 p-4 rounded-md">
            <h3 className="text-blue-300 text-sm uppercase tracking-wider mb-1">
              Role
            </h3>
            <p className="text-white">{dummyUser.role}</p>
          </div>

          <div className="bg-gray-700 p-4 rounded-md">
            <h3 className="text-blue-300 text-sm uppercase tracking-wider mb-1">
              Joined
            </h3>
            <p className="text-white">{dummyUser.joined}</p>
          </div>

          <div className="bg-gray-700 p-4 rounded-md col-span-1 md:col-span-2">
            <h3 className="text-blue-300 text-sm uppercase tracking-wider mb-1">
              Bio
            </h3>
            <p className="text-gray-300">{dummyUser.bio}</p>
          </div>
        </div>

        <div className="mt-6 text-right">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;

