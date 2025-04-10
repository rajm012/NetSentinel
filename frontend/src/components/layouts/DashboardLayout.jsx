import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-gray-950 text-white">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <TopBar />
        <div className="p-4 overflow-y-auto flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
