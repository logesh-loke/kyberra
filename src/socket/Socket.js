// src/socket.js
import { io } from "socket.io-client";

let socket = null;

export function connectSocket({ token, user } = {}) {
  if (socket && socket.connected) return socket;

  const URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:8080";

  socket = io(URL, {
    transports: ["websocket"],
    auth: { token: token || null }, // server reads handshake.auth.token
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socket.on("connect", () => {
  // console.log("Socket connected:", socket.id);
  if (user?.id || user?.email) {
    // console.log("connection socket user Id",user.id)
    socket.emit("registerUser", { id: user.id, email: user.email });
  }
});

  socket.on("connect_error", (err) => {
    console.warn("Socket connect_error:", err.message || err);
  });

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason);
  });

   socket.on("newEmail", (data) => {
    console.log("📨 New Email Arrived from backend:", data);
  });

   socket.on("newSendEmail",(data)=>{
    console.log("New Send Email Form Socket :-" , data)
   })

   socket.on("getWeeklyTraffic",(data)=>{
    console.log("New Dashboard Data:-", data.Data)
   })

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function getSocket() {
  return socket;
}
