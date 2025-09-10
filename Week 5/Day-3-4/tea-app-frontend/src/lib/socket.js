import { io } from "socket.io-client";

let socket = null;

export function getSocket(token) {
  if (socket && socket.connected) return socket;
  socket = io("/nest", {
    path: "/ws",
    auth: {
      token:
        token ||
        (typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : ""),
    },
    transports: ["websocket"],
  });
  // reconnect logic built-in
  return socket;
}
