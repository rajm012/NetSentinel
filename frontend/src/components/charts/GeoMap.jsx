import React, { useEffect, useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from 'react-simple-maps';

// const geoUrl =
//   'https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json';

const geoUrl =
  'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

const GeoMap = () => {
  const [locations, setLocations] = useState(getRandomLocations());

  // Simulate live update every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLocations(getRandomLocations());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">🗺️ GeoIP Traffic Map</h3>
      <ComposableMap projectionConfig={{ scale: 140 }}>
      <Geographies geography={geoUrl}>
  {({ geographies }) =>
    geographies.map(geo => (
      <Geography
        key={geo.rsmKey}
        geography={geo}
        style={{
          default: { fill: "#e0e0e0", stroke: "#999" },
          hover: { fill: "#aaa" },
          pressed: { fill: "#2b6cb0" },
        }}
      />
    ))
  }
</Geographies>


        {locations.map((loc, idx) => (
          <Marker key={idx} coordinates={[loc.lng, loc.lat]}>
            <circle r={4} fill="#ef4444" stroke="#fff" strokeWidth={1} />
            <text textAnchor="middle" y={-10} style={{ fontSize: 10 }}>
              {loc.label}
            </text>
          </Marker>
        ))}
      </ComposableMap>
    </div>
  );
};

// Replace with actual GeoIP backend data later
const getRandomLocations = () => [
  { lat: 37.7749, lng: -122.4194, label: "USA" },
  { lat: 51.5074, lng: -0.1278, label: "UK" },
  { lat: 28.6139, lng: 77.209, label: "India" },
  { lat: 35.6895, lng: 139.6917, label: "Japan" },
  { lat: 55.7558, lng: 37.6173, label: "Russia" },
];

export default GeoMap;
