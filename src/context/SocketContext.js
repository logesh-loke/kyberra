// src/context/SocketContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { connectSocket, disconnectSocket, getSocket } from "src/socket/Socket";

const SocketContext = createContext({
  socket: null,
  connect: () => {},
  disconnect: () => {},
});

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(() => getSocket());

  const connect = ({ token, user } = {}) => {
    const s = connectSocket({ token, user });
    setSocket(s);
    return s;
  };

  const disconnect = () => {
    disconnectSocket();
    setSocket(null);
  };

  useEffect(() => {
    setSocket(getSocket());
  }, []);

  const value = useMemo(() => ({ socket, connect, disconnect }), [socket]);

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export const useSocketContext = () => useContext(SocketContext);
