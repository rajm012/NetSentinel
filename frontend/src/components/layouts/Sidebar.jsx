import { Link, useLocation } from "react-router-dom";
// import { cn } from "@/utils/cn"; // optional: utility to combine classes

const navItems = [
  { label: "🟢 Real-Time", path: "/dashboard/realtime" },
  { label: "📁 Historical", path: "/dashboard/historical" },
  { label: "🧠 Threat Intel", path: "/dashboard/threat-intel" },
  { label: "⚙️ Configuration", path: "/dashboard/config" },
  { lable: "🧪 Packet Testbed", path: "/dashboard/testbed"},
  { label: "📦 Upload Logs", path: "/dashboard/upload-logs" },
  { label: "📜 Docs", path: "/docs" },
  { label: "🧑‍💼 Profile", path: "/dashboard/profile" },
];

const Sidebar = () => {
  const { pathname } = useLocation();

  return (
    <div className="w-60 h-screen bg-gray-900 text-white p-4 flex flex-col shadow-lg">
      <h1 className="text-2xl font-bold mb-6">🛡️ Sniffer</h1>
      <nav className="space-y-3">
        {navItems.map(({ label, path }) => (
          <Link
            key={path}
            to={path}
            className={`block py-2 px-4 rounded-md hover:bg-gray-700 transition ${
              pathname === path ? "bg-gray-700 font-semibold" : ""
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
