import AlertFeed from "../ui/alerts/AlertFeed";
import ProtocolDistribution from "../ui/charts/ProtocolDistribution";

export default function RealtimeView() {
  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Packet Feed */}
      <div className="md:col-span-2 bg-white p-4 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">Live Packet Feed</h2>
        {/* You can place your packet table here */}
        <p>Packet feed coming soon...</p>
      </div>

      {/* Alerts and Chart */}
      <div className="flex flex-col gap-4">
        <AlertFeed />
        <ProtocolDistribution />
      </div>
    </div>
  );
}
