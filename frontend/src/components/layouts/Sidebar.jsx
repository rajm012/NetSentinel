import { Link, useLocation } from "react-router-dom";
import { LightningBoltIcon, ClockIcon, ShieldCheckIcon, CogIcon, BeakerIcon, UploadIcon, BookOpenIcon, UserIcon} from "@heroicons/react/outline";

const navItems = [
  { label: "Real-Time", path: "/dashboard/realtime", icon: LightningBoltIcon },
  { label: "Historical", path: "/dashboard/historical", icon: ClockIcon },
  { label: "Threat Intel", path: "/dashboard/threat-intel", icon: ShieldCheckIcon },
  { label: "Configuration", path: "/dashboard/config", icon: CogIcon },
  { label: "Packet Testbed", path: "/dashboard/testbed", icon: BeakerIcon },
  { label: "Upload Logs", path: "/dashboard/upload-logs", icon: UploadIcon },
  { label: "Documentation", path: "/docs", icon: BookOpenIcon },
  { label: "Profile", path: "/dashboard/profile", icon: UserIcon },
  { label: "Settings", path: "/dashboard/settings", icon: CogIcon },
];

const Sidebar = () => {
  const { pathname } = useLocation();

  return (
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col border-r border-gray-800">
      <div className="p-6 pb-4">
        <h1 className="text-2xl font-bold flex items-center">
          <span className="text-blue-400 mr-2">🛡️</span>
          <span>PacketSniffer</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">Network Security Monitor</p>
      </div>
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navItems.map(({ label, path, icon: Icon }) => (
          <Link
            key={path}
            to={path}
            className={`flex items-center py-3 px-4 rounded-lg transition-all ${
              pathname === path 
                ? "bg-blue-900/50 text-blue-100 border-l-4 border-blue-400"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
            }`}
          >
            {Icon && <Icon className="h-5 w-5 mr-3" />}
            <span>{label}</span>
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-800 text-xs text-gray-400">
        <div className="flex justify-between items-center">
          <span>v1.0.0</span>
          <span>© 2023</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
