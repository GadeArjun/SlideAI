// config/socket.js

import { Server } from "socket.io";
import jwt from "jsonwebtoken";

/**
 * STORE USER SOCKETS
 * userId -> socketId
 */
const userSocketMap = new Map();

let ioInstance = null;

/**
 * INIT SOCKET.IO
 */
export const initSocket = (server) => {
  ioInstance = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  /**
   * CONNECTION
   */
  ioInstance.on("connection", (socket) => {
    console.log("Socket Connected:", socket.id);

    socket.on("auth", (userId) => {
      if (userId) {
        userSocketMap.set(userId.toString(), socket.id);
        console.log(`Registered User: ${userId.toString()} -> ${socket.id}`);
      }
    });

    /**
     * GET ONLINE USERS
     */
    socket.on("get-online-users", () => {
      socket.emit("online-users", Array.from(userSocketMap.keys()));
    });

    /**
     * DISCONNECT
     */
    socket.on("disconnect", () => {
      console.log("Socket Disconnected:", socket.id);

      /**
       * REMOVE USER SOCKET
       */
      for (const [key, value] of userSocketMap.entries()) {
        if (value === socket.id) {
          userSocketMap.delete(key);
          break;
        }
      }
    });
  });

  return ioInstance;
};

/**
 * GET IO INSTANCE
 */
export const getIO = () => {
  if (!ioInstance) {
    throw new Error("Socket.io not initialized");
  }

  return ioInstance;
};

/**
 * GET SOCKET ID FROM USER ID
 */
export const getSocketIdByUserId = (userId) => {
  return userSocketMap.get(userId.toString());
};

/**
 * SEND EVENT TO USER
 */
export const emitToUser = (userId, event, data = {}) => {
  if (!ioInstance) return;

  const socketId = getSocketIdByUserId(userId);

  if (!socketId) {
    console.log(`User ${userId} is offline`);
    return;
  }

  ioInstance.to(socketId).emit(event, data);
};

/**
 * CHECK USER ONLINE
 */
export const isUserOnline = (userId) => {
  return userSocketMap.has(userId.toString());
};
