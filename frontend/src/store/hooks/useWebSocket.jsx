// frontend/src/store/hooks/useWebSocket.js
import { useEffect, useRef } from 'react';
import usePacketStore from '../slices/packets';
import useAlertStore from '../slices/alerts';

const WS_URL = 'ws://localhost:5000/ws/packets'; // Update if different

const useWebSocket = () => {
  const socketRef = useRef(null);
  const addPacket = usePacketStore((state) => state.addPacket);
  const addAlert = useAlertStore((state) => state.addAlert);

  useEffect(() => {
    socketRef.current = new WebSocket(WS_URL);

    socketRef.current.onopen = () => {
      console.log('[🔌] WebSocket connected');
    };

    socketRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'packet') {
          addPacket(data.payload);
        } else if (data.type === 'alert') {
          addAlert(data.payload);
        } else {
          console.warn('[❓] Unknown data type received:', data);
        }
      } catch (error) {
        console.error('[❌] Error parsing WebSocket message:', error);
      }
    };

    socketRef.current.onerror = (err) => {
      console.error('[🚨] WebSocket error:', err);
    };

    socketRef.current.onclose = () => {
      console.warn('[🔌] WebSocket disconnected');
    };

    return () => {
      if (socketRef.current) socketRef.current.close();
    };
  }, [addPacket, addAlert]);
};

export default useWebSocket;
