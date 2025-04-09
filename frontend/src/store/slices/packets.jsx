// frontend/src/store/slices/packets.js
import { create } from 'zustand';

const usePacketStore = create((set, get) => ({
  packets: [],
  maxPackets: 500,

  addPacket: (newPacket) => {
    const { packets, maxPackets } = get();
    const updated = [...packets, newPacket];

    if (updated.length > maxPackets) {
      updated.shift(); // Remove oldest if max exceeded
    }

    set({ packets: updated });
  },

  clearPackets: () => set({ packets: [] }),

  getPacketById: (id) => {
    const { packets } = get();
    return packets.find((pkt) => pkt.id === id);
  },

  setMaxPackets: (max) => set({ maxPackets: max }),
}));

export default usePacketStore;


// import usePacketStore from '@/store/slices/packets';

// const ExampleComponent = () => {
//   const packets = usePacketStore((state) => state.packets);
//   const addPacket = usePacketStore((state) => state.addPacket);

//   // Simulate adding a packet
//   const testAdd = () => {
//     addPacket({
//       id: 'pkt_test',
//       timestamp: new Date().toISOString(),
//       src_ip: '10.0.0.1',
//       dst_ip: '1.1.1.1',
//       protocol: 'HTTP',
//       length: 128,
//       info: 'GET /index.html'
//     });
//   };

//   return (
//     <div>
//       <button onClick={testAdd}>Add Packet</button>
//       <pre>{JSON.stringify(packets, null, 2)}</pre>
//     </div>
//   );
// };

