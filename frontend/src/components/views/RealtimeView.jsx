import { useState } from "react";
import AlertFeed from "../ui/alerts/AlertFeed";
import GeoMap from "../ui/charts/GeoMap";
import ProtocolDistribution from "../ui/charts/ProtocolDistribution";
import TrafficFlowChart from "../ui/charts/TrafficFlowChart";
import CaptureControls from "../ui/controls/CaptureControls";
import { useSelector } from "react-redux";
import useWebSocket from "@/store/hooks/useWebSocket";

const RealtimeView = () => {
  const [viewMode, setViewMode] = useState("raw"); // 'raw' or 'flow'
  const packets = useSelector((state) => state.packets.data);
  const alerts = useSelector((state) => state.alerts.recent);
  useWebSocket(); // Initializes and connects WebSocket

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">🟢 Real-Time Network Monitoring</h2>
        <div className="space-x-2">
          <button
            onClick={() => setViewMode("raw")}
            className={`px-4 py-2 rounded-lg ${viewMode === "raw" ? "bg-blue-600 text-white" : "bg-gray-700"}`}
          >
            Raw View
          </button>
          <button
            onClick={() => setViewMode("flow")}
            className={`px-4 py-2 rounded-lg ${viewMode === "flow" ? "bg-blue-600 text-white" : "bg-gray-700"}`}
          >
            Flow View
          </button>
        </div>
      </div>

      {/* Capture Controls */}
      <CaptureControls />

      {/* Charts & Map */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <GeoMap packets={packets} />
        <ProtocolDistribution packets={packets} />
        <TrafficFlowChart packets={packets} />
      </div>

      {/* Alerts */}
      <div>
        <h3 className="text-lg font-semibold mb-2">⚠️ Alert Feed</h3>
        <AlertFeed alerts={alerts} />
      </div>

      {/* Packet Display */}
      <div>
        <h3 className="text-lg font-semibold mb-2">
          {viewMode === "raw" ? "🧾 Raw Packets" : "🔁 Flow Data"}
        </h3>
        <div className="bg-gray-800 rounded-lg p-4 h-64 overflow-y-auto text-sm text-green-200">
          {viewMode === "raw"
            ? packets.slice(-100).map((pkt, i) => (
                <div key={i} className="border-b border-gray-700 py-1">{pkt.raw}</div>
              ))
            : packets.slice(-100).map((flow, i) => (
                <div key={i} className="border-b border-gray-700 py-1">
                  {flow.src_ip} ➡️ {flow.dst_ip} | {flow.protocol} | {flow.packet_count} pkts
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default RealtimeView;
