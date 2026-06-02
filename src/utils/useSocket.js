// src/hooks/useSocket.js
import { useEffect } from "react";
import { useSocketContext } from "src/context/SocketContext";

export default function useSocket(eventMap = {}, deps = []) {
  const { socket } = useSocketContext();

  useEffect(() => {
    if (!socket) return;

    Object.entries(eventMap).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    return () => {
      Object.entries(eventMap).forEach(([event, handler]) => {
        socket.off(event, handler);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, ...deps]);
}
