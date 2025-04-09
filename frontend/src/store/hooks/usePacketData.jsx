// frontend/src/store/hooks/usePacketData.js
import { useMemo } from 'react';
import usePacketStore from '../slices/packets';

const usePacketData = () => {
  const packets = usePacketStore((state) => state.packets);

  const protocolCounts = useMemo(() => {
    const counts = {
      TCP: 0,
      UDP: 0,
      ICMP: 0,
      DNS: 0,
      HTTP: 0,
      TLS: 0,
      ARP: 0,
      OTHER: 0,
    };

    packets.forEach((pkt) => {
      const proto = pkt.protocol?.toUpperCase() || 'OTHER';
      if (counts.hasOwnProperty(proto)) {
        counts[proto]++;
      } else {
        counts.OTHER++;
      }
    });

    return counts;
  }, [packets]);

  const latestPackets = useMemo(() => {
    return packets.slice(-100).reverse(); // latest 100 packets
  }, [packets]);

  const geoData = useMemo(() => {
    return packets
      .filter(pkt => pkt.geo && pkt.geo.country)
      .map(pkt => ({
        source: pkt.src_ip,
        dest: pkt.dst_ip,
        country: pkt.geo.country,
        lat: pkt.geo.lat,
        lon: pkt.geo.lon,
      }));
  }, [packets]);

  return {
    protocolCounts,
    latestPackets,
    geoData,
  };
};

export default usePacketData;
