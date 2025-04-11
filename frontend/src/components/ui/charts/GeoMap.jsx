import { useEffect, useRef } from 'react';

export const GeoMap = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    // In a real implementation, you would use a mapping library like Leaflet or Google Maps
    // This is just a placeholder visualization
    const canvas = mapRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw a simple world map representation
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw some random "traffic" points
    for (let i = 0; i < 15; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = 2 + Math.random() * 4;
      const intensity = Math.random();
      
      ctx.fillStyle = `rgba(59, 130, 246, ${intensity})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  }, []);

  return (
    <div className="relative h-64">
      <canvas 
        ref={mapRef} 
        className="w-full h-full rounded"
        width={800}
        height={400}
      />
      <div className="absolute bottom-2 left-2 text-sm text-gray-600">
        Simulated traffic origins (mock data)
      </div>
    </div>
  );
};