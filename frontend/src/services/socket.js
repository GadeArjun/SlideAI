import { io } from "socket.io-client";
import { SOCKET_URL } from "../constants";

let socket = null;

export const socketService = {
  connect() {
    if (socket?.connected) return socket;

    socket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });

    socket.on("connect_error", (err) => {
      console.warn("Socket error:", err.message);
    });

    return socket;
  },

  disconnect() {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  },

  on(event, handler) {
    if (!socket) this.connect();
    socket?.on(event, handler);
    return () => socket?.off(event, handler);
  },

  off(event, handler) {
    socket?.off(event, handler);
  },

  emit(event, data) {
    socket?.emit(event, data);
  },

  getSocket() {
    return socket;
  },

  isConnected() {
    return socket?.connected ?? false;
  },
};
